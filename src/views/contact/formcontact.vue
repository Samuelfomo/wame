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

  <div class="p-10 bg-gray-100 border-blue-600 border-2 rounded-lg min-h-screen">
    <div class="flex items-center justify-center py-10">
      <div class="bg-white shadow-lg rounded-lg p-8 w-full max-w-6xl">
        <h2 class="text-3xl font-bold text-gray-800 mb-6">Ajouter un Contact</h2>

        <form @submit.prevent="registerOrUpdateContact" class="grid grid-cols-2 gap-6">

        <!-- Nom de famille -->
        <div class="flex items-center">
          <i class="fas fa-user text-gray-400"></i>&nbsp;&nbsp;
          <label for="lastname" class="w-24 text-gray-600">Nom</label>
          <select v-model="gender" id="gender" class="border border-gray-300 p-2 focus:outline-none focus:border-indigo-500">
            <option disabled value="" >Genre</option>
            <option value="m" >Mn</option>
            <option value="f">Mne</option>
          </select>&nbsp;&nbsp;
          <input v-model="lastname" type="text" id="lastname" placeholder="Doe" class="flex-1 border border-gray-300 rounded-lg p-2 focus:outline-none focus:border-indigo-500">
        </div>

        <!-- Prénom -->
        <div class="flex items-center">
          <i class="fas fa-user text-gray-400"></i>&nbsp;&nbsp;
          <label for="firstname" class="w-24 text-gray-600">Prénom</label>
          <input v-model="firstname" type="text" id="firstname" placeholder="John" class=" flex-1 border border-gray-300 rounded-lg p-2 focus:outline-none focus:border-indigo-500">
        </div>

        <!-- Mobile -->
        <div class="flex items-center">
          <i class="fas fa-phone text-gray-400"></i>&nbsp;&nbsp;
          <label for="mobile" class="w-24 text-gray-600">Mobile</label>
          <input v-model="mobile" type="tel" id="mobile" placeholder="06 12 34 56 78" class="flex-1 border border-gray-300 rounded-lg p-2 focus:outline-none focus:border-indigo-500">
        </div>

        <!-- WhatsApp -->
        <div class="flex items-center">
          <i class="fab fa-whatsapp text-gray-400"></i>&nbsp;&nbsp;
          <label for="whatsapp" class="w-24 text-gray-600">WhatsApp</label>
          <input v-model="whatsapp" type="tel" id="whatsapp" placeholder="06 12 34 56 78" class="flex-1 border border-gray-300 rounded-lg p-2 focus:outline-none focus:border-indigo-500">
        </div>

        <!-- Email -->
        <div class="flex items-center">
          <i class="fas fa-envelope text-gray-400"></i>&nbsp;&nbsp;
          <label for="email" class="w-24 text-gray-600">Email</label>
          <input v-model="email" type="email" id="email" placeholder="john.doe@example.com" class="flex-1 border border-gray-300 rounded-lg p-2 focus:outline-none focus:border-indigo-500">
        </div>

        <!-- Langue -->
        <div class="flex items-center">
          <i class="fas fa-language text-gray-400"></i>&nbsp;&nbsp;
          <label for="language" class="w-24 text-gray-600">Langue</label>
          <select v-model="language" id="language" class="flex-1 border border-gray-300 rounded-lg p-2 focus:outline-none focus:border-indigo-500">
            <option disabled value="">Sélectionnez</option>
            <option value="en">English</option>
            <option value="fr">French</option>
          </select>
        </div>

        <!-- Localisation -->
        <div class="flex items-center">
          <i class="fas fa-map-marker-alt text-gray-400"></i>&nbsp;&nbsp;
          <label for="location" class="w-24 text-gray-600">Localisation</label>
          <input v-model="location" type="text" id="location" placeholder="Paris" class="flex-1 border border-gray-300 rounded-lg p-2 focus:outline-none focus:border-indigo-500">
        </div>


        <!-- Qualifié -->
        <div class="flex items-center">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <label for="qualified" class="w-24 text-gray-600">Qualifié</label>
          <input v-model="qualified" type="checkbox" id="qualified" class="h-5 w-5 text-indigo-600 border-gray-300 rounded">
        </div>


        <!-- Bouton d'envoi -->
        <div class="col-span-2 text-right">
          <button class="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200">
            Enregistrer
          </button>
        </div>

      </form>
    </div>
  </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { saveContact } from "@/data/contact/service/contactService";
import type { Alert, Response } from "@/data/contact/service/model/contactApiModel";

import { useRouter } from 'vue-router';



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
const alerts = ref<Alert[]>([]);

const router = useRouter();

async function registerOrUpdateContact() {
  if (!lastname.value || !mobile.value) {
    showMessage("Les champs 'Nom' et 'Mobile' sont obligatoires.");
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
    const savedContact = await saveContact(postData);
    if (savedContact) {
      showMessage('Enregistrement réussi');

      firstname.value = '';
      lastname.value = '';
      mobile.value = null;
      email.value = '';
      whatsapp.value = null;
      location.value = '';
      gender.value = '';
      language.value = '';
      guid.value = null;
      qualified.value=false;

      // await router.push('/contact');

    } else {
      showMessage("Enregistrement échoué", 'error');
    }
  } catch (error) {
    showMessage("Erreur lors de l'enregistrement du contact", 'error');
  }
}

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

const props = defineProps({
  contact: {
    type: Object,
    required: false,
  },
});

if (props.contact) {
  guid.value = props.contact.guid;
  firstname.value = props.contact.firstname;
  lastname.value = props.contact.lastname;
  mobile.value = props.contact.mobile;
  whatsapp.value = props.contact.whatsapp;
  email.value = props.contact.email;
  location.value = props.contact.location;
  gender.value = props.contact.gender;
  language.value = props.contact.language;
  qualified.value = props.contact.qualified;
}

</script>

<style scoped>
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css');
/* Design propre et sobre, sans fond coloré */
</style>

