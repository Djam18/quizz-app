import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import i18n from './i18n'

// Créer l'instance Pinia
const pinia = createPinia()

// Créer l'application
const app = createApp(App)

// Activer les plugins dans le bon ordre
app.use(pinia)  // Pinia doit être initialisé en premier
app.use(router)
app.use(i18n)

app.mount('#app')