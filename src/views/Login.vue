<template>
  <div class="flex items-center justify-center h-screen px-6 bg-login">
    <div class="w-full max-w-sm p-6 bg-white rounded-md shadow-md">
      <!-- Logo et titre -->
      <div class="flex items-center justify-center p-6">
        <svg
          class="w-10 h-10"
          viewBox="0 0 512 512"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M364.61 390.213C304.625 450.196 207.37 450.196 147.386 390.213C117.394 360.22 102.398 320.911 102.398 281.6C102.398 242.291 117.394 202.981 147.386 172.989C147.386 230.4 153.6 281.6 230.4 307.2C230.4 256 256 102.4 294.4 76.7999C320 128 334.618 142.997 364.608 172.989C394.601 202.981 409.597 242.291 409.597 281.6C409.597 320.911 394.601 360.22 364.61 390.213Z"
            fill="#4C51BF"
            stroke="#4C51BF"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M201.694 387.105C231.686 417.098 280.312 417.098 310.305 387.105C325.301 372.109 332.8 352.456 332.8 332.8C332.8 313.144 325.301 293.491 310.305 278.495C295.309 263.498 288 256 275.2 230.4C256 243.2 243.201 320 243.201 345.6C201.694 345.6 179.2 332.8 179.2 332.8C179.2 352.456 186.698 372.109 201.694 387.105Z"
            fill="white"
          />
        </svg>
        <span class="text-2xl font-semibold text-gray-700">WAME-APP</span>
      </div>

      <!-- Formulaire de connexion -->
      <form class="mt-4" @submit.prevent="handleLogin">
        <!-- Email -->
        <label class="block">
          <span class="text-lg text-black">Email</span>
          <input
            v-model="email"
            type="email"
            :disabled="isLoading"
            class="block w-full mt-2 border-gray-600 rounded-md focus:border-indigo-600 focus:ring focus:ring-opacity-40 focus:ring-indigo-500"
            :class="{ 'opacity-50 cursor-not-allowed': isLoading }"
          >
        </label>

        <!-- Mot de passe -->
        <label class="block mt-3">
          <span class="text-sm text-gray-700">Password</span>
          <input
            v-model="password"
            type="password"
            :disabled="isLoading"
            class="block w-full mt-1 border-gray-200 rounded-md focus:border-indigo-600 focus:ring focus:ring-opacity-40 focus:ring-indigo-500"
            :class="{ 'opacity-50 cursor-not-allowed': isLoading }"
          >
        </label>

        <!-- Options de connexion -->
        <div class="flex items-center justify-between mt-4">
          <div>
            <label class="inline-flex items-center">
              <input
                type="checkbox"
                v-model="rememberMe"
                :disabled="isLoading"
                class="text-indigo-600 border-gray-200 rounded-md focus:border-indigo-600 focus:ring focus:ring-opacity-40 focus:ring-indigo-500"
              >
              <span class="mx-2 text-sm text-gray-600">Remember me</span>
            </label>
          </div>

          <div>
            <a
              class="block text-sm text-indigo-700 hover:underline"
              href="#"
            >Forgot your password?</a>
          </div>
        </div>

        <!-- Bouton de connexion -->
        <div class="mt-6">
          <button
            type="submit"
            :disabled="isLoading"
            class="w-full px-4 py-2 text-sm text-center text-white bg-indigo-600 rounded-md focus:outline-none hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <template v-if="isLoading">
              <svg class="inline w-4 h-4 mr-2 animate-spin" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"/>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
              </svg>
              Connexion en cours...
            </template>
            <template v-else>
              Se connecter
            </template>
          </button>
        </div>
      </form>

      <!-- Message d'alerte -->
      <TransitionGroup name="fade">
        <div
          v-if="alert"
          :key="alert.message"
          :class="[
            'mt-4 p-2 rounded text-white text-center',
            alert.type === 'success' ? 'bg-green-500' : 'bg-red-500'
          ]"
        >
          {{ alert.message }}
        </div>
      </TransitionGroup>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { LoginAdapter } from '@/data/login/LoginAdapter';

const router = useRouter();
const email = ref('');
const password = ref('');
const rememberMe = ref(false);
const isLoading = ref(false);
const alert = ref<{ type: string; message: string } | null>(null);

const handleLogin = async () => {
  // Réinitialiser l'état
  alert.value = null;
  isLoading.value = true;

  try {
    const loginAdapter = new LoginAdapter(0, null, '', '', email.value, password.value);

    // Valider les données avant l'envoi
    loginAdapter.validateLoginData();

    // Tentative de connexion
    const response = await loginAdapter.login();

    // Si la connexion réussit
    if (response) {
      // Sauvegarder dans le localStorage si "Remember me" est coché
      if (rememberMe.value) {
        localStorage.setItem('userEmail', email.value);
      }

      alert.value = {
        type: 'success',
        message: 'Connexion réussie !'
      };

      // Attendre un peu pour montrer le message de succès
      setTimeout(async () => {
        await router.push('/dashboard');
      }, 1000);
    }
  } catch (error) {
    // Gestion des différents types d'erreurs
    const errorMessage = error instanceof Error ? error.message : 'An error has occurred';
    alert.value = {
      type: 'error',
      message: errorMessage
    };
  } finally {
    isLoading.value = false;
  }
};

// Charger l'email sauvegardé si disponible
if (localStorage.getItem('userEmail')) {
  email.value = localStorage.getItem('userEmail') || '';
  rememberMe.value = true;
}
</script>

<style scoped>
.bg-login {
  background-image: url('@/assets/images/background.jpg');
  background-size: cover;
  background-position: center;
}
/**

.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

 */
</style>
