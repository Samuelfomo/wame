<template>
  <!-- Alertes -->
  <div class="fixed top-4 right-4 z-50">
    <TransitionGroup
      enter-active-class="transform ease-out duration-300 transition"
      enter-from-class="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
      enter-to-class="translate-y-0 opacity-100 sm:translate-x-0"
      leave-active-class="transition ease-in duration-100"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div v-for="alert in alerts" :key="alert.id" class="bg-green-500 text-white px-4 py-2 rounded shadow-lg transition-opacity duration-300 mb-2">
        <strong>{{ alert.title }}:</strong> {{ alert.message }}
        <button @click="removeAlert(alert.id)" class="ml-2 text-xs text-gray-200">X</button>
      </div>
    </TransitionGroup>
  </div>
  <div class="p-8 bg-gray-100 min-h-screen">
    <h3 class="text-3xl font-semibold text-gray-800 mb-6">Gestion du Lexique</h3>

    <div class="bg-white p-6 rounded-lg shadow-md">
      <div class="flex justify-between items-center mb-6">
        <h4 class="text-xl font-semibold text-gray-700">Liste des Lexiques</h4>
        <div class="flex space-x-4">
          <span class="text-blue-500 text-xl font-black">AJOUTER</span>
          <button
            @click="openAddModal"
            class="p-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center"
            title="Ajouter un Nouveau Lexique"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
          </button>
          <button
            v-if="selectedLexicons.length > 0"
            @click="confirmDelete(selectedLexicons)"
            class="p-2 bg-red-600 text-white rounded hover:bg-red-700 flex items-center"
            title="Supprimer Sélectionnée"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            </svg>
            <span class="ml-1 text-sm">{{ selectedLexicons.length }}</span>
          </button>
        </div>
      </div>

      <table id="lexicon-table" class="min-w-full bg-white rounded table-class">
        <thead>
        <tr>
          <th></th>
          <th class="py-2 px-4 bg-gray-100 border-b border-gray-300 text-left text-sm text-gray-600">Référence</th>
          <th class="py-2 px-4 bg-gray-100 border-b border-gray-300 text-left text-sm text-gray-600">Français</th>
          <th class="py-2 px-4 bg-gray-100 border-b border-gray-300 text-left text-sm text-gray-600">Anglais</th>
          <th class="py-2 px-4 bg-gray-100 border-b border-gray-300 text-left text-sm text-gray-600">Actions</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="lexicon in lexicons" :key="lexicon.guid" class="hover:bg-gray-50">
          <td>
            <input
              class="py-2 px-4 border-b border-gray-300"
              type="checkbox"
              v-model="selectedLexicons"
              :value="lexicon.guid"
            />
          </td>
          <td class="py-2 px-4 border-b border-gray-300" @click="editLexicon(lexicon)">
            <span v-if="lexicon.portable" class="inline-block w-2.5 h-2.5 rounded-full bg-blue-600 mr-2 absolute"></span>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            {{ lexicon.reference }}
          </td>
          <td class="py-2 px-4 border-b border-gray-300" @click="editLexicon(lexicon)">{{ lexicon.french }}</td>
          <td class="py-2 px-4 border-b border-gray-300" @click="editLexicon(lexicon)">{{ lexicon.english }}</td>
          <td class="py-2 px-4 border-b border-gray-300">
            <div class="relative">
              <button @click.stop="toggleMenu(lexicon.guid)" class="p-1 hover:bg-gray-100 rounded">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                </svg>
              </button>
              <div v-if="activeMenu === lexicon.guid" class="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
                <div class="py-1">
                  <button @click="editLexicon(lexicon)" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">
                    Modifier
                  </button>
                  <button @click="copyToClipboard(lexicon.reference)" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">
                    Copier
                  </button>
                  <button @click="confirmDelete([lexicon.guid])" class="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full text-left">
                    Supprimer
                  </button>
                </div>
              </div>
            </div>
          </td>
        </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal pour Ajouter/Modifier -->
    <div v-if="showFormModal" class="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
      <div class="bg-white p-6 rounded-lg shadow-md max-w-2xl w-full">
        <h3 class="text-xl font-semibold text-gray-700 mb-4">
          {{ guid ? 'Modifier le Lexique' : 'Ajouter un Nouveau Lexique' }}
        </h3>

        <div class="mb-4">
          <label class="text-gray-700 block mb-2" for="modal-reference">Référence</label>
          <input
            v-model="reference"
            id="modal-reference"
            type="text"
            class="input-class p-2 w-full border border-gray-300 rounded bg-gray-50"
            disabled
          />
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label class="text-gray-700 block mb-2" for="modal-english">Anglais</label>
            <textarea
              v-model="english"
              id="modal-english"
              class="input-class mt-2 p-2 w-full border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500"
              placeholder="Entrez le terme en Anglais"
            />
          </div>
          <div>
            <label class="text-gray-700 block mb-2" for="modal-french">Français</label>
            <textarea
              v-model="french"
              id="modal-french"
              class="input-class mt-2 p-2 w-full border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500"
              placeholder="Entrez le terme en Français"
            />
          </div>
        </div>

        <div class="mb-4">
          <label class="inline-flex items-center">
            <input type="checkbox" v-model="portable" class="form-checkbox"/>
            <span class="ml-2">Exporter pour Mobile</span>
          </label>
        </div>

        <div class="flex justify-end space-x-4">
          <button @click="closeFormModal" class="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400">
            Annuler
          </button>
          <button @click="registerOrUpdateLexicon" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            {{ guid ? 'Mettre à Jour' : 'Enregistrer' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Modal de Confirmation de Suppression -->
    <div v-if="showDeleteModal" class="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
      <div class="bg-white p-6 rounded-lg shadow-md max-w-sm w-full">
        <h3 class="text-xl font-semibold text-gray-700 mb-4">Confirmer la Suppression</h3>
        <p class="text-gray-600 mb-6">
          Êtes-vous sûr de vouloir supprimer {{ guidToDelete.length > 1 ? 'ces lexiques' : 'ce lexique' }} ?
        </p>
        <div class="flex justify-end space-x-4">
          <button @click="closeModal" class="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400">Annuler</button>
          <button @click="deleteLexicon" class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">Confirmer</button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import axios from 'axios';
import { ref, onMounted, watch, nextTick } from 'vue';
import '../../constant';
import { API_ENDPOINT } from '../../constant';
import 'datatables.net-dt/css/dataTables.dataTables.min.css';
import 'datatables.net';

const lexicons = ref([]);
const isLoading = ref(true);
const message = ref('');
const guid = ref(null);
const portable = ref(false);
const french = ref('');
const english = ref('');
const reference = ref('');
const showDeleteModal = ref(false);
const guidToDelete = ref([]);
const selectedLexicons = ref([]);
const showFormModal = ref(false);
const activeMenu = ref(null);
const alerts = ref([]);

const showMessage = (msg, status = 'success') => {
  if (alerts.value.some(alert => alert.message === msg)) return; // Évite les doublons

  const id = Date.now();
  alerts.value.push({
    id,
    title: status === 'success' ? 'Succès' : 'Erreur',
    message: msg
  });

  setTimeout(() => {
    removeAlert(id);
  }, 3000);
};

const removeAlert = (id) => {
  alerts.value = alerts.value.filter(alert => alert.id !== id);
};

const closeModal = () => {
  showDeleteModal.value = false;
  guidToDelete.value = [];
};

const closeFormModal = () => {
  console.log("Fermeture du modal...");
  showFormModal.value = false; // Ferme le modal
  nextTick(() => {
    // Réinitialisation des valeurs
    english.value = '';
    french.value = '';
    reference.value = '';
    portable.value = false;
    guid.value = null;
    console.log("Modal fermé et champs réinitialisés.");
  });
};

function toOpenCamelCase(str) {
  if (!str) return '';
  return str
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');
}

async function fetchLexicons() {
  try {
    const response = await axios.get(`${API_ENDPOINT}/lexicon/list_all`);
    lexicons.value = response.data.response || []; // Vérifie que la réponse est un tableau
    if ($.fn.DataTable.isDataTable('#lexicon-table')) {
      $('#lexicon-table').DataTable().destroy();
    }
    await nextTick();
    $("#lexicon-table").DataTable();
  } catch (error) {
    showMessage("Erreur lors de la récupération des lexiques.", 'error');
  } finally {
    isLoading.value = false;
  }
}

async function registerOrUpdateLexicon() {
  if (!english.value || !french.value) {
    showMessage("Les champs Anglais et Français sont requis.", 'error');
    return;
  }

  try {
    const postData = {
      english: english.value,
      french: french.value,
      portable: portable.value,
      guid: guid.value
    };

    await axios.post(`${API_ENDPOINT}/lexicon/add`,postData);
    showMessage('Lexique enregistré avec succès !');
    // Recharger la page après l'enregistrement
    location.reload();
  } catch (error) {
    console.error("Erreur lors de l'enregistrement du lexique:", error);
    showMessage("Erreur lors de l'enregistrement du lexique.", 'error');
  }
}

function confirmDelete(guidArray) {
  guidToDelete.value = guidArray;
  showDeleteModal.value = true;
}

async function deleteLexicon() {
  try {
    await axios.put(`${API_ENDPOINT}/lexicon/delete`, { guids: guidToDelete.value });
    showMessage('Lexique supprimé avec succès !');
    await fetchLexicons();
    showDeleteModal.value = false;
  } catch (error) {
    console.error("Erreur lors de la suppression du lexique:", error);
    showMessage("Erreur lors de la suppression du lexique.", 'error');
  }
}

function openAddModal() {
  guid.value = null;
  english.value = '';
  french.value = '';
  reference.value = '';
  portable.value = false;
  showFormModal.value = true;
}

function editLexicon(lexicon) {
  guid.value = lexicon.guid;
  english.value = lexicon.english;
  french.value = lexicon.french;
  reference.value = lexicon.reference; // Si besoin de transformer
  portable.value = lexicon.portable;
  showFormModal.value = true;
}

function copyToClipboard(text) {
  const tempInput = document.createElement("input");
  tempInput.value = text;
  document.body.appendChild(tempInput);
  tempInput.select();
  document.execCommand("copy");
  document.body.removeChild(tempInput);

  showMessage("Référence copiée dans le presse-papiers !"); // Utilisation de showMessage pour les alertes
  activeMenu.value = null;

  // Auto-hide message after 3 seconds
  setTimeout(() => {
    message.value = '';
  }, 3000);
}

// function copyToClipboard(text) {
//   navigator.clipboard.writeText(text).then(() => {
//     showMessage('Texte copié au presse-papiers !');
//   }).catch(err => {
//     console.error('Erreur lors de la copie :', err);
//     showMessage("Erreur lors de la copie du texte.", 'error');
//   });
// }

function toggleMenu(lexiconGuid) {
  activeMenu.value = activeMenu.value === lexiconGuid ? null : lexiconGuid;
}

// Écouteur d'événements pour fermer le menu au clic extérieur
document.addEventListener('click', (event) => {
  if (!event.target.closest('.relative')) {
    activeMenu.value = null;
  }
});

// Surveiller les modifications de 'english' pour mettre à jour la référence
watch(english, (newValue) => {
  reference.value = newValue ? toOpenCamelCase(newValue) : ''; // Utilisation de la fonction ici
});

onMounted(fetchLexicons);
</script>

<style scoped>
.fixed {
  transition: opacity 0.5s ease;
}
</style>
