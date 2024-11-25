<template>
  <!-- Système d'alertes -->
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

  <div class="p-8 bg-gray-100 min-h-screen">
    <h3 class="text-3xl font-semibold text-gray-800 mb-6">Gestion des Utilisateurs</h3>

    <div class="flex gap-6">
      <!-- Formulaire (partie gauche) -->
      <!-- <Transition name="slide">
        <div v-if="showForm" class="w-1/3 bg-white p-6 rounded-lg shadow-md h-fit">
          <div class="flex justify-between items-center mb-6">
            <h4 class="text-xl font-semibold text-gray-700">{{ editingUser ? 'Modifier' : 'Ajouter' }} un utilisateur</h4>
            <button @click="toggleForm" class="text-gray-500 hover:text-gray-700">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form @submit.prevent="handleSubmit" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">Nom</label>
              <input v-model="form.nom" type="text"
                     class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">Prénom</label>
              <input v-model="form.prenom" type="text"
                     class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">Email</label>
              <input v-model="form.email" type="email"
                     class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
            </div>

            <div class="flex justify-end space-x-3 pt-4">
              <button type="button" @click="toggleForm"
                      class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
                Annuler
              </button>
              <button type="submit"
                      class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">
                {{ editingUser ? 'Modifier' : 'Enregistrer' }}
              </button>
            </div>
          </form>
        </div>
      </Transition> -->

      <Transition name="slide">
        <div v-if="showForm" class="w-1/3 bg-white p-6 rounded-lg shadow-md h-fit">
          <div class="flex justify-between items-center mb-6">
            <h4 class="text-xl font-semibold text-gray-700">{{ editingUser ? 'Modifier' : 'Ajouter' }} un utilisateur</h4>
            <button @click="toggleForm" class="text-gray-500 hover:text-gray-700">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form @submit.prevent="handleSubmit" class="space-y-4">
            <div class="relative">
              <label class="block text-sm font-medium text-gray-700 mb-1">Contact</label>
              <div class="relative">
                <input
                  type="text"
                  v-model="searchQuery"
                  @focus="showOptions = true"
                  @input="filterContacts"
                  placeholder="Rechercher un contact..."
                  class="w-full p-2 border rounded-md pr-10"
                />
                <div
                  v-if="showOptions"
                  class="absolute z-50 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-y-auto"
                >
                  <div
                    v-for="contact in filteredContacts"
                    :key="contact.id"
                    @click="selectContact(contact)"
                    class="p-2 hover:bg-gray-100 cursor-pointer"
                  >
                    <div class="font-medium">{{ contact.nom }} {{ contact.prenom }}</div>
                    <div class="text-sm text-gray-600">{{ contact.email }}</div>
                  </div>
                  <div
                    v-if="filteredContacts.length === 0"
                    class="p-2 text-gray-500 text-center"
                  >
                    Aucun contact trouvé
                  </div>
                </div>
              </div>
              <div v-if="selectedContact" class="mt-2 p-2 bg-gray-50 rounded-md">
                <div class="font-medium">Contact sélectionné:</div>
                <div>{{ selectedContact.nom }} {{ selectedContact.prenom }}</div>
                <div class="text-sm text-gray-600">{{ selectedContact.email }}</div>
              </div>
            </div>

            <div class="flex justify-end space-x-3 pt-4">
              <button type="button" @click="toggleForm"
                      class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
                Annuler
              </button>
              <button type="submit"
                      class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">
                {{ editingUser ? 'Modifier' : 'Enregistrer' }}
              </button>
            </div>
          </form>
        </div>
      </Transition>

      <!-- Table (partie droite) -->
      <div class="flex-1 bg-white p-6 rounded-lg shadow-md">
        <!-- En-tête avec boutons -->
        <div class="flex justify-between items-center mb-6">
          <h4 class="text-xl font-semibold text-gray-700">Liste des Utilisateurs</h4>
          <div class="flex space-x-4">
            <span class="text-black-500 text-xl font-black">AJOUTER</span>
            <button @click="toggleForm"
                    class="p-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor"
                   stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
            </button>

            <button
              v-if="selectedUsers.length > 0"
              @click="confirmDelete(selectedUsers)"
              class="p-2 bg-red-600 text-white rounded hover:bg-red-700 flex items-center"
              title="Supprimer Sélectionnée"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor"
                   stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              </svg>
              <span class="ml-1 text-sm">{{ selectedUsers.length }}</span>
            </button>
          </div>
        </div>

        <!-- DataTable -->
        <table id="users-table" class="min-w-full bg-white rounded">
        <thead>
          <tr>
            <th class="py-2 px-4 bg-gray-950 border-b border-gray-300 text-left text-sm text-white">Nom</th>
            <th class="py-2 px-4 bg-gray-950 border-b border-gray-300 text-left text-sm text-white">Prénom</th>
            <th class="py-2 px-4 bg-gray-950 border-b border-gray-300 text-left text-sm text-white">Email</th>
            <th class="py-2 px-4 bg-gray-950 border-b border-gray-300 text-left text-sm text-white">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.id" class="hover:bg-gray-50">
            <td class="py-2 px-4 border-b border-gray-300">{{ user.nom }}</td>
            <td class="py-2 px-4 border-b border-gray-300">{{ user.prenom }}</td>
            <td class="py-2 px-4 border-b border-gray-300">{{ user.email }}</td>
            <td class="py-2 px-4 border-b border-gray-300">
              <div class="relative">
                <button @click="toggleMenu(user.id)" class="p-1 hover:bg-gray-100 rounded">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                  </svg>
                </button>
                <div v-if="activeMenu === user.id"
                     class="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
                  <div class="py-1">
                    <button @click="editUser(user)"
                            class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">
                      Modifier
                    </button>
                    <button @click="confirmDelete([user.id])"
                            class="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full text-left">
                      Supprimer
                    </button>
                  </div>
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

        <!-- Skeleton Loader -->
        <div v-if="isLoading" class="animate-pulse">
        <div class="flex justify-between mb-4">
          <div class="h-6 bg-gray-300 w-1/4 rounded"></div>
          <div class="flex space-x-2">
            <div class="h-10 w-10 bg-gray-300 rounded"></div>
            <div class="h-10 w-10 bg-gray-300 rounded"></div>
          </div>
        </div>
        <table class="min-w-full">
          <thead>
            <tr>
              <th v-for="n in 4" :key="n" class="py-2 px-4 bg-gray-200 border-b">
                <div class="h-4 bg-gray-300 w-3/4 rounded"></div>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="n in 5" :key="n">
              <td v-for="m in 4" :key="m" class="py-2 px-4 border-b">
                <div class="h-4 bg-gray-200 w-full rounded"></div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      </div>
    </div>

    <!-- Modal de Confirmation de Suppression -->
    <div v-if="showDeleteModal" class="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
      <div class="bg-white p-6 rounded-lg shadow-md max-w-sm w-full">
        <h3 class="text-xl font-semibold text-gray-700 mb-4">Confirmer la Suppression</h3>
        <p class="text-gray-600 mb-6">
          Êtes-vous sûr de vouloir supprimer {{ selectedUsers.length > 1 ? 'ces utilisateurs' : 'cet utilisateur' }} ?
        </p>
        <div class="flex justify-end space-x-4">
          <button @click="closeModal" class="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400">
            Annuler
          </button>
          <button @click="deleteUsers" class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
            Confirmer
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue';
import 'datatables.net-dt/css/dataTables.dataTables.min.css';
import 'datatables.net';
import 'datatables.net-responsive';

