import { MBTIType } from './mbtiTypes';

export type AxisLetter = 'E' | 'I' | 'S' | 'N' | 'T' | 'F' | 'J' | 'P';

export interface QuestionOption {
  text: string;
  letter: AxisLetter;
}

export interface Question {
  id: number;
  text: string;
  optionA: QuestionOption;
  optionB: QuestionOption;
}

export const questions: Question[] = [
  {
    id: 1,
    text: "After a long, stressful week, what restores you faster?",
    optionA: { text: "being with friends / social activities", letter: 'E' },
    optionB: { text: "Alone time, quiet solitude", letter: 'I' },
  },
  {
    id: 2,
    text: "Which is more draining for you?",
    optionA: { text: "Long periods of solitude", letter: 'E' },
    optionB: { text: "Long periods of social interaction", letter: 'I' },
  },
  {
    id: 3,
    text: "Which statement resonates more with you?",
    optionA: { text: "I notice what is — the concrete details", letter: 'S' },
    optionB: { text: "I notice what could be — the possibilities", letter: 'N' },
  },
  {
    id: 4,
    text: "When someone tells you a story, you prefer hearing:",
    optionA: { text: "What happened, step by step in order", letter: 'S' },
    optionB: { text: "What it means or what it implies", letter: 'N' },
  },
  {
    id: 5,
    text: "When making a decision, what matters more?",
    optionA: { text: "Does it make logical sense?", letter: 'T' },
    optionB: { text: "How will it affect the people involved?", letter: 'F' },
  },
  {
    id: 6,
    text: "In conflict, what do you prioritize?",
    optionA: { text: "Fixing the problem itself", letter: 'T' },
    optionB: { text: "Easing the emotional tension first", letter: 'F' },
  },
  {
    id: 7,
    text: "What feels better to you?",
    optionA: { text: "Having a clear plan in place", letter: 'J' },
    optionB: { text: "Keeping your options open", letter: 'P' },
  },
  {
    id: 8,
    text: "How do you respond to unexpected changes?",
    optionA: { text: "Annoyed or stressed — I had it figured out", letter: 'J' },
    optionB: { text: "Energized or curious — new possibilities!", letter: 'P' },
  },
  {
    id: 9,
    text: "What does your workspace look like?",
    optionA: { text: "Organized and intentional", letter: 'J' },
    optionB: { text: "Flexible, creative chaos that works for me", letter: 'P' },
  },
  {
    id: 10,
    text: "When giving directions, you prefer to use:",
    optionA: { text: "Specific landmarks and step-by-step turns", letter: 'S' },
    optionB: { text: "A general sense of orientation and area", letter: 'N' },
  },
  {
    id: 11,
    text: "When recalling a past event, you remember:",
    optionA: { text: "Sensory details — sounds, colors, textures", letter: 'S' },
    optionB: { text: "The meaning, feeling, or insight from it", letter: 'N' },
  },
  {
    id: 12,
    text: "When someone is upset, you naturally:",
    optionA: { text: "Offer a solution or practical advice", letter: 'T' },
    optionB: { text: "Offer understanding and emotional support", letter: 'F' },
  },
  {
    id: 13,
    text: "Which bothers you more?",
    optionA: { text: "Inconsistency and illogical decisions", letter: 'T' },
    optionB: { text: "Disharmony and hurt feelings", letter: 'F' },
  },
  {
    id: 14,
    text: "Deadlines feel like:",
    optionA: { text: "Necessary structure that helps me focus", letter: 'J' },
    optionB: { text: "External pressure that constrains me", letter: 'P' },
  },
];

export interface AxisScores {
  E: number;
  I: number;
  S: number;
  N: number;
  T: number;
  F: number;
  J: number;
  P: number;
}

export interface AxisResult {
  letter: 'E' | 'I' | 'S' | 'N' | 'T' | 'F' | 'J' | 'P';
  score: number;
  oppositeScore: number;
  isWeak: boolean;
}

export interface TestResults {
  scores: AxisScores;
  type: MBTIType;
  axes: {
    EI: AxisResult;
    SN: AxisResult;
    TF: AxisResult;
    JP: AxisResult;
  };
}

export function calculateResults(answers: Record<number, 'A' | 'B'>): TestResults {
  const scores: AxisScores = {
    E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0,
  };

  for (const [questionId, choice] of Object.entries(answers)) {
    const question = questions.find(q => q.id === parseInt(questionId));
    if (question) {
      const option = choice === 'A' ? question.optionA : question.optionB;
      scores[option.letter] += 1;
    }
  }

  const EI: AxisResult = {
    letter: scores.E >= scores.I ? 'E' : 'I',
    score: Math.max(scores.E, scores.I),
    oppositeScore: Math.min(scores.E, scores.I),
    isWeak: scores.E === scores.I,
  };

  const SN: AxisResult = {
    letter: scores.S >= scores.N ? 'S' : 'N',
    score: Math.max(scores.S, scores.N),
    oppositeScore: Math.min(scores.S, scores.N),
    isWeak: scores.S === scores.N,
  };

  const TF: AxisResult = {
    letter: scores.T >= scores.F ? 'T' : 'F',
    score: Math.max(scores.T, scores.F),
    oppositeScore: Math.min(scores.T, scores.F),
    isWeak: scores.T === scores.F,
  };

  const JP: AxisResult = {
    letter: scores.J >= scores.P ? 'J' : 'P',
    score: Math.max(scores.J, scores.P),
    oppositeScore: Math.min(scores.J, scores.P),
    isWeak: scores.J === scores.P,
  };

  const type = `${EI.letter}${SN.letter}${TF.letter}${JP.letter}` as MBTIType;

  return {
    scores,
    type,
    axes: { EI, SN, TF, JP },
  };
}
