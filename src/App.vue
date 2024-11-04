<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'

const defaultLayout = 'default'

const { currentRoute } = useRouter()

const layout = computed(
  () => `${currentRoute.value.meta.layout || defaultLayout}-layout`,
)
</script>

<template>
  <component :is="layout">
    <router-view />
  </component>
</template>


<!--<script setup lang="ts">-->
<!--import { RouterLink, RouterView } from 'vue-router';-->
<!--</script>-->

<!--<template>-->
<!--&lt;!&ndash;  <header>&ndash;&gt;-->
<!--&lt;!&ndash;  <div class="wrapper">&ndash;&gt;-->
<!--&lt;!&ndash;    <nav>&ndash;&gt;-->
<!--&lt;!&ndash;      <RouterLink to="/home">Home</RouterLink>&ndash;&gt;-->
<!--&lt;!&ndash;      <RouterLink to="/">Home</RouterLink>&ndash;&gt;-->
<!--&lt;!&ndash;      <RouterLink to="/about">About</RouterLink>&ndash;&gt;-->
<!--&lt;!&ndash;      <RouterLink to="/list">Lexicon List</RouterLink>&ndash;&gt;-->
<!--&lt;!&ndash;      <RouterLink to="/add">Lexicon Save!</RouterLink>&ndash;&gt;-->
<!--&lt;!&ndash;    </nav>&ndash;&gt;-->
<!--&lt;!&ndash;  </div>&ndash;&gt;-->
<!--&lt;!&ndash;  </header>&ndash;&gt;-->
<!--  &lt;!&ndash; Affiche le composant en fonction de la route &ndash;&gt;-->
<!--  <RouterView />-->
<!--</template>-->

<!--<style scoped>-->
<!--header {-->
<!--  line-height: 1.5;-->
<!--  max-height: 100vh;-->
<!--}-->

<!--nav {-->
<!--  width: 100%;-->
<!--  font-size: 12px;-->
<!--  text-align: center;-->
<!--  margin-top: 2rem;-->
<!--}-->

<!--nav a.router-link-exact-active {-->
<!--  color: var(&#45;&#45;color-text);-->
<!--}-->

<!--nav a.router-link-exact-active:hover {-->
<!--  background-color: transparent;-->
<!--}-->

<!--nav a {-->
<!--  display: inline-block;-->
<!--  padding: 0 1rem;-->
<!--  border-left: 1px solid var(&#45;&#45;color-border);-->
<!--}-->

<!--nav a:first-of-type {-->
<!--  border: 0;-->
<!--}-->

<!--@media (min-width: 1024px) {-->
<!--  header {-->
<!--    display: flex;-->
<!--    place-items: center;-->
<!--    padding-right: calc(var(&#45;&#45;section-gap) / 2);-->
<!--  }-->

<!--  .logo {-->
<!--    margin: 0 2rem 0 0;-->
<!--    width: 150px;-->
<!--    height: 150px;-->
<!--  }-->

<!--  body .wrapper {-->
<!--    display: flex;-->
<!--    place-items: flex-start;-->
<!--    flex-wrap: wrap;-->
<!--  }-->

<!--  nav {-->
<!--    text-align: left;-->
<!--    margin-left: -1rem;-->
<!--    font-size: 1rem;-->
<!--    padding: 1rem 0;-->
<!--    margin-top: 1rem;-->
<!--  }-->
<!--}-->
<!--</style>-->


