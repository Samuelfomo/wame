<template>
  <div class="about">
    <h1>This is an about page</h1>
  </div>
</template>

<style>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>

<template xmlns="http://www.w3.org/1999/html">

  <div class="p-8 bg-gray-100 min-h-screen">
    <h3 class="text-3xl font-semibold text-gray-800 mb-6">Lexicon Management</h3>

    <!-- Registration Form -->
    <div class="bg-white p-6 rounded-lg shadow-md mb-8">
      <h2 class="text-xl font-semibold text-gray-700 mb-4">Lexicon Form</h2>

      <div class="bg-white rounded-lg mb-8 flex items-center">
        <div class="flex-grow">
          <label class="text-gray-700" for="reference">Reference</label>
          <input
            v-model="reference"
            id="reference"
            type="text"
            class="input-class p-2 w-full border border-gray-300 rounded bg-white"
          />
        </div>
        <button
          @click="copyToClipboard(lexicon.reference)"
          class="ml-4 px-2 py-1 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
        >
          Copier
        </button>
      </div>

      <form @submit.prevent="registerOrUpdateLexicon">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="text-gray-700" for="english">English</label>
            <textarea
              v-model="english"
              id="english"
              type="text"
              class="input-class mt-2 p-2 w-full border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter English term"
            />
          </div>
          <div>
            <label class="text-gray-700" for="french">French</label>
            <textarea
              v-model="french"
              id="french"
              type="text"
              class="input-class mt-2 p-2 w-full border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter French term"
            />
          </div>
          <div class="text-right">
            <fieldset id="portable">
              <div>
                <label class="text-gray-700" for="portable">Exporter pour le Mobile :</label>
                &nbsp;&nbsp;
                <input
                  type="checkbox"
                  id="portable"
                  v-model="portable"
                />&nbsp;
                <label for="portable">Oui</label>
              </div>
            </fieldset>
          </div>

        </div>
        <div class="mt-4 flex justify-end">
          <button
            type="submit"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 submit-button"
          >
            {{ guid ? 'Update' : 'Register' }}
          </button>
        </div>
      </form>
      <p v-if="message" class="text-green-600 text-center mt-4">{{ message }}</p>
    </div>

    <div class="bg-white p-6 rounded-lg shadow-md">
      <h4 class="text-xl font-semibold text-gray-700 mb-4">Lexicon List</h4>
      <table id="lexicon-table" class="min-w-full bg-white rounded table-class">
        <thead>
        <tr>
          <th class="py-2 px-4 bg-gray-100 border-b border-gray-300 text-left text-sm text-gray-600">French</th>
          <th class="py-2 px-4 bg-gray-100 border-b border-gray-300 text-left text-sm text-gray-600">English</th>
          <th class="py-2 px-4 bg-gray-100 border-b border-gray-300 text-left text-sm text-gray-600">Reference</th>
          <th class="py-2 px-4 bg-gray-100 border-b border-gray-300 text-left text-sm text-gray-600">Actions</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="lexicon in lexicons" :key="lexicon.guid" class="hover:bg-gray-50">
          <td class="py-2 px-4 border-b border-gray-300">{{ lexicon.french }}</td>
          <td class="py-2 px-4 border-b border-gray-300">{{ lexicon.english }}</td>
          <td class="py-2 px-4 border-b border-gray-300">
            <button @click="copyToClipboard(lexicon.reference)">
              Copy Reference
            </button>
          </td>
          <td class="py-2 px-4 border-b border-gray-300 flex space-x-2">
            <button @click="editLexicon(lexicon)" class="text-blue-600 hover:text-blue-800">Edit</button>
            <button @click="confirmDelete(lexicon.guid)" class="text-red-600 hover:text-red-800">Delete</button>
          </td>
        </tr>
        </tbody>
      </table>
    </div>

    <div v-if="showDeleteModal" class="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
      <div class="bg-white p-6 rounded-lg shadow-md max-w-sm w-full">
        <h3 class="text-xl font-semibold text-gray-700 mb-4">Confirm Deletion</h3>
        <p class="text-gray-600 mb-6">Are you sure you want to delete this lexicon entry?</p>
        <div class="flex justify-end space-x-4">
          <button @click="closeModal" class="cancel-button">Cancel</button>
          <button @click="deleteLexicon" class="confirm-button">Confirm</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import axios from 'axios';
