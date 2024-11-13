

<template>
  <div class="bg-gray-100 min-h-screen py-8 px-4 sm:px-6 lg:px-8">
    <div class="max-w-4xl mx-auto">
      <!-- Header -->
      <h1 class="text-3xl font-bold text-gray-800 mb-6 text-center">Gestion des Contacts</h1>

      <!-- Search Bar -->
      <div class="mb-6">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Rechercher un contact..."
          class="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
        />
      </div>

      <!-- Contact List with Pagination -->
      <div class="bg-white shadow rounded-lg mb-6">
        <ul>
          <li
            v-for="contact in paginatedContacts"
            :key="contact.id"
            class="px-4 py-4 border-b border-gray-200 flex justify-between items-center"
          >
            <div>
              <p class="text-lg font-semibold text-gray-800">{{ contact.firstname }} {{ contact.lastname }}</p>
              <p class="text-sm text-gray-600">{{ contact.email }}</p>
              <p class="text-sm text-gray-600">Tel: {{ contact.mobile }}</p>
            </div>
            <div class="flex space-x-4">
              <button
                @click="editContact(contact)"
                class="text-blue-500 hover:text-blue-700 font-semibold"
              >
                Modifier
              </button>
              <button
                @click="deleteContact(contact.id)"
                class="text-red-500 hover:text-red-700 font-semibold"
              >
                Supprimer
              </button>
            </div>
          </li>
        </ul>
        <p v-if="!filteredContacts.length" class="text-center py-4 text-gray-500">Aucun contact trouvé.</p>
      </div>

      <!-- Pagination Controls -->
      <div class="flex justify-between items-center mb-6">
        <button
          @click="prevPage"
          :disabled="currentPage === 1"
          class="px-4 py-2 bg-gray-300 text-gray-700 font-semibold rounded-lg shadow-md hover:bg-gray-400 disabled:opacity-50"
        >
          Précédent
        </button>
        <span>Page {{ currentPage }} sur {{ totalPages }}</span>
        <button
          @click="nextPage"
          :disabled="currentPage === totalPages"
          class="px-4 py-2 bg-gray-300 text-gray-700 font-semibold rounded-lg shadow-md hover:bg-gray-400 disabled:opacity-50"
        >
          Suivant
        </button>
      </div>

      <!-- Add Contact Button -->
      <div class="text-center mb-6">
        <button
          @click="showModal = true"
          class="px-4 py-2 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600"
        >
          Ajouter un Contact
        </button>
      </div>

      <!-- Contact Form Modal -->
      <div v-if="showModal" class="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center">
        <div class="bg-white p-6 rounded-lg shadow-lg w-96">
          <h2 class="text-2xl font-semibold mb-4">{{ editing ? "Modifier le Contact" : "Ajouter un Contact" }}</h2>
          <form @submit.prevent="saveContact">
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700">Prénom</label>
              <input
                v-model="contactForm.firstname"
                type="text"
                required
                class="mt-1 w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
              />
            </div>
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700">Nom</label>
              <input
                v-model="contactForm.lastname"
                type="text"
                required
                class="mt-1 w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
              />
            </div>
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700">Email</label>
              <input
                v-model="contactForm.email"
                type="email"
                required
                class="mt-1 w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
              />
            </div>
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700">Mobile</label>
              <input
                v-model="contactForm.mobile"
                type="tel"
                required
                class="mt-1 w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
              />
            </div>
            <div class="flex justify-end">
              <button
                type="submit"
                class="px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600"
              >
                {{ editing ? "Mettre à Jour" : "Ajouter" }}
              </button>
              <button
                @click="cancelEdit"
                type="button"
                class="ml-3 px-4 py-2 bg-gray-300 text-gray-700 font-semibold rounded-lg shadow-md hover:bg-gray-400"
              >
                Annuler
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      contacts: [
        // Exemples de données de contact
        { id: 1, firstname: "Jean", lastname: "Dupont", email: "jean.dupont@example.com", mobile: "123456789" },
        { id: 2, firstname: "Marie", lastname: "Durand", email: "marie.durand@example.com", mobile: "987654321" },
        // Ajouter plus de contacts pour tester la pagination
      ],
      contactForm: {
        id: null,
        firstname: "",
        lastname: "",
        email: "",
        mobile: ""
      },
      searchQuery: "",
      editing: false,
      showModal: false,
      currentPage: 1,
      pageSize: 10,
    };
  },
  computed: {
    filteredContacts() {
      return this.contacts.filter(contact => {
        return (
          contact.firstname.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          contact.lastname.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          contact.email.toLowerCase().includes(this.searchQuery.toLowerCase())
        );
      });
    },
    paginatedContacts() {
      const start = (this.currentPage - 1) * this.pageSize;
      const end = this.currentPage * this.pageSize;
      return this.filteredContacts.slice(start, end);
    },
    totalPages() {
      return Math.ceil(this.filteredContacts.length / this.pageSize);
    }
  },
  methods: {
    saveContact() {
      if (this.editing) {
        const index = this.contacts.findIndex(c => c.id === this.contactForm.id);
        if (index !== -1) this.contacts.splice(index, 1, { ...this.contactForm });
      } else {
        this.contacts.push({ ...this.contactForm, id: Date.now() });
      }
      this.resetForm();
      this.showModal = false;
    },
    editContact(contact) {
      this.contactForm = { ...contact };
      this.editing = true;
      this.showModal = true;
    },
    deleteContact(id) {
      this.contacts = this.contacts.filter(contact => contact.id !== id);
    },
    resetForm() {
      this.contactForm = { id: null, firstname: "", lastname: "", email: "", mobile: "" };
      this.editing = false;
    },
    cancelEdit() {
      this.resetForm();
      this.showModal = false;
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
      }
    }
  }
};
</script>

