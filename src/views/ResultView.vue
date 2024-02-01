<template>
  <div class="result-container">
    <ScoreCard
      :result="quizResult"
      :canPlayAgain="canPlayAgain"
      :isPremium="isPremium"
      @restart="restartQuiz"
      @home="goHome"
      @upgrade="upgradeAccount"
    />

    <div v-if="isPremium" class="premium-section">
      <h2>{{ $t('premium.title') }}</h2>
      <p>Merci d'avoir souscrit à notre version premium!</p>

      <div class="history-container">
        <h3>Votre historique</h3>
        <div class="history-list">
          <div v-for="(item, index) in quizHistory.slice(0, 5)" :key="index" class="history-item">
            <div class="history-score">{{ item.score }}%</div>
            <div class="history-details">
              <div>{{ item.category }}</div>
              <div>{{ formatDate(item.date) }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useQuizStore } from '../store/quizStore';
import { useUserStore } from '../store/userStore';
import ScoreCard from '../components/ScoreCard.vue';
import { useI18n } from 'vue-i18n';

export default defineComponent({
  name: 'ResultView',
  components: {
    ScoreCard
  },

  setup() {
    const router = useRouter();
    const quizStore = useQuizStore();
    const userStore = useUserStore();
    const { t } = useI18n();

    // Vérifier si l'utilisateur a terminé un quiz
    if (!quizStore.quizFinished) {
      router.push('/');
    }

    const formatDate = (date: Date): string => {
      if (!(date instanceof Date)) {
        date = new Date(date);
      }

      return new Intl.DateTimeFormat('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      }).format(date);
    };

    const restartQuiz = () => {
      quizStore.restartQuiz();
      router.push('/quiz');
    };

    const goHome = () => {
      router.push('/');
    };

    const upgradeAccount = () => {
      userStore.upgradeToPremium();
      // Dans une vraie application, redirigez vers une page de paiement
      alert('Félicitations! Vous avez activé la version premium.');
    };

    return {
      quizResult: computed(() => quizStore.quizResult),
      canPlayAgain: computed(() => userStore.canPlayAgain),
      isPremium: computed(() => userStore.isPremium),
      quizHistory: computed(() => userStore.quizHistory),
      premiumFeatures: computed(() => {
        const features = t('premium.features');
        return Array.isArray(features) ? features : [];
      }),
      formatDate,
      restartQuiz,
      goHome,
      upgradeAccount
    };
  }
});
</script>

<style scoped>
.result-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  gap: 30px;
}

.premium-section, .upgrade-container {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 25px;
  width: 100%;
  margin-top: 20px;
}

.history-container {
  margin-top: 20px;
}

.history-list {
  margin-top: 15px;
}

.history-item {
  display: flex;
  padding: 12px;
  border-radius: 6px;
  background-color: #f5f5f5;
  margin-bottom: 10px;
  align-items: center;
}

.history-score {
  font-size: 1.5rem;
  font-weight: bold;
  color: #2e7d32;
  margin-right: 20px;
  min-width: 60px;
  text-align: center;
}

.history-details {
  display: flex;
  flex-direction: column;
  gap: 5px;
  color: #616161;
}

.feature-list {
  list-style-type: none;
  padding: 0;
  margin: 20px 0;
}

.feature-list li {
  padding: 8px 0;
  display: flex;
  align-items: center;
}

.feature-list li:before {
  content: "✓";
  color: #26a69a;
  font-weight: bold;
  margin-right: 10px;
}

.premium-btn {
  background-color: #ffc107;
  color: #212121;
  border: none;
  padding: 12px 25px;
  border-radius: 6px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s;
  margin-top: 10px;
}

.premium-btn:hover {
  background-color: #ffb300;
}
</style>