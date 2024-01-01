<template>
  <div class="quiz-container">
    <div v-if="loading" class="loading">
      <div class="spinner"></div>
      <p>Chargement des questions...</p>
    </div>

    <div v-else-if="error" class="error">
      <h2>Une erreur est survenue</h2>
      <p>{{ error }}</p>
      <button class="btn-retry" @click="goHome">Retour à l'accueil</button>
    </div>

    <div v-else-if="quizStarted" class="quiz-content">
      <QuizHeader
        :category="currentQuestion?.category || ''"
        :current="quizProgress.current"
        :total="quizProgress.total"
        :percentage="quizProgress.percentage"
        :remainingTime="remainingTime"
        :timePerQuestion="timePerQuestion"
      />

      <QuestionCard
        v-if="currentQuestion"
        :question="currentQuestion"
        :showResult="false"
        :quizFinished="quizFinished"
        @answer="handleAnswer"
      />
    </div>

    <div v-else-if="quizFinished" class="quiz-finished">
      <router-link to="/result" class="btn-result">Voir les résultats</router-link>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, onUnmounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useQuizStore } from '../store/quizStore';
import { useUserStore } from '../store/userStore';
import QuizHeader from '../components/QuizHeader.vue';
import QuestionCard from '../components/QuestionCard.vue';

export default defineComponent({
  name: 'QuizView',
  components: {
    QuizHeader,
    QuestionCard
  },

  setup() {
    const router = useRouter();
    const quizStore = useQuizStore();
    const userStore = useUserStore();

    // Vérifier si l'utilisateur est connecté, sinon rediriger vers l'accueil
    if (!userStore.isLoggedIn) {
      router.push('/');
    }

    // Initialiser le quiz
    onMounted(() => {
      if (!quizStore.quizStarted && !quizStore.quizFinished) {
        const categoryId = Number(router.currentRoute.value.query.category) || undefined;
        const difficulty = router.currentRoute.value.query.difficulty?.toString() || undefined;

        quizStore.startQuiz(10, categoryId, difficulty);
      } else if (quizStore.quizFinished) {
        router.push('/result');
      }
    });

    // Nettoyer le timer lorsque le composant est détruit
    onUnmounted(() => {
      quizStore.stopTimer();
    });

    const handleAnswer = (answer: string) => {
      quizStore.answerQuestion(answer);

      // Si le quiz est terminé, rediriger vers la page de résultats
      if (quizStore.quizFinished) {
        setTimeout(() => {
          router.push('/result');
        }, 1000);
      }
    };

    const goHome = () => {
      router.push('/');
    };

    return {
      // États du quiz
      loading: computed(() => quizStore.loading),
      error: computed(() => quizStore.error),
      quizStarted: computed(() => quizStore.quizStarted),
      quizFinished: computed(() => quizStore.quizFinished),

      // Données du quiz
      currentQuestion: computed(() => quizStore.currentQuestion),
      quizProgress: computed(() => quizStore.quizProgress),
      remainingTime: computed(() => quizStore.remainingTime),
      timePerQuestion: computed(() => quizStore.timePerQuestion),

      // Méthodes
      handleAnswer,
      goHome
    };
  }
});
</script>

<style scoped>
.quiz-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
}

.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 300px;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 5px solid #f3f3f3;
  border-top: 5px solid #26a69a;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 20px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error {
  text-align: center;
  padding: 30px;
  background-color: #ffebee;
  border-radius: 8px;
  margin-top: 30px;
}

.btn-retry {
  background-color: #26a69a;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  margin-top: 15px;
}

.quiz-content {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.quiz-finished {
  text-align: center;
  margin-top: 50px;
}

.btn-result {
  display: inline-block;
  background-color: #26a69a;
  color: white;
  text-decoration: none;
  padding: 15px 30px;
  border-radius: 6px;
  font-weight: bold;
  transition: background-color 0.3s;
}

.btn-result:hover {
  background-color: #00897b;
}
</style>