<style scoped>
body {
  font-family: 'Inter', sans-serif;
}
</style>
<!--<template>-->
<!--  &lt;!&ndash; Alertes &ndash;&gt;-->

<!--  <div class="fixed top-4 right-4 z-50">-->
<!--    <TransitionGroup v-if="alerts && alerts.length > 0" tag="div" name="alert">-->
<!--      <div-->
<!--        v-for="alert in alerts"-->
<!--        :key="alert.id"-->
<!--        :class="alert.type === 'success' ? 'bg-green-500 text-white px-9 py-5 rounded shadow-lg mb-2' : 'bg-red-500 text-white px-9 py-5 rounded shadow-lg mb-2'"-->
<!--      >-->
<!--        <strong>{{ alert.title }}:</strong> {{ alert.message }}-->
<!--        <button @click="removeAlert(alert.id)" class="ml-2 text-xs text-gray-200">X</button>-->
<!--      </div>-->
<!--    </TransitionGroup>-->
<!--  </div>-->
<!--  <div class="p-10 bg-gray-100 min-h-screen">-->
<!--    <h3 class="text-3xl font-semibold text-gray-800 mb-6">Gestion du Lexique</h3>-->

<!--    <div class="bg-white p-12 rounded-lg shadow-md min-h-screen">-->
<!--      <div class="flex justify-between items-center mb-6">-->
<!--        <h4 class="text-xl font-semibold text-gray-700">Liste des Lexiques</h4>-->
<!--        <div class="flex space-x-4">-->
<!--          &lt;!&ndash;          <span class="text-blue-500 text-xl font-black">AJOUTER</span>&ndash;&gt;-->
<!--          <button-->
<!--            @click="openAddModal"-->
<!--            class="p-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center"-->
<!--            title="Ajouter un Nouveau Lexique"-->
<!--          >-->
<!--            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">-->
<!--              <line x1="12" y1="5" x2="12" y2="19"></line>-->
<!--              <line x1="5" y1="12" x2="19" y2="12"></line>-->
<!--            </svg>-->
<!--          </button>-->
<!--          <button-->
<!--            v-if="selectedLexicons.length > 0"-->
<!--            @click="confirmDelete(selectedLexicons)"-->
<!--            class="p-2 bg-red-600 text-white rounded hover:bg-red-700 flex items-center"-->
<!--            title="Supprimer Sélectionnée"-->
<!--          >-->
<!--            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">-->
<!--              <polyline points="3 6 5 6 21 6"></polyline>-->
<!--              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>-->
<!--            </svg>-->
<!--            <span class="ml-1 text-sm">{{ selectedLexicons.length }}</span>-->
<!--          </button>-->
<!--        </div>-->
<!--      </div>-->

