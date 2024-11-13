<template>

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

  <div class="p-8 bg-gray-100 min-h-screen">
    <h3 class="text-3xl font-semibold text-gray-800 mb-6">Gestion des Contacts</h3>

    <div class="bg-white p-6 rounded-lg shadow-md">
      <div class="flex justify-between items-center mb-6">
        <h4 class="text-xl font-semibold text-gray-700">Liste des Contacts</h4>
        <div class="flex space-x-4">
          <span class="text-black-500 text-xl font-black">AJOUTER</span>
          <button
            @click="openAddModal"
            class="p-2 bg-red-600 text-white rounded hover:bg-red-700 flex items-center"
            title="Ajouter un Nouveau Contact"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
          </button>
          <button
            v-if="selectedContacts.length > 0"
            @click="confirmDelete(selectedContacts)"
            class="p-2 bg-red-600 text-white rounded hover:bg-red-700 flex items-center"
            title="Supprimer Sélectionnée"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            </svg>
            <span class="ml-1 text-sm">{{ selectedContacts.length }}</span>
          </button>
        </div>
      </div>

      <table id="contact-table" class="min-w-full bg-white rounded table-class">
        <thead>
        <tr>
          <!--          <th>-->
          <!--            <input-->
          <!--              class="py-2 px-4 bg-gray-100 border-b border-gray-300 text-left text-sm text-gray-600"-->
          <!--              type="checkbox"-->
          <!--              v-model="selectAll"-->
          <!--              @change="toggleSelectAll"-->
          <!--            />-->
          <!--          </th>-->
          <th class="py-2 px-4 bg-gray-100 border-b border-gray-300 text-left text-sm text-gray-600">Nom</th>
          <th class="py-2 px-4 bg-gray-100 border-b border-gray-300 text-left text-sm text-gray-600">Mobile</th>
          <th class="py-2 px-4 bg-gray-100 border-b border-gray-300 text-left text-sm text-gray-600">Email</th>
          <th class="py-2 px-4 bg-gray-100 border-b border-gray-300 text-left text-sm text-gray-600">Whatsapp</th>
          <th class="py-2 px-4 bg-gray-100 border-b border-gray-300 text-left text-sm text-gray-600">Ville</th>
          <th class="py-2 px-4 bg-gray-100 border-b border-gray-300 text-left text-sm text-gray-600">Langue</th>
          <th class="py-2 px-4 bg-gray-100 border-b border-gray-300 text-left text-sm text-gray-600">Actions</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="contact in contacts" :key="contact.guid" class="hover:bg-gray-50">
          <!--          <td>-->
          <!--            <input-->
          <!--              class="py-2 px-4 border-b border-gray-300"-->
          <!--              type="checkbox"-->
          <!--              v-model="selectedContacts"-->
          <!--              :value="contact.guid"-->
          <!--            />-->
          <!--          </td>-->
          <td class="py-2 px-4 border-b border-gray-300" @click="editContact(contact)">
            {{ contact.gender === 'm' ? 'Mn.' : 'Mne.' }}&nbsp;{{ contact.lastname }}
          </td>
          <td class="py-2 px-4 border-b border-gray-300" @click="editContact(contact)">{{ contact.mobile }}</td>
          <td class="py-2 px-4 border-b border-gray-300" @click="editContact(contact)">{{ contact.email }}</td>
          <td class="py-2 px-4 border-b border-gray-300" @click="editContact(contact)">{{ contact.whatsapp }}</td>
          <td class="py-2 px-4 border-b border-gray-300" @click="editContact(contact)">{{ contact.location }}</td>
          <td class="py-2 px-4 border-b border-gray-300" @click="editContact(contact)">{{ contact.language }}</td>
          <td class="py-2 px-4 border-b border-gray-300">
            <div class="relative">
              <button @click="toggleMenu(contact.guid)" class="p-1 hover:bg-gray-100 rounded">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                </svg>
              </button>
              <div v-if="activeMenu === contact.guid" class="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
                <div class="py-1">
                  <button @click="editContact(contact)" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">
                    Modifier
                  </button>
                  <button @click="confirmDelete([contact.guid])" class="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full text-left">
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
          {{ guid ? 'Modifier le Contact' : 'Ajouter un Nouveau Contact' }}
        </h3>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label class="text-gray-700 block mb-2" for="modal-firstname">Prénom</label>
            <input
              v-model="firstname"
              id="modal-firstname"
              class="input-class mt-2 p-2 w-full border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500"
              placeholder="Entrez votre prénom"
            />
          </div>
          <div>
            <label class="text-gray-700 block mb-2" for="modal-lastname">Nom</label>
            <input
              v-model="lastname"
              id="modal-lastname"
              class="input-class mt-2 p-2 w-full border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500"
              placeholder="Entrez votre nom"
            />
          </div>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label class="text-gray-700 block mb-2" for="modal-mobile">Mobile</label>
            <input
              type="text"
              v-model="mobile"
              id="modal-mobile"
              class="input-class mt-2 p-2 w-full border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500"
              placeholder="Entrez votre numéro de téléphone"
            />
          </div>
          <div>
            <label class="text-gray-700 block mb-2" for="modal-email">Email</label>
            <input
              type="email"
              v-model="email"
              id="modal-email"
              class="input-class mt-2 p-2 w-full border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500"
              placeholder="Entrez votre adresse email"
            />
          </div>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label class="text-gray-700 block mb-2" for="modal-whatsapp">Whatsapp</label>
            <input
              type="text"
              v-model="whatsapp"
              id="modal-whatsapp"
              class="input-class mt-2 p-2 w-full border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500"
              placeholder="Entrez votre numéro Whatsapp"
            />
          </div>
          <div>
            <label class="text-gray-700 block mb-2" for="modal-location">Ville</label>
            <input
              v-model="location"
              id="modal-location"
              class="input-class mt-2 p-2 w-full border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500"
              placeholder="Entrez votre ville"
            />
          </div>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label class="text-gray-700 block mb-2" for="modal-gender">Genre</label>
            <select
              v-model="gender"
              class="w-full mt-2 border-gray-200 rounded-md focus:border-indigo-600 focus:ring focus:ring-opacity-40 focus:ring-indigo-500"
              id="modal-gender"
            >
              <option value="m">Homme</option>
              <option value="f">Femme</option>
            </select>
          </div>
          <div>
            <label class="text-gray-700 block mb-2" for="modal-language">Langue</label>
            <select
              v-model="language"
              class="w-full mt-2 border-gray-200 rounded-md focus:border-indigo-600 focus:ring focus:ring-opacity-40 focus:ring-indigo-500"
              id="modal-language"
            >
              <option value="en">English</option>
              <option value="fr">French</option>
            </select>
          </div>
        </div>

        <div class="mb-4">
          <label class="inline-flex items-center">
            <input type="checkbox" v-model="qualified" class="form-checkbox"/>
            <span class="ml-2">Approuver</span>
          </label>
        </div>

        <div class="flex justify-end space-x-4">
          <button @click="guid ? closeFormModal() : closeFormModalsave()" class="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400">
            Annuler
          </button>
          <button @click="registerOrUpdateContact" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
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
          Êtes-vous sûr de vouloir supprimer {{ guidToDelete.length > 1 ? 'ces contacts' : 'ce contact' }} ?
        </p>
        <div class="flex justify-end space-x-4">
          <button @click="closeModal" class="cancel-button">Annuler</button>
          <button @click="deleteContact" class="confirm-button">Confirmer</button>
        </div>
      </div>
    </div>

    <!-- Message Toast -->
    <div v-if="message" class="fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded shadow-lg">
      {{ message }}
    </div>
  </div>
