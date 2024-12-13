<script setup lang="ts">
import { ref } from 'vue'
import { useSidebar } from '@/composables/useSidebar'

const { isOpen } = useSidebar()
const isCollapsed = ref(false)
const activeClass = ref('bg-gray-600 bg-opacity-25 text-gray-100 border-gray-100')
const inactiveClass = ref('border-gray-900 text-gray-500 hover:bg-gray-600 hover:bg-opacity-25 hover:text-gray-100')

const toggleCollapse = () => {
  isCollapsed.value = !isCollapsed.value
}
</script>

<template>
  <div class="flex">
    <!-- Backdrop -->
    <div
      :class="isOpen ? 'block' : 'hidden'"
      class="fixed inset-0 z-20 transition-opacity bg-black opacity-50 lg:hidden"
      @click="isOpen = false"
    />
    <!-- End Backdrop -->

    <div
      :class="[
        isOpen ? 'translate-x-0 ease-out' : '-translate-x-full ease-in',
        isCollapsed ? 'w-20' : 'w-64',
      ]"
      class="fixed inset-y-0 left-0 z-30 overflow-y-auto transition-all duration-300 transform bg-gray-900 lg:translate-x-0 lg:static lg:inset-0"
    >
      <nobr>
      <div class="flex items-center justify-between mt-8 px-4">
        <div class="flex items-center">
          <svg
            class="w-12 h-12"
            viewBox="0 0 512 512"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M364.61 390.213C304.625 450.196 207.37 450.196 147.386 390.213C117.394 360.22 102.398 320.911 102.398 281.6C102.398 242.291 117.394 202.981 147.386 172.989C147.386 230.4 153.6 281.6 230.4 307.2C230.4 256 256 102.4 294.4 76.7999C320 128 334.618 142.997 364.608 172.989C394.601 202.981 409.597 242.291 409.597 281.6C409.597 320.911 394.601 360.22 364.61 390.213Z"
              fill="#0000FF"
              stroke="#0000FF"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M201.694 387.105C231.686 417.098 280.312 417.098 310.305 387.105C325.301 372.109 332.8 352.456 332.8 332.8C332.8 313.144 325.301 293.491 310.305 278.495C295.309 263.498 288 256 275.2 230.4C256 243.2 243.201 320 243.201 345.6C201.694 345.6 179.2 332.8 179.2 332.8C179.2 352.456 186.698 372.109 201.694 387.105Z"
              fill="white"
            />
          </svg>
          <span class="mx-4 text-2xl font-semibold text-white" v-show="!isCollapsed">WAME-APP</span>
        </div>
