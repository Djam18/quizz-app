import axios from 'axios';
import type { Question } from '../types/Question';
import { prepareQuestions } from '../utils/shuffle';

// API Open Trivia Database
const apiBaseUrl = 'https://opentdb.com/api.php';

interface ApiResponse {
  response_code: number;
  results: Omit<Question, 'id'>[];
}

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
