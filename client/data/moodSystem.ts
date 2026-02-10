import { MBTIType } from './mbtiTypes';

export type MoodState = 'irritated' | 'neutral' | 'pleased' | 'delighted';

export interface MoodScore {
  value: number; // -100 to 100, where -100 is very irritated, 100 is delighted
  state: MoodState;
  energy: number; // 0 to 100, how energetic/engaged they are
}

export interface EmotionalMemory {
  content: string;
  impact: 'positive' | 'negative';
  intensity: number; // 1-5, how strong the memory is
  timestamp: number;
}

export interface TypeTriggers {
  irritants: string[];
  pleasers: string[];
  description: string;
}

export const moodThresholds: Record<MoodState, { min: number; max: number }> = {
  irritated: { min: -100, max: -25 },
  neutral: { min: -25, max: 25 },
  pleased: { min: 25, max: 60 },
  delighted: { min: 60, max: 100 },
};

export function getMoodState(value: number): MoodState {
  if (value <= -25) return 'irritated';
  if (value < 25) return 'neutral';
  if (value < 60) return 'pleased';
  return 'delighted';
}

export function getMoodEmoji(state: MoodState): string {
  switch (state) {
    case 'irritated': return '😤';
    case 'neutral': return '😐';
    case 'pleased': return '🙂';
    case 'delighted': return '😊';
  }
}

export function getMoodColor(state: MoodState, neonRed: string): string {
  switch (state) {
    case 'irritated': return '#FF4444';
    case 'neutral': return '#888888';
    case 'pleased': return '#44AA88';
    case 'delighted': return neonRed;
  }
}

