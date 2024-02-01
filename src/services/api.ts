import axios from 'axios';
import type { Question } from '../types/Question';
import { prepareQuestions } from '../utils/shuffle';

// API Open Trivia Database
const apiBaseUrl = 'https://opentdb.com/api.php';

interface ApiResponse {
  response_code: number;
  results: Omit<Question, 'id'>[];
}

// Langues supportées
const SUPPORTED_LANGUAGES = ['en', 'fr'];

/**
 * Récupère les questions depuis l'API externe
 * @param amount Nombre de questions à récupérer
 * @param category ID de la catégorie (optionnel)
 * @param difficulty Niveau de difficulté (optionnel)
 * @returns Promise avec un tableau de questions préparées
 */
export async function fetchQuestions(
  amount: number = 10,
  category?: number,
  difficulty?: string
): Promise<Question[]> {
  try {
    const params: Record<string, string | number> = { amount };

    if (category) params.category = category;
    if (difficulty) params.difficulty = difficulty;

    const response = await axios.get<ApiResponse>(apiBaseUrl, { params });

    if (response.data.response_code !== 0) {
      throw new Error(`Erreur API: Code ${response.data.response_code}`);
    }

    // Ajouter un ID et préparer les questions
    const questionsWithId = response.data.results.map((q, index) => ({
      ...q,
      id: index + 1
    }));

    return prepareQuestions(questionsWithId);
  } catch (error) {
    console.error('Erreur lors de la récupération des questions:', error);
    throw error;
  }
}

// Récupérer les catégories disponibles
export async function fetchCategories() {
  try {
    const response = await axios.get('https://opentdb.com/api_category.php');
    return response.data.trivia_categories;
  } catch (error) {
    console.error('Erreur lors de la récupération des catégories:', error);
    throw error;
  }
}

/**
 * Récupère les questions depuis les fichiers JSON locaux
 * @param category - ID de la catégorie
 * @param language - Code de la langue (en, fr)
 * @returns Promise<Question[]> - Questions traduites
 */
export async function getQuestions(category: number | string, language: string = 'fr'): Promise<Question[]> {
  // Vérifier que la langue est supportée
  if (!SUPPORTED_LANGUAGES.includes(language)) {
    console.warn(`Language ${language} not supported, falling back to French`);
    language = 'fr';
  }

  try {
    // Si "benin" est spécifié comme catégorie
    if (category === 'benin') {
      const questions = await import(`../data/benin_${language}.json`);
      return questions.default || questions;
    }

    // Sinon, charger les questions de la catégorie spécifiée
    const questions = await import(`../data/${category}_${language}.json`);
    return questions.default || questions;
  } catch (error) {
    console.error(`Error loading questions: ${error}`);

    // En cas d'erreur, essayer de charger les questions générales
    try {
      const generalQuestions = await import(`../data/9_${language}.json`); // 9 = General Knowledge
      return generalQuestions.default || generalQuestions;
    } catch (fallbackError) {
      console.error(`Fallback failed: ${fallbackError}`);
      return []; // Retourner un tableau vide en dernier recours
    }
  }
}

/**
 * Obtient la liste des catégories disponibles
 * @returns Promise<Array<{id: number; name: string}>> - Catégories disponibles
 */
export async function getCategories(language: string = 'fr'): Promise<Array<{id: number | string; name: string}>> {
  // Liste des catégories
  const categories = [
    { id: 9, name: 'General Knowledge' },
    { id: 10, name: 'Books' },
    { id: 11, name: 'Film' },
    { id: 12, name: 'Music' },
    { id: 14, name: 'Television' },
    { id: 15, name: 'Video Games' },
    { id: 17, name: 'Science & Nature' },
    { id: 18, name: 'Computers' },
    { id: 19, name: 'Mathematics' },
    { id: 22, name: 'Geography' },
    { id: 23, name: 'History' },
    { id: 27, name: 'Animals' },
    { id: 'benin', name: 'Benin' } // Catégorie spéciale pour le Bénin
  ];

  // Traduire les noms des catégories si nécessaire
  if (language === 'fr') {
    return [
      { id: 9, name: 'Connaissances générales' },
      { id: 10, name: 'Livres' },
      { id: 11, name: 'Films' },
      { id: 12, name: 'Musique' },
      { id: 14, name: 'Télévision' },
      { id: 15, name: 'Jeux vidéo' },
      { id: 17, name: 'Sciences & Nature' },
      { id: 18, name: 'Informatique' },
      { id: 19, name: 'Mathématiques' },
      { id: 22, name: 'Géographie' },
      { id: 23, name: 'Histoire' },
      { id: 27, name: 'Animaux' },
      { id: 'benin', name: 'Bénin' }
    ];
  }

  return categories;
}

/**
 * Vérifie si les fichiers de questions sont disponibles
 * @returns Promise<boolean> - true si les fichiers sont disponibles
 */
export async function checkQuestionsAvailability(): Promise<boolean> {
  try {
    // Tenter de charger un fichier de questions pour vérifier la disponibilité
    // L'erreur de TypeScript "Cannot find module" est normale car le fichier
    // sera créé par le script translate-questions.js
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    await import('../data/9_fr.json');
    return true;
  } catch (error) {
    console.warn('Question files not available. Run the translation script first.');
    return false;
  }
}
