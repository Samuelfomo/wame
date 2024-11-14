//
//
// import { createRouter, createWebHistory } from 'vue-router';
//
// /**
//  * section lexicon router
//  */
// import LexiconAdd from '../components/lexicon/form-contact.vue';
// import LexiconList from '../components/lexicon/list_lexicon.vue';
// import Home from '../components/layouts/home.vue';
// import Dashboard from "@/components/layouts/dashboard.vue";
// import Dashboard_lexicon from "@/components/dashboard-contact.vue";
//
// /**
//  * section contact router
//  */
// import SaveContact from "@/components/contact/contact-form.vue";
// import Dashboard_saveCt from "@/components/dashboard-savect.vue";
//
// const routes = [
//   /**
//    * routes path for lexicon
//    */
//   {path: '/dashboard-lexicon', component: Dashboard_lexicon},
//   { path: '/home', component: Home },
//   { path: '/', redirect: '/dashboard' },
//   { path: '/lexicon-add', component: LexiconAdd},
//   { path: '/list', component: LexiconList},
//   {path: '/dashboard', component: Dashboard},
//
//   /**
//    * routes path for contact
//    */
//   {path: '/contact-add', component: SaveContact},
//   {path: '/contact-save', component: Dashboard_saveCt},
// ];
//
// const router = createRouter({
//   history: createWebHistory(),
//   routes,
// });
//
// export default router;
//

import type { RouteRecordRaw } from 'vue-router'
import { createRouter, createWebHistory } from 'vue-router'

import Dashboard from '../views/Dashboard.vue'
import Forms from '../views/Forms.vue'
import Lexicon from '../views/lexicon.vue'
import Contact from '../views/contact/contact.vue'
import Login from '../views/Login.vue'
import Modal from '../views/Modal.vue'
import Card from '../views/Card.vue'
import Blank from '@/views/Blank.vue'
import FormContact from '@/views/contact/formcontact.vue'


const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Login',
    component: Login,
    meta: { layout: 'empty' },
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
  },
  {
    path: '/forms',
    name: 'Forms',
    component: Forms,
  },
  {
    path: '/cards',
    name: 'Cards',
    component: Card,
  },
  {
    path: '/lexicon',
    name: 'Lexicon',
    component: Lexicon,
  },
  {
    path: '/contact',
    name: 'Contact',
    component: Contact,
  },
  {
    path: '/modal',
    name: 'Modal',
    component: Modal,
  },
  {
    path: '/blank',
    name: 'Blank',
    component: Blank,
  }, {
    path: '/formcontact',
    name: 'FormContact',
    component: FormContact,
  },

]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
