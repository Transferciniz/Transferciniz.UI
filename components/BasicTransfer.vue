<template>
  <div class="p-4 flex flex-col">
    <div class="rounded-md flex flex-col">

      <div class="flex justify-start items-center gap-x-2">
        <p class="text-lg">Nereden</p>
        <USeparator orientation="horizontal" />
      </div>
      <div class="flex justify-between items-center">
        <div class="flex flex-col">
          <p class="text-bold text-2xl">{{ address.displayAddress }}</p>
          <p class="text-xs opacity-50">{{ address.address }}</p>
        </div>
        <UButton label="Değiştir" color="neutral" variant="subtle" @click="isLocationSelectorVisible = true"/>
      </div>



      <div class="flex justify-start items-center gap-x-2 mt-4">
        <p class="text-lg">Nereye</p>
        <USeparator orientation="horizontal" />
      </div>
      <div class="flex justify-between items-center">
        <div class="flex flex-col">
          <p class="text-bold text-2xl">{{ '-' }}</p>
          <p class="text-xs opacity-50">{{ 'Lütfen konum seçin' }}</p>
        </div>
        <UButton label="Konum Seç" color="neutral" variant="subtle" />
      </div>


      <UInput type="datetime-local" class="mt-4" v-model="formattedDate" @change="onDateChange" size="xl" />


      <div class="mt-4 flex flex-col gap-y-2">
        <USwitch label="Rotayı Favoriye Ekle" v-model:model-value="isAddFavorite"
          description="Sık kullandığınız rotaları favorilerinize ekleyerek zaman kazanın." />
        <UFormField description="Transferi hatırlayabileceğiniz bir isim girin." v-if="isAddFavorite">
          <UInput placeholder="İsim giriniz" class="w-full" v-model:model-value="favoriteName" />
        </UFormField>
        <USwitch label="Kişileride Rotaya Kaydet" v-if="isAddFavorite" v-model:model-value="isAddPeople"
          description="Bu transferi hep aynı kişiler ile yapıyorsanız kişileri de kaydedebilirsiniz." />
      </div>
      <div class="flex justify-center items-center" @click="searchTransfer">
        <UButton variant="solid" size="xl" label="Transfer Ara" trailing-icon="ic:baseline-search"
          class="relative mt-2 w-60 flex justify-center" />

      </div>
    </div>
    <UDrawer should-scale-background :direction="'top'" v-model:open="isSearchPopoverVisible">
      <template #body>
        <div class="flex flex-col rounded-md p-2 mt-2">
          <UInput icon="i-heroicons-magnifying-glass-20-solid" size="xl" class="w-full" color="neutral"
            v-model="searchInput" :trailing="false" @click="isSearchPanelVisible = true"
            placeholder="Bir yer arayın..." />
          <div class="flex flex-col mt-2 justify-center items-center" v-if="isSearchPanelVisible">
            <Icon name="eos-icons:bubble-loading" :size="30" v-if="isSearching" />
            <div v-else class="flex flex-col items-start justify-start w-full">
              <div class="flex flex-col  overflow-y-scroll gap-y-2">
                <div v-for="location in searchResults" class="text-xs bg-gray-800 p-2 rounded-md"
                  @click="selectWaypoint(location)">
                  <p>{{ location.name }}</p>
                  <p class="opacity-50">{{ location.address }}</p>
                </div>
              </div>

            </div>
          </div>
        </div>
      </template>

    </UDrawer>
    <LocationSelector v-model:open="isLocationSelectorVisible"/>
  </div>
</template>

<script setup lang="ts">


import type { ILocationSearchResult } from "~/core/app/ITripLocation";


const isLocationSelectorVisible = ref(false);

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

const { address } = storeToRefs(useLocationStore())


const {
  date,
  isAddPeople,
  isAddFavorite,
  favoriteName
} = storeToRefs(useCreateTransferStore())



const formattedDate = computed(() => {
  date.value.setMinutes(date.value.getMinutes() - date.value.getTimezoneOffset());
  return date.value.toISOString().slice(0, 16); // YYYY-MM-DDTHH:MM
});

function onDateChange(event: any) {
  date.value = new Date(event.target.value)
}

function openSearch(mode: 'from' | 'to'): void {
  searchInput.value = '';
  searchMode.value = mode;
  isSearchPopoverVisible.value = true;
}

function selectWaypoint(payload: ILocationSearchResult): void {
  if (searchMode.value == 'from') {
    fromLocation.value = payload;
  } else {
    toLocation.value = payload;
  }
  searchInput.value = '';
  isSearchPopoverVisible.value = false;
}

function changeDirections() {
  const from = fromLocation.value;
  const to = toLocation.value;
  fromLocation.value = to;
  toLocation.value = from;
}

function searchTransfer() {
  if (isAddFavorite.value && favoriteName.value == "") {
    useToast().add({
      title: "Favori ismi eksik!",
      description: "Lütfen bu transferi hatırlayabileceğiniz bir isim girin.",
      color: "error",
    })
  }
  if (toLocation.value == undefined) {
    useToast().add({
      title: "Varış noktası eksik!",
      description: "Lütfen bir varış noktası seçiniz",
      color: "warning",
    })
  }
  const locations = fromLocation.value != undefined ? [fromLocation.value, toLocation.value] : [toLocation.value]
  useCreateTransferStore().createBasicTransferWaypoints(locations as ILocationSearchResult[])
}
</script>