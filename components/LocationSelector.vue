<template>
    <UDrawer should-scale-background :direction="'top'" :open="open" @update:open="(val) => emit('update:open', val)">
      <template #body>
        <div class="flex flex-col rounded-md p-2">
          <div class="bg-red-800 text-white flex flex-col justify-start items-start p-4 rounded-md">
            <p class="text-xs">Canlı Konumu Kullan</p>
            <p class="text-lg font-bold">{{ address.displayAddress }}</p>
            <p class="text-xs opacity-70">{{ address.address }}</p>
          </div>

          <USeparator orientation="horizontal" label="Kayıtlı Adresleriniz" class="mt-2"/>

          <div class="bg-gray-800 flex flex-col justify-start items-start mt-2 p-4 rounded-md">
            <p class="text-xs">Varsayılan Adresiniz</p>
            <p class="text-lg font-bold">{{ defaultLocation.name }}</p>
            <p class="text-xs opacity-70">{{ defaultLocation.address }}</p>
          </div>

          <div class="bg-gray-800 flex flex-col justify-start items-start mt-2 p-4 rounded-md" v-for="location in locations">
            <p class="text-lg font-bold">{{ location.name }}</p>
            <p class="text-xs opacity-70">{{ location.address }}</p>
          </div>
          

          <UInput 
          icon="i-heroicons-magnifying-glass-20-solid"
          placeholder="Bir yer arayın..."
          size="xl"
          class="w-full mt-2"
          color="neutral"
          v-model="searchInput"
          :trailing="false"
          @click="isSearchPanelVisible = true"/>
          
          <USeparator orientation="horizontal" label="Arama Sonuçları" v-if="isSearchPanelVisible" class="my-2"/>
          <div class="flex flex-col mt-2 justify-center items-center" v-if="isSearchPanelVisible">
            <Icon 
            name="eos-icons:bubble-loading" 
            :size="30" 
            v-if="isSearching" />

            <div v-else class="flex flex-col items-start justify-start w-full">
              <div class="flex flex-col overflow-y-scroll gap-y-2">
                
                <div v-for="location in searchResults" class="text-xs bg-gray-800 p-4 rounded-md" @click="selectLocation(location)">
                  <p class="text-lg">{{ location.name }}</p>
                  <p class="text-xs opacity-50">{{ location.address }}</p>
                </div>

              </div>
            </div>
          </div>
        </div>
      </template>
    </UDrawer>
</template>

<script lang="ts" setup>

defineProps<{
  open: boolean
}>();

const emit = defineEmits(['update:open']);


const {
  searchInput,
  searchResults,
  isSearchPanelVisible,
  isSearching
} = storeToRefs(useLocationSearchStore());

const {
  address
} = storeToRefs(useLocationStore());

const {
defaultLocation,
locations
} = storeToRefs(useAccountLocations())

function selectLocation(payload: any){

}
</script>

