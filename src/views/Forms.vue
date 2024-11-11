<template>
  <div class="fixed top-4 right-4 z-50">
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

    <div v-if="isLoading" class="text-center">
      <p>Chargement des lexiques...</p>
    </div>

    <div v-if="error" class="text-red-500">
      <p>Erreur : {{ error }}</p>
    </div>

    <div v-if="!isLoading && !error">
      <div class="bg-white p-12 rounded-lg shadow-md min-h-screen">
        <div class="flex justify-between items-center mb-6">
          <h4 class="text-xl font-semibold text-gray-700">Liste des Lexiques</h4>
          <div class="flex space-x-4">
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

        <table id="lexicon-table" class="min-w-full bg-white rounded">
          <thead>
          <tr>
            <th class="py-2 px-4 bg-gray-100 border-b border-gray-300 text-left text-sm text-gray-600">Référence</th>
            <th class="py-2 px-4 bg-gray-100 border-b border-gray-300 text-left text-sm text-gray-600">Anglais</th>
            <th class="py-2 px-4 bg-gray-100 border-b border-gray-300 text-left text-sm text-gray-600">Français</th>
            <th class="py-2 px-4 bg-gray-100 border-b border-gray-300 text-left text-sm text-gray-600">Actions</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="lexicon in lexicons" :key="lexicon.guid" class="hover:bg-gray-50">
            <td @click="editLexicon(lexicon)">{{ lexicon.reference }}</td>
            <td @click="editLexicon(lexicon)">{{ lexicon.english }}</td>
            <td @click="editLexicon(lexicon)">{{ lexicon.french }}</td>
            <td>
              <button @click.stop="toggleMenu(lexicon.guid)">Options</button>
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
            <button @click="closeFormModal" class="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400">Annuler</button>
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
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, nextTick } from 'vue';
import { fetchLexiconsFromApi, delLexicon, saveLexicon, updateLexicon } from "@/data/lexicon/service/lexiconService";
import type { Lexicon } from '@/data/lexicon/model/Lexicon';
import type { Alert } from "@/data/lexicon/service/model/lexiconApiModel";
import { copyReference } from "@/data/utils/helper/copy";
import { toOpenCamelCase } from "@/data/utils/helper/camelcase";

const lexicons = ref<Lexicon[]>([]);
const isLoading = ref(true);
const error = ref<string | null>(null);
const showFormModal = ref(false);
const showDeleteModal = ref(false);
const selectedLexicons = ref([]);
const alerts = ref<Alert[]>([]);
const guid = ref<number | null>(null);
const portable = ref(false);
const french = ref('');
const english = ref('');
const reference = ref('');
const guidToDelete = ref<(string | number)[]>([]);

