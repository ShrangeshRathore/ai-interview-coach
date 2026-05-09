import { InterviewQuestion } from '../types/interview';

export const POWER_PLATFORM_QUESTIONS: InterviewQuestion[] = [
  // Technical Questions
  {
    id: 'pp-1',
    category: 'power-platform',
    difficulty: 'intermediate',
    question: 'Can you explain the difference between Power Apps, Power Automate, and Power BI?',
    expectedAnswer: 'Power Apps is for building custom business applications, Power Automate is for workflow automation, and Power BI is for business intelligence and data visualization.',
    keyPoints: [
      'Power Apps: Low-code/no-code app development',
      'Power Automate: Workflow automation and RPA',
      'Power BI: Data analytics and reporting',
      'Integration capabilities between all three'
    ],
    followUpQuestions: [
      'How would you choose which tool to use for a specific business need?',
      'Can you give an example of how these tools work together?'
    ]
  },
  {
    id: 'pp-2',
    category: 'power-platform',
    difficulty: 'advanced',
    question: 'How do you handle data source connections and security in Power Apps?',
    expectedAnswer: 'I use connectors for various data sources, implement proper authentication, and follow security best practices like least privilege access.',
    keyPoints: [
      'Use appropriate connectors (SQL, SharePoint, Dataverse, etc.)',
      'Implement authentication methods (OAuth, API keys, etc.)',
      'Configure data source permissions',
      'Use environment variables for sensitive information',
      'Implement row-level security when needed'
    ]
  },
  {
    id: 'pp-3',
    category: 'power-platform',
    difficulty: 'intermediate',
    question: 'Explain the concept of Dataverse and its role in Power Platform.',
    expectedAnswer: 'Dataverse is the data platform for Power Platform that provides secure, scalable data storage with built-in business logic.',
    keyPoints: [
      'Secure data storage for Power Platform apps',
      'Built-in business logic and validation',
      'Integration with other Microsoft services',
      'Common Data Model for standardized data',
      'Security and compliance features'
    ]
  },
  {
    id: 'pp-4',
    category: 'power-platform',
    difficulty: 'advanced',
    question: 'How do you optimize Power Apps performance?',
    expectedAnswer: 'I optimize by reducing data calls, using delegation, implementing proper caching, and following performance best practices.',
    keyPoints: [
      'Minimize data source calls',
      'Use delegation for large datasets',
      'Implement proper loading screens',
      'Optimize formulas and expressions',
      'Use concurrent functions when appropriate',
      'Monitor app analytics'
    ]
  },

  // Copilot Studio Questions
  {
    id: 'cs-1',
    category: 'copilot-studio',
    difficulty: 'intermediate',
    question: 'What is Copilot Studio and how does it differ from traditional chatbot development?',
    expectedAnswer: 'Copilot Studio is a low-code platform for building conversational AI solutions, making it accessible to non-developers compared to traditional coding approaches.',
    keyPoints: [
      'Low-code/no-code chatbot development',
      'Visual conversation designer',
      'Integration with Microsoft services',
      'AI-powered natural language understanding',
      'Rapid prototyping capabilities'
    ]
  },
  {
    id: 'cs-2',
    category: 'copilot-studio',
    difficulty: 'advanced',
    question: 'How do you handle complex conversation flows in Copilot Studio?',
    expectedAnswer: 'I use topics, entities, variables, and conditional logic to create sophisticated conversation flows.',
    keyPoints: [
      'Create topics for different conversation paths',
      'Use entities for data extraction',
      'Implement variables for state management',
      'Add conditional logic with Power Fx',
      'Handle fallback scenarios',
      'Test conversation flows thoroughly'
    ]
  },
  {
    id: 'cs-3',
    category: 'copilot-studio',
    difficulty: 'intermediate',
    question: 'Explain how to integrate Copilot Studio with Power Platform apps.',
    expectedAnswer: 'I can embed Copilot Studio chatbots in Power Apps using the Copilot component or integrate via Power Automate flows.',
    keyPoints: [
      'Use Copilot component in Power Apps',
      'Trigger Power Automate flows from conversations',
      'Pass data between Copilot and Power Apps',
      'Handle authentication and security',
      'Monitor conversation analytics'
    ]
  },
  {
    id: 'cs-4',
    category: 'copilot-studio',
    difficulty: 'advanced',
    question: 'How do you implement multilingual support in Copilot Studio?',
    expectedAnswer: 'I configure multiple languages in the bot settings and create language-specific topics and responses.',
    keyPoints: [
      'Enable multiple languages in bot settings',
      'Create language-specific topics',
      'Use translation services for responses',
      'Handle language detection',
      'Test multilingual scenarios'
    ]
  },

  // Behavioral Questions
  {
    id: 'bh-1',
    category: 'behavioral',
    difficulty: 'intermediate',
    question: 'Tell me about a time when you had to learn a new technology quickly. How did you approach it?',
    expectedAnswer: 'I broke down the learning into manageable chunks, used official documentation, practiced with small projects, and sought help from the community.',
    keyPoints: [
      'Assess current knowledge and gaps',
      'Create a structured learning plan',
      'Use official documentation and courses',
      'Practice with hands-on projects',
      'Seek mentorship and community support',
      'Apply learning in real scenarios'
    ]
  },
  {
    id: 'bh-2',
    category: 'behavioral',
    difficulty: 'intermediate',
    question: 'Describe a challenging technical problem you solved in a Power Platform project.',
    expectedAnswer: 'I identified the root cause, researched solutions, implemented a fix, and documented the resolution for future reference.',
    keyPoints: [
      'Clearly define the problem',
      'Gather requirements and constraints',
      'Research and evaluate solutions',
      'Implement and test the solution',
      'Document the process and outcome',
      'Share learnings with the team'
    ]
  },

  // Situational Questions
  {
    id: 'sit-1',
    category: 'situational',
    difficulty: 'intermediate',
    question: 'How would you handle a situation where a Power App you built is performing poorly in production?',
    expectedAnswer: 'I would monitor performance metrics, identify bottlenecks, optimize the app, and implement monitoring for future issues.',
    keyPoints: [
      'Monitor app performance and usage',
      'Identify performance bottlenecks',
      'Optimize data queries and formulas',
      'Implement caching strategies',
      'Add error handling and logging',
      'Communicate with stakeholders',
      'Plan for scalability'
    ]
  },
  {
    id: 'sit-2',
    category: 'situational',
    difficulty: 'advanced',
    question: 'If you were asked to build a complex workflow that integrates multiple systems, how would you approach it?',
    expectedAnswer: 'I would start with requirements gathering, design the architecture, implement incrementally, and thoroughly test the integration.',
    keyPoints: [
      'Gather detailed requirements',
      'Design integration architecture',
      'Choose appropriate connectors and APIs',
      'Implement error handling and retry logic',
      'Test thoroughly with various scenarios',
      'Document the integration process',
      'Plan for maintenance and monitoring'
    ]
  }
];

export const getQuestionsByCategory = (category: InterviewQuestion['category']): InterviewQuestion[] => {
  return POWER_PLATFORM_QUESTIONS.filter(q => q.category === category);
};

export const getQuestionsByDifficulty = (difficulty: InterviewQuestion['difficulty']): InterviewQuestion[] => {
  return POWER_PLATFORM_QUESTIONS.filter(q => q.difficulty === difficulty);
};

export const getRandomQuestions = (count: number = 5): InterviewQuestion[] => {
  const shuffled = [...POWER_PLATFORM_QUESTIONS].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};