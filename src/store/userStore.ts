import { defineStore } from 'pinia';
import type { User, QuizResult } from '../types/Question';

interface UserState {
  user: User | null;
  lastQuizDate: Date | null;
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    user: null,
    lastQuizDate: null
  }),

  getters: {
    isLoggedIn: (state) => !!state.user,
    userName: (state) => state.user?.name || 'Invité',
    userCountry: (state) => state.user?.country || '',
    isPremium: (state) => state.user?.isPremium || false,
    isAdmin: (state) => state.user?.role === 'admin',
    quizHistory: (state) => state.user?.history || [],

    canPlayAgain: (state) => {
      if (!state.lastQuizDate) return true;
      if (state.user?.isPremium) return true;

      // Pour les utilisateurs non premium, vérifier si 24h se sont écoulées
      const now = new Date();
      const timeDiff = now.getTime() - state.lastQuizDate.getTime();
      const hoursDiff = timeDiff / (1000 * 60 * 60);

      return hoursDiff >= 24;
    },

    topScores: (state) => {
      if (!state.user) return [];

      return [...state.user.history]
        .sort((a, b) => b.score - a.score)
        .slice(0, 5);
    }
  },

  actions: {
    login(name: string, country: string) {
      // Vérifier si l'utilisateur existe dans le localStorage
      const storedUser = localStorage.getItem(`quiz_user_${name}`);

      if (storedUser) {
        this.user = JSON.parse(storedUser);
      } else {
        // Créer un nouvel utilisateur
        this.user = {
          name,
          country,
          isPremium: false,
          history: []
        };
        this.saveUserToLocalStorage();
      }
    },

    logout() {
      this.user = null;
      this.lastQuizDate = null;
    },

    addQuizResult(result: QuizResult) {
      if (!this.user) return;

      this.user.history.push(result);
      this.lastQuizDate = new Date();
      this.saveUserToLocalStorage();
    },

    upgradeToPremium() {
      if (!this.user) return;

      this.user.isPremium = true;
      this.saveUserToLocalStorage();
    },

    saveUserToLocalStorage() {
      if (!this.user) return;

      localStorage.setItem(`quiz_user_${this.user.name}`, JSON.stringify(this.user));
    }
  }
});