// États de base
const users = ref([]);
const isLoading = ref(true);
const showForm = ref(false);
const showDeleteModal = ref(false);
const selectedUsers = ref([]);
const activeMenu = ref(null);
const editingUser = ref(null);
const alerts = ref([]);

// États pour le sélecteur de contact
const contacts = ref([
  { id: 1, nom: 'Dupont', prenom: 'Jean', email: 'jean.dupont@email.com' },
  { id: 2, nom: 'Martin', prenom: 'Sophie', email: 'sophie.martin@email.com' },
  { id: 3, nom: 'Bernard', prenom: 'Pierre', email: 'pierre.bernard@email.com' },
  // Ajoutez vos contacts ici
]);
const searchQuery = ref('');
const showOptions = ref(false);
const selectedContact = ref(null);
const filteredContacts = ref([]);

// Initialisation de DataTables
async function initDataTable() {
  if ($.fn.DataTable.isDataTable('#users-table')) {
    $('#users-table').DataTable().destroy();
  }
  await nextTick();

  $('#users-table').DataTable({
    responsive: true,
    ordering: false,
    pageLength: 10,
    lengthMenu: [10, 25, 50, 100, 200],
    language: {
      url: '//cdn.datatables.net/plug-ins/1.10.24/i18n/French.json'
    }
  });
}

// Gestion des alertes
function showMessage(message, type = 'success') {
  const id = Date.now();
  alerts.value.push({
    id,
    title: type === 'success' ? 'Succès' : 'Erreur',
    message,
    type
  });

  setTimeout(() => removeAlert(id), 3000);
}

