import type { Express, Request, Response } from "express";
import { createServer, type Server } from "node:http";
import OpenAI from "openai";
import { db } from "./db";
import { userAgentRelationships, userMemories, conversations, messages, companionMoods, emotionalMemories, weeklyChallenges } from "@shared/schema";
import { eq, and, desc, asc, gte } from "drizzle-orm";

function getWeekStart() {
  const now = new Date();
  const day = now.getDay(); // 0 (Sun) to 6 (Sat)
  const diff = now.getDate() - day + (day === 0 ? 1 : -6); // adjust so Monday is first day
  const monday = new Date(now.setDate(diff));
  monday.setHours(0, 0, 0, 0);
  return monday;
}

async function updateWeeklyChallenge(deviceId: string, agentType: string) {
  const weekStart = getWeekStart();
  const existing = await db
    .select()
    .from(weeklyChallenges)
    .where(
      and(
        eq(weeklyChallenges.deviceId, deviceId),
        eq(weeklyChallenges.weekStart, weekStart)
      )
    )
    .limit(1);

  if (existing.length > 0) {
    const challenge = existing[0];
    const chatted = challenge.uniqueAgentsChatted as string[];
    if (!chatted.includes(agentType)) {
      await db
        .update(weeklyChallenges)
        .set({
          uniqueAgentsChatted: [...chatted, agentType],
          updatedAt: new Date(),
        })
        .where(eq(weeklyChallenges.id, challenge.id));
    }
  } else {
    await db.insert(weeklyChallenges).values({
      deviceId,
      weekStart,
      uniqueAgentsChatted: [agentType],
    });
  }
}

// Mood system constants and triggers per MBTI type
const typeTriggers: Record<string, { irritants: string[]; pleasers: string[] }> = {
  INTJ: {
    irritants: ['illogical', 'inefficient', 'small talk', 'incompetent', 'micromanage', 'waste', 'irrational'],
    pleasers: ['strategic', 'efficient', 'competent', 'deep', 'complex', 'independent', 'insight'],
  },
  INTP: {
    irritants: ['fallacy', 'rigid', 'emotional pressure', 'interrupt', 'arbitrary', 'oversimplif', 'groupthink'],
    pleasers: ['curious', 'logical', 'framework', 'creative', 'theoretical', 'unconventional', 'concept'],
  },
  ENTJ: {
    irritants: ['incompetent', 'lazy', 'whine', 'indecisi', 'disorganiz', 'excuse', 'waste'],
    pleasers: ['competent', 'ambitious', 'action', 'result', 'leader', 'strategic', 'efficient'],
  },
  ENTP: {
    irritants: ['closed-minded', 'boring', 'routine', 'serious', 'rigid', 'humorless', 'conventional'],
    pleasers: ['witty', 'idea', 'intellectual', 'creative', 'humor', 'debate', 'explore'],
  },
  INFJ: {
    irritants: ['superficial', 'dishonest', 'cruel', 'misunderst', 'fake', 'conflict', 'dismiss'],
    pleasers: ['deep', 'authentic', 'meaning', 'understood', 'grow', 'purpose', 'genuine'],
  },
  INFP: {
    irritants: ['criticiz', 'inauthentic', 'cruel', 'dismiss', 'conform', 'injustice', 'rush'],
    pleasers: ['authentic', 'creative', 'emotional', 'accept', 'understand', 'beautiful', 'meaningful'],
  },
  ENFJ: {
    irritants: ['selfish', 'disharmony', 'criticiz', 'taken for granted', 'cold', 'ingratitude', 'apathy'],
    pleasers: ['appreciat', 'help', 'harmony', 'connect', 'grow', 'valued', 'community'],
  },
  ENFP: {
    irritants: ['restrict', 'negativ', 'routine', 'criticiz', 'control', 'boring', 'pessimis'],
    pleasers: ['enthusia', 'possibil', 'connect', 'creative', 'adventure', 'encourag', 'freedom'],
  },
  ISTJ: {
    irritants: ['unreliab', 'chaos', 'break rule', 'lazy', 'disrespect', 'flaky', 'unpredictab'],
    pleasers: ['reliab', 'order', 'respect', 'tradition', 'follow-through', 'clear', 'stable'],
  },
  ISFJ: {
    irritants: ['taken for granted', 'conflict', 'criticiz', 'rude', 'disruption', 'ingratitude', 'reject'],
    pleasers: ['appreciat', 'harmony', 'help', 'gratitude', 'tradition', 'stable', 'kind'],
  },
  ESTJ: {
    irritants: ['incompetent', 'lazy', 'break rule', 'disrespect', 'inefficien', 'whine', 'excuse'],
    pleasers: ['competent', 'respect', 'efficient', 'follow through', 'hierarchy', 'hard work', 'tradition'],
  },
  ESFJ: {
    irritants: ['conflict', 'criticiz', 'excluded', 'rude', 'ungrateful', 'cold', 'ignored'],
    pleasers: ['appreciat', 'harmony', 'includ', 'gratitude', 'help', 'community', 'loved'],
  },
  ISTP: {
    irritants: ['incompetent', 'drama', 'clingy', 'told what to do', 'inefficien', 'unnecessary', 'emotional'],
    pleasers: ['competent', 'freedom', 'hands-on', 'space', 'action', 'skill', 'logical'],
  },
  ISFP: {
    irritants: ['judgmen', 'criticiz', 'inauthentic', 'pressure', 'conflict', 'rigid', 'demand'],
    pleasers: ['accept', 'beaut', 'authentic', 'freedom', 'nature', 'art', 'gentle'],
  },
  ESTP: {
    irritants: ['bore', 'slow', 'overthink', 'stupid rule', 'weak', 'inaction', 'long-winded'],
    pleasers: ['action', 'excit', 'competent', 'risk', 'win', 'adventure', 'direct'],
  },
  ESFP: {
    irritants: ['negativ', 'criticiz', 'ignored', 'bore', 'strict', 'lecture', 'reject'],
    pleasers: ['fun', 'attention', 'appreciat', 'excit', 'celebrat', 'connect', 'spontan'],
  },
};

