<template>
    <div>
      <h3 class="text-3xl font-semibold text-gray-700">
        Forms
      </h3>
      <div class="mt-8">
        <h4 class="text-gray-600">
         Contact Forms
        </h4>

        <div class="mt-4">
          <div class="p-6 bg-white rounded-md shadow-md">
            <h2 class="text-lg font-semibold text-gray-700 capitalize">
              contact
            </h2>

            <form @submit.prevent="registerContact" class="border: bg-white">
              <div class="grid grid-cols-1 gap-6 mt-4 sm:grid-cols-2">
                <div>
                  <label class="text-gray-700" for="firstname">Firstname</label>
                  <input
                    v-model="contact.firstname"
                    class="w-full mt-2 border-gray-200 rounded-md focus:border-indigo-600 focus:ring focus:ring-opacity-40 focus:ring-indigo-500"
                    type="text"
                    style="border: solid black 1px"
                    id="firstname"
                  >
                </div>

                <div>
                  <label class="text-gray-700" for="firstname">Lastname</label>
                  <input
                    v-model="contact.lastname"
                    class="w-full mt-2 border-gray-200 rounded-md focus:border-indigo-600 focus:ring focus:ring-opacity-40 focus:ring-indigo-500"
                    type="text"
                    style="border: solid black 1px"
                    id="lastname"
                  >
                </div>

                <div>
                  <label class="text-gray-700" for="mobile">Mobile</label>
                  <input
                  v-model="contact.mobile"
                  class="w-full mt-2 border-gray-200 rounded-md focus:border-indigo-600 focus:ring focus:ring-opacity-40 focus:ring-indigo-500"
                  type="text"
                  style="border: solid black 1px"
                  id="mobile"
                  >
                </div>

                <div>
                  <label class="text-gray-700" for="emailAddress">Email Address</label>
                  <input
                    v-model="contact.email"
                    class="w-full mt-2 border-gray-200 rounded-md focus:border-indigo-600 focus:ring focus:ring-opacity-40 focus:ring-indigo-500"
                    type="email"
                    style="border: solid black 1px"
                    id="email"
                  >
                </div>

                <div>
                  <label class="text-gray-700" for="whatsapp">Whatsapp</label>
                  <input
                  v-model="contact.whatsapp"
                  class="w-full mt-2 border-gray-200 rounded-md focus:border-indigo-600 focus:ring focus:ring-opacity-40 focus:ring-indigo-500"
                  type="text"
                  style="border: solid black 1px"
                  id="whatsapp"
                  >
                </div>

                <div>
                  <label class="text-gray-700" for="location">City</label>
                  <input
                    v-model="contact.location"
                    class="w-full mt-2 border-gray-200 rounded-md focus:border-indigo-600 focus:ring focus:ring-opacity-40 focus:ring-indigo-500"
                    type="text"
                    style="border: solid black 1px"
                    id="location"
                  >
                </div>


                <div>
                  <label class="text-gray-700" for="language">Language</label>
                  <select
                    v-model="contact.language"
                    class="w-full mt-2 border-gray-200 rounded-md focus:border-indigo-600 focus:ring focus:ring-opacity-40 focus:ring-indigo-500"
                    type="text"
                    style="border: solid black 1px"
                    id="language"
                  >
                    <option value="en">English</option>
                    <option value="fr">French</option>
                  </select>
                </div>

                <div>
                  <label class="text-gray-700" for="gender">Gender</label>
                  <select
                    v-model="contact.gender"
                    class="w-full mt-2 border-gray-200 rounded-md focus:border-indigo-600 focus:ring focus:ring-opacity-40 focus:ring-indigo-500"
                    type="text"
                    style="border: solid black 1px"
                    id="gender"
                  >
                    <option value="m">Homme</option>
                    <option value="f">Femme</option>
                  </select>
                </div>

                <div>
                  <label class="text-gray-700" for="qualified">Qualified</label>
                  <select
                    v-model="contact.qualified"
                    class="w-full mt-2 border-gray-200 rounded-md focus:border-indigo-600 focus:ring focus:ring-opacity-40 focus:ring-indigo-500"
                    type="text"
                    style="border: solid black 1px"
                  >
                    <option value="true">Oui</option>
                    <option value="false">Non</option>
                  </select>
                </div>
              </div>

              <div class="flex justify-end mt-4">

                <button type="submit" class="inline-flex items-center px-5 py-2.5 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300">
                  Enregistrer
                </button>
              </div>
            </form>
            <p v-if="message" class="mt-4 text-green-600 text-center">{{ message }}</p>

          </div>
        </div>
      </div>
    </div>

</template>


<script>
import axios from 'axios';
export default {
  data() {
    return {
      contact: {
        firstname: '',
        lastname: '',
        mobile: '',
        email: '',
        whatsapp: '',
        location: '',
        language: 'en',
        gender: 'm',
        qualified: false,
      },
      message: '',
    };
  },
  methods: {
    async registerContact() {
      try {
        const response = await axios.post('http://192.168.100.103:3000/contact/add', this.contact);
        this.message = response.data.message || 'Contact enregistré avec succès';

        // Réinitialiser les champs du formulaire
        this.contact = {
          firstname: '',
          lastname: '',
          mobile: '',
          email: '',
          whatsapp: '',
          location: '',
          language: 'en',
          gender: 'm',
          qualified: false,
        };
      } catch (error) {
        console.error("Erreur lors de l'enregistrement du contact :", error);
        this.message = error.response?.data?.message || "Une erreur s'est produite";
      }
    },
  },
};
</script>