<!--      <table id="lexicon-table" class="min-w-full bg-white rounded table-class">-->
<!--        <thead>-->
<!--        <tr>-->
<!--          &lt;!&ndash;          <th></th>&ndash;&gt;-->
<!--          <th class="py-2 px-4 bg-gray-100 border-b border-gray-300 text-left text-sm text-gray-600">Référence</th>-->
<!--          <th class="py-2 px-4 bg-gray-100 border-b border-gray-300 text-left text-sm text-gray-600">Anglais</th>-->
<!--          <th class="py-2 px-4 bg-gray-100 border-b border-gray-300 text-left text-sm text-gray-600">Français</th>-->
<!--          <th class="py-2 px-4 bg-gray-100 border-b border-gray-300 text-left text-sm text-gray-600">Actions</th>-->
<!--        </tr>-->
<!--        </thead>-->
<!--        <tbody>-->
<!--        <tr v-for="lexicon in lexicons" :key="lexicon.guid" class="hover:bg-gray-50">-->
<!--          &lt;!&ndash;          <td>&ndash;&gt;-->
<!--          &lt;!&ndash;            <input&ndash;&gt;-->
<!--          &lt;!&ndash;              class="py-2 px-4 border-b border-gray-300"&ndash;&gt;-->
<!--          &lt;!&ndash;              type="checkbox"&ndash;&gt;-->
<!--          &lt;!&ndash;              v-model="selectedLexicons"&ndash;&gt;-->
<!--          &lt;!&ndash;              :value="lexicon.guid"&ndash;&gt;-->
<!--          &lt;!&ndash;            />&ndash;&gt;-->
<!--          &lt;!&ndash;          </td>&ndash;&gt;-->
<!--          <td class="py-2 px-4 border-b border-gray-300" @click="editLexicon(lexicon)">-->
<!--            <span v-if="lexicon.portable" class="inline-block w-2.5 h-2.5 rounded-full bg-blue-600 mr-2 absolute"></span>-->
<!--            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-->
<!--            {{ lexicon.reference }}-->
<!--          </td>-->
<!--          <td class="py-2 px-4 border-b border-gray-300" @click="editLexicon(lexicon)">{{ lexicon.english }}</td>-->
<!--          <td class="py-2 px-4 border-b border-gray-300" @click="editLexicon(lexicon)">{{ lexicon.french }}</td>-->
<!--          <td class="py-2 px-4 border-b border-gray-300">-->
<!--            <div class="relative">-->
<!--              <button @click.stop="toggleMenu(lexicon.guid)" class="p-1 hover:bg-gray-100 rounded float-right">-->
<!--                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">-->
<!--                  <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />-->
<!--                </svg>-->
<!--              </button>-->
<!--              <div v-if="activeMenu === lexicon.guid" class="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">-->
<!--                <div class="py-1">-->
<!--                  <button @click="editLexicon(lexicon)" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">-->
<!--                    Modifier-->
<!--                  </button>-->
<!--                  <button @click="copyToClipboard(lexicon.reference)" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">-->
<!--                    Copier-->
<!--                  </button>-->
<!--                  <button @click="confirmDelete([lexicon.guid])" class="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full text-left">-->
<!--                    Supprimer-->
<!--                  </button>-->
<!--                </div>-->
<!--              </div>-->
<!--            </div>-->
<!--          </td>-->
<!--        </tr>-->
<!--        </tbody>-->
<!--      </table>-->
<!--    </div>-->

<!--    &lt;!&ndash; Modal pour Ajouter/Modifier &ndash;&gt;-->
<!--    <div v-if="showFormModal" class="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">-->
<!--      <div class="bg-white p-6 rounded-lg shadow-md max-w-2xl w-full">-->
<!--        <h3 class="text-xl font-semibold text-gray-700 mb-4">-->
<!--          {{ guid ? 'Modifier le Lexique' : 'Ajouter un Nouveau Lexique' }}-->
<!--        </h3>-->

<!--        <div class="mb-4">-->
<!--          <label class="text-gray-700 block mb-2" for="modal-reference">Référence</label>-->
<!--          <input-->
<!--            v-model="reference"-->
<!--            id="modal-reference"-->
<!--            type="text"-->
<!--            class="input-class p-2 w-full border border-gray-300 rounded bg-gray-50"-->
<!--            disabled-->
<!--          />-->
<!--        </div>-->

