<template>
  <div class="leaderboard-container">
    <h1>{{ $t('leaderboard.title') }}</h1>

    <div class="leaderboard-card">
      <table class="leaderboard-table">
        <thead>
          <tr>
            <th>{{ $t('leaderboard.rank') }}</th>
            <th>{{ $t('leaderboard.name') }}</th>
            <th>{{ $t('leaderboard.country') }}</th>
            <th>{{ $t('leaderboard.score') }}</th>
            <th>{{ $t('leaderboard.date') }}</th>
          </tr>
        </thead>
        <tbody>
          <!-- Données simulées dans une réelle application, ces données viendraient d'une API -->
          <tr v-for="(user, index) in leaderboardData" :key="index">
            <td>{{ index + 1 }}</td>
            <td>{{ user.name }}</td>
            <td>{{ user.country }}</td>
            <td>{{ user.score }}%</td>
            <td>{{ formatDate(user.date) }}</td>
          </tr>
        </tbody>
      </table>

      <div v-if="!isPremium" class="premium-message">
        <p>{{ $t('leaderboard.premium_msg') }}</p>
        <button class="premium-btn" @click="upgradeAccount">
          {{ $t('premium.upgrade') }}
        </button>
      </div>
    </div>

    <div class="user-stats" v-if="isLoggedIn">
      <h2>Vos statistiques</h2>
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-value">{{ topScore }}%</div>
          <div class="stat-label">Meilleur score</div>
        </div>

        <div class="stat-card">
          <div class="stat-value">{{ averageScore }}%</div>
          <div class="stat-label">Score moyen</div>
        </div>

        <div class="stat-card">
          <div class="stat-value">{{ totalQuizzes }}</div>
          <div class="stat-label">Quiz terminés</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import { useUserStore } from '../store/userStore';

interface LeaderboardUser {
  name: string;
  country: string;
  score: number;
  date: Date;
}

export default defineComponent({
  name: 'LeaderboardView',

  setup() {
    const userStore = useUserStore();

    // Données de classement (simulées)
    const leaderboardData: LeaderboardUser[] = [
      { name: 'Jean', country: 'France', score: 96, date: new Date('2023-05-15') },
      { name: 'Marie', country: 'Belgique', score: 92, date: new Date('2023-05-16') },
      { name: 'Ali', country: 'Maroc', score: 90, date: new Date('2023-05-10') },
      { name: 'Sophie', country: 'Canada', score: 88, date: new Date('2023-05-18') },
      { name: 'Carlos', country: 'Espagne', score: 85, date: new Date('2023-05-14') }
    ];

    const formatDate = (date: Date): string => {
      if (!(date instanceof Date)) {
        date = new Date(date);
      }

      return new Intl.DateTimeFormat('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      }).format(date);
    };

    const upgradeAccount = () => {
      userStore.upgradeToPremium();
      alert('Félicitations! Vous avez activé la version premium.');
    };

    // Calculer les statistiques de l'utilisateur
    const history = computed(() => userStore.quizHistory);

    const topScore = computed(() => {
      if (!history.value.length) return 0;
      return Math.max(...history.value.map(item => item.score));
    });

    const averageScore = computed(() => {
      if (!history.value.length) return 0;
      const sum = history.value.reduce((acc, item) => acc + item.score, 0);
      return Math.round(sum / history.value.length);
    });

    const totalQuizzes = computed(() => history.value.length);

    return {
      leaderboardData,
      formatDate,
      upgradeAccount,
      isLoggedIn: computed(() => userStore.isLoggedIn),
      isPremium: computed(() => userStore.isPremium),
      topScore,
      averageScore,
      totalQuizzes
    };
  }
});
</script>

<style scoped>
.leaderboard-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
}

h1 {
  text-align: center;
  margin-bottom: 30px;
  color: #26a69a;
}

.leaderboard-card {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 25px;
  margin-bottom: 30px;
  overflow-x: auto;
}

.leaderboard-table {
  width: 100%;
  border-collapse: collapse;
}

.leaderboard-table th {
  background-color: #f5f5f5;
  color: #424242;
  padding: 12px;
  text-align: left;
}

.leaderboard-table td {
  padding: 12px;
  border-top: 1px solid #e0e0e0;
}

.leaderboard-table tr:hover {
  background-color: #f9f9f9;
}

.premium-message {
  margin-top: 25px;
  padding: 15px;
  background-color: #fff8e1;
  border-radius: 6px;
  text-align: center;
}

.premium-btn {
  background-color: #ffc107;
  color: #212121;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s;
  margin-top: 10px;
}

.premium-btn:hover {
  background-color: #ffb300;
}

.user-stats {
  margin-top: 20px;
}

.user-stats h2 {
  margin-bottom: 15px;
  color: #424242;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

.stat-card {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
  text-align: center;
}

.stat-value {
  font-size: 2rem;
  font-weight: bold;
  color: #26a69a;
  margin-bottom: 10px;
}

.stat-label {
  color: #616161;
}
</style>
