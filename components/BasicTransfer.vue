<template>
  <div class="p-4 flex flex-col">
    <div class="rounded-md flex flex-col">

      <div class="my-4">
        <UButtonGroup>
          <UInput
            v-model="value"
            size="xl"
            placeholder="Mevcut Konumunuz"
            :ui="{
              base: 'pl-[75px]',
              leading: 'pointer-events-none'
            }"
          >
            <template #leading>
              <p class="text-sm text-[var(--ui-text-muted)]">
                Nereden:
              </p>
            </template>
          </UInput>

           <USelectMenu  v-model="domain" :items="domains" />
        </UButtonGroup>
      </div>

      <div class="my-4">
        <UButtonGroup>
          <UInput
            v-model="value"
            size="xl"
            placeholder="Mevcut Konumunuz"
            :ui="{
              base: 'pl-[75px]',
              leading: 'pointer-events-none'
            }"
          >
            <template #leading>
              <p class="text-sm text-[var(--ui-text-muted)]">
                Nereye:
              </p>
            </template>
          </UInput>

           <USelectMenu  v-model="domain" :items="domains" />
        </UButtonGroup>
      </div>

      <UInput type="datetime-local" v-model="formattedDate" @change="onDateChange" size="xl"/>


      <!--
      <p>Nereden</p>
      <div class="flex justify-between items-center gap-x-2">
        <div @click="openSearch('from')"
             class="border text-sm rounded-lg block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500">
          <p v-if="fromLocation == null">Mevcut konumunuz kullanılıyor</p>
          <div v-else class="flex flex-col justify-start items-start">
            <p>{{ fromLocation.name }}</p>
            <p class="text-xs opacity-50">{{ fromLocation.address }}</p>
          </div>
        </div>
        <div class="bg-gray-900 rounded-md p-2 flex justify-center items-center">
          <Icon name="material-symbols:my-location-rounded" size="28"/>
        </div>
      </div>

      -->



      <!--
      <p class="mt-2">Nereye</p>
      <div class="flex justify-between items-center gap-x-2">
        <div @click="openSearch('to')"
             class="border text-sm rounded-lg block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500">
          <p v-if="toLocation == null">Bir adres seçiniz...</p>
          <div v-else class="flex flex-col justify-start items-start">
            <p>{{ toLocation.name }}</p>
            <p class="text-xs opacity-50">{{ toLocation.address }}</p>
          </div>
        </div>
        <div class="bg-gray-900 rounded-md p-2 flex justify-center items-center" @click="changeDirections">
          <Icon name="tdesign:arrow-up-down-2" size="28"/>
        </div>
      </div>
      <p class="mt-2">Tarih</p>
      <div class="flex justify-start items-center">
        <input type="datetime-local" v-model="formattedDate" @change="onDateChange"
               class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
      </div>


    -->
      <div class="mt-4 flex flex-col gap-y-2">
        <USwitch label="Rotayı Favoriye Ekle"
                 v-model:model-value="isAddFavorite"
                 description="Sık kullandığınız rotaları favorilerinize ekleyerek zaman kazanın."/>
        <UFormField description="Transferi hatırlayabileceğiniz bir isim girin." v-if="isAddFavorite">
          <UInput placeholder="İsim giriniz" class="w-full" v-model:model-value="favoriteName" />
        </UFormField>
        <USwitch label="Kişileride Rotaya Kaydet" v-if="isAddFavorite"
                 v-model:model-value="isAddPeople"
                 description="Bu transferi hep aynı kişiler ile yapıyorsanız kişileri de kaydedebilirsiniz."/>
      </div>
      <div class="flex justify-center items-center" @click="searchTransfer">
        <UButton
        variant="solid"
        size="xl"
        label="Transfer Ara"
        trailing-icon="ic:baseline-search"
        class="relative mt-2 w-60 flex justify-center"
        />

      </div>
    </div>
    <UDrawer should-scale-background :direction="'top'" v-model:open="isSearchPopoverVisible">
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
            <Icon name="eos-icons:bubble-loading" :size="30" v-if="isSearching"/>
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


const {
  date,
  isAddPeople,
  isAddFavorite,
  favoriteName
} = storeToRefs(useCreateTransferStore())


const value = ref('')
const domains = ['Konumumu Kullan', 'Kayıtlı Adresim', 'Konum Seç']
const domain = ref(domains[0])

const formattedDate = computed(() => {
  date.value.setMinutes(date.value.getMinutes() - date.value.getTimezoneOffset());
  return date.value.toISOString().slice(0, 16); // YYYY-MM-DDTHH:MM
});

function onDateChange(event: Event) {
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
  if(isAddFavorite.value && favoriteName.value == ""){
    useToast().add({
      title: "Favori ismi eksik!",
      description: "Lütfen bu transferi hatırlayabileceğiniz bir isim girin.",
      color: "error",
    })
  }
  if(toLocation.value == undefined) {
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