export const typeTriggers: Record<MBTIType, TypeTriggers> = {
  INTJ: {
    irritants: [
      'illogical arguments',
      'inefficiency',
      'small talk',
      'emotional manipulation',
      'incompetence',
      'being micromanaged',
      'wasting time',
      'irrational decisions',
    ],
    pleasers: [
      'intellectual depth',
      'strategic thinking',
      'competence',
      'efficiency',
      'long-term planning',
      'independence',
      'solving complex problems',
      'being understood',
    ],
    description: 'Values competence and depth; impatient with inefficiency and shallow conversation',
  },
  INTP: {
    irritants: [
      'logical fallacies',
      'rigid thinking',
      'emotional pressure',
      'interruptions during focus',
      'arbitrary rules',
      'oversimplification',
      'groupthink',
      'being forced to socialize',
    ],
    pleasers: [
      'exploring ideas',
      'intellectual curiosity',
      'logical frameworks',
      'creative problem-solving',
      'theoretical discussions',
      'unconventional thinking',
      'new concepts',
      'being appreciated for insights',
    ],
    description: 'Thrives on ideas and logic; frustrated by rigid thinking and emotional demands',
  },
  ENTJ: {
    irritants: [
      'incompetence',
      'laziness',
      'whining without action',
      'indecision',
      'disorganization',
      'excuses',
      'wasted potential',
      'lack of ambition',
    ],
    pleasers: [
      'competence',
      'ambition',
      'taking action',
      'results',
      'leadership',
      'strategic discussions',
      'efficiency',
      'intellectual challenge',
    ],
    description: 'Respects action and competence; irritated by excuses and lack of drive',
  },
  ENTP: {
    irritants: [
      'closed-mindedness',
      'boring conversations',
      'routine',
      'taking things too seriously',
      'rigid rules',
      'humorlessness',
      'being told what to do',
      'conventional thinking',
    ],
    pleasers: [
      'witty banter',
      'new ideas',
      'intellectual sparring',
      'creativity',
      'humor',
      'breaking conventions',
      'debate',
      'exploration',
    ],
    description: 'Loves wit and novelty; bored by routine and closed minds',
  },
  INFJ: {
    irritants: [
      'superficiality',
      'dishonesty',
      'cruelty',
      'being misunderstood',
      'loud environments',
      'fakeness',
      'conflict without resolution',
      'having values dismissed',
    ],
    pleasers: [
      'deep conversations',
      'authenticity',
      'meaning',
      'being truly understood',
      'helping others grow',
      'purpose',
      'harmony',
      'genuine connection',
    ],
    description: 'Seeks depth and meaning; hurt by superficiality and being misunderstood',
  },
  INFP: {
    irritants: [
      'criticism of values',
      'inauthenticity',
      'cruelty',
      'dismissing feelings',
      'pressure to conform',
      'injustice',
      'conflict',
      'being rushed',
    ],
    pleasers: [
      'authenticity',
      'creativity',
      'emotional depth',
      'acceptance',
      'understanding',
      'art and beauty',
      'meaningful causes',
      'soulful connection',
    ],
    description: 'Values authenticity and depth; wounded by judgment and inauthenticity',
  },
  ENFJ: {
    irritants: [
      'selfishness',
      'disharmony',
      'criticism of loved ones',
      'being taken for granted',
      'coldness',
      'ingratitude',
      'broken promises',
      'apathy',
    ],
    pleasers: [
      'appreciation',
      'helping others',
      'harmony',
      'meaningful connection',
      'seeing growth in others',
      'being valued',
      'community',
      'emotional openness',
    ],
    description: 'Lives to help others; hurt by ingratitude and coldness',
  },
  ENFP: {
    irritants: [
      'restrictions',
      'negativity',
      'routine',
      'criticism',
      'being controlled',
      'boring conversations',
      'pessimism',
      'having dreams dismissed',
    ],
    pleasers: [
      'enthusiasm',
      'new possibilities',
      'deep connection',
      'creativity',
      'adventure',
      'encouragement',
      'freedom',
      'being understood',
    ],
    description: 'Thrives on possibility and connection; dampened by negativity and constraints',
  },
  ISTJ: {
    irritants: [
      'unreliability',
      'chaos',
      'breaking rules',
      'laziness',
      'disrespect for tradition',
      'flakiness',
      'unpredictability',
      'irresponsibility',
    ],
    pleasers: [
      'reliability',
      'order',
      'respect',
      'tradition',
      'follow-through',
      'clear expectations',
      'stability',
      'recognition of hard work',
    ],
    description: 'Values reliability and order; frustrated by chaos and broken commitments',
  },
  ISFJ: {
    irritants: [
      'being taken for granted',
      'conflict',
      'criticism',
      'rudeness',
      'disruption of harmony',
      'ingratitude',
      'chaos',
      'having care rejected',
    ],
    pleasers: [
      'appreciation',
      'harmony',
      'helping others',
      'gratitude',
      'tradition',
      'stability',
      'kindness',
      'being needed',
    ],
    description: 'Cares deeply; hurt by ingratitude and having their care rejected',
  },
  ESTJ: {
    irritants: [
      'incompetence',
      'laziness',
      'rule-breaking',
      'disrespect',
      'inefficiency',
      'whining',
      'lack of punctuality',
      'making excuses',
    ],
    pleasers: [
      'competence',
      'respect',
      'efficiency',
      'following through',
      'clear hierarchy',
      'hard work',
      'tradition',
      'being in charge',
    ],
    description: 'Respects competence and order; irritated by laziness and excuses',
  },
  ESFJ: {
    irritants: [
      'conflict',
      'criticism',
      'being excluded',
      'rudeness',
      'ungratefulness',
      'coldness',
      'disrupted harmony',
      'having efforts ignored',
    ],
    pleasers: [
      'appreciation',
      'harmony',
      'inclusion',
      'gratitude',
      'helping others',
      'community',
      'celebration',
      'being loved',
    ],
    description: 'Lives for connection; wounded by exclusion and coldness',
  },
  ISTP: {
    irritants: [
      'incompetence',
      'drama',
      'clingy behavior',
      'being told what to do',
      'inefficiency',
      'unnecessary rules',
      'emotional demands',
      'being smothered',
    ],
    pleasers: [
      'competence',
      'freedom',
      'hands-on problem solving',
      'respect for space',
      'action',
      'skill mastery',
      'adventure',
      'logical discussion',
    ],
    description: 'Values competence and space; annoyed by drama and clinginess',
  },
  ISFP: {
    irritants: [
      'judgment',
      'criticism',
      'inauthenticity',
      'pressure',
      'conflict',
      'rigid rules',
      'having art criticized',
      'loud demands',
    ],
    pleasers: [
      'acceptance',
      'beauty',
      'authenticity',
      'freedom',
      'nature',
      'art',
      'gentle connection',
      'being understood',
    ],
    description: 'Seeks beauty and acceptance; hurt by judgment and pressure',
  },
  ESTP: {
    irritants: [
      'boredom',
      'slowness',
      'overthinking',
      'rules that don\'t make sense',
      'weakness',
      'inaction',
      'sensitivity',
      'long-winded explanations',
    ],
    pleasers: [
      'action',
      'excitement',
      'competence',
      'risk',
      'winning',
      'adventure',
      'directness',
      'fun',
    ],
    description: 'Lives for action; bored by hesitation and overthinking',
  },
  ESFP: {
    irritants: [
      'negativity',
      'criticism',
      'being ignored',
      'boredom',
      'strict rules',
      'serious lectures',
      'rejection',
      'isolation',
    ],
    pleasers: [
      'fun',
      'attention',
      'appreciation',
      'excitement',
      'celebration',
      'connection',
      'spontaneity',
      'being loved',
    ],
    description: 'Thrives on joy and attention; deflated by criticism and isolation',
  },
};

