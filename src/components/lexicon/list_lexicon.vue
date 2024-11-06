<template>
  <div class="lexicon-list">
    <h2>Liste des Lexiques</h2>
    <div v-if="isLoading">Chargement...</div>
    <div v-else-if="errorMessage">{{ errorMessage }}</div>
    <div v-else-if="lexicons.length === 0">Aucun lexique trouvé.</div>
    <table v-else>
      <thead>
      <tr>
        <th>French</th>
        <th>English</th>
        <th>Reference</th>
        <th class="text-dark">ACTION</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="lexicon in lexicons" :key="lexicon.reference">
        <td>{{ lexicon.french }}</td>
        <td>{{ lexicon.english }}</td>
        <td>{{ lexicon.reference }}</td>
        <td class="text-white text-center">
          <button @click="editLexicon(lexicon.guid)" class="bg-blue-700">UPDATE</button>
          <br>
          <button @click="deleteLexicon(lexicon.guid)" class="bg-red-600">DELETE</button>

        </td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';

const lexicons = ref([]);
const isLoading = ref(true);
const errorMessage = ref('');

onMounted(async () => {
  try {
    const response = await fetch('http://${API_ENDPOINT}/lexicon/list_all');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    lexicons.value = data.response; // Mettez à jour ici pour accéder à 'response'
    console.log('Données récupérées :', lexicons.value);
  } catch (error) {
    console.error("Erreur lors de la récupération des lexiques:", error);
    errorMessage.value = "Erreur lors de la récupération des lexiques.";
  } finally {
    isLoading.value = false;
  }
});
</script>

<style scoped>
.lexicon-list {
  margin: 2rem auto;
  max-width: 800px;
  text-align: center;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  padding: 0.5rem;
  border: 1px solid #ccc;
}

th {
  background-color: #f9f9f9;
}

tbody tr:nth-child(even) {
  background-color: #f3f3f3;
}
</style>
