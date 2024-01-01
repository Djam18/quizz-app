import { defineStore } from 'pinia';
import { fetchQuestions } from '../services/api';
import type { Question } from '../types/Question';
import { useUserStore } from './userStore';

interface QuizState {
  questions: Question[];
  currentQuestionIndex: number;
  loading: boolean;
  error: string | null;
  selectedCategory: number | null;
  selectedDifficulty: string | null;
  quizStarted: boolean;
  quizFinished: boolean;
  timePerQuestion: number; // en secondes
  remainingTime: number;   // en secondes
  timerInterval: number | null;
}

export const useQuizStore = defineStore('quiz', {
  state: (): QuizState => ({
    questions: [],
    currentQuestionIndex: 0,
    loading: false,
    error: null,
    selectedCategory: null,
    selectedDifficulty: null,
    quizStarted: false,
    quizFinished: false,
    timePerQuestion: 15,
    remainingTime: 15,
    timerInterval: null
  }),

  getters: {
    currentQuestion: (state) =>
      state.questions.length > 0 && state.currentQuestionIndex < state.questions.length
        ? state.questions[state.currentQuestionIndex]
        : null,

    quizProgress: (state) => ({
      current: state.currentQuestionIndex + 1,
      total: state.questions.length,
      percentage: Math.round(((state.currentQuestionIndex + 1) / state.questions.length) * 100)
    }),

    quizResult: (state) => {
      const correctAnswers = state.questions.filter(q => q.isCorrect).length;
      const totalQuestions = state.questions.length;
      const score = Math.round((correctAnswers / totalQuestions) * 100);

      return {
        score,
        totalQuestions,
        correctAnswers,
        date: new Date(),
        category: state.questions[0]?.category || 'Mixed'
      };
    }
  },

  actions: {
    async startQuiz(amount = 10, category?: number, difficulty?: string) {
      this.loading = true;
      this.error = null;
      this.quizStarted = false;
      this.quizFinished = false;
      this.currentQuestionIndex = 0;

      this.selectedCategory = category || null;
      this.selectedDifficulty = difficulty || null;

      try {
        this.questions = await fetchQuestions(amount, category, difficulty);
        this.quizStarted = true;
        this.startTimer();
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Une erreur est survenue';
      } finally {
        this.loading = false;
      }
    },

    answerQuestion(answer: string) {
      if (!this.currentQuestion || this.quizFinished) return;

      this.stopTimer();

      // Enregistrer la réponse
      const currentQuestion = this.questions[this.currentQuestionIndex];
      currentQuestion.userAnswer = answer;
      currentQuestion.isCorrect = answer === currentQuestion.correct_answer;

      // Passer à la question suivante ou terminer le quiz
      if (this.currentQuestionIndex < this.questions.length - 1) {
        this.currentQuestionIndex++;
        this.resetTimer();
        this.startTimer();
      } else {
        this.finishQuiz();
      }
    },

    startTimer() {
      this.resetTimer();
      this.timerInterval = window.setInterval(() => {
        if (this.remainingTime > 0) {
          this.remainingTime--;
        } else {
          // Temps écoulé, marquer comme incorrecte et passer à la suivante
          if (this.currentQuestion) {
            this.answerQuestion('');
          }
        }
      }, 1000);
    },

    resetTimer() {
      this.remainingTime = this.timePerQuestion;
    },

    stopTimer() {
      if (this.timerInterval !== null) {
        clearInterval(this.timerInterval);
        this.timerInterval = null;
      }
    },

    finishQuiz() {
      this.quizFinished = true;
      this.stopTimer();

      // Sauvegarder le résultat dans le store utilisateur
      const result = this.quizResult;
      const userStore = useUserStore();
      userStore.addQuizResult(result);
    },

    restartQuiz() {
      this.startQuiz(
        this.questions.length,
        this.selectedCategory || undefined,
        this.selectedDifficulty || undefined
      );
    }
  }
});