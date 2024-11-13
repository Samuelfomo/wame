<template>
  <!-- Alertes -->
  <div class="fixed top-4 right-4 z-50 name">
    <TransitionGroup v-if="alerts && alerts.length > 0" tag="div" name="alert">
      <div
        v-for="alert in alerts"
        :key="alert.id"
        :class="alert.type === 'success' ? 'bg-green-500 text-white px-9 py-5 rounded shadow-lg mb-2' : 'bg-red-500 text-white px-9 py-5 rounded shadow-lg mb-2'"
      >
        <strong>{{ alert.title }}:</strong> {{ alert.message }}
        <button @click="removeAlert(alert.id)" class="ml-2 text-xs text-gray-200">X</button>
      </div>
    </TransitionGroup>
  </div>
  <div class="p-10 bg-gray-100 min-h-screen">
    <h3 class="text-3xl font-semibold text-gray-800 mb-6">Gestion du Lexique</h3>

    <div class="bg-white p-12 rounded-lg shadow-md min-h-screen">
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
          <th class="py-2 px-4 bg-gray-100 border-b border-gray-300 text-left text-sm text-gray-600">Anglais</th>
          <th class="py-2 px-4 bg-gray-100 border-b border-gray-300 text-left text-sm text-gray-600">Français</th>
          <th class="py-2 px-4 bg-gray-100 border-b border-gray-300 text-left text-sm text-gray-600">Actions</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="lexicon in lexicons" :key="lexicon.guid" class="hover:bg-gray-50">
          <td class="py-2 px-4 border-b border-gray-300" @click="editLexicon(lexicon)">
            <span v-if="lexicon.portable" class="inline-block w-2.5 h-2.5 rounded-full bg-blue-600 mr-2 absolute"></span>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            {{ lexicon.reference }}
          </td>
          <td class="py-2 px-4 border-b border-gray-300" @click="editLexicon(lexicon)">{{ lexicon.english }}</td>
          <td class="py-2 px-4 border-b border-gray-300" @click="editLexicon(lexicon)">{{ lexicon.french }}</td>
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
          <button @click="guid ? closeFormModal() : closeFormModalsave()" class="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400">
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
import { ref, onMounted, watch, nextTick } from 'vue';
import 'datatables.net-dt/css/dataTables.dataTables.min.css';
import 'datatables.net';
import {toOpenCamelCase} from "@/data/utils/helper/camelcase";

import {delLexicon, fetchLexiconsFromApi, saveLexicon, updateLexicon} from "@/data/lexicon/service/lexiconService";
import {Lexicon} from '@/data/lexicon/model/Lexicon'
import type { Response,Alert } from "@/data/lexicon/service/model/lexiconApiModel";
import {copyReference} from "@/data/utils/helper/copy";

const lexicons = ref<Lexicon[]>([]);
const isLoading = ref(true);
const message = ref('');
const guid = ref<number | null>(null);
const portable = ref(false);
const french = ref('');
const english = ref('');
const reference = ref('');
const showDeleteModal = ref(false);
const guidToDelete = ref<(string | number)[]>([]);
const selectedLexicons = ref([]);
const showFormModal = ref(false);
const activeMenu = ref<string | null>(null);
const alerts = ref<Alert[]>([]);

const showMessage = (msg: string, status: 'success' | 'error' = 'success') => {
  if (alerts.value.some(alert => alert.message === msg)) return; // Évite les doublons

  const id = Date.now();
  alerts.value.push({
    id,
    title: status === 'success' ? 'Succès' : 'Erreur',
    message: msg,
    type:status
  });

  setTimeout(() => {
    removeAlert(id);
  }, 3000);
};

const removeAlert = (id: string | number) => {
  alerts.value = alerts.value.filter(alert => alert.id !== id);
};

const closeModal = () => {
  showDeleteModal.value = false;
  guidToDelete.value = [];
};

/**
 * list lexicon datas
 */
async function fetchLexicons() {
  try {
    const response = await fetchLexiconsFromApi();
    lexicons.value = response || [];
    if ($.fn.DataTable.isDataTable('#lexicon-table')) {
      $('#lexicon-table').DataTable().destroy();
    }
    await nextTick();

    $("#lexicon-table").DataTable({
      "ordering": false, // Assurez-vous que le tri est activé
      "pageLength": 10, // Nombre d'entrées par page par défaut
      "lengthMenu": [10, 25, 50, 100, 200], // Options de sélection du nombre d'entrées par page
    });
  } catch (error) {
    showMessage("Error when retrieving lexicons.", 'error');
  } finally {
    isLoading.value = false;
  }
}

/**
 * save or update lexicon
 */