</template>

<script setup lang="ts">
import axios from 'axios';
import { onMounted, ref, nextTick } from 'vue';
import 'datatables.net-dt/css/dataTables.dataTables.min.css';
import 'datatables.net';
import {Constant} from "@/app/constant/constant";

import {Contact} from "@/data/contact/model/Contact";
import {fetchContactsFromApi, saveContact} from "@/data/contact/service/contactService";
import type {Alert, Response} from "@/data/contact/service/model/contactApiModel";




const contacts = ref<Contact[]>([]);
const isLoading = ref(true);
const message = ref('');
const guid = ref<number | null>(null);
const firstname = ref('');
const lastname = ref('');
const mobile = ref<number | null>(null);
const email = ref('');
const whatsapp = ref<number | null | undefined>(null);
const location = ref('');
const gender = ref('');
const language = ref('');
const qualified = ref(false);
const showDeleteModal = ref(false);
const guidToDelete = ref<(string | number)[]>([]);
const selectedContacts = ref([]);
const showFormModal = ref(false);
const activeMenu = ref< string | null >(null);
const alerts = ref<Alert[]>([]);



function toggleMenu(contactGuid: string | null) {
  activeMenu.value = activeMenu.value === contactGuid ? null : contactGuid;
}

// Ferme le menu en cliquant à l'extérieur
document.addEventListener('click', (event) => {
  const target = event.target as HTMLElement;
  if (target && !target.closest('.relative')) {
    activeMenu.value = null;
  }
});