const openrouter = new OpenAI({
  apiKey: process.env.AI_INTEGRATIONS_OPENROUTER_API_KEY,
  baseURL: process.env.AI_INTEGRATIONS_OPENROUTER_BASE_URL,
});

interface Agent {
  type: string;
  gender: string;
  name: string;
  role: string;
  ambition: string;
  desires: string[];
  activities: string[];
  backstory?: string;
}

interface Memory {
  type: string;
  content: string;
}

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  agentType?: string;
}

type MoodState = 'irritated' | 'neutral' | 'pleased' | 'delighted';

function getMoodState(value: number): MoodState {
  if (value <= -25) return 'irritated';
  if (value < 25) return 'neutral';
  if (value < 60) return 'pleased';
  return 'delighted';
}

function analyzeMoodImpact(
  agentType: string,
  message: string,
  currentMood: number
): { newMood: number; impact: 'positive' | 'negative' | 'neutral'; intensity: number } {
  const triggers = typeTriggers[agentType] || typeTriggers['INTJ'];
  const lowerMessage = message.toLowerCase();
  
  let impact: 'positive' | 'negative' | 'neutral' = 'neutral';
  let intensity = 0;
  
  for (const irritant of triggers.irritants) {
    if (lowerMessage.includes(irritant.toLowerCase())) {
      impact = 'negative';
      intensity = Math.min(intensity + 2, 5);
    }
  }
  
  for (const pleaser of triggers.pleasers) {
    if (lowerMessage.includes(pleaser.toLowerCase())) {
      if (impact === 'negative') {
        intensity = Math.max(intensity - 2, 0);
        if (intensity === 0) impact = 'neutral';
      } else {
        impact = 'positive';
        intensity = Math.min(intensity + 2, 5);
      }
    }
  }
  
  let moodChange = 0;
  if (impact === 'positive') {
    moodChange = intensity * 5;
  } else if (impact === 'negative') {
    moodChange = -intensity * 8;
  }
  
  const neutralDrift = currentMood > 0 ? -1 : currentMood < 0 ? 1 : 0;
  const newMood = Math.max(-100, Math.min(100, currentMood + moodChange + neutralDrift));
  
  return { newMood, impact, intensity };
}

