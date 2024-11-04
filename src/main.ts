// // import './assets/main.css'
// //
// // import { createApp } from 'vue'
// // import { createPinia } from 'pinia'
// //
// // import App from './App.vue'
// // import router from './router'
// //
// // const app = createApp(App)
// //
// // app.use(createPinia())
// // app.use(router)
// //
// // app.mount('#app')
// //
//
// // Importation du fichier CSS principal
// import './assets/main.css'
//
// // Importation des fonctions nécessaires de Vue et Pinia
// import { createApp } from 'vue'
// import { createPinia } from 'pinia'
//
// // Importation du composant principal de l'application
// import App from './App.vue'
//
// // Importation du routeur
// import router from './router'
//
// // Création de l'application Vue
// const app = createApp(App)
//
// // Installation de Pinia comme gestionnaire d'état
// app.use(createPinia())
//
// // Installation du routeur
// app.use(router)
//
// // Montage de l'application sur l'élément avec l'ID 'app'
// app.mount('#app')

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './assets/main.css'
import $ from 'jquery';

window.$ = $;
window.jQuery = $;

import DashboardLayout from './components/layouts/DashboardLayout.vue'
import EmptyLayout from './components/layouts/EmptyLayout.vue'

const app = createApp(App)

app.component('DefaultLayout', DashboardLayout)
app.component('EmptyLayout', EmptyLayout)

app.use(router)
app.mount('#app')