<!--         Bouton pour réduire/étendre -->
        <button
          @click="toggleCollapse"
          class="p-2 text-gray-400 hover:text-white focus:outline-none"
        >
          <svg
            class="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              v-if="!isCollapsed"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
            />
            <path
              v-else
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M13 5l7 7-7 7M5 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>
      </nobr>
      <nav class="mt-10">
        <router-link
          class="flex items-center px-6 py-2 mt-4 duration-200 border-l-4"
          :class="[$route.name === 'Dashboard' ? activeClass : inactiveClass]"
          to="/dashboard"
        >
          <svg
            class="w-5 h-5"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M2 10C2 5.58172 5.58172 2 10 2V10H18C18 14.4183 14.4183 18 10 18C5.58172 18 2 14.4183 2 10Z"
              fill="currentColor"
            />
            <path
              d="M12 2.25195C14.8113 2.97552 17.0245 5.18877 17.748 8.00004H12V2.25195Z"
              fill="currentColor"
            />
          </svg>

          <span class="mx-4" v-show="!isCollapsed">Menu</span>
        </router-link>

        <router-link
          class="flex items-center px-6 py-2 mt-4 duration-200 border-l-4"
          :class="[$route.name === 'Contact' ? activeClass : inactiveClass]"
          to="/contact"
        >
          <svg
            class="w-5 h-5"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M5 3C3.89543 3 3 3.89543 3 5V7C3 8.10457 3.89543 9 5 9H7C8.10457 9 9 8.10457 9 7V5C9 3.89543 8.10457 3 7 3H5Z"
              fill="currentColor"
            />
            <path
              d="M5 11C3.89543 11 3 11.8954 3 13V15C3 16.1046 3.89543 17 5 17H7C8.10457 17 9 16.1046 9 15V13C9 11.8954 8.10457 11 7 11H5Z"
              fill="currentColor"
            />
            <path
              d="M11 5C11 3.89543 11.8954 3 13 3H15C16.1046 3 17 3.89543 17 5V7C17 8.10457 16.1046 9 15 9H13C11.8954 9 11 8.10457 11 7V5Z"
              fill="currentColor"
            />
            <path
              d="M11 13C11 11.8954 11.8954 11 13 11H15C16.1046 11 17 11.8954 17 13V15C17 16.1046 16.1046 17 15 17H13C11.8954 17 11 16.1046 11 15V13Z"
              fill="currentColor"
            />
          </svg>

          <span class="mx-4" v-show="!isCollapsed">Contact</span>
        </router-link>

        <router-link
          class="flex items-center px-6 py-2 mt-4 duration-200 border-l-4"
          :class="[$route.name === 'Lexicon' ? activeClass : inactiveClass]"
          to="/lexicon"
        >
          <svg
            class="w-5 h-5"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M7 3C6.44772 3 6 3.44772 6 4C6 4.55228 6.44772 5 7 5H13C13.5523 5 14 4.55228 14 4C14 3.44772 13.5523 3 13 3H7Z"
              fill="currentColor"
            />
            <path
              d="M4 7C4 6.44772 4.44772 6 5 6H15C15.5523 6 16 6.44772 16 7C16 7.55228 15.5523 8 15 8H5C4.44772 8 4 7.55228 4 7Z"
              fill="currentColor"
            />
            <path
              d="M2 11C2 9.89543 2.89543 9 4 9H16C17.1046 9 18 9.89543 18 11V15C18 16.1046 17.1046 17 16 17H4C2.89543 17 2 16.1046 2 15V11Z"
              fill="currentColor"
            />
          </svg>

          <span class="mx-4" v-show="!isCollapsed">Lexicon</span>
        </router-link>

        <router-link
          class="flex items-center px-6 py-2 mt-4 duration-200 border-l-4"
          :class="[$route.name === 'Forms' ? activeClass : inactiveClass]"
          to="/forms"
        >
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z"
            />
            <path
              fill-rule="evenodd"
              d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"
              clip-rule="evenodd"
            />
          </svg>

          <span class="mx-4" v-show="!isCollapsed">Forms</span>
        </router-link>

        <router-link
          class="flex items-center px-6 py-2 mt-4 duration-200 border-l-4"
          :class="[$route.name === 'NewUser' ? activeClass : inactiveClass]"
          to="/user"
        >

          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-users-plus">
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M5 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0" />
            <path d="M3 21v-2a4 4 0 0 1 4 -4h4c.96 0 1.84 .338 2.53 .901" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            <path d="M16 19h6" />
            <path d="M19 16v6" />
          </svg>

          <span class="mx-4" v-show="!isCollapsed">New User</span>
        </router-link>

        <router-link
          class="flex items-center px-6 py-2 mt-4 duration-200 border-l-4"
          :class="[$route.name === 'Modal' ? activeClass : inactiveClass]"
          to="/modal"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M3 12v3c0 1.657 3.134 3 7 3s7-1.343 7-3v-3c0 1.657-3.134 3-7 3s-7-1.343-7-3z" />
            <path d="M3 7v3c0 1.657 3.134 3 7 3s7-1.343 7-3V7c0 1.657-3.134 3-7 3S3 8.657 3 7z" />
            <path d="M17 5c0 1.657-3.134 3-7 3S3 6.657 3 5s3.134-3 7-3 7 1.343 7 3z" />
          </svg>

          <span class="mx-4" v-show="!isCollapsed">Modal</span>
        </router-link>

        <router-link
          class="flex items-center px-6 py-2 mt-4 duration-200 border-l-4"
          :class="[$route.name === 'Blank' ? activeClass : inactiveClass]"
          to="/blank"
        >
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"
            />
          </svg>

          <span class="mx-4" v-show="!isCollapsed">Blank</span>
        </router-link>
      </nav>

      <div class="absolute bottom-90 w-full">
        <router-link
          class="flex items-center px-6 py-2 mt-4 duration-200 border-l-4 mb-4"
          :class="[$route.name === 'Modal' ? activeClass : inactiveClass]"
          to="/"
        >
          <svg class="svg-icon text-red-600 border-0.125rem" style="width: 1em; height: 1em;vertical-align: middle;fill: currentColor;
          overflow: hidden;" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg">
            <path d="M768 106V184c97.2 76 160 194.8 160 328 0 229.6-186.4 416-416 416S96 741.6 96 512c0-133.2 62.8-251.6 160-328V106C121.6 190.8 32 341.2 32 512c0 265.2 214.8 480 480 480s480-214.8 480-480c0-170.8-89.6-321.2-224-406z" fill="" />
            <path d="M512 32c-17.6 0-32 14.4-32 32v448c0 17.6 14.4 32 32 32s32-14.4 32-32V64c0-17.6-14.4-32-32-32z" fill="" />
          </svg>
          <span v-show="!isCollapsed" class="mx-4 text-blue-600">logout</span>
        </router-link>
      </div>
    </div>
  </div>