import { onMounted, ref } from 'vue';
import 'datatables.net-dt/css/dataTables.dataTables.min.css';
import 'datatables.net';
const lexicons = ref([]);
const isLoading = ref(true);
const errorMessage = ref('');
const message = ref('');
const guid = ref(null);
const portable = ref(false);
const french = ref('');
const english = ref('');
const reference = ref('');
const showDeleteModal = ref(false);
const guidToDelete = ref(null);

async function fetchLexicons() {
  try {
    const response = await axios.get('http://192.168.100.103:3000/lexicon/list_all');
    lexicons.value = response.data.response;
    $(document).ready(() => $('#lexicon-table').DataTable());
  } catch (error) {
    errorMessage.value = "Erreur lors de la récupération des lexiques.";
  } finally {
    isLoading.value = false;
  }
}

async function registerOrUpdateLexicon() {
  const url = `http://192.168.100.103:3000/lexicon/add`;

  // Vérifiez si les champs requis ne sont pas vides
  if (!english.value || !french.value) {
    message.value = "English and French fields are required.";
    return; // Arrêtez l'exécution si les champs sont vides
  }

  try {
    const response = await axios.post(url, {
      english: english.value,
      french: french.value,
      portable: portable.value,
      guid: guid.value
    });

    console.log(response.data.response);
    reference.value = response.data.response.reference;
    message.value = response.data.message || 'Operation successful';
    resetForm();
    await fetchLexicons();
  } catch (error) {
    console.error(error.response.data); // Ajoutez cela pour voir le détail de l'erreur
    message.value = "An error has occurred. Check console for details.";
  }
}


function editLexicon(lexicon) {
  guid.value = lexicon.guid;
  english.value = lexicon.english;
  french.value = lexicon.french;
  reference.value = lexicon.reference;
  portable.value = lexicon.portable;
}

function confirmDelete(guid) {
  guidToDelete.value = guid;
  showDeleteModal.value = true;
}

async function deleteLexicon() {
  try {
    await axios.put('http://192.168.100.103:3000/lexicon/delete', { guid: guidToDelete.value });
    message.value = 'Lexicon deleted successfully';
    closeModal();
    await fetchLexicons();
  } catch (error) {
    message.value = "An error occurred during deletion";
  }
}

function closeModal() {
  showDeleteModal.value = false;
  guidToDelete.value = null;
}

function copyToClipboard(text) {
  navigator.clipboard.writeText(text)
    .then(() => {
      message.value = 'Reference copied to clipboard!';
    })
    .catch(err => {
      console.error('Failed to copy: ', err);
      message.value = "Could not copy reference.";
    });
}


function resetForm() {
  guid.value = null;
  // reference.value = '';
  english.value = '';
  french.value = '';
  portable.value = false;
}

onMounted(fetchLexicons);
</script>

<style scoped>
.input-class {
  border: 1px solid #e5e7eb;
  padding: 8px;
  border-radius: 4px;
  width: 100%;
}

.submit-button {
  background-color: #4f46e5; /* Tailwind color */
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.submit-button:hover {
  background-color: #4338ca; /* Darker shade */
}

.cancel-button {
  background-color: #e5e7eb;
  color: black;
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
}

.confirm-button {
  background-color: #dc2626;
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
}

.confirm-button:hover {
  background-color: #b91c1c; /* Darker shade */
}

.table-class {
  width: 100%;
}
</style>