<!--        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">-->
<!--          <div>-->
<!--            <label class="text-gray-700 block mb-2" for="modal-english">Anglais</label>-->
<!--            <textarea-->
<!--              v-model="english"-->
<!--              id="modal-english"-->
<!--              class="input-class mt-2 p-2 w-full border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500"-->
<!--              placeholder="Entrez le terme en Anglais"-->
<!--            />-->
<!--          </div>-->
<!--          <div>-->
<!--            <label class="text-gray-700 block mb-2" for="modal-french">Français</label>-->
<!--            <textarea-->
<!--              v-model="french"-->
<!--              id="modal-french"-->
<!--              class="input-class mt-2 p-2 w-full border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500"-->
<!--              placeholder="Entrez le terme en Français"-->
<!--            />-->
<!--          </div>-->
<!--        </div>-->

<!--        <div class="mb-4">-->
<!--          <label class="inline-flex items-center">-->
<!--            <input type="checkbox" v-model="portable" class="form-checkbox"/>-->
<!--            <span class="ml-2">Exporter pour Mobile</span>-->
<!--          </label>-->
<!--        </div>-->

<!--        <div class="flex justify-end space-x-4">-->
<!--          <button @click="closeFormModal" class="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400">-->
<!--            Annuler-->
<!--          </button>-->
<!--          <button @click="registerOrUpdateLexicon" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">-->
<!--            {{ guid ? 'Mettre à Jour' : 'Enregistrer' }}-->
<!--          </button>-->
<!--        </div>-->
<!--      </div>-->
<!--    </div>-->

<!--    &lt;!&ndash; Modal de Confirmation de Suppression &ndash;&gt;-->
<!--    <div v-if="showDeleteModal" class="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">-->
<!--      <div class="bg-white p-6 rounded-lg shadow-md max-w-sm w-full">-->
<!--        <h3 class="text-xl font-semibold text-gray-700 mb-4">Confirmer la Suppression</h3>-->
<!--        <p class="text-gray-600 mb-6">-->
<!--          Êtes-vous sûr de vouloir supprimer {{ guidToDelete.length > 1 ? 'ces lexiques' : 'ce lexique' }} ?-->
<!--        </p>-->
<!--        <div class="flex justify-end space-x-4">-->
<!--          <button @click="closeModal" class="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400">Annuler</button>-->
<!--          <button @click="deleteLexicon" class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">Confirmer</button>-->
<!--        </div>-->
<!--      </div>-->
<!--    </div>-->

<!--  </div>-->
<!--</template>-->

<!--<script setup lang="ts">-->
<!--// import axios from 'axios';-->
<!--import { ref, onMounted, watch, nextTick } from 'vue';-->
<!--import 'datatables.net-dt/css/dataTables.dataTables.min.css';-->
<!--import 'datatables.net';-->
<!--import {toOpenCamelCase} from "@/data/utils/helper/camelcase";-->

<!--import {delLexicon, fetchLexiconsFromApi, saveLexicon} from "@/data/lexicon/service/lexiconService";-->
<!--import {Lexicon} from '@/data/lexicon/model/Lexicon'-->
<!--import type { Response,Alert } from "@/data/lexicon/service/model/lexiconApiModel";-->
<!--import {copyReference} from "@/data/utils/helper/copy";-->
<!--import {updateLexicon} from "@/data/lexicon/service/lexiconService";-->

<!--const lexicons = ref<Lexicon[]>([]);-->
<!--const isLoading = ref(true);-->
<!--const message = ref('');-->
<!--const guid = ref<number | null>(null);-->
<!--const portable = ref(false);-->
<!--const french = ref('');-->
<!--const english = ref('');-->
<!--const reference = ref('');-->
<!--const showDeleteModal = ref(false);-->
<!--const guidToDelete = ref<(string | number)[]>([]);-->
<!--const selectedLexicons = ref([]);-->
<!--const showFormModal = ref(false);-->
<!--const activeMenu = ref<string | null>(null);-->
<!--const alerts = ref<Alert[]>([]);-->

<!--const showMessage = (msg: string, status: 'success' | 'error' = 'success') => {-->
<!--  if (alerts.value.some(alert => alert.message === msg)) return; // Évite les doublons-->

<!--  const id = Date.now();-->
<!--  alerts.value.push({-->
<!--    id,-->
<!--    title: status === 'success' ? 'Succès' : 'Erreur',-->
<!--    message: msg,-->
<!--    type:status-->
<!--  });-->

<!--  setTimeout(() => {-->
<!--    removeAlert(id);-->
<!--  }, 3000);-->
<!--};-->

<!--const removeAlert = (id: string | number) => {-->
<!--  alerts.value = alerts.value.filter(alert => alert.id !== id);-->
<!--};-->

