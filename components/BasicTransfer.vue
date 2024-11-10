<template>
  <div class="p-4 flex flex-col">
    <div class="bg-gray-800 p-4 rounded-md flex flex-col">
      <p>Nereden</p>
      <div class="flex justify-between items-center gap-x-2">
        <div @click="openSearch('from')" class="border text-sm rounded-lg block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500">
          <p v-if="fromLocation == null">Mevcut konumunuz kullanılıyor</p>
          <div v-else class="flex flex-col justify-start items-start">
            <p>{{fromLocation.name}}</p>
            <p class="text-xs opacity-50">{{fromLocation.address}}</p>
          </div>
        </div>
        <div class="bg-gray-900 rounded-md p-2 flex justify-center items-center">
          <Icon name="material-symbols:my-location-rounded" size="28" />
        </div>
      </div>
      <p class="mt-2">Nereye</p>
      <div class="flex justify-between items-center gap-x-2">
        <div  @click="openSearch('to')" class="border text-sm rounded-lg block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500">
          <p v-if="toLocation == null">Bir adres seçiniz...</p>
          <div v-else class="flex flex-col justify-start items-start">
            <p>{{toLocation.name}}</p>
            <p class="text-xs opacity-50">{{toLocation.address}}</p>
          </div>
        </div>
        <div class="bg-gray-900 rounded-md p-2 flex justify-center items-center" @click="changeDirections">
          <Icon name="tdesign:arrow-up-down-2" size="28"/>
        </div>
      </div>
      <p class="mt-2">Tarih</p>
      <div class="flex justify-start items-center">
        <input type="datetime-local"  v-model="formattedDate" @change="onDateChange"
               class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
      </div>
      <div class="flex justify-center items-center" @click="searchTransfer">
        <div class="bg-white text-gray-900 text-lg px-8 py-2 rounded-md relative top-[30px]">Transfer Ara</div>
      </div>
    </div>
    <UDrawer should-scale-background  :direction="'top'" v-model:open="isSearchPopoverVisible">
      <template #body>
        <div class="flex flex-col rounded-md p-2 mt-2">
          <UInput
              icon="i-heroicons-magnifying-glass-20-solid"
              size="xl"
              class="w-full"
              color="white"
              v-model="searchInput"
              :trailing="false"
              @click="isSearchPanelVisible = true"
              placeholder="Bir yer arayın..."
          />
          <div class="flex flex-col mt-2 justify-center items-center" v-if="isSearchPanelVisible">
            <Icon name="eos-icons:bubble-loading" :size="30" v-if="isSearching" />
            <div v-else class="flex flex-col items-start justify-start w-full">
              <div class="flex flex-col  overflow-y-scroll gap-y-2">
                <div v-for="location in searchResults" class="text-xs bg-gray-800 p-2 rounded-md" @click="selectWaypoint(location)">
                  <p>{{location.name}}</p>
                  <p class="opacity-50">{{location.address}}</p>
                </div>
              </div>

            </div>
          </div>
        </div>
      </template>

    </UDrawer>
  </div>
</template>

<script setup lang="ts">



import type {ILocationSearchResult} from "~/core/app/ITripLocation";

const isSearchPopoverVisible = ref(false);
const searchMode = ref<'from' | 'to'>('from');
const fromLocation = ref<ILocationSearchResult>()
const toLocation = ref<ILocationSearchResult>()
const {
  searchInput,
    searchResults,
    isSearchPanelVisible,
    isSearching
} = storeToRefs(useLocationSearchStore());



const {date} = storeToRefs(useCreateTransferStore())

const formattedDate = computed(() => {
  date.value.setMinutes(date.value.getMinutes() - date.value.getTimezoneOffset());
  return date.value.toISOString().slice(0, 16); // YYYY-MM-DDTHH:MM
});

function onDateChange(event: Event) {
  date.value = new Date(event.target.value)
}


function openSearch(mode: 'from' | 'to'): void{
  searchInput.value = '';
  searchMode.value = mode;
  isSearchPopoverVisible.value = true;
}

function selectWaypoint(payload: ILocationSearchResult): void {
  if(searchMode.value == 'from'){
    fromLocation.value = payload;
  }else{
    toLocation.value = payload;
  }
  searchInput.value = '';
  isSearchPopoverVisible.value = false;
}

function changeDirections(){
  const from = fromLocation.value;
  const to = toLocation.value;
  fromLocation.value = to;
  toLocation.value = from;
}

function searchTransfer(){
  const locations = fromLocation.value != undefined ? [fromLocation.value, toLocation.value] : [toLocation.value]
  useCreateTransferStore().createBasicTransferWaypoints(locations as ILocationSearchResult[])
}
</script>