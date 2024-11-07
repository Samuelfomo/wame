
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
          <!--          <span class="text-blue-500 text-xl font-black">AJOUTER</span>-->
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
          <!--          <th></th>-->
          <th class="py-2 px-4 bg-gray-100 border-b border-gray-300 text-left text-sm text-gray-600">Référence</th>
          <th class="py-2 px-4 bg-gray-100 border-b border-gray-300 text-left text-sm text-gray-600">Français</th>
          <th class="py-2 px-4 bg-gray-100 border-b border-gray-300 text-left text-sm text-gray-600">Anglais</th>
          <th class="py-2 px-4 bg-gray-100 border-b border-gray-300 text-left text-sm text-gray-600">Actions</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="lexicon in lexicons" :key="lexicon.guid" class="hover:bg-gray-50">
          <!--          <td>-->
          <!--            <input-->
          <!--              class="py-2 px-4 border-b border-gray-300"-->
          <!--              type="checkbox"-->
          <!--              v-model="selectedLexicons"-->
          <!--              :value="lexicon.guid"-->
          <!--            />-->
          <!--          </td>-->
          <td class="py-2 px-4 border-b border-gray-300" @click="editLexicon(lexicon)">
            <span v-if="lexicon.portable" class="inline-block w-2.5 h-2.5 rounded-full bg-blue-600 mr-2 absolute"></span>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            {{ lexicon.reference }}
          </td>
          <td class="py-2 px-4 border-b border-gray-300" @click="editLexicon(lexicon)">{{ lexicon.french }}</td>
          <td class="py-2 px-4 border-b border-gray-300" @click="editLexicon(lexicon)">{{ lexicon.english }}</td>
          <td class="py-2 px-4 border-b border-gray-300">
            <div class="relative">
              <button @click.stop="toggleMenu(lexicon.guid)" class="p-1 hover:bg-gray-100 rounded float-right">
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
import "../../constant";
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

  const limitedEnglish = english.value.length > 120 ? english.value.slice(0, 120) : english.value;

  try {
    const postData = {
      english: limitedEnglish,
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
// watch(english, (newValue) => {
//   reference.value = newValue ? toOpenCamelCase(newValue) : ''; // Utilisation de la fonction ici
// });

// Surveiller les modifications de 'english' pour mettre à jour la référence
watch(english, (newValue) => {
  if (newValue) {
    // Limiter à 120 caractères
    const limitedValue = newValue.length > 120 ? newValue.slice(0, 120) : newValue;
    reference.value = toOpenCamelCase(limitedValue); // Convertir le texte limité
  } else {
    reference.value = ''; // Réinitialiser si le champ est vide
  }
});

onMounted(fetchLexicons);
</script>

<style scoped>
.fixed {
  transition: opacity 0.5s ease;
}
</style>


<!--<template>-->
<!--  <div class="p-8 bg-gray-100 min-h-screen">-->
<!--    <h3 class="text-3xl font-semibold text-gray-800 mb-6">Lexicon Management</h3>-->

<!--    <div class="bg-white p-6 rounded-lg shadow-md">-->
<!--      <h4 class="text-xl font-semibold text-gray-700 mb-4">Lexicon List</h4>-->

<!--      <table id="lexicon-table" class="min-w-full bg-white rounded table-class">-->
<!--        <thead>-->
<!--        <tr>-->
<!--          <th>-->
<!--            <input-->
<!--              class="py-2 px-4 bg-gray-100 border-b border-gray-300 text-left text-sm text-gray-600"-->
<!--              type="checkbox"-->
<!--              v-model="selectAll"-->
<!--              @change="toggleSelectAll"-->
<!--            />-->
<!--          </th>-->
<!--          <th class="py-2 px-4 bg-gray-100 border-b border-gray-300 text-left text-sm text-gray-600">French</th>-->
<!--          <th class="py-2 px-4 bg-gray-100 border-b border-gray-300 text-left text-sm text-gray-600">English</th>-->
<!--          <th class="py-2 px-4 bg-gray-100 border-b border-gray-300 text-left text-sm text-gray-600">Reference</th>-->
<!--          <th class="py-2 px-4 bg-gray-100 border-b border-gray-300 text-left text-sm text-gray-600">Action</th>-->

<!--        </tr>-->
<!--        </thead>-->
<!--        <tbody>-->
<!--        <tr v-for="lexicon in lexicons" :key="lexicon.guid" class="hover:bg-gray-50">-->
<!--          <td>-->
<!--            <input-->
<!--              class="py-2 px-4 border-b border-gray-300"-->
<!--              type="checkbox"-->
<!--              v-model="selectedLexicons"-->
<!--              :value="lexicon.guid"-->
<!--            />-->
<!--          </td>-->
<!--          <td class="py-2 px-4 border-b border-gray-300">{{ lexicon.french }}</td>-->
<!--          <td class="py-2 px-4 border-b border-gray-300">{{ lexicon.english }}</td>-->
<!--          <td class="py-2 px-4 border-b border-gray-300">{{ lexicon.reference }}</td>-->
<!--          <td class="flex justify-center mb-4">-->
<!--            <select @change="handleSelectAction" class="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400">-->
<!--              <option value="">Choose an action</option>-->
<!--              <option v-if="selectedLexicons.length === 0" value="add">Add</option>-->
<!--              <option v-if="selectedLexicons.length === 1" value="edit">Edit</option>-->
<!--              <option v-if="selectedLexicons.length > 0" value="delete">Delete</option>-->
<!--              <option v-if="selectedLexicons.length === 1" value="copy">Copy</option>-->
<!--            </select>-->
<!--          </td>-->
<!--        </tr>-->
<!--        </tbody>-->
<!--      </table>-->
<!--    </div>-->

<!--    <div v-if="showDeleteModal" class="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">-->
<!--      <div class="bg-white p-6 rounded-lg shadow-md max-w-sm w-full">-->
<!--        <h3 class="text-xl font-semibold text-gray-700 mb-4">Confirm Deletion</h3>-->
<!--        <p class="text-gray-600 mb-6">Are you sure you want to delete this lexicon entry?</p>-->
<!--        <div class="flex justify-end space-x-4">-->
<!--          <button @click="closeModal" class="cancel-button">Cancel</button>-->
<!--          <button @click="deleteLexicon" class="confirm-button">Confirm</button>-->
<!--        </div>-->
<!--      </div>-->
<!--    </div><br/><br/>-->

<!--    &lt;!&ndash; Registration Form &ndash;&gt;-->
<!--    <div class="bg-white p-6 rounded-lg shadow-md mb-8">-->
<!--      <h2 class="text-xl font-semibold text-gray-700 mb-4">Lexicon Form</h2>-->

<!--      <div class="bg-white rounded-lg mb-8 flex items-center">-->
<!--        <div class="flex-grow">-->
<!--          <label class="text-gray-700" for="reference">Reference</label>-->
<!--          <input-->
<!--            v-model="reference"-->
<!--            id="reference"-->
<!--            type="text"-->
<!--            class="input-class p-2 w-full border border-gray-300 rounded bg-white"-->
<!--            disabled-->
<!--          />-->
<!--        </div>-->
<!--        <button-->
<!--          @click="copyToClipboard(reference)"-->
<!--          class="ml-4 px-2 py-1 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"-->
<!--        >-->
<!--          Copy-->
<!--        </button>-->
<!--      </div>-->

<!--      <form @submit.prevent="registerOrUpdateLexicon">-->
<!--        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">-->
<!--          <div>-->
<!--            <label class="text-gray-700" for="english">English</label>-->
<!--            <textarea-->
<!--              v-model="english"-->
<!--              id="english"-->
<!--              type="text"-->
<!--              class="input-class mt-2 p-2 w-full border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"-->
<!--              placeholder="Enter English term"-->
<!--            />-->
<!--          </div>-->
<!--          <div>-->
<!--            <label class="text-gray-700" for="french">French</label>-->
<!--            <textarea-->
<!--              v-model="french"-->
<!--              id="french"-->
<!--              type="text"-->
<!--              class="input-class mt-2 p-2 w-full border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"-->
<!--              placeholder="Enter French term"-->
<!--            />-->
<!--          </div>-->
<!--          <div class="text-left">-->
<!--            <fieldset id="portable">-->
<!--              <div>-->
<!--                <label class="text-gray-700" for="portable">Exporter pour le Mobile :</label>-->
<!--                &nbsp;&nbsp;-->
<!--                <input-->
<!--                  type="checkbox"-->
<!--                  id="portable"-->
<!--                  v-model="portable"-->
<!--                />-->
<!--              </div>-->
<!--            </fieldset>-->
<!--          </div>-->
<!--        </div>-->
<!--        <div class="mt-4 flex justify-end">-->
<!--          <button-->
<!--            type="submit"-->
<!--            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 submit-button"-->
<!--          >-->
<!--            {{ guid ? 'Update' : 'Register' }}-->
<!--          </button>-->
<!--        </div>-->
<!--      </form>-->
<!--      <p v-if="message" class="text-green-600 text-center mt-4">{{ message }}</p>-->
<!--    </div>-->
<!--  </div>-->
<!--</template>-->

<!--<script setup lang="ts">-->
<!--import axios from 'axios';-->
<!--import { onMounted, ref, watch } from 'vue';-->
<!--import 'datatables.net-dt/css/dataTables.dataTables.min.css';-->
<!--import 'datatables.net';-->

<!--const lexicons = ref([]);-->
<!--const isLoading = ref(true);-->
<!--const errorMessage = ref('');-->
<!--const message = ref('');-->
<!--const guid = ref(null);-->
<!--const portable = ref(false);-->
<!--const french = ref('');-->
<!--const english = ref('');-->
<!--const reference = ref('');-->
<!--const showDeleteModal = ref(false);-->
<!--const guidToDelete = ref(null);-->
<!--const selectAll = ref(false);-->
<!--const selectedLexicons = ref([]);-->

<!--// Fonction pour convertir en CamelCase-->
<!--function toOpenCamelCase(str) {-->
<!--  if (!str) return '';-->
<!--  return str-->
<!--    .toLowerCase()-->
<!--    .split(' ')-->
<!--    .map(word => word.charAt(0).toUpperCase() + word.slice(1))-->
<!--    .join('');-->
<!--}-->

<!--// Watcher pour mettre à jour la référence automatiquement-->
<!--watch(english, (newValue) => {-->
<!--  if (newValue) {-->
<!--    reference.value = toOpenCamelCase(newValue);-->
<!--  } else {-->
<!--    reference.value = '';-->
<!--  }-->
<!--});-->

<!--async function fetchLexicons() {-->
<!--  try {-->
<!--    const response = await axios.get('http://${API_ENDPOINT}/lexicon/list_all');-->
<!--    lexicons.value = response.data.response;-->
<!--    $(document).ready(() => $('#lexicon-table').DataTable());-->
<!--  } catch (error) {-->
<!--    errorMessage.value = "Erreur lors de la récupération des lexiques.";-->
<!--  } finally {-->
<!--    isLoading.value = false;-->
<!--  }-->
<!--}-->

<!--async function registerOrUpdateLexicon() {-->
<!--  const url = `http://192.168.100.103:3000/lexicon/add`;-->

<!--  if (!english.value || !french.value) {-->
<!--    message.value = "English and French fields are required.";-->
<!--    return;-->
<!--  }-->

<!--  try {-->
<!--    const response = await axios.post(url, {-->
<!--      english: english.value,-->
<!--      french: french.value,-->
<!--      portable: portable.value,-->
<!--      guid: guid.value-->
<!--    });-->

<!--    console.log(response.data.response);-->
<!--    reference.value = response.data.response.reference;-->
<!--    message.value = response.data.message || 'Operation successful';-->
<!--    resetForm();-->
<!--    await fetchLexicons();-->
<!--  } catch (error) {-->
<!--    console.error(error.response.data);-->
<!--    message.value = "An error has occurred. Check console for details.";-->
<!--  }-->
<!--}-->

<!--function editLexicon(lexicon) {-->
<!--  guid.value = lexicon.guid;-->
<!--  english.value = lexicon.english;-->
<!--  french.value = lexicon.french;-->
<!--  portable.value = lexicon.portable;-->
<!--  reference.value = lexicon.reference;-->
<!--}-->

<!--function confirmDelete(guid) {-->
<!--  guidToDelete.value = guid;-->
<!--  showDeleteModal.value = true;-->
<!--}-->

<!--async function deleteLexicon() {-->
<!--  try {-->
<!--    await axios.put('http://${API_ENDPOINT}/lexicon/delete', { guid: guidToDelete.value });-->
<!--    message.value = 'Lexicon deleted successfully';-->
<!--    closeModal();-->
<!--    await fetchLexicons();-->
<!--  } catch (error) {-->
<!--    message.value = "Une erreur s'est produite lors de la suppression.";-->
<!--  }-->
<!--}-->

<!--function closeModal() {-->
<!--  showDeleteModal.value = false;-->
<!--  guidToDelete.value = null;-->
<!--}-->

<!--function copyToClipboard(text) {-->
<!--  const tempInput = document.createElement("input");-->
<!--  tempInput.value = text;-->
<!--  document.body.appendChild(tempInput);-->
<!--  tempInput.select();-->
<!--  document.execCommand("copy");-->
<!--  document.body.removeChild(tempInput);-->
<!--  message.value = "Référence copiée dans le presse-papiers!";-->
<!--}-->


<!--function resetForm() {-->
<!--  guid.value = null;-->
<!--  english.value = '';-->
<!--  french.value = '';-->
<!--  portable.value = false;-->
<!--}-->
<!--function toggleSelectAll() {-->
<!--  if (selectAll.value) {-->
<!--    selectedLexicons.value = lexicons.value.map(lexicon => lexicon.guid);-->
<!--  } else {-->
<!--    selectedLexicons.value = [];-->
<!--  }-->
<!--}-->

<!--function handleSelectAction(event) {-->
<!--  const action = event.target.value;-->

<!--  switch (action) {-->
<!--    case 'add':-->
<!--      redirectToAddForm();-->
<!--      break;-->
<!--    case 'edit':-->
<!--      if (selectedLexicons.value.length === 1) {-->
<!--        const lexicon = lexicons.value.find(lex => lex.guid === selectedLexicons.value[0]);-->
<!--        editLexicon(lexicon);-->
<!--      } else {-->
<!--        alert("Sélectionnez une seule entrée pour l'éditer.");-->
<!--      }-->
<!--      break;-->
<!--    case 'delete':-->
<!--      confirmDelete(selectedLexicons.value);-->
<!--      break;-->
<!--    case 'copy':-->
<!--      if (selectedLexicons.value.length === 1) {-->
<!--        const lexicon = lexicons.value.find(lex => lex.guid === selectedLexicons.value[0]);-->
<!--        copyToClipboard(lexicon.reference);-->
<!--      } else {-->
<!--        alert("Sélectionnez une seule entrée pour copier.");-->
<!--      }-->
<!--      break;-->
<!--    default:-->
<!--      break;-->
<!--  }-->
<!--}-->

<!--function redirectToAddForm() {-->
<!--  resetForm();  // Réinitialise les champs du formulaire-->
<!--  window.scrollTo({ top: 0, behavior: 'smooth' }); // Remonte en haut de la page pour voir le formulaire-->
<!--}-->

<!--onMounted(fetchLexicons);-->
<!--</script>-->

<!--<style scoped>-->
<!--.input-class {-->
<!--  border: 1px solid #e5e7eb;-->
<!--  padding: 8px;-->
<!--  border-radius: 4px;-->
<!--  width: 100%;-->
<!--}-->

<!--.submit-button {-->
<!--  background-color: #4f46e5;-->
<!--  color: white;-->
<!--  padding: 10px 15px;-->
<!--  border: none;-->
<!--  border-radius: 4px;-->
<!--  cursor: pointer;-->
<!--}-->

<!--.submit-button:hover {-->
<!--  background-color: #4338ca;-->
<!--}-->

<!--.cancel-button {-->
<!--  background-color: #e5e7eb;-->
<!--  color: black;-->
<!--  padding: 10px 15px;-->
<!--  border: none;-->
<!--  border-radius: 4px;-->
<!--}-->

<!--.confirm-button {-->
<!--  background-color: #dc2626;-->
<!--  color: white;-->
<!--  padding: 10px 15px;-->
<!--  border: none;-->
<!--  border-radius: 4px;-->
<!--}-->

<!--.confirm-button:hover {-->
<!--  background-color: #b91c1c;-->
<!--}-->

<!--.table-class {-->
<!--  width: 100%;-->
<!--}-->
<!--</style>-->


<!--&lt;!&ndash;<template xmlns="http://www.w3.org/1999/html">&ndash;&gt;-->

<!--&lt;!&ndash;  <div class="p-8 bg-gray-100 min-h-screen">&ndash;&gt;-->
<!--&lt;!&ndash;    <h3 class="text-3xl font-semibold text-gray-800 mb-6">Lexicon Management</h3>&ndash;&gt;-->

<!--&lt;!&ndash;    <div class="bg-white p-6 rounded-lg shadow-md">&ndash;&gt;-->
<!--&lt;!&ndash;      <h4 class="text-xl font-semibold text-gray-700 mb-4">Lexicon List</h4>&ndash;&gt;-->

<!--&lt;!&ndash;      <table id="lexicon-table" class="min-w-full bg-white rounded table-class">&ndash;&gt;-->
<!--&lt;!&ndash;        <thead>&ndash;&gt;-->
<!--&lt;!&ndash;        <tr>&ndash;&gt;-->
<!--&lt;!&ndash;          <th>&ndash;&gt;-->
<!--&lt;!&ndash;            <input&ndash;&gt;-->
<!--&lt;!&ndash;              class="py-2 px-4 bg-gray-100 border-b border-gray-300 text-left text-sm text-gray-600"&ndash;&gt;-->
<!--&lt;!&ndash;              type="checkbox"&ndash;&gt;-->
<!--&lt;!&ndash;              v-model="selectAll"&ndash;&gt;-->
<!--&lt;!&ndash;              @change="toggleSelectAll"&ndash;&gt;-->
<!--&lt;!&ndash;            />&ndash;&gt;-->
<!--&lt;!&ndash;          </th>&ndash;&gt;-->
<!--&lt;!&ndash;          <th class="py-2 px-4 bg-gray-100 border-b border-gray-300 text-left text-sm text-gray-600">French</th>&ndash;&gt;-->
<!--&lt;!&ndash;          <th class="py-2 px-4 bg-gray-100 border-b border-gray-300 text-left text-sm text-gray-600">English</th>&ndash;&gt;-->
<!--&lt;!&ndash;          <th class="py-2 px-4 bg-gray-100 border-b border-gray-300 text-left text-sm text-gray-600">Reference</th>&ndash;&gt;-->
<!--&lt;!&ndash;          <th class="py-2 px-4 bg-gray-100 border-b border-gray-300 text-left text-sm text-gray-600">Actions</th>&ndash;&gt;-->
<!--&lt;!&ndash;        </tr>&ndash;&gt;-->
<!--&lt;!&ndash;        </thead>&ndash;&gt;-->
<!--&lt;!&ndash;        <tbody>&ndash;&gt;-->
<!--&lt;!&ndash;        <tr v-for="lexicon in lexicons" :key="lexicon.guid" class="hover:bg-gray-50">&ndash;&gt;-->
<!--&lt;!&ndash;          <td>&ndash;&gt;-->
<!--&lt;!&ndash;            <input&ndash;&gt;-->
<!--&lt;!&ndash;              class="py-2 px-4 border-b border-gray-300"&ndash;&gt;-->
<!--&lt;!&ndash;              type="checkbox"&ndash;&gt;-->
<!--&lt;!&ndash;              v-model="selectedLexicons"&ndash;&gt;-->
<!--&lt;!&ndash;              :value="lexicon"&ndash;&gt;-->
<!--&lt;!&ndash;            /></td>&ndash;&gt;-->
<!--&lt;!&ndash;          <td class="py-2 px-4 border-b border-gray-300">{{ lexicon.french }}</td>&ndash;&gt;-->
<!--&lt;!&ndash;          <td class="py-2 px-4 border-b border-gray-300">{{ lexicon.english }}</td>&ndash;&gt;-->
<!--&lt;!&ndash;          <td class="py-2 px-4 border-b border-gray-300">{{lexicon.reference}}&ndash;&gt;-->
<!--&lt;!&ndash;          </td>&ndash;&gt;-->
<!--&lt;!&ndash;                      <td class="py-2 px-4 border-b border-gray-300 flex space-x-2">&ndash;&gt;-->
<!--&lt;!&ndash;                        <button @click="editLexicon(lexicon)" class="text-blue-600 hover:text-blue-800">Edit</button>&ndash;&gt;-->
<!--&lt;!&ndash;                        <button @click="confirmDelete(lexicon.guid)" class="text-red-600 hover:text-red-800">Delete</button>&ndash;&gt;-->
<!--&lt;!&ndash;                      </td>&ndash;&gt;-->
<!--&lt;!&ndash;                    </tr>&ndash;&gt;-->
<!--&lt;!&ndash;                    </tbody>&ndash;&gt;-->
<!--&lt;!&ndash;                  </table>&ndash;&gt;-->
<!--&lt;!&ndash;      </div>&ndash;&gt;-->

<!--&lt;!&ndash;                <div v-if="showDeleteModal" class="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">&ndash;&gt;-->
<!--&lt;!&ndash;                  <div class="bg-white p-6 rounded-lg shadow-md max-w-sm w-full">&ndash;&gt;-->
<!--&lt;!&ndash;                    <h3 class="text-xl font-semibold text-gray-700 mb-4">Confirm Deletion</h3>&ndash;&gt;-->
<!--&lt;!&ndash;                    <p class="text-gray-600 mb-6">Are you sure you want to delete this lexicon entry?</p>&ndash;&gt;-->
<!--&lt;!&ndash;                    <div class="flex justify-end space-x-4">&ndash;&gt;-->
<!--&lt;!&ndash;                      <button @click="closeModal" class="cancel-button">Cancel</button>&ndash;&gt;-->
<!--&lt;!&ndash;                      <button @click="deleteLexicon" class="confirm-button">Confirm</button>&ndash;&gt;-->
<!--&lt;!&ndash;                    </div>&ndash;&gt;-->
<!--&lt;!&ndash;                  </div>&ndash;&gt;-->
<!--&lt;!&ndash;                </div>&ndash;&gt;-->


<!--&lt;!&ndash;    &lt;!&ndash; Registration Form &ndash;&gt;&ndash;&gt;-->
<!--&lt;!&ndash;    <div class="bg-white p-6 rounded-lg shadow-md mb-8">&ndash;&gt;-->
<!--&lt;!&ndash;      <h2 class="text-xl font-semibold text-gray-700 mb-4">Lexicon Form</h2>&ndash;&gt;-->

<!--&lt;!&ndash;      <div class="bg-white rounded-lg mb-8 flex items-center">&ndash;&gt;-->
<!--&lt;!&ndash;        <div class="flex-grow">&ndash;&gt;-->
<!--&lt;!&ndash;          <label class="text-gray-700" for="reference">Reference</label>&ndash;&gt;-->
<!--&lt;!&ndash;          <input&ndash;&gt;-->
<!--&lt;!&ndash;            v-model="reference"&ndash;&gt;-->
<!--&lt;!&ndash;            id="reference"&ndash;&gt;-->
<!--&lt;!&ndash;            type="text"&ndash;&gt;-->
<!--&lt;!&ndash;            class="input-class p-2 w-full border border-gray-300 rounded bg-white"&ndash;&gt;-->
<!--&lt;!&ndash;            disabled&ndash;&gt;-->
<!--&lt;!&ndash;          />&ndash;&gt;-->
<!--&lt;!&ndash;        </div>&ndash;&gt;-->
<!--&lt;!&ndash;        <button&ndash;&gt;-->
<!--&lt;!&ndash;          @click="copyToClipboard(reference)"&ndash;&gt;-->
<!--&lt;!&ndash;          class="ml-4 px-2 py-1 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"&ndash;&gt;-->
<!--&lt;!&ndash;        >&ndash;&gt;-->
<!--&lt;!&ndash;          Copy&ndash;&gt;-->
<!--&lt;!&ndash;        </button>&ndash;&gt;-->
<!--&lt;!&ndash;      </div>&ndash;&gt;-->

<!--&lt;!&ndash;      <form @submit.prevent="registerOrUpdateLexicon">&ndash;&gt;-->
<!--&lt;!&ndash;        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">&ndash;&gt;-->
<!--&lt;!&ndash;          <div>&ndash;&gt;-->
<!--&lt;!&ndash;            <label class="text-gray-700" for="english">English</label>&ndash;&gt;-->
<!--&lt;!&ndash;            <textarea&ndash;&gt;-->
<!--&lt;!&ndash;              v-model="english"&ndash;&gt;-->
<!--&lt;!&ndash;              id="english"&ndash;&gt;-->
<!--&lt;!&ndash;              type="text"&ndash;&gt;-->
<!--&lt;!&ndash;              class="input-class mt-2 p-2 w-full border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"&ndash;&gt;-->
<!--&lt;!&ndash;              placeholder="Enter English term"&ndash;&gt;-->
<!--&lt;!&ndash;            />&ndash;&gt;-->
<!--&lt;!&ndash;          </div>&ndash;&gt;-->
<!--&lt;!&ndash;          <div>&ndash;&gt;-->
<!--&lt;!&ndash;            <label class="text-gray-700" for="french">French</label>&ndash;&gt;-->
<!--&lt;!&ndash;            <textarea&ndash;&gt;-->
<!--&lt;!&ndash;              v-model="french"&ndash;&gt;-->
<!--&lt;!&ndash;              id="french"&ndash;&gt;-->
<!--&lt;!&ndash;              type="text"&ndash;&gt;-->
<!--&lt;!&ndash;              class="input-class mt-2 p-2 w-full border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"&ndash;&gt;-->
<!--&lt;!&ndash;              placeholder="Enter French term"&ndash;&gt;-->
<!--&lt;!&ndash;            />&ndash;&gt;-->
<!--&lt;!&ndash;          </div>&ndash;&gt;-->
<!--&lt;!&ndash;          <div class="text-left">&ndash;&gt;-->
<!--&lt;!&ndash;            <fieldset id="portable">&ndash;&gt;-->
<!--&lt;!&ndash;              <div>&ndash;&gt;-->
<!--&lt;!&ndash;                <label class="text-gray-700" for="portable">Exporter pour le Mobile :</label>&ndash;&gt;-->
<!--&lt;!&ndash;                &nbsp;&nbsp;&ndash;&gt;-->
<!--&lt;!&ndash;                <input&ndash;&gt;-->
<!--&lt;!&ndash;                  type="checkbox"&ndash;&gt;-->
<!--&lt;!&ndash;                  id="portable"&ndash;&gt;-->
<!--&lt;!&ndash;                  v-model="portable"&ndash;&gt;-->
<!--&lt;!&ndash;                />&ndash;&gt;-->
<!--&lt;!&ndash;              </div>&ndash;&gt;-->
<!--&lt;!&ndash;            </fieldset>&ndash;&gt;-->
<!--&lt;!&ndash;          </div>&ndash;&gt;-->

<!--&lt;!&ndash;        </div>&ndash;&gt;-->
<!--&lt;!&ndash;        <div class="mt-4 flex justify-end">&ndash;&gt;-->
<!--&lt;!&ndash;          <button&ndash;&gt;-->
<!--&lt;!&ndash;            type="submit"&ndash;&gt;-->
<!--&lt;!&ndash;            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 submit-button"&ndash;&gt;-->
<!--&lt;!&ndash;          >&ndash;&gt;-->
<!--&lt;!&ndash;            {{ guid ? 'Update' : 'Register' }}&ndash;&gt;-->
<!--&lt;!&ndash;          </button>&ndash;&gt;-->
<!--&lt;!&ndash;        </div>&ndash;&gt;-->
<!--&lt;!&ndash;      </form>&ndash;&gt;-->
<!--&lt;!&ndash;      <p v-if="message" class="text-green-600 text-center mt-4">{{ message }}</p>&ndash;&gt;-->
<!--&lt;!&ndash;    </div>&ndash;&gt;-->

<!--&lt;!&ndash;  </div>&ndash;&gt;-->
<!--&lt;!&ndash;</template>&ndash;&gt;-->

<!--&lt;!&ndash;            <script setup lang="ts">&ndash;&gt;-->
<!--&lt;!&ndash;            import axios from 'axios';&ndash;&gt;-->
<!--&lt;!&ndash;            import { onMounted, ref, watch } from 'vue';&ndash;&gt;-->
<!--&lt;!&ndash;            import 'datatables.net-dt/css/dataTables.dataTables.min.css';&ndash;&gt;-->
<!--&lt;!&ndash;            import 'datatables.net';&ndash;&gt;-->

<!--&lt;!&ndash;            const lexicons = ref([]);&ndash;&gt;-->
<!--&lt;!&ndash;            const isLoading = ref(true);&ndash;&gt;-->
<!--&lt;!&ndash;            const errorMessage = ref('');&ndash;&gt;-->
<!--&lt;!&ndash;            const message = ref('');&ndash;&gt;-->
<!--&lt;!&ndash;            const guid = ref(null);&ndash;&gt;-->
<!--&lt;!&ndash;            const portable = ref(false);&ndash;&gt;-->
<!--&lt;!&ndash;            const french = ref('');&ndash;&gt;-->
<!--&lt;!&ndash;            const english = ref('');&ndash;&gt;-->
<!--&lt;!&ndash;            const reference = ref('');&ndash;&gt;-->
<!--&lt;!&ndash;            const showDeleteModal = ref(false);&ndash;&gt;-->
<!--&lt;!&ndash;            const guidToDelete = ref(null);&ndash;&gt;-->

<!--&lt;!&ndash;            async function fetchLexicons() {&ndash;&gt;-->
<!--&lt;!&ndash;              try {&ndash;&gt;-->
<!--&lt;!&ndash;                const response = await axios.get('http://192.168.100.103:3000/lexicon/list_all');&ndash;&gt;-->
<!--&lt;!&ndash;                lexicons.value = response.data.response;&ndash;&gt;-->
<!--&lt;!&ndash;                $(document).ready(() => $('#lexicon-table').DataTable());&ndash;&gt;-->
<!--&lt;!&ndash;              } catch (error) {&ndash;&gt;-->
<!--&lt;!&ndash;                errorMessage.value = "Erreur lors de la récupération des lexiques.";&ndash;&gt;-->
<!--&lt;!&ndash;              } finally {&ndash;&gt;-->
<!--&lt;!&ndash;                isLoading.value = false;&ndash;&gt;-->
<!--&lt;!&ndash;              }&ndash;&gt;-->
<!--&lt;!&ndash;            }&ndash;&gt;-->

<!--&lt;!&ndash;            watch(english, (newValue) => {&ndash;&gt;-->
<!--&lt;!&ndash;              if (newValue) {&ndash;&gt;-->
<!--&lt;!&ndash;                reference.value = Lexicon.toOpenCamelCase(newValue);&ndash;&gt;-->
<!--&lt;!&ndash;              } else {&ndash;&gt;-->
<!--&lt;!&ndash;                reference.value = '';&ndash;&gt;-->
<!--&lt;!&ndash;              }&ndash;&gt;-->
<!--&lt;!&ndash;            });&ndash;&gt;-->

<!--&lt;!&ndash;            async function registerOrUpdateLexicon() {&ndash;&gt;-->
<!--&lt;!&ndash;              const url = `http://192.168.100.103:3000/lexicon/add`;&ndash;&gt;-->

<!--&lt;!&ndash;              // Vérifiez si les champs requis ne sont pas vides&ndash;&gt;-->
<!--&lt;!&ndash;              if (!english.value || !french.value) {&ndash;&gt;-->
<!--&lt;!&ndash;                message.value = "English and French fields are required.";&ndash;&gt;-->
<!--&lt;!&ndash;                return; // Arrêtez l'exécution si les champs sont vides&ndash;&gt;-->
<!--&lt;!&ndash;              }&ndash;&gt;-->

<!--&lt;!&ndash;              try {&ndash;&gt;-->
<!--&lt;!&ndash;                const response = await axios.post(url, {&ndash;&gt;-->
<!--&lt;!&ndash;                  english: english.value,&ndash;&gt;-->
<!--&lt;!&ndash;                  french: french.value,&ndash;&gt;-->
<!--&lt;!&ndash;                  portable: portable.value,&ndash;&gt;-->
<!--&lt;!&ndash;                  guid: guid.value&ndash;&gt;-->
<!--&lt;!&ndash;                });&ndash;&gt;-->

<!--&lt;!&ndash;                console.log(response.data.response);&ndash;&gt;-->
<!--&lt;!&ndash;                reference.value = response.data.response.reference;&ndash;&gt;-->
<!--&lt;!&ndash;                message.value = response.data.message || 'Operation successful';&ndash;&gt;-->
<!--&lt;!&ndash;                resetForm();&ndash;&gt;-->
<!--&lt;!&ndash;                await fetchLexicons();&ndash;&gt;-->
<!--&lt;!&ndash;              } catch (error) {&ndash;&gt;-->
<!--&lt;!&ndash;                console.error(error.response.data); // Ajoutez cela pour voir le détail de l'erreur&ndash;&gt;-->
<!--&lt;!&ndash;                message.value = "An error has occurred. Check console for details.";&ndash;&gt;-->
<!--&lt;!&ndash;              }&ndash;&gt;-->
<!--&lt;!&ndash;            }&ndash;&gt;-->


<!--&lt;!&ndash;            function editLexicon(lexicon) {&ndash;&gt;-->
<!--&lt;!&ndash;              guid.value = lexicon.guid;&ndash;&gt;-->
<!--&lt;!&ndash;              english.value = lexicon.english;&ndash;&gt;-->
<!--&lt;!&ndash;              french.value = lexicon.french;&ndash;&gt;-->
<!--&lt;!&ndash;              portable.value = lexicon.portable;&ndash;&gt;-->
<!--&lt;!&ndash;            }&ndash;&gt;-->

<!--&lt;!&ndash;            function confirmDelete(guid) {&ndash;&gt;-->
<!--&lt;!&ndash;              guidToDelete.value = guid;&ndash;&gt;-->
<!--&lt;!&ndash;              showDeleteModal.value = true;&ndash;&gt;-->
<!--&lt;!&ndash;            }&ndash;&gt;-->

<!--&lt;!&ndash;            async function deleteLexicon() {&ndash;&gt;-->
<!--&lt;!&ndash;              try {&ndash;&gt;-->
<!--&lt;!&ndash;                await axios.put('http://192.168.100.103:3000/lexicon/delete', { guid: guidToDelete.value });&ndash;&gt;-->
<!--&lt;!&ndash;                message.value = 'Lexicon deleted successfully';&ndash;&gt;-->
<!--&lt;!&ndash;                closeModal();&ndash;&gt;-->
<!--&lt;!&ndash;                await fetchLexicons();&ndash;&gt;-->
<!--&lt;!&ndash;              } catch (error) {&ndash;&gt;-->
<!--&lt;!&ndash;                message.value = "Une erreur s'est produite lors de la suppression.";&ndash;&gt;-->
<!--&lt;!&ndash;              }&ndash;&gt;-->
<!--&lt;!&ndash;            }&ndash;&gt;-->

<!--&lt;!&ndash;            function closeModal() {&ndash;&gt;-->
<!--&lt;!&ndash;              showDeleteModal.value = false;&ndash;&gt;-->
<!--&lt;!&ndash;              guidToDelete.value = null;&ndash;&gt;-->
<!--&lt;!&ndash;            }&ndash;&gt;-->

<!--&lt;!&ndash;            // function copyToClipboard(text) {&ndash;&gt;-->
<!--&lt;!&ndash;            //   if (!text) {&ndash;&gt;-->
<!--&lt;!&ndash;            //     message.value = "No reference to copy.";&ndash;&gt;-->
<!--&lt;!&ndash;            //     return;&ndash;&gt;-->
<!--&lt;!&ndash;            //   }&ndash;&gt;-->
<!--&lt;!&ndash;            //   navigator.clipboard.writeText(text)&ndash;&gt;-->
<!--&lt;!&ndash;            //     .then(() => {&ndash;&gt;-->
<!--&lt;!&ndash;            //       message.value = 'Reference copied to clipboard!';&ndash;&gt;-->
<!--&lt;!&ndash;            //     })&ndash;&gt;-->
<!--&lt;!&ndash;            //     .catch(err => {&ndash;&gt;-->
<!--&lt;!&ndash;            //       console.error('Failed to copy: ', err);&ndash;&gt;-->
<!--&lt;!&ndash;            //       message.value = "Could not copy reference.";&ndash;&gt;-->
<!--&lt;!&ndash;            //     });&ndash;&gt;-->
<!--&lt;!&ndash;            // }&ndash;&gt;-->

<!--&lt;!&ndash;            function copyToClipboard(text) {&ndash;&gt;-->
<!--&lt;!&ndash;              // Crée un champ de texte temporaire&ndash;&gt;-->
<!--&lt;!&ndash;              const tempInput = document.createElement("input");&ndash;&gt;-->
<!--&lt;!&ndash;              tempInput.value = text;&ndash;&gt;-->
<!--&lt;!&ndash;              document.body.appendChild(tempInput);&ndash;&gt;-->

<!--&lt;!&ndash;              // Sélectionne le texte et copie-le dans le presse-papiers&ndash;&gt;-->
<!--&lt;!&ndash;              tempInput.select();&ndash;&gt;-->
<!--&lt;!&ndash;              document.execCommand("copy");&ndash;&gt;-->

<!--&lt;!&ndash;              // Supprime le champ de texte temporaire&ndash;&gt;-->
<!--&lt;!&ndash;              document.body.removeChild(tempInput);&ndash;&gt;-->

<!--&lt;!&ndash;              message.value = "Reference copied to clipboard!";&ndash;&gt;-->
<!--&lt;!&ndash;            }&ndash;&gt;-->


<!--&lt;!&ndash;            function resetForm() {&ndash;&gt;-->
<!--&lt;!&ndash;              guid.value = null;&ndash;&gt;-->
<!--&lt;!&ndash;              // reference.value = '';&ndash;&gt;-->
<!--&lt;!&ndash;              english.value = '';&ndash;&gt;-->
<!--&lt;!&ndash;              french.value = '';&ndash;&gt;-->
<!--&lt;!&ndash;              portable.value = false;&ndash;&gt;-->
<!--&lt;!&ndash;            }&ndash;&gt;-->


<!--&lt;!&ndash;            onMounted(fetchLexicons);&ndash;&gt;-->
<!--&lt;!&ndash;            </script>&ndash;&gt;-->

<!--&lt;!&ndash;            <style scoped>&ndash;&gt;-->
<!--&lt;!&ndash;            .input-class {&ndash;&gt;-->
<!--&lt;!&ndash;              border: 1px solid #e5e7eb;&ndash;&gt;-->
<!--&lt;!&ndash;              padding: 8px;&ndash;&gt;-->
<!--&lt;!&ndash;              border-radius: 4px;&ndash;&gt;-->
<!--&lt;!&ndash;              width: 100%;&ndash;&gt;-->
<!--&lt;!&ndash;            }&ndash;&gt;-->

<!--&lt;!&ndash;            .submit-button {&ndash;&gt;-->
<!--&lt;!&ndash;              background-color: #4f46e5; /* Tailwind color */&ndash;&gt;-->
<!--&lt;!&ndash;              color: white;&ndash;&gt;-->
<!--&lt;!&ndash;              padding: 10px 15px;&ndash;&gt;-->
<!--&lt;!&ndash;              border: none;&ndash;&gt;-->
<!--&lt;!&ndash;              border-radius: 4px;&ndash;&gt;-->
<!--&lt;!&ndash;              cursor: pointer;&ndash;&gt;-->
<!--&lt;!&ndash;            }&ndash;&gt;-->

<!--&lt;!&ndash;            .submit-button:hover {&ndash;&gt;-->
<!--&lt;!&ndash;              background-color: #4338ca; /* Darker shade */&ndash;&gt;-->
<!--&lt;!&ndash;            }&ndash;&gt;-->

<!--&lt;!&ndash;            .cancel-button {&ndash;&gt;-->
<!--&lt;!&ndash;              background-color: #e5e7eb;&ndash;&gt;-->
<!--&lt;!&ndash;              color: black;&ndash;&gt;-->
<!--&lt;!&ndash;              padding: 10px 15px;&ndash;&gt;-->
<!--&lt;!&ndash;              border: none;&ndash;&gt;-->
<!--&lt;!&ndash;              border-radius: 4px;&ndash;&gt;-->
<!--&lt;!&ndash;            }&ndash;&gt;-->

<!--&lt;!&ndash;            .confirm-button {&ndash;&gt;-->
<!--&lt;!&ndash;              background-color: #dc2626;&ndash;&gt;-->
<!--&lt;!&ndash;              color: white;&ndash;&gt;-->
<!--&lt;!&ndash;              padding: 10px 15px;&ndash;&gt;-->
<!--&lt;!&ndash;              border: none;&ndash;&gt;-->
<!--&lt;!&ndash;              border-radius: 4px;&ndash;&gt;-->
<!--&lt;!&ndash;            }&ndash;&gt;-->

<!--&lt;!&ndash;            .confirm-button:hover {&ndash;&gt;-->
<!--&lt;!&ndash;              background-color: #b91c1c; /* Darker shade */&ndash;&gt;-->
<!--&lt;!&ndash;            }&ndash;&gt;-->

<!--&lt;!&ndash;            .table-class {&ndash;&gt;-->
<!--&lt;!&ndash;              width: 100%;&ndash;&gt;-->
<!--&lt;!&ndash;            }&ndash;&gt;-->
<!--&lt;!&ndash;            </style>&ndash;&gt;-->