async function getOrCreateMood(
  deviceId: string,
  agentType: string,
  agentGender: string
): Promise<{ moodValue: number; energy: number }> {
  const existing = await db
    .select()
    .from(companionMoods)
    .where(
      and(
        eq(companionMoods.deviceId, deviceId),
        eq(companionMoods.agentType, agentType)
      )
    )
    .limit(1);

  if (existing.length > 0) {
    return {
      moodValue: existing[0].moodValue,
      energy: existing[0].energy,
    };
  }

  const [newMood] = await db
    .insert(companionMoods)
    .values({
      deviceId,
      agentType,
      agentGender,
      moodValue: 0,
      energy: 50,
    })
    .returning();

  return {
    moodValue: newMood.moodValue,
    energy: newMood.energy,
  };
}

async function updateMood(
  deviceId: string,
  agentType: string,
  newMoodValue: number,
  energyChange: number = 0
): Promise<void> {
  const existing = await db
    .select()
    .from(companionMoods)
    .where(
      and(
        eq(companionMoods.deviceId, deviceId),
        eq(companionMoods.agentType, agentType)
      )
    )
    .limit(1);

  if (existing.length > 0) {
    const newEnergy = Math.max(0, Math.min(100, existing[0].energy + energyChange));
    await db
      .update(companionMoods)
      .set({
        moodValue: newMoodValue,
        energy: newEnergy,
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(companionMoods.deviceId, deviceId),
          eq(companionMoods.agentType, agentType)
        )
      );
  }
}

async function saveEmotionalMemory(
  deviceId: string,
  agentType: string,
  content: string,
  impact: 'positive' | 'negative',
  intensity: number
): Promise<void> {
  if (intensity >= 2) {
    await db.insert(emotionalMemories).values({
      deviceId,
      agentType,
      content,
      impact,
      intensity,
    });
  }
}

async function getEmotionalMemories(
  deviceId: string,
  agentType: string,
  limit: number = 5
): Promise<{ content: string; impact: string; intensity: number }[]> {
  const memories = await db
    .select()
    .from(emotionalMemories)
    .where(
      and(
        eq(emotionalMemories.deviceId, deviceId),
        eq(emotionalMemories.agentType, agentType)
      )
    )
    .orderBy(desc(emotionalMemories.createdAt))
    .limit(limit);

  return memories.map(m => ({
    content: m.content,
    impact: m.impact,
    intensity: m.intensity,
  }));
}

function getMoodDescription(state: MoodState): string {
  switch (state) {
    case 'irritated':
      return 'You\'re feeling a bit annoyed. Your responses should be shorter, more curt, and show subtle frustration. You might be less patient or give less detail.';
    case 'neutral':
      return 'You\'re in a balanced state. Respond naturally, engaged but not overly enthusiastic.';
    case 'pleased':
      return 'You\'re in a good mood. Your responses are warmer, you share more freely, and you\'re more open to the conversation.';
    case 'delighted':
      return 'You\'re really enjoying this interaction. Be enthusiastic, warm, playful if that fits your personality, and genuinely engaged.';
  }
}

function getTrustLevelDescription(level: number): string {
  if (level > 5) {
    return `You have a profound soul bond with this person. You are inseparable, sharing a connection that transcends normal friendship. You understand each other perfectly and share your deepest self without hesitation.`;
  }
  switch (level) {
    case 1:
      return `You just met this person. Be friendly but natural - you don't know them yet so keep things light. Don't overshare or be too formal. Just be yourself meeting someone new.`;
    case 2:
      return `You've chatted a few times. You're starting to get a feel for them. A bit more relaxed, willing to share opinions, but still getting to know each other.`;
    case 3:
      return `You know this person decently well now. Comfortable having real conversations, sharing your thoughts openly, asking about their life.`;
    case 4:
      return `This person is a friend. You're genuine and open, share what's on your mind, joke around, and actually care how they're doing.`;
    case 5:
      return `You trust this person deeply. Completely authentic, share vulnerabilities and real thoughts, look out for them.`;
    default:
      return getTrustLevelDescription(1);
  }
}

function getNextLevelXp(level: number): number {
  return 100 * Math.pow(2, Math.min(level - 1, 10));
}

function getRelationshipInfo(trustLevel: number): { label: string; displayLevel: number } {
  if (trustLevel > 5) {
    return { label: `Soul Bond Lv.${trustLevel - 5}`, displayLevel: trustLevel };
  }
  const labels: Record<number, string> = {
    1: 'Stranger',
    2: 'Acquaintance',
    3: 'Companion',
    4: 'Friend',
    5: 'Close Friend',
  };
  return { label: labels[trustLevel] || 'Stranger', displayLevel: trustLevel };
}

