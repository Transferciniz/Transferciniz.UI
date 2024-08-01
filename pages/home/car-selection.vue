<template>
  <div class="w-full h-full flex flex-col">
    <div class="flex justify-between gap-x-2 items-center border-b-[0.5px] border-gray-600">
      <div class="flex justify-start items-center gap-x-2 p-4 overflow-x-scroll">
        <span class="text-sm font-medium me-2 px-2.5 py-0.5 rounded bg-base-700 text-white whitespace-nowrap">Lüks &nbsp; &times;</span>
        <span class="text-sm font-medium me-2 px-2.5 py-0.5 rounded bg-base-700 text-white whitespace-nowrap">VIP &nbsp; &times;</span>
        <span class="text-sm font-medium me-2 px-2.5 py-0.5 rounded bg-base-700 text-white whitespace-nowrap">Bebek Koltuğu &nbsp; &times;</span>
        <span class="text-sm font-medium me-2 px-2.5 py-0.5 rounded bg-base-700 text-white whitespace-nowrap">İkram &nbsp; &times;</span>
      </div>
      <div class="flex justify-end items-center text-white">
        <p class="text-md">Filtrele: </p>
        <Icon name="material-symbols:filter-alt-outline" size="32" class="bg-white" />
      </div>
    </div>

    <div class="flex flex-col w-full p-4 gap-y-4">

      <div class="bg-white text-white rounded-lg  gap-y-2 flex flex-col p-3">
        <div class="flex justify-start items-center gap-x-2">
          <span class="text-sm font-medium inline-block px-2.5 py-0.5 rounded bg-base-700 text-white ">Sizin İçin En Uygun</span>
          <span class="text-sm font-light text-gray-400 italic">Seçimlerinize göre en iyi seçenek!</span>
        </div>
        <div class="flex justify-start gap-x-1 items-center">
          <span class="text-sm font-medium px-2.5 py-0.5 rounded bg-base-700 text-white whitespace-nowrap">3x</span>
          <p class="text-2xl tracking-tighter font-bold text-gray-700">Ford Fiesta 1.4 DCI</p>
          <span class="text-sm font-medium px-2 py-0.5 text-center rounded bg-gray-700 text-white whitespace-nowrap">
            <div class="flex justify-center items-center">
            <Icon name="material-symbols:person" size="16" class="bg-white"/>
            <p class="text-xs font-light text-white">3+1</p>
          </div>
          </span>


        </div>
        <UCarousel v-slot="{ item }" :items="items" :ui="{ item: 'basis-full' }" class="rounded-lg overflow-hidden">
          <img :src="item" class="w-full" draggable="false">
        </UCarousel>

        <div class="flex justify-between gap-x-2 items-center">
          <div class="bg-gray-700 text-white text-md font-normal px-4 py-1 rounded-md">Deneyimle</div>
          <div class="bg-base-700 text-white text-md font-normal px-4 py-1 rounded-md" @click="openPaymentDrawer()">Seç ve 12.463₺ Ödeme Yap</div>
        </div>

      </div>
      <div class="bg-white text-white rounded-lg  gap-y-2 flex flex-col p-3">
        <div class="flex justify-start items-center gap-x-2">
          <span class="text-sm font-medium inline-block px-2.5 py-0.5 rounded bg-base-700 text-white ">En Ucuz</span>
        </div>
        <div class="flex justify-start gap-x-1 items-center">
          <p class="text-2xl tracking-tighter font-bold text-gray-700">Mercedes Sprinter</p>
          <span class="text-sm font-medium px-2 py-0.5 text-center rounded bg-gray-700 text-white whitespace-nowrap">
            <div class="flex justify-center items-center">
            <Icon name="material-symbols:person" size="16" class="bg-white"/>
            <p class="text-xs font-light text-white">17+1</p>
          </div>
          </span>


        </div>
        <UCarousel v-slot="{ item }" :items="items" :ui="{ item: 'basis-full' }" class="rounded-lg overflow-hidden">
          <img :src="item" class="w-full" draggable="false">
        </UCarousel>

        <div class="flex justify-between gap-x-2 items-center">
          <div class="bg-gray-700 text-white text-md font-normal px-4 py-1 rounded-md">Deneyimle</div>
          <div class="bg-base-700 text-white text-md font-normal px-4 py-1 rounded-md" @click="openPaymentDrawer()">Seç ve 9.135₺ Ödeme Yap</div>
        </div>

      </div>

      <div class="inline-flex items-center justify-center relative w-full my-2">
        <hr class="w-full h-px border-0 bg-gray-700">
        <span class="absolute px-3 font-medium -translate-x-1/2 left-1/2 text-white bg-gray-900">Diğer Alternatifler</span>
      </div>


      <div class="bg-gray-800 border border-gray-700 text-white rounded-lg  gap-y-2 flex flex-col p-3">
        <div class="flex justify-start gap-x-1 items-center">
          <p class="text-2xl tracking-tighter font-bold text-white-700">Porsche Panemera</p>
          <span class="text-sm font-medium px-2 py-0.5 text-center rounded bg-base-700 text-white whitespace-nowrap">
            <div class="flex justify-center items-center">
            <Icon name="material-symbols:person" size="16" class="bg-white"/>
            <p class="text-xs font-light text-white">3+1</p>
          </div>
          </span>


        </div>
        <UCarousel v-slot="{ item }" :items="items" :ui="{ item: 'basis-full' }" class="rounded-lg overflow-hidden">
          <img :src="item" class="w-full" draggable="false">
        </UCarousel>

        <div class="flex justify-between gap-x-2 items-center">
          <div class="bg-white text-gray-700 text-md font-normal px-4 py-1 rounded-md">Deneyimle</div>
          <div class="bg-base-700 text-white text-md font-normal px-4 py-1 rounded-md" @click="openPaymentDrawer()">Seç ve 48.312₺ Ödeme Yap</div>
        </div>

      </div>
      <div class="bg-gray-800 border border-gray-700 text-white rounded-lg  gap-y-2 flex flex-col p-3">
        <div class="flex justify-start gap-x-1 items-center">
          <p class="text-2xl tracking-tighter font-bold text-white-700">Porsche Panemera</p>
          <span class="text-sm font-medium px-2 py-0.5 text-center rounded bg-base-700 text-white whitespace-nowrap">
            <div class="flex justify-center items-center">
            <Icon name="material-symbols:person" size="16" class="bg-white"/>
            <p class="text-xs font-light text-white">3+1</p>
          </div>
          </span>


        </div>
        <UCarousel v-slot="{ item }" :items="items" :ui="{ item: 'basis-full' }" class="rounded-lg overflow-hidden">
          <img :src="item" class="w-full" draggable="false">
        </UCarousel>

        <div class="flex justify-between gap-x-2 items-center">
          <div class="bg-white text-gray-700 text-md font-normal px-4 py-1 rounded-md">Deneyimle</div>
          <div class="bg-base-700 text-white text-md font-normal px-4 py-1 rounded-md" @click="openPaymentDrawer()">Seç ve 48.312₺ Ödeme Yap</div>
        </div>

      </div>
    </div>

    <Drawer title="Ödeme Yap" ref="paymentDrawer">
      <div class="flex flex-col p-4 gap-y-4">
        <div>
          <label for="countries" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Kayıtlı Kartlarım</label>
          <select id="countries" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
            <option selected>**** 8998 ile biten kartım</option>
          </select>
        </div>


        <div class="flex justify-center">
          <div class="bg-base-600 text-white rounded-md px-4 py-2 text-center" @click="doPayment()">Ödemeyi Onayla</div>
        </div>
      </div>
    </Drawer>

  </div>
</template>
<script setup lang="ts">

const paymentDrawer = ref(null);
const items = [
  'https://picsum.photos/1920/1080?random=1',
  'https://picsum.photos/1920/1080?random=2',
  'https://picsum.photos/1920/1080?random=3',
  'https://picsum.photos/1920/1080?random=4',
  'https://picsum.photos/1920/1080?random=5',
  'https://picsum.photos/1920/1080?random=6'
]

function openPaymentDrawer() {
  paymentDrawer.value.open();
}

function doPayment() {
  paymentDrawer.value.close();
}
</script>