async function fetchContacts() {
  try {
    const response = await fetchContactsFromApi();
    contacts.value =response || [];
    if ($.fn.DataTable.isDataTable('#contact-table')) {
      $('#contact-table').DataTable().destroy();
    }
    await nextTick();

    $("#contact-table").DataTable({
      "ordering": false, // Assurez-vous que le tri est activé
      "pageLength": 10, // Nombre d'entrées par page par défaut
      "lengthMenu": [10, 25, 50, 100, 200], // Options de sélection du nombre d'entrées par page
    });
  } catch (error) {
    showMessage('Error when retrieving contacts.');
  } finally {
    isLoading.value = false;
  }
}

async function registerOrUpdateContact() {
  if (!lastname.value || !mobile.value || typeof guid.value === 'undefined') {
    showMessage("The 'Name', 'Mobile' and 'GUID' fields are mandatory.") ;
    return;
  }

  const postData: Response = {
    firstname: firstname.value,
    lastname: lastname.value,
    mobile: mobile.value,
    whatsapp: whatsapp.value !== null ? whatsapp.value : undefined,
    email: email.value,
    location: location.value,
    gender: gender.value,
    qualified: qualified.value,
    language: language.value,
    guid: guid.value || undefined
  };
  try {
    let savedContact;
    if (guid.value) {
      savedContact = await saveContact(postData);
      await fetchContacts();
      closeFormModal();
    }
    else {
      if (contactExists(mobile.value,whatsapp.value,email.value)) {
        showMessage("The contact already exists..", 'error');
        $("#contact-table").DataTable().search(mobile.value).draw();
        closeFormModal();
        return;
      }
     savedContact = await saveContact(postData);
      firstname.value = '';
      lastname.value = '';
      mobile.value = null;
      email.value = '';
      whatsapp.value = null;
      location.value = '';
      gender.value = '';
      language.value = '';
      guid.value = null;

    }
    if (savedContact instanceof Contact) {
      showMessage('Operation Successful');
    } else {
      showMessage("Operation Failed.", 'error');
    }
  } catch (error) {
    showMessage(`Erreur lors de l'enregistrement du contact: ${error.message}`);
  }
}

function contactExists(mobile, whatsapp, email) {
  return contacts.value.some(contact =>
    contact.mobile === mobile ||
    contact.whatsapp === whatsapp ||
    contact.email === email
  );
}

function openAddModal() {
  // Réinitialiser les champs
  guid.value = null;
  firstname.value = '';
  lastname.value = '';
  mobile.value = null;
  email.value = '';
  whatsapp.value = null;
  location.value = '';
  gender.value = '';
  qualified.value = false;
  language.value = '';
  showFormModal.value = true;
}

function editContact(contact: {
  id: number,
  guid: string,
  firstname: string,
  lastname: string,
  mobile: number,
  whatsapp: number,
  email: string,
  gender: string,
  language: string,
  location: string,
  qualified: boolean
}) {

  guid.value = Number(contact.guid) || null ;
  firstname.value = contact.firstname || '';
  lastname.value = contact.lastname || '';
  mobile.value = Number(contact.mobile) || null;
  whatsapp.value = Number(contact.whatsapp) || null;
  email.value = contact.email || '';
  gender.value = contact.gender || '';
  language.value = contact.language || '';
  location.value = contact.location || '';
  qualified.value = contact.qualified || false;
  showFormModal.value = true;
}

function closeFormModal() {
  showFormModal.value = false;
  // Réinitialiser les champs
  firstname.value = '';
  lastname.value = '';
  mobile.value = null;
  email.value = '';
  whatsapp.value = null;
  location.value = '';
  gender.value = '';
  language.value = '';
  guid.value = null;
}

function closeFormModalsave(){
  showFormModal.value = false;
location.reload();
}

async function confirmDelete(guidArray: (string | number)[]) {
  guidToDelete.value = guidArray;
  showDeleteModal.value = true;
}

async function deleteContact() {
  try {
    await axios.put(`${Constant.APIENDPOINT}/contact/delete`, { guids: guidToDelete.value });
    showMessage('Contact supprimé avec succès !');
    await fetchContacts();
    showDeleteModal.value = false;
  } catch (error) {
    console.error("Erreur lors de la suppression du contact:", error);
    showMessage('Erreur lors de la suppression du contact.');
  }
}


function closeModal() {
  showDeleteModal.value = false;
  guidToDelete.value = [];
}
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


onMounted(fetchContacts);
</script>

<style scoped>
.input-class {
  transition: border-color 0.3s;
}

.input-class:focus {
  border-color: #3b82f6; /* Couleur de bordure au focus */
}

.cancel-button {
  background-color: #e5e7eb;
  color: #374151;
}

.cancel-button:hover {
  background-color: #d1d5db;
}

.confirm-button {
  background-color: #ef4444;
  color: white;
}

.confirm-button:hover {
  background-color: #dc2626;
}
</style>
