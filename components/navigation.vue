<template>
  <div class="z-1 w-full h-16 bg-gray-900 shadow-2xl">
    <div class="flex justify-around items-center h-full bg-gray-900">
      <NuxtLink to="/home" active-class="!text-white" class="text-gray-600 transition ease-in-out duration-300 ">
      <Icon name="material-symbols:home-rounded" size="30" mode="css" />
      </NuxtLink>
      <NuxtLink to="/home/trip-route" active-class="!text-white" class="text-gray-600 transition ease-in-out duration-300 ">
      <Icon name="mdi:navigation-variant" size="30" mode="css" />
      </NuxtLink>
      <Icon name="octicon:history-16" size="30" class="bg-gray-600" />
      <img class="w-10 h-10 rounded-full" src="/logo-type.png" alt="tripTypeLogo" @click="openTripTypeDrawer()">
    </div>
    <Drawer title="Transfer Tipi Seç" ref="selectTripTypeDrawer">
      <div class="flex flex-col gap-y-4 p-5 divide-y divide-gray-600">
        <div class="flex justify-between p-4 items-center rounded-md border border-gray-400 text-white">
          <p>Kara Yolu Transferi</p>
          <img src="/logo-type.png" class="w-12 h-12" alt="groundTrip">
        </div>
        <div class="flex justify-between p-4 items-center rounded-md border border-gray-400 text-white">
          <p>Kara Yolu Transferi</p>
          <img src="/logo-type.png" class="w-12 h-12" alt="groundTrip">
        </div>
        <div class="flex justify-between p-4 items-center rounded-md border border-gray-400 text-white">
          <p>Kara Yolu Transferi</p>
          <img src="/logo-type.png" class="w-12 h-12" alt="groundTrip">
        </div>
      </div>
    </Drawer>
  </div>

</template>
<script setup lang="ts">

const selectTripTypeDrawer = ref(null)

function openTripTypeDrawer() {
  selectTripTypeDrawer?.value?.open();
}
</script>