<!-- src/components/form-contact.vue -->
<template>
  <div class="w-full max-w-2xl mx-auto p-6 bg-white shadow rounded-lg">
    <h2 class="text-2xl font-bold mb-4 text-center">Register Lexicon</h2>
    <form @submit.prevent="registerLexicon" class="form-container">

      <div class="mb-3">
        <label class="block font-medium" for="reference">Reference</label>
        <input v-model="reference" type="text" id="reference" class="w-full p-3 border rounded" />
      </div>

      <div class="mb-3">
        <label class="block font-medium" for="english">English</label>
        <input v-model="english" type="text" id="english" class="w-full p-3 border rounded" />
      </div>

      <div class="mb-3">
        <label class="block font-medium" for="french">French</label>
        <input v-model="french" type="text" id="french" class="w-full p-3 border rounded" />
      </div>

      <div class="mb-3">
        <label class="block font-medium" for="portable">Portable</label>
        <select v-model="portable" id="portable" class="w-full p-3 border rounded">
          <option :value="true">True</option>
          <option :value="false">False</option>
        </select>
      </div>

      <div class="mb-3">
        <input v-model="guid" type="hidden" id="guid" class="w-full p-3 border rounded" />
      </div>

      <button type="submit" class="inline-flex items-center px-5 py-2.5 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
        Register
        <span class="inline-flex items-center justify-center w-4 h-4 ms-2 text-xs font-semibold text-blue-800 bg-blue-200 rounded-full"> i
</span>
      </button>

    </form>

    <p v-if="message" class="mt-4 text-green-600 text-center">{{ message }}</p>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      guid: null,
      portable: false,
      french: '',
      english: '',
      reference: '',
      message: '',
      name: 'Header',

    };
  },
  // data() {
  //   return {
  //     reference: '',
  //     english: '',
  //     french: '',
  //     portable: '',
  //     guid: null,
  //     message: ''
  //   };
  // },
  methods: {
    async registerLexicon() {
      try {
        const response = await axios.post('http://192.168.100.103:3000/lexicon/add', {
          reference: this.reference,
          english: this.english,
          french: this.french,
          portable: this.portable,
          guid: this.guid
        });

        this.message = response.data.message || 'Lexicon registered successfully';

        // Clear form fields
        this.reference = '';
        this.english = '';
        this.french = '';
        this.portable = '';
        this.guid = '';
      } catch (error) {
        console.error("Error registering lexicon:", error);
        this.message = error.response?.data?.message || "An error occurred";
      }
    }
  }
};
</script>

<style scoped>
/* Styles pour améliorer la présentation du formulaire */
.form-container {
  max-width:100%;
  margin: auto;
}
</style>

