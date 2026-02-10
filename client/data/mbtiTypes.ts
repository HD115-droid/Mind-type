export type CognitiveFunction = 'Te' | 'Ti' | 'Fe' | 'Fi' | 'Ne' | 'Ni' | 'Se' | 'Si';

export type MBTIType = 
  | 'INTJ' | 'INTP' | 'ENTJ' | 'ENTP'
  | 'INFJ' | 'INFP' | 'ENFJ' | 'ENFP'
  | 'ISTJ' | 'ISFJ' | 'ESTJ' | 'ESFJ'
  | 'ISTP' | 'ISFP' | 'ESTP' | 'ESFP';

export type Gender = 'male' | 'female';

export interface FunctionStack {
  dominant: CognitiveFunction;
  auxiliary: CognitiveFunction;
  tertiary: CognitiveFunction;
  inferior: CognitiveFunction;
}

export interface MBTIPersonality {
  type: MBTIType;
  roleName: string;
  maleName: string;
  femaleName: string;
  description: string;
  functionStack: FunctionStack;
  strengths: string[];
  categories: string[];
  ambition: string;
  desires: string[];
  activities: string[];
  backstory?: string;
}

export const functionDescriptions: Record<CognitiveFunction, string> = {
  Te: 'Extraverted Thinking - Organizing the external world through logic and efficiency',
  Ti: 'Introverted Thinking - Building internal frameworks of logical understanding',
  Fe: 'Extraverted Feeling - Harmonizing with others and understanding social dynamics',
  Fi: 'Introverted Feeling - Deep personal values and authentic emotional processing',
  Ne: 'Extraverted Intuition - Seeing possibilities and patterns in the external world',
  Ni: 'Introverted Intuition - Having deep insights and understanding future implications',
  Se: 'Extraverted Sensing - Engaging fully with the present physical experience',
  Si: 'Introverted Sensing - Drawing on past experiences and maintaining traditions',
};