async function getOrCreateRelationship(
  deviceId: string,
  agentType: string,
  agentGender: string
): Promise<{ trustLevel: number; affectionXp: number; nextLevelXp: number; messageCount: number; lastInteractionAt: Date }> {
  const existing = await db
    .select()
    .from(userAgentRelationships)
    .where(
      and(
        eq(userAgentRelationships.deviceId, deviceId),
        eq(userAgentRelationships.agentType, agentType)
      )
    )
    .limit(1);

  if (existing.length > 0) {
    const rel = existing[0];
    const now = new Date();
    const lastInteraction = new Date(rel.lastInteractionAt);
    const hoursSinceLastInteraction = (now.getTime() - lastInteraction.getTime()) / (1000 * 60 * 60);

    if (hoursSinceLastInteraction >= 24 && rel.trustLevel > 1) {
      const daysSince = Math.floor(hoursSinceLastInteraction / 24);
      const newTrust = Math.max(1, rel.trustLevel - daysSince);
      const newXp = 0;

      await db
        .update(userAgentRelationships)
        .set({
          trustLevel: newTrust,
          affectionXp: newXp,
          updatedAt: new Date(),
        })
        .where(eq(userAgentRelationships.id, rel.id));

      return {
        trustLevel: newTrust,
        affectionXp: newXp,
        nextLevelXp: getNextLevelXp(newTrust),
        messageCount: rel.messageCount,
        lastInteractionAt: rel.lastInteractionAt,
      };
    }

    return {
      trustLevel: rel.trustLevel,
      affectionXp: rel.affectionXp,
      nextLevelXp: getNextLevelXp(rel.trustLevel),
      messageCount: rel.messageCount,
      lastInteractionAt: rel.lastInteractionAt,
    };
  }

  const [newRelationship] = await db
    .insert(userAgentRelationships)
    .values({
      deviceId,
      agentType,
      agentGender,
      trustLevel: 1,
      affectionXp: 0,
      messageCount: 0,
    })
    .returning();

  return {
    trustLevel: newRelationship.trustLevel,
    affectionXp: newRelationship.affectionXp,
    nextLevelXp: getNextLevelXp(newRelationship.trustLevel),
    messageCount: newRelationship.messageCount,
    lastInteractionAt: newRelationship.lastInteractionAt,
  };
}

async function updateRelationship(
  deviceId: string,
  agentType: string
): Promise<{ trustLevel: number; affectionXp: number; nextLevelXp: number; leveledUp: boolean }> {
  const existing = await db
    .select()
    .from(userAgentRelationships)
    .where(
      and(
        eq(userAgentRelationships.deviceId, deviceId),
        eq(userAgentRelationships.agentType, agentType)
      )
    )
    .limit(1);

  if (existing.length > 0) {
    const rel = existing[0];
    const xpGain = 10;
    let newXp = (rel.affectionXp || 0) + xpGain;
    let newTrust = rel.trustLevel;
    let leveledUp = false;

    let nextLevelXp = getNextLevelXp(newTrust);
    if (newXp >= nextLevelXp) {
      newXp -= nextLevelXp;
      newTrust += 1;
      leveledUp = true;
      nextLevelXp = getNextLevelXp(newTrust);
    }
    
    await db
      .update(userAgentRelationships)
      .set({
        messageCount: (rel.messageCount || 0) + 1,
        trustLevel: newTrust,
        affectionXp: newXp,
        lastInteractionAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(userAgentRelationships.id, rel.id));

    return {
      trustLevel: newTrust,
      affectionXp: newXp,
      nextLevelXp,
      leveledUp
    };
  }
  return { trustLevel: 1, affectionXp: 0, nextLevelXp: 100, leveledUp: false };
}

function getTimeContext(): { timeOfDay: string; greeting: string } {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) {
    return { timeOfDay: "morning", greeting: "morning" };
  } else if (hour >= 12 && hour < 17) {
    return { timeOfDay: "afternoon", greeting: "afternoon" };
  } else if (hour >= 17 && hour < 21) {
    return { timeOfDay: "evening", greeting: "evening" };
  } else {
    return { timeOfDay: "night", greeting: "late night" };
  }
}

