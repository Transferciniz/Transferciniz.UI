<template>
  <div class="p-5 ">

    <div class="flex flex-col gap-y-4">
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

      <div>
        <h3 class="text-lg font-medium text-gray-900 dark:text-white">Transfer Tipinizi Seçiniz</h3>
        <ul class="grid w-full mt-2 gap-6 md:grid-cols-2">
          <li class="opacity-20">
            <input disabled type="radio" id="hosting-small" name="hosting" value="hosting-small" class="hidden peer" required />
            <label for="hosting-small" class="inline-flex items-center justify-between w-full p-5 text-gray-500 bg-white border border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 dark:peer-checked:text-blue-500 peer-checked:border-blue-600 peer-checked:text-blue-600 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700">
              <div class="block">
                <div class="w-full text-lg font-semibold text-white">Direkt Transfer</div>
                <div class="w-full text-sm">Sadece bir noktadan başka bir noktaya gidecekseniz en iyi seçim.</div>
              </div>
              <Icon name="tabler:arrow-up-circle" class="w-10 h-10 ms-3 "/>

            </label>
          </li>
          <li class="opacity-20">
            <input disabled type="radio" id="hosting-big" name="hosting" value="hosting-big" class="hidden peer">
            <label for="hosting-big" class="inline-flex items-center justify-between w-full p-5 text-gray-500 bg-white border border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 dark:peer-checked:text-blue-500 peer-checked:border-blue-600 peer-checked:text-blue-600 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700">
              <div class="block">
                <div class="w-full text-lg font-semibold text-white">Çok Destinasyonlu Transfer</div>
                <div class="w-full text-sm">Bir çok kişiyi, farklı destinasyonlardan alacaksanız en iyi seçim.</div>
              </div>
              <Icon name="tabler:arrow-merge-both" class="w-10 h-10 ms-3 "/>

            </label>
          </li>
          <li>
            <input type="radio" id="tour" name="hosting" value="tour" class="hidden peer">
            <label for="tour" class="inline-flex items-center justify-between w-full p-5 text-gray-500 bg-white border border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 dark:peer-checked:text-blue-500 peer-checked:border-blue-600 peer-checked:text-blue-600 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700">
              <div class="block">
                <div class="w-full text-lg font-semibold text-white">Tur / Seyahat</div>
                <div class="w-full text-sm">Kişileri istenilen konum / durak üzerinden alıp, belli bir rota planı ile yolculuk yapacaksanız en iyi seçim.</div>
              </div>
              <Icon name="icon-park-twotone:tour-bus" class="w-10 h-10 ms-3 "/>

            </label>
          </li>
        </ul>
      </div>


    </div>


  </div>
</template>
<script setup lang="ts">

const {
  tripName,
  startDate,
  totalPeople
} = storeToRefs(useCreateTripStore())
</script>