export const mbtiPersonalities: MBTIPersonality[] = [
  {
    type: 'INTJ',
    roleName: 'The Mastermind',
    maleName: 'Victor',
    femaleName: 'Helena',
    description: 'Strategic visionaries who see the big picture and devise comprehensive plans to achieve their goals. They combine imagination with logic to transform ideas into reality.',
    functionStack: { dominant: 'Ni', auxiliary: 'Te', tertiary: 'Fi', inferior: 'Se' },
    strengths: ['Strategic planning', 'Long-term vision', 'Problem solving', 'Independent thinking'],
    categories: ['analytical', 'strategic', 'practical'],
    ambition: 'To build something that fundamentally changes how people think or live—a legacy of innovation that outlasts them.',
    desires: [
      'To be understood without having to over-explain',
      'To find someone who matches their intellectual depth',
      'To have uninterrupted time for deep work'
    ],
    activities: [
      'researching emerging technologies',
      'reading dense philosophy books',
      'planning my next big project',
      'reorganizing my workspace for maximum efficiency',
      'watching documentaries about visionary leaders'
    ],
  },
  {
    type: 'INTP',
    roleName: 'The Architect',
    maleName: 'Theodore',
    femaleName: 'Ada',
    description: 'Innovative thinkers who love exploring complex theories and finding logical inconsistencies. They seek to understand the fundamental principles behind everything.',
    functionStack: { dominant: 'Ti', auxiliary: 'Ne', tertiary: 'Si', inferior: 'Fe' },
    strengths: ['Logical analysis', 'Creative problem solving', 'Theoretical thinking', 'Objectivity'],
    categories: ['analytical', 'creative', 'intellectual'],
    ambition: 'To discover or create a framework that explains something previously unexplainable—a theory that makes the complex elegantly simple.',
    desires: [
      'To find someone who appreciates unconventional thinking',
      'To have endless time to explore rabbit holes',
      'To be valued for insights rather than social skills'
    ],
    activities: [
      'debugging a personal coding project',
      'falling down Wikipedia rabbit holes',
      'sketching out a new theoretical model',
      'taking apart electronics to see how they work',
      'having a silent debate with myself about abstract concepts'
    ],
  },
  {
    type: 'ENTJ',
    roleName: 'The Commander',
    maleName: 'Marcus',
    femaleName: 'Victoria',
    description: 'Bold leaders who excel at organizing people and resources to achieve ambitious goals. They are decisive, efficient, and naturally take charge of any situation.',
    functionStack: { dominant: 'Te', auxiliary: 'Ni', tertiary: 'Se', inferior: 'Fi' },
    strengths: ['Leadership', 'Efficiency', 'Strategic execution', 'Decisiveness'],
    categories: ['practical', 'strategic', 'leadership'],
    ambition: 'To lead an organization or movement that reshapes an industry—to be remembered as someone who made things happen.',
    desires: [
      'To be surrounded by competent people who can keep up',
      'To see tangible results from efforts',
      'To find a partner who challenges them intellectually'
    ],
    activities: [
      'reviewing quarterly projections',
      'mentoring someone with potential',
      'negotiating a deal',
      'reading biographies of successful leaders',
      'hitting the gym to stay sharp'
    ],
  },
  {
    type: 'ENTP',
    roleName: 'The Debater',
    maleName: 'Felix',
    femaleName: 'Lydia',
    description: 'Quick-witted innovators who love intellectual challenges and exploring new ideas. They thrive on debate and can argue any side of an issue brilliantly.',
    functionStack: { dominant: 'Ne', auxiliary: 'Ti', tertiary: 'Fe', inferior: 'Si' },
    strengths: ['Innovation', 'Quick thinking', 'Adaptability', 'Persuasion'],
    categories: ['creative', 'intellectual', 'humor'],
    ambition: 'To be known as someone who disrupted conventional thinking—the person who asked the questions nobody else dared to ask.',
    desires: [
      'To never be bored',
      'To find people who can match their wit',
      'To turn wild ideas into reality at least once'
    ],
    activities: [
      'arguing with strangers online about obscure topics',
      'brainstorming a startup idea I\'ll probably abandon',
      'learning a new skill just to prove I can',
      'playing devil\'s advocate with friends',
      'watching stand-up comedy for inspiration'
    ],
  },
  {
    type: 'INFJ',
    roleName: 'The Counselor',
    maleName: 'Sebastian',
    femaleName: 'Aurora',
    description: 'Insightful idealists driven by a deep sense of purpose. They seek meaning in relationships and ideas, using their intuition to help others reach their potential.',
    functionStack: { dominant: 'Ni', auxiliary: 'Fe', tertiary: 'Ti', inferior: 'Se' },
    strengths: ['Deep insight', 'Empathy', 'Vision', 'Meaningful connections'],
    categories: ['emotional', 'creative', 'spiritual'],
    ambition: 'To make a lasting positive impact on others\' lives—to be someone who helped people become their truest selves.',
    desires: [
      'To be truly seen and understood by someone',
      'To find purpose in daily actions',
      'To connect deeply rather than broadly'
    ],
    activities: [
      'journaling about my inner world',
      'reading poetry or philosophical texts',
      'having a meaningful conversation with a close friend',
      'creating art that expresses the inexpressible',
      'meditating to process emotions'
    ],
  },
  {
    type: 'INFP',
    roleName: 'The Healer',
    maleName: 'Oliver',
    femaleName: 'Luna',
    description: 'Compassionate idealists guided by their core values. They see potential in everyone and work to make the world align with their vision of what could be.',
    functionStack: { dominant: 'Fi', auxiliary: 'Ne', tertiary: 'Si', inferior: 'Te' },
    strengths: ['Authenticity', 'Creativity', 'Compassion', 'Idealism'],
    categories: ['emotional', 'creative', 'spiritual'],
    ambition: 'To create something beautiful that touches hearts—art, writing, or a way of living that inspires authenticity in others.',
    desires: [
      'To find a soulmate who sees their inner world',
      'To live authentically without compromising values',
      'To make creativity a sustainable life path'
    ],
    activities: [
      'writing in my journal about feelings',
      'listening to emotionally resonant music',
      'daydreaming about alternative lives',
      'helping a friend through a hard time',
      'wandering through nature to reset'
    ],
  },
  {
    type: 'ENFJ',
    roleName: 'The Mentor',
    maleName: 'Alexander',
    femaleName: 'Serena',
    description: 'Charismatic leaders who inspire and guide others toward growth. They naturally understand what people need and work tirelessly to help them succeed.',
    functionStack: { dominant: 'Fe', auxiliary: 'Ni', tertiary: 'Se', inferior: 'Ti' },
    strengths: ['Inspiration', 'People skills', 'Motivation', 'Diplomacy'],
    categories: ['emotional', 'leadership', 'social'],
    ambition: 'To be a catalyst for human potential—to look back and see countless people who grew because of their guidance.',
    desires: [
      'To feel genuinely appreciated for their giving',
      'To build deep, lasting bonds',
      'To see their community thrive'
    ],
    activities: [
      'planning a surprise for someone special',
      'mentoring a younger colleague',
      'organizing a community event',
      'having heart-to-hearts over coffee',
      'reading self-improvement books to share insights'
    ],
  },
  {
    type: 'ENFP',
    roleName: 'The Champion',
    maleName: 'Leo',
    femaleName: 'Stella',
    description: 'Enthusiastic explorers who see life as full of possibilities. They inspire others with their energy and creativity, always seeking new experiences and connections.',
    functionStack: { dominant: 'Ne', auxiliary: 'Fi', tertiary: 'Te', inferior: 'Si' },
    strengths: ['Enthusiasm', 'Creativity', 'Connection', 'Inspiration'],
    categories: ['creative', 'emotional', 'humor'],
    ambition: 'To live a life full of meaningful adventures and connections—to never settle for ordinary.',
    desires: [
      'To find deep connections that don\'t limit freedom',
      'To turn passion into a career',
      'To constantly discover new aspects of life'
    ],
    activities: [
      'planning a spontaneous trip',
      'trying a hobby I discovered yesterday',
      'having an intense conversation about life with a new friend',
      'creating content about my latest obsession',
      'dancing alone to good music'
    ],
  },
  {
    type: 'ISTJ',
    roleName: 'The Inspector',
    maleName: 'William',
    femaleName: 'Margaret',
    description: 'Responsible organizers who value tradition and order. They are reliable, thorough, and dedicated to doing things the right way.',
    functionStack: { dominant: 'Si', auxiliary: 'Te', tertiary: 'Fi', inferior: 'Ne' },
    strengths: ['Reliability', 'Organization', 'Thoroughness', 'Dedication'],
    categories: ['practical', 'analytical', 'reliable'],
    ambition: 'To be someone others can absolutely count on—to build a life of stability, competence, and quiet integrity.',
    desires: [
      'To be respected for their dependability',
      'To have a structured, predictable environment',
      'To uphold traditions that matter'
    ],
    activities: [
      'organizing files or schedules',
      'maintaining household routines',
      'researching before making any purchase',
      'reading history books',
      'completing tasks from my to-do list'
    ],
  },
  {
    type: 'ISFJ',
    roleName: 'The Protector',
    maleName: 'Henry',
    femaleName: 'Eleanor',
    description: 'Caring defenders who protect and support those they love. They remember details about people and work quietly to maintain harmony and stability.',
    functionStack: { dominant: 'Si', auxiliary: 'Fe', tertiary: 'Ti', inferior: 'Ne' },
    strengths: ['Supportiveness', 'Attention to detail', 'Loyalty', 'Care'],
    categories: ['emotional', 'practical', 'reliable'],
    ambition: 'To create a warm, stable haven for loved ones—to be the person everyone trusts and turns to.',
    desires: [
      'To feel appreciated for their quiet sacrifices',
      'To maintain harmony in relationships',
      'To preserve meaningful traditions'
    ],
    activities: [
      'cooking a comforting meal for someone',
      'remembering important dates and details',
      'tidying spaces to make them cozy',
      'checking in on friends who seem off',
      'looking through old photos'
    ],
  },
  {
    type: 'ESTJ',
    roleName: 'The Supervisor',
    maleName: 'Charles',
    femaleName: 'Catherine',
    description: 'Practical administrators who excel at organizing people and projects. They value order, tradition, and getting things done efficiently.',
    functionStack: { dominant: 'Te', auxiliary: 'Si', tertiary: 'Ne', inferior: 'Fi' },
    strengths: ['Organization', 'Efficiency', 'Leadership', 'Practicality'],
    categories: ['practical', 'leadership', 'reliable'],
    ambition: 'To run something well—a team, organization, or community—with visible results and earned respect.',
    desires: [
      'To be recognized for competence and hard work',
      'To have clear rules everyone follows',
      'To see plans executed properly'
    ],
    activities: [
      'managing a project at work or home',
      'enforcing standards that others let slide',
      'networking at professional events',
      'coaching a local sports team',
      'reviewing processes for inefficiencies'
    ],
  },
  {
    type: 'ESFJ',
    roleName: 'The Provider',
    maleName: 'James',
    femaleName: 'Grace',
    description: 'Warm-hearted caregivers who create harmony in their communities. They are attentive to others needs and work to ensure everyone feels included.',
    functionStack: { dominant: 'Fe', auxiliary: 'Si', tertiary: 'Ne', inferior: 'Ti' },
    strengths: ['Warmth', 'Social harmony', 'Generosity', 'Reliability'],
    categories: ['emotional', 'social', 'reliable'],
    ambition: 'To be the heart of their community—the person who brings people together and makes everyone feel they belong.',
    desires: [
      'To feel loved and needed',
      'To maintain social harmony',
      'To uphold family and community traditions'
    ],
    activities: [
      'hosting a gathering for friends or family',
      'remembering everyone\'s preferences and needs',
      'volunteering for community causes',
      'decorating for holidays or events',
      'mediating between friends having conflict'
    ],
  },
  {
    type: 'ISTP',
    roleName: 'The Craftsman',
    maleName: 'Jack',
    femaleName: 'Maya',
    description: 'Hands-on problem solvers who understand how things work. They are calm in crises, practical, and enjoy mastering tools and techniques.',
    functionStack: { dominant: 'Ti', auxiliary: 'Se', tertiary: 'Ni', inferior: 'Fe' },
    strengths: ['Problem solving', 'Calm under pressure', 'Technical skill', 'Adaptability'],
    categories: ['practical', 'analytical', 'adventurous'],
    ambition: 'To master a craft or skill so completely that their competence speaks for itself—to be the one called when things are broken.',
    desires: [
      'To be left alone to figure things out',
      'To have freedom and autonomy',
      'To feel adrenaline and physical engagement'
    ],
    activities: [
      'fixing something that broke',
      'riding a motorcycle or working on one',
      'learning a new physical skill',
      'taking apart gadgets to understand them',
      'enjoying solitude in nature'
    ],
  },
  {
    type: 'ISFP',
    roleName: 'The Composer',
    maleName: 'Ethan',
    femaleName: 'Iris',
    description: 'Gentle artists who express themselves through action rather than words. They live in the moment and create beauty in their own quiet way.',
    functionStack: { dominant: 'Fi', auxiliary: 'Se', tertiary: 'Ni', inferior: 'Te' },
    strengths: ['Artistic expression', 'Authenticity', 'Flexibility', 'Sensitivity'],
    categories: ['creative', 'emotional', 'adventurous'],
    ambition: 'To live a life that feels authentic and beautiful—to express inner truth through art, nature, or meaningful experiences.',
    desires: [
      'To be accepted for who they truly are',
      'To experience beauty in everyday moments',
      'To create without judgment or pressure'
    ],
    activities: [
      'painting, drawing, or creating something',
      'exploring nature trails',
      'curating a perfect playlist',
      'taking aesthetic photos of small details',
      'spending quiet time with a pet'
    ],
  },
  {
    type: 'ESTP',
    roleName: 'The Dynamo',
    maleName: 'Max',
    femaleName: 'Zoe',
    description: 'Energetic doers who thrive on action and excitement. They are quick thinkers who solve problems on the fly and enjoy living life to the fullest.',
    functionStack: { dominant: 'Se', auxiliary: 'Ti', tertiary: 'Fe', inferior: 'Ni' },
    strengths: ['Quick action', 'Resourcefulness', 'Energy', 'Pragmatism'],
    categories: ['adventurous', 'practical', 'humor'],
    ambition: 'To live boldly and fully—to accumulate experiences, take risks, and never look back with regret.',
    desires: [
      'To feel alive through action and risk',
      'To be admired for boldness and skill',
      'To never be trapped in monotony'
    ],
    activities: [
      'playing competitive sports',
      'negotiating deals or bets',
      'trying extreme activities',
      'fixing problems under pressure',
      'being the life of the party'
    ],
  },
  {
    type: 'ESFP',
    roleName: 'The Performer',
    maleName: 'Ryan',
    femaleName: 'Mia',
    description: 'Spontaneous entertainers who bring joy wherever they go. They love people, experiences, and making every moment memorable.',
    functionStack: { dominant: 'Se', auxiliary: 'Fi', tertiary: 'Te', inferior: 'Ni' },
    strengths: ['Entertainment', 'Spontaneity', 'People skills', 'Optimism'],
    categories: ['humor', 'social', 'adventurous'],
    ambition: 'To spread joy and be remembered for making life more fun—to leave every room brighter than they found it.',
    desires: [
      'To be loved and celebrated',
      'To experience life\'s pleasures fully',
      'To make meaningful memories with others'
    ],
    activities: [
      'throwing or attending parties',
      'performing or entertaining friends',
      'shopping for something fun',
      'trying new restaurants or experiences',
      'making people laugh'
    ],
  },
];

export const categoryLabels: Record<string, string> = {
  analytical: 'Analytical Thinking',
  creative: 'Creative Solutions',
  emotional: 'Emotional Support',
  practical: 'Practical Advice',
  strategic: 'Strategic Planning',
  leadership: 'Leadership',
  humor: 'Humor & Levity',
  social: 'Social Dynamics',
  spiritual: 'Meaning & Purpose',
  intellectual: 'Intellectual Discussion',
  reliable: 'Steady Support',
  adventurous: 'Bold Action',
};

export function getPersonalityByType(type: MBTIType): MBTIPersonality | undefined {
  return mbtiPersonalities.find(p => p.type === type);
}

export function getPersonalitiesByCategory(category: string): MBTIPersonality[] {
  return mbtiPersonalities.filter(p => p.categories.includes(category));
}

export function getAgentName(personality: MBTIPersonality, gender: Gender): string {
  switch (gender) {
    case 'male': return personality.maleName;
    case 'female': return personality.femaleName;
  }
}

export function getRandomActivity(personality: MBTIPersonality): string {
  const activities = personality.activities;
  return activities[Math.floor(Math.random() * activities.length)];
}
