<template>
  <div class="flex flex-col w-full h-full">
    <div class="flex flex-col gap-4 h-full">

      <div class="flex items-center gap-4 px-4">
        <div class="font-medium text-white text-xl">
          <div class="flex justify-start items-center gap-x-2">Mustafa ŞEKER <span class="text-xs font-medium me-2 px-2.5 py-0.5 rounded bg-gray-700 text-gray-300">Şekerler GRUP</span></div>
          <div class="text-sm  text-gray-400">Yönetim Kurulu Başkanı</div>
        </div>
      </div>

      <form class="w-screen px-5">
        <div class="relative">
          <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
            <svg class="w-4 h-4 text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
            </svg>
          </div>
          <input type="search" id="default-search" class="block w-full p-4 ps-10 text-sm border rounded-lg bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-base-500 focus:border-base-500" placeholder="Gideceğiniz Yeri Yazınız" required />
          <button type="button" class="text-white absolute end-2.5 bottom-2.5  focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-4 py-2 bg-base-600 hover:bg-base-700 focus:ring-base-800" @click.prevent="openSearchResultsDrawer()">Ara</button>
        </div>
      </form>

      <div class="inline-flex items-center justify-center w-full mt-2">
        <hr class="w-full h-px border-0 bg-gray-700">
        <span class="absolute px-3 font-medium -translate-x-1/2 left-1/2 text-white bg-gray-900">Yakın Noktalar</span>
      </div>

      <div class="flex justify-start items-center gap-x-4 overflow-x-scroll mt-0 p-2">
        <span class="text-sm font-medium me-2 px-2.5 py-0.5 rounded bg-base-700 text-white">Oteller</span>
        <span class="text-sm font-medium me-2 px-2.5 py-0.5 rounded bg-gray-700 text-gray-300">Restoranlar</span>
        <span class="text-sm font-medium me-2 px-2.5 py-0.5 rounded bg-gray-700 text-gray-300">Barlar</span>
        <span class="text-sm font-medium me-2 px-2.5 py-0.5 rounded bg-gray-700 text-gray-300">Park</span>
        <span class="whitespace-nowrap text-sm font-medium me-2 px-2.5 py-0.5 rounded bg-gray-700 text-gray-300">Alışveriş Merkezleri</span>

      </div>

      <div class="flex w-full gap-x-4 overflow-x-scroll">
        <div class="border rounded-lg shadow bg-gray-800 border-gray-700 min-w-40" v-for="i in 8" >
          <img class="rounded-t-lg w-full h-32 object-cover" :src="'https://picsum.photos/600/600?random=' + i" alt="" />
          <div class="p-2">
            <h5 class="text-sm font-bold tracking-tight text-white">Havalimanı İç Hatlar</h5>
          </div>
        </div>
      </div>
      <Map/>


    </div>

    <Drawer :title="'Arama Sonuçları'" ref="searchResultsDrawer">
      <div class="flex flex-col gap-y-1 divide-y divide-gray-600">
        <search-result-item title="Antalya Havalimanı" eta="1.5 Saat" distance="13 KM" description="Antalya Airport, Yeşilköy, Antalya Havaalanı Dış Hatlar Terminali 1, 07230 Muratpaşa/Antalya"/>
        <search-result-item title="Antalya Havalimanı" eta="1.5 Saat" distance="13 KM" description="Antalya Airport, Yeşilköy, Antalya Havaalanı Dış Hatlar Terminali 1, 07230 Muratpaşa/Antalya"/>
        <search-result-item title="Antalya Havalimanı" eta="1.5 Saat" distance="13 KM" description="Antalya Airport, Yeşilköy, Antalya Havaalanı Dış Hatlar Terminali 1, 07230 Muratpaşa/Antalya"/>
        <search-result-item title="Antalya Havalimanı" eta="1.5 Saat" distance="13 KM" description="Antalya Airport, Yeşilköy, Antalya Havaalanı Dış Hatlar Terminali 1, 07230 Muratpaşa/Antalya"/>
        <search-result-item title="Antalya Havalimanı" eta="1.5 Saat" distance="13 KM" description="Antalya Airport, Yeşilköy, Antalya Havaalanı Dış Hatlar Terminali 1, 07230 Muratpaşa/Antalya"/>
        <search-result-item title="Antalya Havalimanı" eta="1.5 Saat" distance="13 KM" description="Antalya Airport, Yeşilköy, Antalya Havaalanı Dış Hatlar Terminali 1, 07230 Muratpaşa/Antalya"/>
        <search-result-item title="Antalya Havalimanı" eta="1.5 Saat" distance="13 KM" description="Antalya Airport, Yeşilköy, Antalya Havaalanı Dış Hatlar Terminali 1, 07230 Muratpaşa/Antalya"/>
      </div>
    </Drawer>
  </div>
</template>
<script setup lang="ts">
import Map from "~/components/map.vue";
import SearchResultItem from "~/components/searchResultItem.vue";

const searchResultsDrawer = ref(null);

function openSearchResultsDrawer() {
  if(searchResultsDrawer.value) {
    searchResultsDrawer.value.open();
  }
}
</script>