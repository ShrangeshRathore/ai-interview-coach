export interface InterviewQuestion {
  id: string;
  category: 'technical' | 'behavioral' | 'situational' | 'power-platform' | 'copilot-studio';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  question: string;
  expectedAnswer: string;
  keyPoints: string[];
  followUpQuestions?: string[];
}

export interface InterviewSession {
  id: string;
  candidateName: string;
  role: string;
  startTime: Date;
  endTime?: Date;
  questions: InterviewQuestion[];
  answers: { questionId: string; answer: string; timestamp: Date }[];
  feedback?: InterviewFeedback;
  status: 'in-progress' | 'completed';
}

export interface InterviewFeedback {
  overallScore: number;
  strengths: string[];
  areasForImprovement: string[];
  technicalProficiency: number;
  communicationSkills: number;
  problemSolving: number;
  recommendations: string[];
}