<!--const closeModal = () => {-->
<!--  showDeleteModal.value = false;-->
<!--  guidToDelete.value = [];-->
<!--};-->

<!--/**-->
<!-- * list lexicon datas-->
<!-- */-->
<!--async function fetchLexicons() {-->
<!--  try {-->
<!--    const response = await fetchLexiconsFromApi();-->
<!--    lexicons.value = response || [];-->
<!--    if ($.fn.DataTable.isDataTable('#lexicon-table')) {-->
<!--      $('#lexicon-table').DataTable().destroy();-->
<!--    }-->
<!--    await nextTick();-->

<!--    $("#lexicon-table").DataTable({-->
<!--      "ordering": false, // Assurez-vous que le tri est activé-->
<!--      "pageLength": 10, // Nombre d'entrées par page par défaut-->
<!--      "lengthMenu": [10, 25, 50, 100, 200], // Options de sélection du nombre d'entrées par page-->
<!--    });-->
<!--  } catch (error) {-->
<!--    showMessage("Error when retrieving lexicons.", 'error');-->
<!--  } finally {-->
<!--    isLoading.value = false;-->
<!--  }-->
<!--}-->

<!--/**-->
<!-- * save or update lexicon-->
<!-- */-->
<!--// async function registerOrUpdateLexicon() {-->
<!--//   if (!english.value || !french.value) {-->
<!--//     showMessage("English and French fields are required.", 'error');-->
<!--//     return;-->
<!--//   }-->
<!--//-->
<!--//   const limitedEnglish = english.value.length > 120 ? english.value.slice(0, 120) : english.value;-->
<!--//   if (referenceExists(reference.value)) {-->
<!--//     showMessage("La référence existe déjà.", 'error');-->
<!--//     // Filtrer le tableau pour afficher uniquement les résultats correspondants-->
<!--//     $("#lexicon-table").DataTable().search(reference.value).draw(); // Filtre le tableau-->
<!--//     return;-->
<!--//   }-->
<!--//   const postData: Response = {-->
<!--//     english: limitedEnglish,-->
<!--//     french: french.value,-->
<!--//     portable: portable.value,-->
<!--//     guid: guid.value-->
<!--//   };-->
<!--//-->
<!--//   try {-->
<!--//     const savedLexicon = await saveLexicon(postData);-->
<!--//     if (savedLexicon) {-->
<!--//       closeFormModal();-->
<!--//       location.reload();-->
<!--//       showMessage('Operation Successful');-->
<!--//       // await fetchLexicons();-->
<!--//     } else {-->
<!--//       showMessage("Operation Failed.", 'error');-->
<!--//     }  } catch (error) {-->
<!--//     showMessage("Error during lexicon registration.", 'error');-->
<!--//   }-->
<!--// }-->

<!--async function registerOrUpdateLexicon() {-->
<!--  if (!english.value || !french.value) {-->
<!--    showMessage("English and French fields are required.", 'error');-->
<!--    return;-->
<!--  }-->

<!--  const limitedEnglish = english.value.length > 120 ? english.value.slice(0, 120) : english.value;-->
<!--  if (referenceExists(reference.value)) {-->
<!--    showMessage("La référence existe déjà.", 'error');-->
<!--    // Filtrer le tableau pour afficher uniquement les résultats correspondants-->
<!--    $("#lexicon-table").DataTable().search(reference.value).draw();-->
<!--    return;-->
<!--  }-->
<!--  const postData: Response = {-->
<!--    english: limitedEnglish,-->
<!--    french: french.value,-->
<!--    portable: portable.value,-->
<!--    guid: guid.value || undefined-->
<!--  };-->

<!--  try {-->
<!--    let savedLexicon;-->
<!--    if (guid.value) {-->
<!--      // Mise à jour-->
<!--      savedLexicon = await updateLexicon(postData);-->

<!--    } else {-->
<!--      // Nouveau-->
<!--      savedLexicon = await saveLexicon(postData);-->

<!--    }-->
<!--    if (savedLexicon instanceof Lexicon) {-->

<!--      //lexicons.value.push(savedLexicon);-->
<!--      // location.reload();-->
<!--      showMessage('Operation Successful');-->
<!--      closeFormModal();-->
<!--      // await wait (2000);-->
<!--      await fetchLexicons();-->
<!--    } else {-->
<!--      showMessage("Operation Failed.", 'error');-->
<!--    }-->
<!--  } catch (error) {-->
<!--    showMessage("Error during lexicon registration.", 'error');-->
<!--  }-->
<!--}-->

