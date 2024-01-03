<template>
  <div class="home">
    <h1>Application de Quiz</h1>
    <p>Bienvenue dans votre application de quiz!</p>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'HomeView'
})
</script>

<style scoped>
.home {
  text-align: center;
  margin-top: 60px;
}
</style>