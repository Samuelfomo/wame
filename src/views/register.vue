<script setup lang="ts">
import { ref } from 'vue'
const name = ref('');
const Register = () => {
  console.log(name.value);
}

</script>

<template>

  <div class="container flex flex-col items-center">
  <div>
    <form @submit.prevent="Register">

      <div>
        <label for="name">Name</label>
        <select name="name" id="name" v-model="name">
          <option value="">selected</option>
          <option value="1">1</option>
          <option value="2">2</option>
        </select>
      </div> <br/>
      <div>
        <button type="submit">Creer</button>
      </div>

    </form>
  </div>
  </div>

</template>

<style scoped>

</style>
