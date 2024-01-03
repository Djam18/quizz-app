/**
 * Mélange les éléments d'un tableau de manière aléatoire
 * @param array Le tableau à mélanger
 * @returns Un nouveau tableau mélangé
 */
export function shuffle<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * Prépare les questions en mélangeant les réponses
 * @param questions Les questions à préparer
 * @returns Tableau de questions avec réponses mélangées
 */
export function prepareQuestions<T extends { correct_answer: string; incorrect_answers: string[] }>(
  questions: T[]
): (T & { allAnswers: string[] })[] {
  return questions.map(question => {
    const allAnswers = shuffle([question.correct_answer, ...question.incorrect_answers]);
    return { ...question, allAnswers };
  });
}