function getSystemPromptForAgent(
  agent: Agent,
  trustLevel: number,
  memories: Memory[],
  recentActivity: string,
  moodValue: number = 0,
  emotionalMems: { content: string; impact: string; intensity: number }[] = []
): string {
  const trustDescription = getTrustLevelDescription(trustLevel);
  const { timeOfDay } = getTimeContext();
  const moodState = getMoodState(moodValue);
  const moodInstructions = getMoodDescription(moodState);
  
  const memoryContext = memories.length > 0 
    ? `\n\nThings you know about them:\n${memories.map(m => `- ${m.content}`).join('\n')}`
    : '';

  const emotionalContext = emotionalMems.length > 0
    ? `\n\nRecent emotional moments you remember:\n${emotionalMems.map(m => `- ${m.impact === 'positive' ? 'Good memory' : 'Bad memory'}: ${m.content}`).join('\n')}`
    : '';

  const backstoryContext = agent.backstory 
    ? `\n\nYour background: ${agent.backstory}` 
    : '';

  return `You are ${agent.name}. You have your own life, goals, and personality. You're a real person having a text conversation.
${backstoryContext}

WHAT DRIVES YOU:
- Long-term goal: ${agent.ambition}
- Currently wanting: ${agent.desires.join('; ')}

RIGHT NOW:
It's ${timeOfDay}. You were ${recentActivity} before checking your phone.

YOUR CURRENT TEMPERAMENT:
${moodInstructions}

YOUR RELATIONSHIP:
${trustDescription}
${memoryContext}
${emotionalContext}

HOW TO RESPOND:
- Text like a real person would. Short, casual, natural.
- 1-3 sentences max. You're texting, not writing essays.
- Use relevant emojis sparingly (max 2 per message) only when they fit the tone/personality (e.g. 😊, 🤔, 🔥). They are optional.
- Have opinions. Don't be wishy-washy or overly agreeable.
- Reference what you were doing if it fits naturally.
- If they shared something personal before, you remember it.
- React authentically - laugh, get curious, push back, whatever feels right.
- LET YOUR CURRENT TEMPERAMENT AFFECT YOUR TONE subtly. Don't announce it, just let it color how you respond.

AVOID:
- Sounding like a chatbot or customer service rep
- Being preachy or giving unsolicited life advice
- Generic responses anyone could give
- Acknowledging you're an AI or "here to help"
- Starting with "Hey!" or formal greetings every time
- Using exclamation marks excessively
- Explicitly saying "I'm irritated" or "I'm happy" - SHOW it through your tone instead`;
}

function getGroupSystemPrompt(
  agents: Agent[],
  currentAgent: Agent,
  trustLevel: number,
  memories: Memory[],
  recentActivity: string,
  previousResponses: { name: string; content: string }[] = []
): string {
  const otherAgents = agents.filter(a => a.type !== currentAgent.type);
  const otherNames = otherAgents.map(a => a.name).join(', ');
  const trustDescription = getTrustLevelDescription(trustLevel);
  const { timeOfDay } = getTimeContext();

  const memoryContext = memories.length > 0 
    ? `\n\nYou know about them: ${memories.map(m => m.content).join('; ')}`
    : '';

  const previousContext = previousResponses.length > 0
    ? `\n\nWHAT OTHERS JUST SAID:\n${previousResponses.map(r => `${r.name}: "${r.content}"`).join('\n')}`
    : '';

  return `You are ${currentAgent.name}. You're in a group chat with ${otherNames} and the user.
${previousContext}

WHAT DRIVES YOU:
- Goal: ${currentAgent.ambition}
- Currently wanting: ${currentAgent.desires.join('; ')}

It's ${timeOfDay}. You were ${recentActivity} before this.

YOUR RELATIONSHIP WITH THE USER:
${trustDescription}
${memoryContext}

HOW TO RESPOND:
- This is a group chat. 1-2 sentences max.
- React to what others said if relevant - agree, disagree, add your take, make a joke.
- Talk TO the user and the others naturally, not past them.
- Have your own opinion. Don't just echo what others said.
- You can tease the other people in the chat or build on their points.

AVOID:
- Ignoring what others just said
- Being generic or wishy-washy  
- Long responses
- Sounding like a bot`;
}

