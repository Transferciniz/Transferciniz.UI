<template>
  <div class="flex flex-col">
    <USeparator label="Varsayılan Adresiniz" class="mt-4"/>
    <div class="bg-gray-800 flex flex-col p-4 rounded-md mt-2">
      <p class="text-xl font-bold">{{ defaultLocation.name }}</p>
      <p class="text-xs opacity-50">{{ defaultLocation.address }}</p>
      </div>
    <USeparator label="Diğer Adresleriniz" class="mt-4"/>
    <div class="flex flex-col gap-y-2 mt-2">
      <div class="bg-gray-800 flex flex-col p-4 rounded-md" v-for="location in locations">
        <p class="text-xl font-bold">{{ location.name }}</p>
        <p class="text-xs opacity-50">{{ location.address }}</p>
      </div>
    </div>
    <UButton color="success" class="flex justify-center mt-4" variant="soft" label="Adres Ekle" to="/profile/add-location" />
  </div>
</template>

<script lang="ts" setup>


const {
  defaultLocation,
  locations
  } = storeToRefs(useAccountLocations())
</script>

