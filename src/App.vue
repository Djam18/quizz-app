<script lang="ts">
import { defineComponent, computed, ref } from 'vue';
import { useUserStore } from './store/userStore';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { setI18nLanguage } from './i18n';

export default defineComponent({
  name: 'App',

  setup() {
    const router = useRouter();
    const userStore = useUserStore();
    const { locale } = useI18n();

    const currentYear = new Date().getFullYear();
    const isLoggedIn = computed(() => userStore.isLoggedIn);

    const availableLocales = ref(['fr', 'en', 'de']);

    const localeNames = {
      fr: 'Français',
      en: 'English',
      de: 'German'
    };

    const changeLocale = (newLocale: string) => {
      setI18nLanguage(newLocale);
    };

    const logout = () => {
      userStore.logout();
      router.push('/');
    };

    return {
      isLoggedIn,
      currentYear,
      logout,
      locale,
      availableLocales,
      localeNames,
      changeLocale
    };
  }
});
</script>

<template>
  <div class="app">
    <header class="app-header">
      <div class="container">
        <div class="logo">
          <router-link to="/">{{ $t('app.title') }}</router-link>
        </div>

        <nav class="main-nav">
          <router-link to="/" class="nav-item">{{ $t('nav.home') }}</router-link>
          <router-link to="/leaderboard" class="nav-item">{{ $t('nav.leaderboard') }}</router-link>
          <router-link to="/about" class="nav-item">{{ $t('nav.about') }}</router-link>

          <button v-if="isLoggedIn" @click="logout" class="nav-item logout-btn">
            {{ $t('nav.logout') }}
          </button>
        </nav>
      </div>

      <div class="language-switcher">
        <button
          v-for="lang in availableLocales"
          :key="lang"
          @click="changeLocale(lang)"
          :class="{ active: locale === lang }"
          class="lang-btn"
        >
          {{ localeNames[lang] }}
        </button>
      </div>
    </header>

    <main class="main-content">
      <router-view />
    </main>

    <footer class="app-footer">
      <div class="container">
        <p>&copy; {{ currentYear }} Quiz App. {{ $t('app.footer') }}</p>
      </div>
    </footer>
  </div>
</template>

<style>
/* Reset CSS */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Roboto', 'Helvetica Neue', sans-serif;
  line-height: 1.6;
  color: #333;
  background-color: #f5f5f5;
}

.container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

/* Header */
.app-header {
  background-color: #26a69a;
  color: white;
  padding: 15px 0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.app-header .container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo a {
  color: white;
  font-size: 1.5rem;
  font-weight: bold;
  text-decoration: none;
}

.main-nav {
  display: flex;
  gap: 20px;
}

.nav-item {
  color: white;
  text-decoration: none;
  font-weight: 500;
  padding: 5px 10px;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.nav-item:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.router-link-active {
  background-color: rgba(255, 255, 255, 0.2);
}

.logout-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1rem;
}

/* Language Switcher */
.language-switcher {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 10px;
  padding: 5px 0;
  background-color: rgba(0, 0, 0, 0.1);
}

.lang-btn {
  background: none;
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  padding: 5px 10px;
  border-radius: 3px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.2s;
}

.lang-btn:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.lang-btn.active {
  background-color: rgba(255, 255, 255, 0.2);
  font-weight: bold;
}

/* Main Content */
.main-content {
  min-height: calc(100vh - 150px);
  padding: 30px 0;
}

/* Footer */
.app-footer {
  background-color: #424242;
  color: #e0e0e0;
  padding: 20px 0;
  text-align: center;
}

/* Responsive design for mobile */
@media (max-width: 768px) {
  .app-header .container {
    flex-direction: column;
    gap: 15px;
  }

  .main-nav {
    width: 100%;
    justify-content: center;
    flex-wrap: wrap;
  }

  .language-switcher {
    margin-top: 15px;
  }
}
</style>
