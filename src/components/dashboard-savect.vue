<template>
  <div>
    <Header />
    <div class="flex justify-around p-6">
      <Dashboard /> <!-- Si vous avez un tableau de bord à afficher -->
      <RegisterForm />
    </div>
  </div>
</template>

<script setup>
import Dashboard from './layouts/dashboard.vue' // Si nécessaire
import RegisterForm from './contact/contact-form.vue'
</script>

<style scoped>
/* Styles pour le composant parent */
</style>

