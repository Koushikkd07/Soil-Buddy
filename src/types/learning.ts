export interface LearningLesson {
  id: string;
  title: string;
  category: 'plant-biology' | 'soil-science' | 'gardening-basics' | 'seasonal-tips';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: number; // in minutes
  description: string;
  content: LessonContent[];
  quiz?: Quiz;
  prerequisites?: string[]; // lesson IDs
  rewards: {
    points: number;
    badges: string[];
  };
  mascot: 'dewey' | 'soily' | 'both';
}

export interface LessonContent {
  type: 'text' | 'image' | 'animation' | 'interactive' | 'fact' | 'connection';
  title?: string;
  content: string;
  imageUrl?: string;
  animation?: string;
  interactive?: InteractiveElement;
  soilDataConnection?: SoilDataConnection;
}

export interface InteractiveElement {
  type: 'drag-drop' | 'click-reveal' | 'slider' | 'matching';
  data: any;
  correctAnswer?: any;
  feedback: {
    correct: string;
    incorrect: string;
  };
}

export interface SoilDataConnection {
  metric: 'moisture' | 'ph' | 'temperature' | 'nutrients';
  explanation: string;
  idealRange?: {
    min: number;
    max: number;
  };
}

export interface Quiz {
  id: string;
  questions: QuizQuestion[];
  passingScore: number; // percentage
}

export interface QuizQuestion {
  id: string;
  question: string;
  type: 'multiple-choice' | 'true-false' | 'drag-drop' | 'fill-blank';
  options?: string[];
  correctAnswer: string | string[];
  explanation: string;
  points: number;
}

export interface LearningProgress {
  userId: string;
  completedLessons: string[];
  currentLesson?: string;
  totalPoints: number;
  earnedBadges: LearningBadge[];
  quizScores: Record<string, number>;
  streakDays: number;
  lastActivityDate: Date;
}

export interface LearningBadge {
  id: string;
  name: string;
  description: string;
  emoji: string;
  category: string;
  earnedDate: Date;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface LearningCategory {
  id: string;
  name: string;
  description: string;
  emoji: string;
  color: string;
  lessons: string[]; // lesson IDs
  totalLessons: number;
  completedLessons: number;
}

export interface FunFact {
  id: string;
  category: string;
  fact: string;
  emoji: string;
  relatedLesson?: string;
  soilDataTrigger?: {
    metric: 'moisture' | 'ph' | 'temperature' | 'nutrients';
    condition: 'low' | 'high' | 'optimal';
  };
}

export interface LearningGame {
  id: string;
  name: string;
  description: string;
  type: 'memory' | 'puzzle' | 'quiz' | 'simulation';
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  rewards: {
    points: number;
    badges?: string[];
  };
  gameData: any;
}

export interface LearningStats {
  totalLessonsCompleted: number;
  totalPoints: number;
  currentStreak: number;
  longestStreak: number;
  favoriteCategory: string;
  timeSpentLearning: number; // in minutes
  averageQuizScore: number;
  badgesEarned: number;
}
