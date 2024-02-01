<template>
  <div class="score-card">
    <h1 class="title">{{ $t('result.title') }}</h1>

    <div class="score-container">
      <div class="score">
        <span class="score-value">{{ result.score }}%</span>
      </div>

      <div class="details">
        <div class="detail-item">
          <span class="label">{{ $t('result.correct') }}:</span>
          <span class="value correct">{{ result.correctAnswers }} / {{ result.totalQuestions }}</span>
        </div>

        <div class="detail-item">
          <span class="label">{{ $t('result.wrong') }}:</span>
          <span class="value incorrect">{{ result.totalQuestions - result.correctAnswers }} / {{ result.totalQuestions }}</span>
        </div>

        <div class="detail-item">
          <span class="label">Catégorie:</span>
          <span class="value">{{ result.category }}</span>
        </div>

        <div class="detail-item">
          <span class="label">Date:</span>
          <span class="value">{{ formatDate(result.date) }}</span>
        </div>
      </div>
    </div>

    <div class="actions">
      <button
        class="btn btn-primary"
        @click="$emit('restart')"
        :disabled="!canPlayAgain"
      >
        {{ $t('result.restart') }}
      </button>

      <button class="btn btn-secondary" @click="$emit('home')">
        {{ $t('result.home') }}
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import type { QuizResult } from '../types/Question';

export default defineComponent({
  name: 'ScoreCard',
  props: {
    result: {
      type: Object as PropType<QuizResult>,
      required: true
    },
    canPlayAgain: {
      type: Boolean,
      required: true
    },
    isPremium: {
      type: Boolean,
      required: true
    }
  },

  setup() {
    const formatDate = (date: Date): string => {
      if (!(date instanceof Date)) {
        date = new Date(date);
      }

      return new Intl.DateTimeFormat('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(date);
    };

    return { formatDate };
  }
});
</script>

<style scoped>
.score-card {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 25px;
  max-width: 700px;
  width: 100%;
  text-align: center;
}

.title {
  font-size: 1.8rem;
  color: #333;
  margin-bottom: 30px;
}

.score-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 30px;
}

.score {
  background-color: #f5f5f5;
  border-radius: 50%;
  width: 150px;
  height: 150px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 25px;
}

.score-value {
  font-size: 2.5rem;
  font-weight: bold;
  color: #2e7d32;
}

.details {
  width: 100%;
  max-width: 400px;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  padding: 8px;
  background-color: #f9f9f9;
  border-radius: 4px;
}

.label {
  font-weight: bold;
  color: #616161;
}

.value {
  color: #424242;
}

.value.correct {
  color: #2e7d32;
  font-weight: bold;
}

.value.incorrect {
  color: #c62828;
  font-weight: bold;
}

.actions {
  display: flex;
  gap: 15px;
  justify-content: center;
  margin-bottom: 20px;
}

.btn {
  padding: 12px 25px;
  border-radius: 6px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-primary {
  background-color: #26a69a;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background-color: #00897b;
}

.btn-secondary {
  background-color: #f5f5f5;
  color: #424242;
  border: 1px solid #e0e0e0;
}

.btn-secondary:hover {
  background-color: #e0e0e0;
}

.premium-info {
  margin-top: 20px;
  padding: 15px;
  background-color: #fff8e1;
  border-radius: 6px;
}

.btn-premium {
  background-color: #ffc107;
  color: #212121;
  margin-top: 10px;
}

.btn-premium:hover {
  background-color: #ffb300;
}
</style>