</template>



<!--<script setup lang="ts">-->
<!--import { ref } from 'vue'-->
<!--import { useSidebar } from '@/composables/useSidebar'-->

<!--const { isOpen } = useSidebar()-->
<!--const activeClass = ref(-->
<!--  'bg-gray-600 bg-opacity-25 text-gray-100 border-gray-100',-->
<!--)-->
<!--const inactiveClass = ref(-->
<!--  'border-gray-900 text-gray-500 hover:bg-gray-600 hover:bg-opacity-25 hover:text-gray-100',-->
<!--)-->
<!--</script>-->

<!--<template>-->
<!--  <div class="flex">-->
<!--    &lt;!&ndash; Backdrop &ndash;&gt;-->
<!--    <div-->
<!--      :class="isOpen ? 'block' : 'hidden'"-->
<!--      class="fixed inset-0 z-20 transition-opacity bg-black opacity-50 lg:hidden"-->
<!--      @click="isOpen = false"-->
<!--    />-->
<!--    &lt;!&ndash; End Backdrop &ndash;&gt;-->

<!--    <div-->
<!--      :class="isOpen ? 'translate-x-0 ease-out' : '-translate-x-full ease-in'"-->
<!--      class="fixed inset-y-0 left-0 z-30 w-64 overflow-y-auto transition duration-300 transform bg-gray-900 lg:translate-x-0 lg:static lg:inset-0"-->
<!--    >-->
<!--      <div class="flex items-center justify-center mt-8">-->
<!--        <div class="flex items-center">-->
<!--          <svg-->
<!--            class="w-12 h-12"-->
<!--            viewBox="0 0 512 512"-->
<!--            fill="none"-->
<!--            xmlns="http://www.w3.org/2000/svg"-->
<!--          >-->
<!--            <path-->
<!--              d="M364.61 390.213C304.625 450.196 207.37 450.196 147.386 390.213C117.394 360.22 102.398 320.911 102.398 281.6C102.398 242.291 117.394 202.981 147.386 172.989C147.386 230.4 153.6 281.6 230.4 307.2C230.4 256 256 102.4 294.4 76.7999C320 128 334.618 142.997 364.608 172.989C394.601 202.981 409.597 242.291 409.597 281.6C409.597 320.911 394.601 360.22 364.61 390.213Z"-->
<!--              fill="#0000FF"-->
<!--              stroke="#0000FF"-->
<!--              stroke-width="2"-->
<!--              stroke-linecap="round"-->
<!--              stroke-linejoin="round"-->
<!--            />-->
<!--            <path-->
<!--              d="M201.694 387.105C231.686 417.098 280.312 417.098 310.305 387.105C325.301 372.109 332.8 352.456 332.8 332.8C332.8 313.144 325.301 293.491 310.305 278.495C295.309 263.498 288 256 275.2 230.4C256 243.2 243.201 320 243.201 345.6C201.694 345.6 179.2 332.8 179.2 332.8C179.2 352.456 186.698 372.109 201.694 387.105Z"-->
<!--              fill="white"-->
<!--            />-->
<!--          </svg>-->

<!--          <span class="mx-4 text-2xl font-semibold text-white">WAME-APP</span>-->
<!--        </div>-->
<!--      </div>-->

