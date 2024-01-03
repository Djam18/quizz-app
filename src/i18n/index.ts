import { createI18n } from 'vue-i18n';
import fr from './locales/fr.json';
import en from './locales/en.json';
import de from './locales/de.json';

// Get stored locale from localStorage or default to French
const storedLocale = localStorage.getItem('quiz-app-locale') || 'fr';

const i18n = createI18n({
  legacy: false,
  locale: storedLocale, // Use stored or default language
  fallbackLocale: 'en',
  messages: {
    fr,
    en,
    de
  }
});

// Create a function to change locale and persist it
export const setI18nLanguage = (locale: string) => {
  if (i18n.global.locale.value !== locale) {
    i18n.global.locale.value = locale;
    localStorage.setItem('quiz-app-locale', locale);
    document.querySelector('html')?.setAttribute('lang', locale);
  }
};

// Initialize HTML lang attribute
document.querySelector('html')?.setAttribute('lang', storedLocale);

export default i18n;