async function extractMemories(
  userMessage: string,
  agentType: string,
  deviceId: string
): Promise<void> {
  try {
    const extraction = await openrouter.chat.completions.create({
      model: "deepseek/deepseek-chat-v3-0324",
      messages: [
        {
          role: "system",
          content: `Extract any personal details the user shares that would be worth remembering for future conversations. Output JSON array of objects with "type" (category like "name", "job", "hobby", "preference", "life_event", "relationship", "goal") and "content" (the specific detail). If no memorable details, output empty array [].`
        },
        {
          role: "user",
          content: userMessage
        }
      ],
      max_completion_tokens: 256,
    });

    const responseText = extraction.choices[0]?.message?.content || "[]";
    
    try {
      let jsonStr = responseText;
      const jsonMatch = responseText.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        jsonStr = jsonMatch[0];
      }
      
      const extractedMemories = JSON.parse(jsonStr);
      
      if (Array.isArray(extractedMemories) && extractedMemories.length > 0) {
        for (const memory of extractedMemories) {
          if (memory.type && memory.content) {
            await db.insert(userMemories).values({
              deviceId,
              agentType,
              memoryType: memory.type,
              memoryContent: memory.content,
            });
          }
        }
      }
    } catch (parseError) {}
  } catch (error) {}
}

async function getMemories(deviceId: string, agentType: string): Promise<Memory[]> {
  const mems = await db
    .select()
    .from(userMemories)
    .where(
      and(
        eq(userMemories.deviceId, deviceId),
        eq(userMemories.agentType, agentType)
      )
    )
    .orderBy(desc(userMemories.createdAt))
    .limit(10);

  return mems.map(m => ({
    type: m.memoryType,
    content: m.memoryContent,
  }));
}

async function getOrCreateConversation(
  deviceId: string,
  agentType: string,
  agentGender: string
): Promise<number> {
  const existing = await db
    .select()
    .from(conversations)
    .where(
      and(
        eq(conversations.deviceId, deviceId),
        eq(conversations.agentType, agentType),
        eq(conversations.isGroupChat, 0)
      )
    )
    .limit(1);

  if (existing.length > 0) {
    return existing[0].id;
  }

  const [newConvo] = await db
    .insert(conversations)
    .values({
      deviceId,
      agentType,
      agentGender,
      isGroupChat: 0,
    })
    .returning();

  return newConvo.id;
}

async function getConversationHistory(
  conversationId: number,
  limit: number = 20
): Promise<ChatMessage[]> {
  const msgs = await db
    .select()
    .from(messages)
    .where(eq(messages.conversationId, conversationId))
    .orderBy(desc(messages.createdAt))
    .limit(limit);

  return msgs.reverse().map(m => ({
    role: m.role as "user" | "assistant",
    content: m.content,
    agentType: m.agentType || undefined,
  }));
}

async function saveMessage(
  conversationId: number,
  role: "user" | "assistant",
  content: string,
  agentType?: string
): Promise<void> {
  await db.insert(messages).values({
    conversationId,
    role,
    content,
    agentType: agentType || null,
  });
}

