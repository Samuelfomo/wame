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

          <router-link class="p-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center"
                       :class="[$route.name === 'FormContact']"
                       to="/formcontact">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
          </router-link>

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
          <th class="py-2 px-4 bg-gray-950 border-b border-gray-300 text-left text-sm text-white">Nom</th>
          <th class="py-2 px-4 bg-gray-950 border-b border-gray-300 text-left text-sm text-white">Mobile</th>
          <th class="py-2 px-4 bg-gray-950 border-b border-gray-300 text-left text-sm text-white">Email</th>
          <th class="py-2 px-4 bg-gray-950 border-b border-gray-300 text-left text-sm text-white">Whatsapp</th>
          <th class="py-2 px-4 bg-gray-950 border-b border-gray-300 text-left text-sm text-white">Ville</th>
          <th class="py-2 px-4 bg-gray-950 border-b border-gray-300 text-left text-sm text-white">Langue</th>
          <th class="py-2 px-4 bg-gray-950 border-b border-gray-300 text-left text-sm text-white">Actions</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="contact in contacts" :key="contact.guid" class="hover:bg-gray-50">
          <td class="py-2 px-4 border-b border-gray-300">
            <span v-if="contact.qualified" class="inline-block font-semibold w-2.5 h-2.5 rounded-full bg-black mr-2 absolute" ></span>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            {{ contact.gender === 'm' ? 'Mn.' : 'Mne.' }}&nbsp;{{ contact.lastname }}
          </td>
          <td class="py-2 px-4 border-b border-gray-300" >{{ contact.mobile }}</td>
          <td class="py-2 px-4 border-b border-gray-300" >{{ contact.email }}</td>
          <td class="py-2 px-4 border-b border-gray-300">{{ contact.whatsapp }}</td>
          <td class="py-2 px-4 border-b border-gray-300" >{{ contact.location }}</td>
          <td class="py-2 px-4 border-b border-gray-300" >{{ contact.language }}</td>
          <td class="py-2 px-4 border-b border-gray-300">
            <div class="relative">
              <button @click="toggleMenu(contact.guid)" class="p-1 hover:bg-gray-100 rounded">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                </svg>
              </button>
              <div v-if="activeMenu === contact.guid" class="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
                <div class="py-1">
                  <button  @click="editContact(contact)"  class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">
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


    <!-- Modal de Confirmation de Suppression -->
    <div v-if="showDeleteModal" class="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
      <div class="bg-white p-6 rounded-lg shadow-md max-w-sm w-full">
        <h3 class="text-xl font-semibold text-gray-700 mb-4">Confirmer la Suppression</h3>
        <p class="text-gray-600 mb-6">
          Êtes-vous sûr de vouloir supprimer {{ guidToDelete.length > 1 ? 'ces contacts' : 'ce contact' }} ?
        </p>
        <div class="flex justify-end space-x-4">
          <button @click="closeModal" class="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400">Annuler</button>
          <button @click="deleteContact" class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">Confirmer</button>
        </div>
      </div>
    </div>
    <div v-if="message" class="fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded shadow-lg">
      {{ message }}
    </div>

    <router-view :on-update="updateMessage"></router-view>

  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, nextTick } from 'vue';
import 'datatables.net-dt/css/dataTables.dataTables.min.css';
import 'datatables.net';
import 'datatables.net-responsive';

import {Contact} from "@/data/contact/model/Contact";
import type {Alert} from "@/data/contact/service/model/contactApiModel";
import { useRouter } from 'vue-router';

const router = useRouter();

const contacts = ref<Contact[]>([]);
const isLoading = ref(true);
const message = ref('');
const showDeleteModal = ref(false);
const guidToDelete = ref<(number | null)[]>([]);
const selectedContacts = ref([]);
const activeMenu = ref< number | null >();
const alerts = ref<Alert[]>([]);


function updateMessage(newMessage: string) {
  message.value = newMessage;
  setTimeout(() => {
    message.value = ''; // Réinitialiser le message après 3 secondes
  }, 3000);
}
function toggleMenu(contactGuid: number | null) {
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
    const response = await Contact.fetchContactsFromApi();
    contacts.value =response || [];
    if ($.fn.DataTable.isDataTable('#contact-table')) {
      $('#contact-table').DataTable().destroy();
    }
    await nextTick();


    $("#contact-table").DataTable({
      responsive: true,
      ordering: false,
      pageLength: 10,
      lengthMenu: [10, 25, 50, 100, 200]
    } as any);

    // $("#contact-table").DataTable({
    //   "ordering": false,
    //   "pageLength": 10,
    //   "lengthMenu": [10, 25, 50, 100, 200],
    //   // responsive: true,
    // });
  } catch (error) {
    showMessage('Error when retrieving contacts.', 'error');
  } finally {
    isLoading.value = false;
  }
}

async function confirmDelete(guidArray: number[]) {
  guidToDelete.value = guidArray;
  showDeleteModal.value = true;
}

async function deleteContact() {
  try {
    for (const guid of guidToDelete.value) {
      const contactToDelete = new Contact(
        '', // firstname
        '', // lastname
        null, // mobile
        null, // whatsapp
        '',
        '',
        '',
        '',
        false,
        undefined,
        undefined,
         undefined,
        guid
      );

      await contactToDelete.deleteContact();
    }
    showMessage('Operation Successfull !','success');
    await fetchContacts();
    showDeleteModal.value = false;
  } catch (error) {
    console.error("Error during contact deletion:", error);
    showMessage('Operation fail.', 'error');
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

const editContact = (contact: Contact) => {
  router.push({
    name: 'FormContact',
    query: { guid: contact.guid?.toString() }
  });
  activeMenu.value = null;
};


onMounted(fetchContacts);
</script>

<style scoped>
</style>
