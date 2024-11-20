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
  <div class="p-10 bg-gray-100 border-blue-600 border-2 rounded-lg min-h-screen" hidden="hidden"></div>

  <div>
    <div class="flex items-center justify-center py-10">
      <div class="bg-white shadow-lg rounded-lg p-8 w-full max-w-6xl">

        <h2 class="text-3xl font-bold text-gray-800 mb-6">{{guid ? 'Modifier le Contact': 'Ajouter un Contact'}}</h2>

        <form @submit.prevent="registerOrUpdateContact">
          <div class="grid grid-cols-1 gap-6 mt-4 sm:grid-cols-2">

          <div class="flex items-center">
            <i class="fas fa-user text-gray-400"></i>&nbsp;&nbsp;
            <label for="lastname" class="w-24 text-gray-600">Nom</label>
            <div class="flex flex-col">
              <label class="flex items-center">
                <input v-model="gender" type="radio" value="m" class="mr-2" />
                Mn
              </label>
              <label class="flex items-center">
                <input v-model="gender" type="radio" value="f" class="mr-2" />
                Mne
              </label>
            </div>
            &nbsp;&nbsp;
            <input v-model="lastname" type="text" id="lastname" placeholder="Doe"
              class="flex-1 border border-gray-300 rounded-lg p-2 focus:outline-none focus:border-indigo-500"/>
          </div>


          <!-- Mobile -->
          <div class="flex items-center">
            <i class="fas fa-phone text-gray-400"></i>&nbsp;&nbsp;
            <label for="mobile" class="w-24 text-gray-600">Mobile</label>
            <input v-model="mobile" type="tel" id="mobile" placeholder="06 12 34 56 78" class="flex-1 border border-gray-300 rounded-lg p-2 focus:outline-none focus:border-indigo-500">
          </div>

          <!-- Prénom -->
        <div class="flex items-center">
          <i class="fas fa-user text-gray-400"></i>&nbsp;&nbsp;
          <label for="firstname" class="w-24 text-gray-600">Prénom</label>
          <input v-model="firstname" type="text" id="firstname" placeholder="John" class=" flex-1 border border-gray-300 rounded-lg p-2 focus:outline-none focus:border-indigo-500">
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
    </div>
          <br/><br/>

        <!-- Bouton-->
        <div class="col-span-2 text-right">
          <!-- Bouton d'envoi -->
          <button class="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200">
            Enregistrer
          </button>
        </div>

      </form>
        <!-- Bouton annule -->
        <div class="col-span-2 text-right">
          <button class="px-4 py-2 bg-red-600 font-semibold text-white rounded hover:bg-red-800 float-left" @click="guid ? router.push('/contact') : clearForm()" style="margin-top: -42px">
            Annuler
          </button>
        </div>
    </div>
  </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import type { Alert } from "@/data/contact/service/model/contactApiModel";
import { useRouter, useRoute } from 'vue-router';
import {Contact} from "@/data/contact/model/Contact";


const router = useRouter();
const route = useRoute();

const guid = ref<number | null>(null);
const firstname = ref('');
const lastname = ref('');
const mobile = ref<number | null>(null);
const email = ref('');
const whatsapp = ref<number | null>(null);
const location = ref('');
const gender = ref('');
const language = ref('');

const qualified = ref(false);
const alerts = ref<Alert[]>([]);


async function registerOrUpdateContact(){
  const contact = new Contact(
    firstname.value,
    lastname.value,
    mobile.value,
    whatsapp.value,
    email.value,
    gender.value ,
    language.value,
    location.value,
    qualified.value,
    new Date() || undefined,
    undefined,
    undefined,
    guid.value || null
  );

  try {
    const savedContact = await contact.saveOrUpdateContact();
    if (savedContact) {
      showMessage(guid.value ? 'Modification réussie' : 'Enregistrement réussi');
      if (guid.value) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        await router.push('/contact');
      } else {
        await clearForm();
      }
    }
  } catch (error: unknown) {
    const message=(error as Error).message || "Erreur lors de l'opération";
    showMessage(message,'error');
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

const loadContactData = async (guidParam: number) => {
  try {
    const contact = new Contact('', '', null, null, '', '', '', '', false, undefined, undefined, undefined, guidParam);
    const success = await contact.loadContactData();

    if (success) {
      guid.value = contact.guid;
      firstname.value = contact.firstname;
      lastname.value = contact.lastname;
      mobile.value = contact.mobile;
      whatsapp.value = contact.whatsapp;
      email.value = contact.email;
      location.value = contact.location;
      gender.value = contact.gender;
      language.value = contact.language;
      qualified.value = contact.qualified;
    }
  } catch (error) {
    showMessage("Erreur lors du chargement du contact", 'error');
  }
};

onMounted(async () => {
  const guidFromQuery = route.query.guid as string;
  if (guidFromQuery) {
    await loadContactData(Number(guidFromQuery));
  }
});

async function clearForm(){
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
}

</script>

<style scoped>
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css');
</style>