const showMessage = (msg: string, status: 'success' | 'error' = 'success') => {
  if (alerts.value.some(alert => alert.message === msg)) return; // Évite les doublons

  const id = Date.now();
  alerts.value.push({
    id,
    title: status === 'success' ? 'Succès' : 'Erreur',
    message: msg,
    type: status
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

async function fetchLexicons() {
  try {
    const response = await fetchLexiconsFromApi();
    lexicons.value = response || [];
  } catch (err) {
    error.value = 'Erreur lors de la récupération des lexiques.';
  } finally {
    isLoading.value = false;
  }
}

async function setup() {
  await fetchLexicons();
}

onMounted(setup);

async function registerOrUpdateLexicon() {
  if (!english.value || !french.value) {
    showMessage("Les champs Anglais et Français sont requis.", 'error');
    return;
  }

  const limitedEnglish = english.value.length > 120 ? english.value.slice(0, 120) : english.value;
  if (referenceExists(reference.value)) {
    showMessage("La référence existe déjà.", 'error');
    return;
  }

  const postData = {
    english: limitedEnglish,
    french: french.value,
    portable: portable.value,
    guid: guid.value || undefined
  };

  try {
    let savedLexicon;
    if (guid.value) {
      savedLexicon = await updateLexicon(postData);
    } else {
      savedLexicon = await saveLexicon(postData);
    }

    if (savedLexicon) {
      showMessage('Opération réussie');
      closeFormModal();
      await fetchLexicons();
    } else {
      showMessage("Échec de l'opération.", 'error');
    }
  } catch (error) {
    showMessage("Erreur lors de l'enregistrement du lexique.", 'error');
  }
}

function editLexicon(lexicon: Lexicon) {
  guid.value = Number(lexicon.guid) || null;
  english.value = lexicon.english || '';
  french.value = lexicon.french || '';
  reference.value = lexicon.reference || '';
  portable.value = lexicon.portable || false;
  showFormModal.value = true;
}

function confirmDelete(guidArray: (string | number)[]) {
  guidToDelete.value = guidArray;
  showDeleteModal.value = true;
}

async function deleteLexicon() {
  try {
    await delLexicon(guidToDelete.value);
    showMessage('Lexique supprimé avec succès !');
    await fetchLexicons();
    showDeleteModal.value = false;
  } catch (error) {
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

async function copyToClipboard(text: string) {
  await copyReference(text);
  showMessage("Référence copiée dans le presse-papiers !");
}

function referenceExists(reference: string): boolean {
  return lexicons.value.some(lexicon => lexicon.reference === reference);
}

function toggleMenu(lexiconGuid: string | null) {
  activeMenu.value = activeMenu.value === lexiconGuid ? null : lexiconGuid;
}

watch(english, async (newValue) => {
  if (newValue) {
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
</script>

<style scoped>
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



<!--<script setup lang="ts">-->
<!--import { ref } from 'vue'-->

<!--interface User {-->
<!--  username: string-->
<!--  email: string-->
<!--  password: string-->
<!--  confirm: string-->
<!--}-->

<!--const user = ref<User>({-->
<!--  username: '',-->
<!--  email: '',-->
<!--  password: '',-->
<!--  confirm: '',-->
<!--})-->

<!--function register() {-->
<!--  const data = JSON.parse(JSON.stringify(user.value))-->
<!--  // eslint-disable-next-line no-console-->
<!--  console.log('Registered: ', data)-->
<!--}-->
<!--</script>-->

<!--<template>-->
<!--  <div>-->
<!--    <h3 class="text-3xl font-semibold text-gray-700">-->
<!--      Forms-->
<!--    </h3>-->

<!--    <div class="mt-4">-->
<!--      <h4 class="text-gray-600">-->
<!--        Model Form-->
<!--      </h4>-->

<!--      <div class="mt-4">-->
<!--        <div-->
<!--          class="w-full max-w-sm overflow-hidden bg-white border rounded-md shadow-md"-->
<!--        >-->
<!--          <form>-->
<!--            <div-->
<!--              class="flex items-center justify-between px-5 py-3 text-gray-700 border-b"-->
<!--            >-->
<!--              <h3 class="text-sm">-->
<!--                Add Category-->
<!--              </h3>-->
<!--              <button>-->
<!--                <svg-->
<!--                  class="w-4 h-4"-->
<!--                  fill="none"-->
<!--                  viewBox="0 0 24 24"-->
<!--                  stroke="currentColor"-->
<!--                >-->
<!--                  <path-->
<!--                    stroke-linecap="round"-->
<!--                    stroke-linejoin="round"-->
<!--                    stroke-width="2"-->
<!--                    d="M6 18L18 6M6 6l12 12"-->
<!--                  />-->
<!--                </svg>-->
<!--              </button>-->
<!--            </div>-->

<!--            <div class="px-5 py-6 text-gray-700 bg-gray-200 border-b">-->
<!--              <label class="text-xs">Name</label>-->

<!--              <div class="relative mt-2 rounded-md shadow-sm">-->
<!--                <span-->
<!--                  class="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-600"-->
<!--                >-->
<!--                  <svg-->
<!--                    class="w-6 h-6"-->
<!--                    fill="none"-->
<!--                    viewBox="0 0 24 24"-->
<!--                    stroke="currentColor"-->
<!--                  >-->
<!--                    <path-->
<!--                      stroke-linecap="round"-->
<!--                      stroke-linejoin="round"-->
<!--                      stroke-width="2"-->
<!--                      d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z"-->
<!--                    />-->
<!--                  </svg>-->
<!--                </span>-->

<!--                <input-->
<!--                  type="text"-->
<!--                  class="w-full px-12 py-2 border-transparent rounded-md appearance-none focus:border-indigo-600 focus:ring focus:ring-opacity-40 focus:ring-indigo-500"-->
<!--                >-->
<!--              </div>-->
<!--            </div>-->

<!--            <div class="flex items-center justify-between px-5 py-3">-->
<!--              <button-->
<!--                class="px-3 py-1 text-sm text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none"-->
<!--              >-->
<!--                Cancel-->
<!--              </button>-->
<!--              <button-->
<!--                class="px-3 py-1 text-sm text-white bg-indigo-600 rounded-md hover:bg-indigo-500 focus:outline-none"-->
<!--              >-->
<!--                Save-->
<!--              </button>-->
<!--            </div>-->
<!--          </form>-->
<!--        </div>-->
<!--      </div>-->
<!--    </div>-->

<!--    <div class="mt-8">-->
<!--      <h4 class="text-gray-600">-->
<!--        Forms-->
<!--      </h4>-->

<!--      <div class="mt-4">-->
<!--        <div class="p-6 bg-white rounded-md shadow-md">-->
<!--          <h2 class="text-lg font-semibold text-gray-700 capitalize">-->
<!--            Account settings-->
<!--          </h2>-->

<!--          <form @submit.prevent="register">-->
<!--            <div class="grid grid-cols-1 gap-6 mt-4 sm:grid-cols-2">-->
<!--              <div>-->
<!--                <label class="text-gray-700" for="username">Username</label>-->
<!--                <input-->
<!--                  v-model="user.username"-->
<!--                  class="w-full mt-2 border-gray-200 rounded-md focus:border-indigo-600 focus:ring focus:ring-opacity-40 focus:ring-indigo-500"-->
<!--                  type="text"-->
<!--                >-->
<!--              </div>-->

<!--              <div>-->
<!--                <label class="text-gray-700" for="emailAddress">Email Address</label>-->
<!--                <input-->
<!--                  v-model="user.email"-->
<!--                  class="w-full mt-2 border-gray-200 rounded-md focus:border-indigo-600 focus:ring focus:ring-opacity-40 focus:ring-indigo-500"-->
<!--                  type="email"-->
<!--                >-->
<!--              </div>-->

<!--              <div>-->
<!--                <label class="text-gray-700" for="password">Password</label>-->
<!--                <input-->
<!--                  v-model="user.password"-->
<!--                  class="w-full mt-2 border-gray-200 rounded-md focus:border-indigo-600 focus:ring focus:ring-opacity-40 focus:ring-indigo-500"-->
<!--                  type="password"-->
<!--                >-->
<!--              </div>-->

<!--              <div>-->
<!--                <label class="text-gray-700" for="passwordConfirmation">Password Confirmation</label>-->
<!--                <input-->
<!--                  v-model="user.confirm"-->
<!--                  clas  s="w-full mt-2 border-gray-200 rounded-md focus:border-indigo-600 focus:ring focus:ring-opacity-40 focus:ring-indigo-500"-->
<!--                  type="password"-->
<!--                >-->
<!--              </div>-->
<!--            </div>-->

<!--            <div class="flex justify-end mt-4">-->
<!--              <button-->
<!--                class="px-4 py-2 text-gray-200 bg-gray-800 rounded-md hover:bg-gray-700 focus:outline-none focus:bg-gray-700"-->
<!--              >-->
<!--                Save-->
<!--              </button>-->
<!--            </div>-->
<!--          </form>-->
<!--        </div>-->
<!--      </div>-->
<!--    </div>-->
<!--  </div>-->
<!--</template>-->
