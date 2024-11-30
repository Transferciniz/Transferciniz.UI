<template>
  <div class="p-4 flex flex-col">
    <div class="rounded-md flex flex-col">

      <div class="flex justify-start items-center gap-x-2">
        <p class="text-lg">Nereden</p>
        <USeparator orientation="horizontal" />
      </div>
      <div class="flex justify-between items-center">
        <div class="flex flex-col">
          <p class="text-bold text-2xl">{{ fromLocation?.name ?? address.displayAddress }}</p>
          <p class="text-xs opacity-50">{{ fromLocation?.address ?? address.address }}</p>
        </div>
        <UButton label="Değiştir" color="neutral" variant="subtle" @click="openSearch('from')"/>
      </div>


      <div class="flex justify-start items-center gap-x-2 mt-4">
        <p class="text-lg">Nereye</p>
        <USeparator orientation="horizontal" />
      </div>
      <div class="flex justify-between items-center">
        <div class="flex flex-col">
          <p class="text-bold text-2xl">{{ toLocation?.name ?? '-' }}</p>
          <p class="text-xs opacity-50">{{ toLocation?.address ?? 'Lütfen konum seçin' }}</p>
        </div>
        <UButton label="Konum Seç" color="neutral" variant="subtle" @click="openSearch('to')"/>
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

    <LocationSelector v-model:open="isLocationSelectorVisible" @on-location-selected="onLocationSelected"/>
  </div>
</template>

<script setup lang="ts">

import type { ILocationSearchResult } from "~/core/app/ITripLocation";


const isLocationSelectorVisible = ref(false);
const searchMode = ref<'from' | 'to'>('from');
const fromLocation = ref<ILocationSearchResult>()
const toLocation = ref<ILocationSearchResult>()

const { 
  address,
  location
} = storeToRefs(useLocationStore())

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
  searchMode.value = mode;
  isLocationSelectorVisible.value = true;
}

function onLocationSelected(payload: ILocationSearchResult): void {
  if (searchMode.value == 'from') {
    fromLocation.value = payload;
  } else {
    toLocation.value = payload;
  }
  isLocationSelectorVisible.value = false;
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
  if(fromLocation.value == undefined){
    fromLocation.value = {
      address: address.value.address,
      name: address.value.displayAddress,
      latitude: location.value.latitude,
      longitude: location.value.longitude
    }
  }
  useCreateTransferStore().createBasicTransferWaypoints([fromLocation.value, toLocation.value]  as ILocationSearchResult[])
}
</script>