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
                  <button  class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">
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
import {fetchContactsFromApi} from "@/data/contact/service/contactService";
import type {Alert} from "@/data/contact/service/model/contactApiModel";




const contacts = ref<Contact[]>([]);
const isLoading = ref(true);
const message = ref('');
const showDeleteModal = ref(false);
const guidToDelete = ref<(string | number)[]>([]);
const selectedContacts = ref([]);
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
</style>









<!--<template>-->
<!--  <div class="flex items-center justify-center py-10">-->
<!--    <div class="bg-white shadow-lg rounded-lg p-6 w-full max-w-5xl">-->
<!--      <h2 class="text-2xl font-bold text-gray-800 mb-4">Ajouter un Contact</h2>-->
<!--      <form @submit.prevent="onSubmit" class="grid grid-cols-2 gap-4">-->

<!--        &lt;!&ndash; Prénom &ndash;&gt;-->
<!--        <div class="flex items-center">-->
<!--          <i class="fas fa-user text-gray-400"></i>&nbsp;&nbsp;-->
<!--          <label for="firstname" class="w-24 text-gray-600">Prénom</label>-->
<!--          <input v-model="firstname" type="text" id="firstname" placeholder="John" class=" flex-1 border border-gray-300 rounded-lg p-2 focus:outline-none focus:border-indigo-500">-->
<!--        </div>-->

<!--        &lt;!&ndash; Nom de famille &ndash;&gt;-->
<!--        <div class="flex items-center">-->
<!--          <i class="fas fa-user text-gray-400"></i>&nbsp;&nbsp;-->
<!--          <label for="lastname" class="w-24 text-gray-600">Nom</label>-->
<!--          <select v-model="gender" id="gender" class="border border-gray-300 p-2 focus:outline-none focus:border-indigo-500">-->
<!--            <option value="male">M</option>-->
<!--            <option value="female">F</option>-->
<!--          </select>&nbsp;&nbsp;-->
<!--          <input v-model="lastname" type="text" id="lastname" placeholder="Doe" class="flex-1 border border-gray-300 rounded-lg p-2 focus:outline-none focus:border-indigo-500">-->
<!--        </div>-->

<!--        &lt;!&ndash; Mobile &ndash;&gt;-->
<!--        <div class="flex items-center">-->
<!--          <i class="fas fa-phone text-gray-400"></i>&nbsp;&nbsp;-->
<!--          <label for="mobile" class="w-24 text-gray-600">Mobile</label>-->
<!--          <input v-model="mobile" type="tel" id="mobile" placeholder="06 12 34 56 78" class="flex-1 border border-gray-300 rounded-lg p-2 focus:outline-none focus:border-indigo-500">-->
<!--        </div>-->

<!--        &lt;!&ndash; WhatsApp &ndash;&gt;-->
<!--        <div class="flex items-center">-->
<!--          <i class="fab fa-whatsapp text-gray-400"></i>&nbsp;&nbsp;-->
<!--          <label for="whatsapp" class="w-24 text-gray-600">WhatsApp</label>-->
<!--          <input v-model="whatsapp" type="tel" id="whatsapp" placeholder="06 12 34 56 78" class="flex-1 border border-gray-300 rounded-lg p-2 focus:outline-none focus:border-indigo-500">-->
<!--        </div>-->

<!--        &lt;!&ndash; Email &ndash;&gt;-->
<!--        <div class="flex items-center">-->
<!--          <i class="fas fa-envelope text-gray-400"></i>&nbsp;&nbsp;-->
<!--          <label for="email" class="w-24 text-gray-600">Email</label>-->
<!--          <input v-model="email" type="email" id="email" placeholder="john.doe@example.com" class="flex-1 border border-gray-300 rounded-lg p-2 focus:outline-none focus:border-indigo-500">-->
<!--        </div>-->

<!--        &lt;!&ndash; Genre &ndash;&gt;-->
<!--&lt;!&ndash;        <div class="flex items-center">&ndash;&gt;-->
<!--&lt;!&ndash;          <i class="fas fa-venus-mars text-gray-400"></i>&nbsp;&nbsp;&ndash;&gt;-->
<!--&lt;!&ndash;          <label for="gender" class="w-24 text-gray-600">Genre</label>&ndash;&gt;-->
<!--&lt;!&ndash;          <select v-model="gender" id="gender" class="flex-1 border border-gray-300 rounded-lg p-2 focus:outline-none focus:border-indigo-500">&ndash;&gt;-->
<!--&lt;!&ndash;            <option disabled value="">Sélectionnez</option>&ndash;&gt;-->
<!--&lt;!&ndash;            <option value="male">Homme</option>&ndash;&gt;-->
<!--&lt;!&ndash;            <option value="female">Femme</option>&ndash;&gt;-->
<!--&lt;!&ndash;            <option value="other">Autre</option>&ndash;&gt;-->
<!--&lt;!&ndash;          </select>&ndash;&gt;-->
<!--&lt;!&ndash;        </div>&ndash;&gt;-->

<!--                &lt;!&ndash; Langue &ndash;&gt;-->
<!--                <div class="flex items-center">-->
<!--                  <i class="fas fa-language text-gray-400"></i>&nbsp;&nbsp;-->
<!--                  <label for="language" class="w-24 text-gray-600">Langue</label>-->
<!--                  <input v-model="language" type="text" id="language" placeholder="Français" class="flex-1 border border-gray-300 rounded-lg p-2 focus:outline-none focus:border-indigo-500">-->
<!--                </div>-->

<!--        &lt;!&ndash; Localisation &ndash;&gt;-->
<!--        <div class="flex items-center">-->
<!--          <i class="fas fa-map-marker-alt text-gray-400"></i>&nbsp;&nbsp;-->
<!--          <label for="location" class="w-24 text-gray-600">Localisation</label>-->
<!--          <input v-model="location" type="text" id="location" placeholder="Paris" class="flex-1 border border-gray-300 rounded-lg p-2 focus:outline-none focus:border-indigo-500">-->
<!--        </div>-->


<!--        &lt;!&ndash; Qualifié &ndash;&gt;-->
<!--        <div class="flex items-center">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-->
<!--          <label for="qualified" class="w-24 text-gray-600">Qualifié</label>-->
<!--          <input v-model="qualified" type="checkbox" id="qualified" class="h-5 w-5 text-indigo-600 border-gray-300 rounded">-->
<!--        </div>-->


<!--        &lt;!&ndash; Bouton d'envoi &ndash;&gt;-->
<!--        <div class="col-span-2 text-right">-->
<!--          <button type="submit" class="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200">-->
<!--            Enregistrer-->
<!--          </button>-->
<!--        </div>-->

<!--      </form>-->
<!--    </div>-->
<!--  </div>-->
<!--</template>-->

<!--<script>-->

<!--</script>-->

<!--<style scoped>-->
<!--@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css');-->
<!--/* Design propre et sobre, sans fond coloré */-->
<!--</style>-->