function removeAlert(id) {
  alerts.value = alerts.value.filter(alert => alert.id !== id);
}

// Fonction de filtrage des contacts
function filterContacts() {
  const query = searchQuery.value.toLowerCase();
  filteredContacts.value = contacts.value.filter(contact =>
    contact.nom.toLowerCase().includes(query) ||
    contact.prenom.toLowerCase().includes(query) ||
    contact.email.toLowerCase().includes(query)
  );
}

// Fonction de sélection d'un contact
function selectContact(contact) {
  selectedContact.value = contact;
  searchQuery.value = `${contact.nom} ${contact.prenom}`;
  showOptions.value = false;
}

// Gestion du menu contextuel
function toggleMenu(userId) {
  activeMenu.value = activeMenu.value === userId ? null : userId;
}

// Gestion du formulaire
function toggleForm() {
  showForm.value = !showForm.value;
  if (!showForm.value) {
    editingUser.value = null;
    selectedContact.value = null;
    searchQuery.value = '';
  }
}

function editUser(user) {
  editingUser.value = user;
  // Trouver le contact correspondant
  const contact = contacts.value.find(c =>
    c.email === user.email ||
    (c.nom === user.nom && c.prenom === user.prenom)
  );
  if (contact) {
    selectContact(contact);
  }
  showForm.value = true;
  activeMenu.value = null;
}

async function handleSubmit() {
  try {
    if (!selectedContact.value) {
      showMessage('Veuillez sélectionner un contact', 'error');
      return;
    }

    if (editingUser.value) {
      // Logique de mise à jour
      const index = users.value.findIndex(u => u.id === editingUser.value.id);
      users.value[index] = {
        ...editingUser.value,
        nom: selectedContact.value.nom,
        prenom: selectedContact.value.prenom,
        email: selectedContact.value.email
      };
      showMessage('Utilisateur modifié avec succès');
    } else {
      // Logique d'ajout
      users.value.push({
        id: Date.now(),
        nom: selectedContact.value.nom,
        prenom: selectedContact.value.prenom,
        email: selectedContact.value.email
      });
      showMessage('Utilisateur ajouté avec succès');
    }

    toggleForm();
    await initDataTable();
  } catch (error) {
    showMessage('Une erreur est survenue', 'error');
  }
}

// Gestion de la suppression
function confirmDelete(userIds) {
  selectedUsers.value = userIds;
  showDeleteModal.value = true;
}

async function deleteUsers() {
  try {
    users.value = users.value.filter(user => !selectedUsers.value.includes(user.id));
    showMessage('Suppression effectuée avec succès', 'success');

    selectedUsers.value = [];
    showDeleteModal.value = false;

    await initDataTable();
  } catch (error) {
    console.error("Erreur lors de la suppression:", error);
    showMessage('Échec de la suppression', 'error');
  }
}

function closeModal() {
  showDeleteModal.value = false;
  selectedUsers.value = [];
}

// Chargement initial des données
async function fetchUsers() {
  try {
    isLoading.value = true;
    // Simuler un appel API (à remplacer par votre vrai appel API)
    await new Promise(resolve => setTimeout(resolve, 1000));

    users.value = [
      { id: 1, nom: 'Dupont', prenom: 'Jean', email: 'jean.dupont@email.com' },
      { id: 2, nom: 'Martin', prenom: 'Sophie', email: 'sophie.martin@email.com' },
      { id: 3, nom: 'Bernard', prenom: 'Pierre', email: 'pierre.bernard@email.com' },
    ];

    await initDataTable();
  } catch (error) {
    console.error("Erreur lors du chargement des utilisateurs:", error);
    showMessage('Erreur lors du chargement des données', 'error');
  } finally {
    isLoading.value = false;
  }
}

// Gestionnaires d'événements pour les clics extérieurs
document.addEventListener('click', (event) => {
  const target = event.target as HTMLElement;
  if (target && !target.closest('.relative')) {
    activeMenu.value = null;
    showOptions.value = false;
  }
});

// Initialisation au montage du composant
onMounted(() => {
  fetchUsers();
  filterContacts(); // Initialiser la liste filtrée
});
</script>

<style scoped>
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}

.alert-enter-active,
.alert-leave-active {
  transition: all 0.3s ease;
}

.alert-enter-from,
.alert-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

.animate-pulse .bg-gray-200,
.animate-pulse .bg-gray-300 {
  background-color: #e5e7eb;
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}
</style>
