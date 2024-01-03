<template>
  <div class="quiz-header">
    <div class="quiz-info">
      <h1 class="category">{{ category }}</h1>
      <div class="progress-container">
        <div class="progress-text">{{ $t('quiz.question') }} {{ current }} {{ $t('quiz.of') }} {{ total }}</div>
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: `${percentage}%` }"></div>
        </div>
      </div>
    </div>

    <div class="timer">
      <div class="timer-text">
        {{ $t('quiz.time') }}: <span :class="{ 'time-low': remainingTime <= 5 }">{{ remainingTime }}</span> {{ $t('quiz.seconds') }}
      </div>
      <div class="timer-bar">
        <div
          class="timer-fill"
          :style="{ width: `${(remainingTime / timePerQuestion) * 100}%` }"
          :class="{ 'time-low-bg': remainingTime <= 5 }"
        ></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'QuizHeader',
  props: {
    category: {
      type: String,
      required: true
    },
    current: {
      type: Number,
      required: true
    },
    total: {
      type: Number,
      required: true
    },
    percentage: {
      type: Number,
      required: true
    },
    remainingTime: {
      type: Number,
      required: true
    },
    timePerQuestion: {
      type: Number,
      required: true
    }
  }
});
</script>

<style scoped>
.quiz-header {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
  margin-bottom: 20px;
  max-width: 800px;
  width: 100%;
}

.quiz-info {
  margin-bottom: 15px;
}

.category {
  font-size: 1.3rem;
  margin-bottom: 10px;
  color: #424242;
}

.progress-container {
  margin-bottom: 10px;
}

.progress-text {
  margin-bottom: 5px;
  color: #616161;
}

.progress-bar {
  background-color: #e0e0e0;
  height: 8px;
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  background-color: #26a69a;
  height: 100%;
  transition: width 0.3s ease;
}

.timer {
  margin-top: 15px;
}

.timer-text {
  margin-bottom: 5px;
  color: #616161;
}

.time-low {
  color: #e53935;
  font-weight: bold;
}

.timer-bar {
  background-color: #e0e0e0;
  height: 8px;
  border-radius: 4px;
  overflow: hidden;
}

.timer-fill {
  background-color: #66bb6a;
  height: 100%;
  transition: width 0.5s linear;
}

.time-low-bg {
  background-color: #e53935;
}
</style>
