<template>

  <template v-if="isDrawerVisible">
    <div class="fixed top-0 left-0 w-screen h-screen bg-black/50 z-50 transition-all opacity-0 ease-in-out duration-300 backdrop-blur-sm" :class="{'opacity-100': isAnimating && isDrawerVisible}" @click="closeDrawer()"></div>
    <div class="fixed bottom-0 z-50 left-0 bg-gray-900/60 rounded-t-2xl backdrop-blur-xl translate-y-[100%] transition-all ease-in-out duration-300"  :class="{'!translate-y-[0%]': isDrawerVisible && isAnimating}">
      <div class="w-screen h-14 border-b border-gray-600 flex justify-center items-center text-center text-xl text-white">Bir Yer Arayın</div>
      <div class="w-screen max-h-[700px] overflow-y-scroll">
        <div class="flex flex-col gap-y-1 divide-y divide-gray-600 min-h-[700px]">
          <input type="text" class="p-4 w-full" :value="searchText" @keydown="onInputChange($event.target.value)">
          <div class="w-full h-[700px]" v-if="searchResults.length == 0"></div>
          <search-result-item v-for="location in searchResults" :location="location" @on-location-selected="onLocationSelected($event)"/>
        </div>
      </div>
    </div>
  </template>






</template>
<script setup lang="ts">
import SearchResultItem from "~/components/searchResultItem.vue";

const {searchResults, searchText, isDrawerVisible, isAnimating} = storeToRefs(useLocationSearchStore());
const {closeDrawer, setSearchText} = useLocationSearchStore();

const emit = defineEmits<{
  (e: 'onLocationSelected', value: any): void
}>()

function onLocationSelected(location: any): void{
  emit("onLocationSelected", location);
  closeDrawer();
}

function onInputChange(payload: string) {
  setSearchText(payload);
}

</script>