<!--// function wait(ms: number): Promise<void> {-->
<!--//   return new Promise(resolve => setTimeout(resolve, ms));-->
<!--// }-->

<!--/**-->
<!-- * initialise-->
<!-- * @param lexicon-->
<!-- */-->
<!--function editLexicon(lexicon: { id: number; guid: string; reference: string; english: string; french: string; portable: boolean }) {-->
<!--  guid.value = Number(lexicon.guid) || null;-->
<!--  english.value = lexicon.english || '';-->
<!--  french.value = lexicon.french || '';-->
<!--  reference.value = lexicon.reference || '';-->
<!--  portable.value = lexicon.portable || false;-->
<!--  showFormModal.value = true;-->
<!--}-->
<!--/**-->
<!-- * prepare delete eltms en stock guids-->
<!-- * @param guidArray-->
<!-- */-->
<!--function confirmDelete(guidArray: (string | number)[]) {-->
<!--  guidToDelete.value = guidArray;-->
<!--  showDeleteModal.value = true;-->
<!--}-->

<!--/**-->
<!-- * delete lexicon-->
<!-- */-->
<!--async function deleteLexicon() {-->
<!--  try {-->
<!--    await delLexicon(guidToDelete.value);-->
<!--    showMessage('Lexicon deleted successfully!');-->
<!--    await fetchLexicons();-->
<!--    showDeleteModal.value = false;-->
<!--  } catch (error) {-->
<!--    console.error("Error when deleting the lexicon:", error);-->
<!--    showMessage("Error when deleting the lexicon.", 'error');-->
<!--  }-->
<!--}-->

<!--/**-->
<!-- * open modal lexicon-->
<!-- */-->
<!--function openAddModal() {-->
<!--  guid.value = null;-->
<!--  english.value = '';-->
<!--  french.value = '';-->
<!--  reference.value = '';-->
<!--  portable.value = false;-->
<!--  showFormModal.value = true;-->
<!--}-->

<!--/**-->
<!-- * copy reference-->
<!-- * @param text-->
<!-- */-->
<!--async function copyToClipboard(text: string) {-->
<!--  await copyReference(text);-->
<!--  showMessage("Référence copiée dans le presse-papiers !");-->
<!--  activeMenu.value = null;-->

<!--  setTimeout(() => {-->
<!--    message.value = '';-->
<!--  }, 3000);-->
<!--}-->

<!--function referenceExists(reference: string): boolean {-->
<!--  return lexicons.value.some(lexicon => lexicon.reference === reference);-->
<!--}-->

<!--function toggleMenu(lexiconGuid: string | null) {-->
<!--  activeMenu.value = activeMenu.value === lexiconGuid ? null : lexiconGuid;-->
<!--}-->

<!--/**-->
<!-- * Écouteur d'événements pour fermer le menu au clic extérieur-->
<!-- */-->
<!--document.addEventListener('click', (event) => {-->
<!--  const target = event.target as HTMLElement;-->
<!--  if (target && !target.closest('.relative')) {-->
<!--    activeMenu.value = null;-->
<!--  }-->
<!--});-->

<!--/**-->
<!-- * Surveiller les modifications de 'english' pour mettre à jour la référence-->
<!-- */-->
<!--watch(english, async (newValue) => {-->
<!--  if (newValue) {-->
<!--    // Limiter à 120 caractères-->
<!--    const limitedValue = newValue.length > 120 ? newValue.slice(0, 120) : newValue;-->
<!--    reference.value = await toOpenCamelCase(limitedValue);-->
<!--  } else {-->
<!--    reference.value = '';-->
<!--  }-->
<!--});-->

<!--const closeFormModal = () => {-->
<!--  showFormModal.value = false;-->
<!--  nextTick(() => {-->
<!--    english.value = '';-->
<!--    french.value = '';-->
<!--    reference.value = '';-->
<!--    portable.value = false;-->
<!--    guid.value = null;-->
<!--  });-->
<!--};-->


<!--onMounted(fetchLexicons);-->
<!--</script>-->

<!--<style scoped>-->
<!--.fixed {-->
<!--  transition: opacity 0.5s ease;-->
<!--}-->
<!--th {-->
<!--  background-color: #3b82f6;-->
<!--  color: white;-->
<!--  padding: 12px;-->
<!--  text-align: left;-->
<!--}-->
<!--</style>-->