// async function registerOrUpdateLexicon() {
//   if (!english.value || !french.value) {
//     showMessage("English and French fields are required.", 'error');
//     return;
//   }
//
//   const limitedEnglish = english.value.length > 120 ? english.value.slice(0, 120) : english.value;
//   if (referenceExists(reference.value)) {
//     showMessage("La référence existe déjà.", 'error');
//     // Filtrer le tableau pour afficher uniquement les résultats correspondants
//     $("#s-table").DataTable().search(reference.value).draw(); // Filtre le tableau
//     return;
//   }
//   const postData: Response = {
//     english: limitedEnglish,
//     french: french.value,
//     portable: portable.value,
//     guid: guid.value
//   };
//
//   try {
//     const savedLexicon = await saveLexicon(postData);
//     if (savedLexicon) {
//       closeFormModal();
//       location.reload();
//       showMessage('Operation Successful');
//       // await fetchLexicons();
//     } else {
//       showMessage("Operation Failed.", 'error');
//     }  } catch (error) {
//     showMessage("Error during lexicon registration.", 'error');
//   }
// }

async function registerOrUpdateLexicon() {
  if (!english.value || !french.value) {
    showMessage("English and French fields are required.", 'error');
    return;
  }

  const limitedEnglish = english.value.length > 120 ? english.value.slice(0, 120) : english.value;

  const postData: Response = {
    english: limitedEnglish,
    french: french.value,
    portable: portable.value,
    guid: guid.value || undefined
  };

  try {
    let savedLexicon;
    if (guid.value) {
      // Mise à jour
      savedLexicon = await updateLexicon(postData);
      closeFormModal();
      await fetchLexicons();

    } else {
      if (referenceExists(reference.value)) {
        showMessage("The reference already exists.", 'error');
        $("#lexicon-table").DataTable().search(reference.value).draw();
        closeFormModal();
        return;
      }
      // Nouveau
      savedLexicon = await saveLexicon(postData);
      guid.value = null;
      english.value = '';
      french.value = '';
      reference.value = '';
      portable.value = false;
    }
    if (savedLexicon instanceof Lexicon) {
      showMessage('Operation Successful');
    } else {
      showMessage("Operation Failed.", 'error');
    }
  } catch (error) {
    showMessage("Error during lexicon registration.", 'error');
  }
}


/**
 * initialise
 * @param lexicon
 */
function editLexicon(lexicon: { id: number; guid: string; reference: string; english: string; french: string; portable: boolean }) {
  guid.value = Number(lexicon.guid) || null;
  english.value = lexicon.english || '';
  french.value = lexicon.french || '';
  reference.value = lexicon.reference || '';
  portable.value = lexicon.portable || false;
  showFormModal.value = true;
}
/**
 * prepare delete eltms en stock guids
 * @param guidArray
 */
function confirmDelete(guidArray: (string | number)[]) {
  guidToDelete.value = guidArray;
  showDeleteModal.value = true;
}

/**
 * delete lexicon
 */
async function deleteLexicon() {
  try {
    await delLexicon(guidToDelete.value);
    showMessage('Lexicon deleted successfully!');
    await fetchLexicons();
    showDeleteModal.value = false;
  } catch (error) {
    console.error("Error when deleting the lexicon:", error);
    showMessage("Error when deleting the lexicon.", 'error');
  }
}

/**
 * open modal lexicon
 */
function openAddModal() {
  guid.value = null;
  english.value = '';
  french.value = '';
  reference.value = '';
  portable.value = false;
  showFormModal.value = true;
}

/**
 * copy reference
 * @param text
 */
async function copyToClipboard(text: string) {
  await copyReference(text);
  showMessage("Référence copiée dans le presse-papiers !");
  activeMenu.value = null;

  setTimeout(() => {
    message.value = '';
  }, 3000);
}

function referenceExists(reference: string): boolean {
  return lexicons.value.some(lexicon => lexicon.reference === reference);
}

function toggleMenu(lexiconGuid: string | null) {
  activeMenu.value = activeMenu.value === lexiconGuid ? null : lexiconGuid;
}

/**
 * Écouteur d'événements pour fermer le menu au clic extérieur
 */
document.addEventListener('click', (event) => {
  const target = event.target as HTMLElement;
  if (target && !target.closest('.relative')) {
    activeMenu.value = null;
  }
});

/**
 * Surveiller les modifications de 'english' pour mettre à jour la référence
 */
watch(english, async (newValue) => {
  if (newValue) {
    // Limiter à 120 caractères
    const limitedValue = newValue.length > 120 ? newValue.slice(0, 120) : newValue;
    reference.value = await toOpenCamelCase(limitedValue);
  } else {
    reference.value = '';
  }
});

const closeFormModal = () => {
  showFormModal.value = false;
  nextTick(() => {
    english.value = '';
    french.value = '';
    reference.value = '';
    portable.value = false;
    guid.value = null;
  });
};
const closeFormModalsave = () => {
  showFormModal.value = false;
  location.reload();
};


onMounted(fetchLexicons);
</script>

<style scoped>
.name{
  z-index: 9999;
}
.fixed {
  transition: opacity 0.5s ease;
}
th {
  background-color: #3b82f6;
  color: white;
  padding: 12px;
  text-align: left;
}

</style>
