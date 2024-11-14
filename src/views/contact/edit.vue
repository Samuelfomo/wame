<template>
  <div class="flex items-center justify-center py-10">
    <div class="bg-white shadow-lg rounded-lg p-6 w-full max-w-5xl">
      <h2 class="text-2xl font-bold text-gray-800 mb-4">Ajouter un Contact</h2>
      <form @submit.prevent="onSubmit" class="grid grid-cols-2 gap-4">

        <!-- Prénom -->
        <div class="flex items-center">
          <i class="fas fa-user text-gray-400"></i>&nbsp;&nbsp;
          <label for="firstname" class="w-24 text-gray-600">Prénom</label>
          <input v-model="firstname" type="text" id="firstname" placeholder="John" class=" flex-1 border border-gray-300 rounded-lg p-2 focus:outline-none focus:border-indigo-500">
        </div>

        <!-- Nom de famille -->
        <div class="flex items-center">
          <i class="fas fa-user text-gray-400"></i>&nbsp;&nbsp;
          <label for="lastname" class="w-24 text-gray-600">Nom</label>
          <select v-model="gender" id="gender" class="border border-gray-300 p-2 focus:outline-none focus:border-indigo-500">
            <option value="male">M</option>
            <option value="female">F</option>
          </select>&nbsp;&nbsp;
          <input v-model="lastname" type="text" id="lastname" placeholder="Doe" class="flex-1 border border-gray-300 rounded-lg p-2 focus:outline-none focus:border-indigo-500">
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

        <!-- Genre -->
<!--        <div class="flex items-center">-->
<!--          <i class="fas fa-venus-mars text-gray-400"></i>&nbsp;&nbsp;-->
<!--          <label for="gender" class="w-24 text-gray-600">Genre</label>-->
<!--          <select v-model="gender" id="gender" class="flex-1 border border-gray-300 rounded-lg p-2 focus:outline-none focus:border-indigo-500">-->
<!--            <option disabled value="">Sélectionnez</option>-->
<!--            <option value="male">Homme</option>-->
<!--            <option value="female">Femme</option>-->
<!--            <option value="other">Autre</option>-->
<!--          </select>-->
<!--        </div>-->

                <!-- Langue -->
                <div class="flex items-center">
                  <i class="fas fa-language text-gray-400"></i>&nbsp;&nbsp;
                  <label for="language" class="w-24 text-gray-600">Langue</label>
                  <input v-model="language" type="text" id="language" placeholder="Français" class="flex-1 border border-gray-300 rounded-lg p-2 focus:outline-none focus:border-indigo-500">
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
          <button type="submit" class="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200">
            Enregistrer
          </button>
        </div>

      </form>
    </div>
  </div>
</template>

<script>

</script>

<style scoped>
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css');
/* Design propre et sobre, sans fond coloré */
</style>
