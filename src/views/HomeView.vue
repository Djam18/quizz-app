<template>
  <div class="home-container">
    <div class="hero-section">
      <h1>{{ $t('app.title') }}</h1>
      <p>{{ $t('app.subtitle') }}</p>
    </div>

    <div class="form-card" v-if="!isLoggedIn">
      <h2>{{ $t('home.welcome') }}</h2>

      <div class="form-group">
        <label for="name">{{ $t('home.name') }}</label>
        <input v-model="name" type="text" id="name" required>
      </div>

      <div class="form-group">
        <label for="country">{{ $t('home.country') }}</label>
        <input v-model="country" type="text" id="country" required>
      </div>

      <button
        class="btn primary-btn"
        :disabled="!name || !country"
        @click="login"
      >
        {{ $t('home.login') }}
      </button>
    </div>

    <div class="quiz-options" v-else>
      <h2>{{ $t('home.welcome') }}, {{ userName }}!</h2>

      <div class="form-group">
        <label for="category">{{ $t('home.category') }}</label>
        <select v-model="selectedCategory" id="category">
          <option value="">{{ $t('categories.any') }}</option>
          <option v-for="category in categories" :key="category.id" :value="category.id">
            {{ category.name }}
          </option>
        </select>
      </div>

      <div class="form-group">
        <label for="difficulty">{{ $t('home.difficulty') }}</label>
        <select v-model="selectedDifficulty" id="difficulty">
          <option value="">{{ $t('difficulty.any') }}</option>
          <option value="easy">{{ $t('difficulty.easy') }}</option>
          <option value="medium">{{ $t('difficulty.medium') }}</option>
          <option value="hard">{{ $t('difficulty.hard') }}</option>
        </select>
      </div>

      <button class="btn primary-btn" @click="startQuiz">
        {{ $t('home.start') }}
      </button>

      <div v-if="quizHistory.length > 0" class="history-preview">
        <h3>{{ $t('quiz.lastScore') }}</h3>
        <ul class="history-list">
          <li v-for="(item, index) in quizHistory.slice(0, 3)" :key="index">
            <span class="score">{{ item.score }}%</span>
            <span class="category">{{ item.category }}</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '../store/userStore';
import { fetchCategories } from '../services/api';

interface Category {
  id: number;
  name: string;
}

export default defineComponent({
  name: 'HomeView',

  setup() {
    const router = useRouter();
    const userStore = useUserStore();

    const name = ref('');
    const country = ref('');
    const categories = ref<Category[]>([]);
    const selectedCategory = ref('');
    const selectedDifficulty = ref('');
    const loading = ref(false);

    // Charger les catégories disponibles
    onMounted(async () => {
      try {
        loading.value = true;
        categories.value = await fetchCategories();
      } catch (error) {
        console.error('Erreur lors du chargement des catégories:', error);
      } finally {
        loading.value = false;
      }
    });

    const login = () => {
      if (name.value && country.value) {
        userStore.login(name.value, country.value);
      }
    };

    const startQuiz = () => {
      const query: Record<string, string> = {};

      if (selectedCategory.value) {
        query.category = selectedCategory.value;
      }

      if (selectedDifficulty.value) {
        query.difficulty = selectedDifficulty.value;
      }

      router.push({ path: '/quiz', query });
    };

    return {
      name,
      country,
      categories,
      selectedCategory,
      selectedDifficulty,
      loading,
      isLoggedIn: computed(() => userStore.isLoggedIn),
      userName: computed(() => userStore.userName),
      quizHistory: computed(() => userStore.quizHistory),
      login,
      startQuiz
    };
  }
});
</script>

<style scoped>
.home-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
}

.hero-section {
  text-align: center;
  margin-bottom: 40px;
}

.hero-section h1 {
  font-size: 2.5rem;
  margin-bottom: 10px;
  color: #26a69a;
}

.hero-section p {
  font-size: 1.2rem;
  color: #616161;
}

.form-card, .quiz-options {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 30px;
  width: 100%;
  max-width: 500px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: bold;
  color: #424242;
}

.form-group input, .form-group select {
  width: 100%;
  padding: 12px;
  border: 2px solid #e0e0e0;
  border-radius: 4px;
  font-size: 1rem;
  transition: border-color 0.3s;
}

.form-group input:focus, .form-group select:focus {
  outline: none;
  border-color: #26a69a;
}

.btn {
  padding: 12px 25px;
  border-radius: 6px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
  font-size: 1rem;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.primary-btn {
  background-color: #26a69a;
  color: white;
  width: 100%;
}

.primary-btn:hover:not(:disabled) {
  background-color: #00897b;
}

.history-preview {
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #e0e0e0;
}

.history-preview h3 {
  margin-bottom: 15px;
  color: #424242;
}

.history-list {
  list-style-type: none;
  padding: 0;
}

.history-list li {
  padding: 10px;
  background-color: #f5f5f5;
  border-radius: 4px;
  margin-bottom: 8px;
  display: flex;
  justify-content: space-between;
}

.history-list .score {
  font-weight: bold;
  color: #2e7d32;
}

.history-list .category {
  color: #616161;
}
</style>
