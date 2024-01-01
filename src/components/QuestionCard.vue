<template>
  <div class="question-card">
    <div class="question" v-html="question.question"></div>

    <div class="options">
      <button
        v-for="(answer, index) in question.allAnswers"
        :key="index"
        class="option"
        :class="{
          selected: userAnswer === answer,
          correct: showResult && answer === question.correct_answer,
          incorrect: showResult && userAnswer === answer && answer !== question.correct_answer
        }"
        :disabled="quizFinished == true"
        @click="selectAnswer(answer)"
        v-html="answer"
      ></button>
    </div>

    <div v-if="showResult" class="result-message">
      <div v-if="isCorrect" class="correct-message">Bonne réponse!</div>
      <div v-else class="incorrect-message">
        Incorrect. La bonne réponse est: <span v-html="question.correct_answer"></span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, PropType } from 'vue';
import type { Question } from '../types/Question';

export default defineComponent({
  name: 'QuestionCard',
  props: {
    question: {
      type: Object as PropType<Question>,
      required: true
    },
    showResult: {
      type: Boolean,
      default: false
    },
    quizFinished: {
      type: Boolean,
      default: false
    }
  },

  setup(props, { emit }) {
    const userAnswer = ref<string | null>(null);

    const isCorrect = computed(() => {
      return userAnswer.value === props.question.correct_answer;
    });

    const selectAnswer = (answer: string) => {
      userAnswer.value = answer;
      emit('answer', answer);
    };

    return {
      userAnswer,
      isCorrect,
      selectAnswer
    };
  }
});
</script>

<style scoped>
.question-card {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
  margin-bottom: 20px;
  max-width: 800px;
  width: 100%;
}

.question {
  font-size: 1.2rem;
  font-weight: bold;
  margin-bottom: 20px;
  color: #333;
}

.options {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.option {
  background-color: #f5f5f5;
  border: 2px solid #e0e0e0;
  border-radius: 6px;
  padding: 15px;
  text-align: left;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s;
}

.option:hover:not(:disabled) {
  background-color: #e9e9e9;
  border-color: #d0d0d0;
}

.option.selected {
  background-color: #e0f7fa;
  border-color: #26c6da;
}

.option.correct {
  background-color: #e8f5e9;
  border-color: #66bb6a;
}

.option.incorrect {
  background-color: #ffebee;
  border-color: #ef5350;
}

.option:disabled {
  cursor: default;
  opacity: 0.8;
}

.result-message {
  margin-top: 20px;
  padding: 15px;
  border-radius: 6px;
  font-weight: bold;
}

.correct-message {
  background-color: #e8f5e9;
  color: #2e7d32;
}

.incorrect-message {
  background-color: #ffebee;
  color: #c62828;
}
</style>