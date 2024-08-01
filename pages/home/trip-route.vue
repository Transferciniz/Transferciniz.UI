<template>
  <div class="w-full h-full flex flex-col">
    <div class="bg-gray-900 border-b border-gray-600 p-5 grid grid-cols-10 gap-4">
        <div class="col-span-2 flex items-center">
          <p class="text-sm text-white">Şuradan :</p>
        </div>
        <div class="col-span-7 relative">
          <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
            <Icon name="material-symbols:location-on-rounded" class="text-gray-400" size="26" />
          </div>
          <input type="search" id="default-search" class="block w-full p-4 ps-10 text-sm border rounded-lg bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-base-500 focus:border-base-500" placeholder="Kalkış Noktanızı Belirtiniz..." required />
          <Icon name="material-symbols:my-location-outline" size="26" class="text-white absolute end-2.5 bottom-3.5 bg-white"/>
        </div>
        <div class="col-span-1 row-span-2 flex items-center justify-center">
          <Icon name="tabler:switch-vertical" size="30" class="bg-white"/>
        </div>
        <div class="col-span-2 flex items-center">
        <p class="text-sm text-white">Şuraya :</p>
      </div>
        <div class="col-span-7 relative">
          <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
            <Icon name="material-symbols:location-on-rounded" class="text-gray-400" size="26" />
          </div>
          <input type="search" id="default-search" class="block w-full p-4 ps-10 text-sm border rounded-lg bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-base-500 focus:border-base-500" placeholder="Varış Noktanızı Belirtin..." required />
        </div>
    </div>
    <div class="flex flex-col gap-y-2 text-white p-4">

      <div class="flex justify-between items-center">
        <p class="font-medium text-md">Yetişkin :</p>
        <div class="flex justify-end gap-x-5 items-center">
          <Icon name="ic:baseline-minus" size="30" @click="personCount--"/>
          <p class="text-md text-white">{{personCount}}</p>
          <Icon name="material-symbols:add" size="30" @click="personCount++"/>
        </div>
      </div>

      <div class="flex justify-between items-center">
        <p class="font-medium text-md">Çocuk :</p>
        <div class="flex justify-end gap-x-5 items-center">
          <Icon name="ic:baseline-minus" size="30" @click="childCount--"/>
          <p class="text-md text-white">{{childCount}}</p>
          <Icon name="material-symbols:add" size="30" @click="childCount++"/>
        </div>
      </div>

      <div class="flex justify-between items-center">
        <p class="font-medium text-md">Engelsiz :</p>
        <div class="flex justify-end gap-x-5 items-center">
          <Icon name="ic:baseline-minus" size="30" @click="handicapedPersonCount--"/>
          <p class="text-md text-white">{{handicapedPersonCount}}</p>
          <Icon name="material-symbols:add" size="30" @click="handicapedPersonCount++"/>
        </div>
      </div>

    </div>
    <Map/>
    <div class="fixed bottom-20 flex justify-center items-center w-screen">
      <NuxtLink to="/home/car-selection">
      <div class="bg-base-600 text-white rounded-md text-center font-medium text-lg px-10 py-2 drop-shadow-xl">Devam Et</div>
      </NuxtLink>
    </div>
  </div>
</template>
<script setup lang="ts">

const personCount= ref(0);
const childCount = ref(0);
const handicapedPersonCount = ref(0);

function increaseCount(value: number) {
  value = value++;
}

function decreaseCount(value: number) {
  value = value--;
}
</script>