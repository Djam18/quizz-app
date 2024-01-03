<template>
  <div class="about">
    <h1>À propos</h1>
    <p>Une application de quiz pour tester vos connaissances sur différents thèmes.</p>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'AboutView'
})
</script>

<style scoped>
.about {
  text-align: center;
  margin-top: 60px;
}
</style>