<!--      <nav class="mt-10">-->
<!--        <router-link-->
<!--          class="flex items-center px-6 py-2 mt-4 duration-200 border-l-4"-->
<!--          :class="[$route.name === 'Dashboard' ? activeClass : inactiveClass]"-->
<!--          to="/dashboard"-->
<!--        >-->
<!--          <svg-->
<!--            class="w-5 h-5"-->
<!--            viewBox="0 0 20 20"-->
<!--            fill="none"-->
<!--            xmlns="http://www.w3.org/2000/svg"-->
<!--          >-->
<!--            <path-->
<!--              d="M2 10C2 5.58172 5.58172 2 10 2V10H18C18 14.4183 14.4183 18 10 18C5.58172 18 2 14.4183 2 10Z"-->
<!--              fill="currentColor"-->
<!--            />-->
<!--            <path-->
<!--              d="M12 2.25195C14.8113 2.97552 17.0245 5.18877 17.748 8.00004H12V2.25195Z"-->
<!--              fill="currentColor"-->
<!--            />-->
<!--          </svg>-->

<!--          <span class="mx-4 text-2xl">Menu</span>-->
<!--        </router-link>-->

<!--        <router-link-->
<!--          class="flex items-center px-6 py-2 mt-4 duration-200 border-l-4"-->
<!--          :class="[$route.name === 'Contact' ? activeClass : inactiveClass]"-->
<!--          to="/contact"-->
<!--        >-->
<!--          <svg-->
<!--            class="w-5 h-5"-->
<!--            viewBox="0 0 20 20"-->
<!--            fill="none"-->
<!--            xmlns="http://www.w3.org/2000/svg"-->
<!--          >-->
<!--            <path-->
<!--              d="M5 3C3.89543 3 3 3.89543 3 5V7C3 8.10457 3.89543 9 5 9H7C8.10457 9 9 8.10457 9 7V5C9 3.89543 8.10457 3 7 3H5Z"-->
<!--              fill="currentColor"-->
<!--            />-->
<!--            <path-->
<!--              d="M5 11C3.89543 11 3 11.8954 3 13V15C3 16.1046 3.89543 17 5 17H7C8.10457 17 9 16.1046 9 15V13C9 11.8954 8.10457 11 7 11H5Z"-->
<!--              fill="currentColor"-->
<!--            />-->
<!--            <path-->
<!--              d="M11 5C11 3.89543 11.8954 3 13 3H15C16.1046 3 17 3.89543 17 5V7C17 8.10457 16.1046 9 15 9H13C11.8954 9 11 8.10457 11 7V5Z"-->
<!--              fill="currentColor"-->
<!--            />-->
<!--            <path-->
<!--              d="M11 13C11 11.8954 11.8954 11 13 11H15C16.1046 11 17 11.8954 17 13V15C17 16.1046 16.1046 17 15 17H13C11.8954 17 11 16.1046 11 15V13Z"-->
<!--              fill="currentColor"-->
<!--            />-->
<!--          </svg>-->

<!--          <span class="mx-4">Contact</span>-->
<!--        </router-link>-->

<!--        <router-link-->
<!--          class="flex items-center px-6 py-2 mt-4 duration-200 border-l-4"-->
<!--          :class="[$route.name === 'Lexicon' ? activeClass : inactiveClass]"-->
<!--          to="/lexicon"-->
<!--        >-->
<!--          <svg-->
<!--            class="w-5 h-5"-->
<!--            viewBox="0 0 20 20"-->
<!--            fill="none"-->
<!--            xmlns="http://www.w3.org/2000/svg"-->
<!--          >-->
<!--            <path-->
<!--              d="M7 3C6.44772 3 6 3.44772 6 4C6 4.55228 6.44772 5 7 5H13C13.5523 5 14 4.55228 14 4C14 3.44772 13.5523 3 13 3H7Z"-->
<!--              fill="currentColor"-->
<!--            />-->
<!--            <path-->
<!--              d="M4 7C4 6.44772 4.44772 6 5 6H15C15.5523 6 16 6.44772 16 7C16 7.55228 15.5523 8 15 8H5C4.44772 8 4 7.55228 4 7Z"-->
<!--              fill="currentColor"-->
<!--            />-->
<!--            <path-->
<!--              d="M2 11C2 9.89543 2.89543 9 4 9H16C17.1046 9 18 9.89543 18 11V15C18 16.1046 17.1046 17 16 17H4C2.89543 17 2 16.1046 2 15V11Z"-->
<!--              fill="currentColor"-->
<!--            />-->
<!--          </svg>-->

