# Quizz App

A Vue 3 + TypeScript trivia quiz application that allows users to test their knowledge across various themes.

## Features

- User registration with name and country selection
- Multiple quiz themes
- Interactive quiz interface with timer
- Scoring system and results summary
- Leaderboard showing top players
- Multi-language support (French and English) with on-the-fly translation

## Project Structure

```
/src
├── assets/                   # Images, logos, sounds
├── components/               # Reusable UI components
│   ├── QuestionCard.vue      # Question card with options
│   ├── QuizHeader.vue        # Quiz header (progress, score, theme)
│   └── ScoreCard.vue         # Results or summary after quiz
├── views/                    # Main pages accessible via router
│   ├── HomeView.vue          # Theme selection or quiz start
│   ├── QuizView.vue          # Main quiz component
│   ├── ResultView.vue        # Results, feedback, restart
│   └── LeaderboardView.vue   # Global ranking
├── router/                   # App routes definition
├── store/                    # Pinia stores
│   ├── quizStore.ts          # Main store for quiz logic
│   └── userStore.ts          # User data: name, country, score, history
├── services/
│   └── api.ts                # External API integration (OpenTDB)
├── i18n/                     # Translations
├── types/
│   └── Question.ts           # TypeScript interfaces for questions
├── data/                     # Local quiz data
├── utils/                    # Utility functions
├── App.vue                   # Root component
└── main.ts                   # Main entry point
```

## Technology Stack

- Vue 3
- TypeScript
- Vite
- Pinia (state management)
- Vue Router
- OpenTDB API for questions

## Installation

```bash
# Install dependencies
npm install

# Compile and hot-reload for development
npm run dev

# Compile and minify for production
npm run build
```

## API Integration

This application uses the [Open Trivia Database API](https://opentdb.com/) to fetch quiz questions.

## Future Enhancements

- Admin panel for managing questions
- PDF export of quiz results
- More themes and categories
- User authentication and profiles

## Developer Setup

Recommended IDE: [VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (disable Vetur)
