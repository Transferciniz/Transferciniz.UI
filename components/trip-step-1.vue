<template>
  <div class="p-5 ">
    <div class="flex flex-col gap-y-4">
      <div>
      </div>
      <div>
        <label class="block mb-2 text-lg font-medium text-white">Transferinize bir isim verin:</label>
        <input type="text" placeholder="Örneğin: Hafta sonu gezisi" v-model="tripName"
               id="username"
               class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
               required>
      </div>
      <div>
        <label class="block mb-2 text-lg font-medium text-white">Gidiş Tarihi:</label>
        <input type="datetime-local"
               v-model="startDate"
               id="username"
               class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
               required>
      </div>
      <div>
        <label for="email" class="block mb-2 text-lg font-medium text-white">Toplam Kişi Sayısı:</label>
        <input type="number" name="username" placeholder="0" v-model="totalPeople"
               id="username"
               class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
               required>
      </div>




    </div>


  </div>
</template>
<script setup lang="ts">

import SwipeDrawer from "~/components/SwipeDrawer.vue";

const {
  tripName,
  startDate,
  totalPeople
} = storeToRefs(useCreateTripStore())
</script>