<!--          <span class="mx-4">Lexicon</span>-->
<!--        </router-link>-->

<!--        <router-link-->
<!--          class="flex items-center px-6 py-2 mt-4 duration-200 border-l-4"-->
<!--          :class="[$route.name === 'Forms' ? activeClass : inactiveClass]"-->
<!--          to="/forms"-->
<!--        >-->
<!--          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">-->
<!--            <path-->
<!--              d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z"-->
<!--            />-->
<!--            <path-->
<!--              fill-rule="evenodd"-->
<!--              d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"-->
<!--              clip-rule="evenodd"-->
<!--            />-->
<!--          </svg>-->

<!--          <span class="mx-4">Forms</span>-->
<!--        </router-link>-->

<!--        <router-link-->
<!--          class="flex items-center px-6 py-2 mt-4 duration-200 border-l-4"-->
<!--          :class="[$route.name === 'Cards' ? activeClass : inactiveClass]"-->
<!--          to="/cards"-->
<!--        >-->
<!--          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">-->
<!--            <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />-->
<!--            <path fill-rule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clip-rule="evenodd" />-->
<!--          </svg>-->

<!--          <span class="mx-4">Cards</span>-->
<!--        </router-link>-->

<!--        <router-link-->
<!--          class="flex items-center px-6 py-2 mt-4 duration-200 border-l-4"-->
<!--          :class="[$route.name === 'Modal' ? activeClass : inactiveClass]"-->
<!--          to="/modal"-->
<!--        >-->
<!--          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">-->
<!--            <path d="M3 12v3c0 1.657 3.134 3 7 3s7-1.343 7-3v-3c0 1.657-3.134 3-7 3s-7-1.343-7-3z" />-->
<!--            <path d="M3 7v3c0 1.657 3.134 3 7 3s7-1.343 7-3V7c0 1.657-3.134 3-7 3S3 8.657 3 7z" />-->
<!--            <path d="M17 5c0 1.657-3.134 3-7 3S3 6.657 3 5s3.134-3 7-3 7 1.343 7 3z" />-->
<!--          </svg>-->

<!--          <span class="mx-4">Modal</span>-->
<!--        </router-link>-->

<!--        <router-link-->
<!--          class="flex items-center px-6 py-2 mt-4 duration-200 border-l-4"-->
<!--          :class="[$route.name === 'Blank' ? activeClass : inactiveClass]"-->
<!--          to="/blank"-->
<!--        >-->
<!--          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">-->
<!--            <path-->
<!--              d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"-->
<!--            />-->
<!--          </svg>-->

<!--          <span class="mx-4">Blank</span>-->
<!--        </router-link>-->
<!--      </nav> <br/><br/><br/><br/><br/><br/><br/><br/><br/>-->
<!--      <footer>-->
<!--        <router-link-->
<!--          class="flex items-center px-6 py-2 mt-4 duration-200 border-l-4"-->
<!--          :class="[$route.name === 'Modal' ? activeClass : inactiveClass]"-->
<!--          to="/"-->
<!--        >-->
<!--          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 20 20" fill="#0000FF">-->
<!--            <path d="M3 12v3c0 1.657 3.134 3 7 3s7-1.343 7-3v-3c0 1.657-3.134 3-7 3s-7-1.343-7-3z" />-->
<!--            <path d="M3 7v3c0 1.657 3.134 3 7 3s7-1.343 7-3V7c0 1.657-3.134 3-7 3S3 8.657 3 7z" />-->
<!--            <path d="M17 5c0 1.657-3.134 3-7 3S3 6.657 3 5s3.134-3 7-3 7 1.343 7 3z" />-->
<!--          </svg>-->
<!--          <button class="text-blue-600"> <i class="mx-4 bg-blue-600" ></i>logout</button>-->

<!--        </router-link>-->
<!--      </footer>-->
<!--    </div>-->
<!--  </div>-->
<!--</template>-->

