<template>
  <div class="bg-gray-100 min-h-screen py-8 px-4 sm:px-6 lg:px-8">
    <div class="max-w-4xl mx-auto">
      <!-- Header -->
      <h1 class="text-3xl font-bold text-gray-800 mb-6 text-center">Gestion des Contacts</h1>

      <!-- Search and Add Contact Button -->
      <div class="flex justify-between mb-6">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Rechercher un contact..."
          class="w-full sm:w-2/3 px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
        />
        <button
          @click="openContactModal()"
          class="ml-4 px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600"
        >
          + Ajouter Contact
        </button>
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
        <p v-if="!paginatedContacts.length" class="text-center py-4 text-gray-500">Aucun contact trouvé.</p>
      </div>

      <!-- Pagination Controls -->
      <div class="flex justify-center space-x-2 mt-4">
        <button
          @click="previousPage"
          :disabled="currentPage === 1"
          class="px-4 py-2 bg-gray-300 text-gray-700 font-semibold rounded-lg shadow-md hover:bg-gray-400"
        >
          Précédent
        </button>
        <button
          @click="nextPage"
          :disabled="currentPage === totalPages"
          class="px-4 py-2 bg-gray-300 text-gray-700 font-semibold rounded-lg shadow-md hover:bg-gray-400"
        >
          Suivant
        </button>
      </div>

      <!-- Contact Form Modal -->
      <div v-if="isModalOpen" class="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
        <div class="bg-white p-6 rounded-lg shadow-lg w-11/12 sm:w-1/2">
          <h2 class="text-2xl font-semibold mb-4">{{ editing ? "Modifier le Contact" : "Ajouter un Contact" }}</h2>
          <form @submit.prevent="saveContact">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label class="block text-sm font-medium text-gray-700">Prénom</label>
                <input
                  v-model="contactForm.firstname"
                  type="text"
                  required
                  class="mt-1 w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Nom</label>
                <input
                  v-model="contactForm.lastname"
                  type="text"
                  required
                  class="mt-1 w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Email</label>
                <input
                  v-model="contactForm.email"
                  type="email"
                  required
                  class="mt-1 w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Mobile</label>
                <input
                  v-model="contactForm.mobile"
                  type="tel"
                  required
                  class="mt-1 w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
                />
              </div>
            </div>
            <div class="flex justify-end">
              <button
                type="submit"
                class="px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600"
              >
                {{ editing ? "Mettre à Jour" : "Ajouter" }}
              </button>
              <button
                @click="closeModal"
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
      contacts: [], // Chargez les contacts via une API ou autre source de données
      contactForm: {
        id: null,
        firstname: "",
        lastname: "",
        email: "",
        mobile: ""
      },
      searchQuery: "",
      editing: false,
      isModalOpen: false,
      currentPage: 1,
      pageSize: 10,
    };
  },
  computed: {
    filteredContacts() {
      return this.contacts.filter(contact =>
        contact.firstname.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        contact.lastname.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        contact.email.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
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
    openContactModal() {
      this.resetForm();
      this.isModalOpen = true;
    },
    closeModal() {
      this.isModalOpen = false;
      this.resetForm();
    },
    saveContact() {
      if (this.editing) {
        const index = this.contacts.findIndex(c => c.id === this.contactForm.id);
        if (index !== -1) this.contacts.splice(index, 1, { ...this.contactForm });
      } else {
        this.contacts.push({ ...this.contactForm, id: Date.now() });
      }
      this.closeModal();
    },
    editContact(contact) {
      this.contactForm = { ...contact };
      this.editing = true;
      this.isModalOpen = true;
    },
    deleteContact(id) {
      this.contacts = this.contacts.filter(contact => contact.id !== id);
    },
    resetForm() {
      this.contactForm = { id: null, firstname: "", lastname: "", email: "", mobile: "" };
      this.editing = false;
    },
    nextPage() {
      if (this.currentPage < this.totalPages) this.currentPage++;
    },
    previousPage() {
      if (this.currentPage > 1) this.currentPage--;
    }
  }
};
</script>

<style scoped>
body {
  font-family: 'Inter', sans-serif;
}
</style>
