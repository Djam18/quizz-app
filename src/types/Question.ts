export interface Question {
  id: number;
  category: string;
  type: 'multiple' | 'boolean';
  difficulty: 'easy' | 'medium' | 'hard';
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
  // Champs ajoutés pour notre application
  allAnswers?: string[]; // Toutes les réponses mélangées
  userAnswer?: string;   // Réponse fournie par l'utilisateur
  isCorrect?: boolean;   // Si la réponse de l'utilisateur est correcte
}

export interface QuizResult {
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  date: Date;
  category: string;
}

export interface User {
  name: string;
  country: string;
  isPremium: boolean;
  role?: 'user' | 'admin';
  history: QuizResult[];
}