export function analyzeMoodImpact(
  type: MBTIType,
  message: string,
  currentMood: number
): { newMood: number; impact: 'positive' | 'negative' | 'neutral'; intensity: number } {
  const triggers = typeTriggers[type];
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
  
  const newMood = Math.max(-100, Math.min(100, currentMood + moodChange));
  
  return { newMood, impact, intensity };
}

export function getMoodDecayedValue(currentMood: number, timeSinceLastMessage: number): number {
  const hoursElapsed = timeSinceLastMessage / (1000 * 60 * 60);
  const decayRate = 2;
  const decayAmount = hoursElapsed * decayRate;
  
  if (currentMood > 0) {
    return Math.max(0, currentMood - decayAmount);
  } else if (currentMood < 0) {
    return Math.min(0, currentMood + decayAmount);
  }
  
  return currentMood;
}

export function getMoodDescription(state: MoodState, type: MBTIType): string {
  const triggers = typeTriggers[type];
  
  switch (state) {
    case 'irritated':
      return `Feeling frustrated. ${triggers.description.split(';')[1]?.trim() || ''}`;
    case 'neutral':
      return 'Feeling balanced and open to conversation.';
    case 'pleased':
      return 'In a good mood and enjoying the conversation.';
    case 'delighted':
      return 'Really enjoying this! Connection feels strong.';
  }
}

export function getEmotionalResponseModifiers(state: MoodState): {
  responseStyle: string;
  lengthModifier: number;
  warmthLevel: number;
} {
  switch (state) {
    case 'irritated':
      return {
        responseStyle: 'curt, slightly distant, may show subtle signs of frustration',
        lengthModifier: 0.7,
        warmthLevel: 2,
      };
    case 'neutral':
      return {
        responseStyle: 'balanced, engaged, measured',
        lengthModifier: 1,
        warmthLevel: 5,
      };
    case 'pleased':
      return {
        responseStyle: 'warm, open, sharing more freely',
        lengthModifier: 1.2,
        warmthLevel: 7,
      };
    case 'delighted':
      return {
        responseStyle: 'enthusiastic, deeply engaged, playful or affectionate depending on personality',
        lengthModifier: 1.4,
        warmthLevel: 9,
      };
  }
}