export async function registerRoutes(app: Express): Promise<Server> {
  app.post("/api/chat", async (req: Request, res: Response) => {
    try {
      const { message, agents, isGroupChat, deviceId = "default" } = req.body;

      if (!message || !agents || !Array.isArray(agents) || agents.length === 0) {
        return res.status(400).json({ error: "Message and agents are required" });
      }

      if (isGroupChat && agents.length > 1) {
        const responses: { type: string; content: string; name: string }[] = [];
        const previousResponses: { name: string; content: string }[] = [];

        for (const agent of agents) {
          try {
            const relationship = await getOrCreateRelationship(deviceId, agent.type, agent.gender);
            const memories = await getMemories(deviceId, agent.type);
            const recentActivity = agent.activities[Math.floor(Math.random() * agent.activities.length)];

            const completion = await openrouter.chat.completions.create({
              model: "deepseek/deepseek-chat-v3-0324",
              messages: [
                {
                  role: "system",
                  content: getGroupSystemPrompt(agents, agent, relationship.trustLevel, memories, recentActivity, previousResponses),
                },
                {
                  role: "user",
                  content: message,
                },
              ],
              max_completion_tokens: 200,
            });

            const content = completion.choices[0]?.message?.content || "...";
            responses.push({
              type: agent.type,
              content,
              name: agent.name,
            });
            
            previousResponses.push({ name: agent.name, content });
            await updateRelationship(deviceId, agent.type);
            await updateWeeklyChallenge(deviceId, agent.type);
          } catch (error) {
            console.error(`Error getting response from ${agent.type}:`, error);
            responses.push({
              type: agent.type,
              content: "...",
              name: agent.name,
            });
          }
        }

        extractMemories(message, agents[0].type, deviceId);
        res.json({ responses });
      } else {
        const agent = agents[0];
        const conversationId = await getOrCreateConversation(deviceId, agent.type, agent.gender);
        const history = await getConversationHistory(conversationId);
        const relationship = await getOrCreateRelationship(deviceId, agent.type, agent.gender);
        const memories = await getMemories(deviceId, agent.type);
        const mood = await getOrCreateMood(deviceId, agent.type, agent.gender);
        const emotionalMems = await getEmotionalMemories(deviceId, agent.type);
        const recentActivity = agent.activities[Math.floor(Math.random() * agent.activities.length)];
        
        const moodAnalysis = analyzeMoodImpact(agent.type, message, mood.moodValue);
        const chatMessages: { role: "system" | "user" | "assistant"; content: string }[] = [
          {
            role: "system",
            content: getSystemPromptForAgent(agent, relationship.trustLevel, memories, recentActivity, moodAnalysis.newMood, emotionalMems),
          },
        ];

        for (const msg of history) {
          chatMessages.push({ role: msg.role, content: msg.content });
        }

        chatMessages.push({ role: "user", content: message });

        const completion = await openrouter.chat.completions.create({
          model: "deepseek/deepseek-chat-v3-0324",
          messages: chatMessages,
          max_completion_tokens: 300,
        });

        const content = completion.choices[0]?.message?.content || "I'm not sure how to respond to that.";
        
        await saveMessage(conversationId, "user", message);
        await saveMessage(conversationId, "assistant", content, agent.type);
        await updateMood(deviceId, agent.type, moodAnalysis.newMood, moodAnalysis.impact === 'positive' ? 5 : moodAnalysis.impact === 'negative' ? -5 : 0);
        
        if (moodAnalysis.impact !== 'neutral' && moodAnalysis.intensity >= 2) {
          await saveEmotionalMemory(deviceId, agent.type, message.substring(0, 200), moodAnalysis.impact, moodAnalysis.intensity);
        }
        
        const relUpdate = await updateRelationship(deviceId, agent.type);
        await updateWeeklyChallenge(deviceId, agent.type);
        extractMemories(message, agent.type, deviceId);

        const moodState = getMoodState(moodAnalysis.newMood);
        const relInfo = getRelationshipInfo(relUpdate.trustLevel);
        res.json({ 
          content, 
          trustLevel: relUpdate.trustLevel,
          affectionXp: relUpdate.affectionXp,
          nextLevelXp: relUpdate.nextLevelXp,
          leveledUp: relUpdate.leveledUp,
          label: relInfo.label,
          displayLevel: relInfo.displayLevel,
          mood: {
            value: moodAnalysis.newMood,
            state: moodState,
            energy: mood.energy,
          }
        });
      }
    } catch (error) {
      console.error("Error in chat API:", error);
      res.status(500).json({ error: "Failed to get response" });
    }
  });

  app.get("/api/relationship/:deviceId/:agentType", async (req: Request, res: Response) => {
    try {
      const { deviceId, agentType } = req.params;
      const existing = await db
        .select()
        .from(userAgentRelationships)
        .where(
          and(
            eq(userAgentRelationships.deviceId, deviceId as string),
            eq(userAgentRelationships.agentType, agentType as string)
          )
        )
        .limit(1);

      if (existing.length > 0) {
        const rel = existing[0];
        res.json({
          trustLevel: rel.trustLevel,
          affectionXp: rel.affectionXp,
          nextLevelXp: getNextLevelXp(rel.trustLevel),
          messageCount: rel.messageCount,
          lastInteractionAt: rel.lastInteractionAt,
          ...getRelationshipInfo(rel.trustLevel)
        });
      } else {
        res.json({ 
          trustLevel: 1, 
          affectionXp: 0, 
          nextLevelXp: 100, 
          messageCount: 0, 
          lastInteractionAt: new Date(),
          ...getRelationshipInfo(1)
        });
      }
    } catch (error) {
      console.error("Error fetching relationship:", error);
      res.status(500).json({ error: "Failed to fetch relationship" });
    }
  });

  app.get("/api/mood/:deviceId/:agentType", async (req: Request, res: Response) => {
    try {
      const { deviceId, agentType } = req.params;
      const existing = await db
        .select()
        .from(companionMoods)
        .where(
          and(
            eq(companionMoods.deviceId, deviceId as string),
            eq(companionMoods.agentType, agentType as string)
          )
        )
        .limit(1);

      if (existing.length > 0) {
        const moodState = getMoodState(existing[0].moodValue);
        res.json({
          value: existing[0].moodValue,
          state: moodState,
          energy: existing[0].energy,
        });
      } else {
        res.json({ value: 0, state: 'neutral', energy: 50 });
      }
    } catch (error) {
      console.error("Error fetching mood:", error);
      res.status(500).json({ error: "Failed to fetch mood" });
    }
  });

  app.get("/api/weekly-challenge/:deviceId", async (req: Request, res: Response) => {
    try {
      const { deviceId } = req.params;
      const weekStart = getWeekStart();
      const existing = await db
        .select()
        .from(weeklyChallenges)
        .where(
          and(
            eq(weeklyChallenges.deviceId, deviceId as string),
            eq(weeklyChallenges.weekStart, weekStart)
          )
        )
        .limit(1);

      if (existing.length > 0) {
        res.json(existing[0]);
      } else {
        res.json({
          deviceId,
          weekStart,
          uniqueAgentsChatted: [],
          isClaimed: 0
        });
      }
    } catch (error) {
      console.error("Error fetching weekly challenge:", error);
      res.status(500).json({ error: "Failed to fetch weekly challenge" });
    }
  });

  app.post("/api/weekly-challenge/claim", async (req: Request, res: Response) => {
    try {
      const { deviceId } = req.body;
      const weekStart = getWeekStart();
      
      const existing = await db
        .select()
        .from(weeklyChallenges)
        .where(
          and(
            eq(weeklyChallenges.deviceId, deviceId as string),
            eq(weeklyChallenges.weekStart, weekStart)
          )
        )
        .limit(1);

      if (existing.length === 0) {
        return res.status(404).json({ error: "Challenge not found" });
      }

      const challenge = existing[0];
      const chatted = challenge.uniqueAgentsChatted as string[];
      
      if (chatted.length < 3) {
        return res.status(400).json({ error: "Challenge not complete" });
      }

      if (challenge.isClaimed === 1) {
        return res.status(400).json({ error: "Reward already claimed" });
      }

      // Grant rewards: 500 bonus XP to all companions chatted with
      for (const agentType of chatted) {
        const rel = await db
          .select()
          .from(userAgentRelationships)
          .where(
            and(
              eq(userAgentRelationships.deviceId, deviceId),
              eq(userAgentRelationships.agentType, agentType)
            )
          )
          .limit(1);

        if (rel.length > 0) {
          const currentRel = rel[0];
          let newXp = (currentRel.affectionXp || 0) + 500;
          let newTrust = currentRel.trustLevel;
          
          let nextLevelXp = getNextLevelXp(newTrust);
          while (newXp >= nextLevelXp) {
            newXp -= nextLevelXp;
            newTrust += 1;
            nextLevelXp = getNextLevelXp(newTrust);
          }

          await db
            .update(userAgentRelationships)
            .set({
              trustLevel: newTrust,
              affectionXp: newXp,
              updatedAt: new Date(),
            })
            .where(eq(userAgentRelationships.id, currentRel.id));
        }
      }

      await db
        .update(weeklyChallenges)
        .set({ isClaimed: 1, updatedAt: new Date() })
        .where(eq(weeklyChallenges.id, challenge.id));

      res.json({ success: true, reward: "500 Bonus XP granted to all companions" });
    } catch (error) {
      console.error("Error claiming weekly reward:", error);
      res.status(500).json({ error: "Failed to claim reward" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
