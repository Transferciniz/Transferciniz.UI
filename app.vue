<template>
  <div>
    <NuxtLayout v-if="isContentReady">
      <NuxtPage/>
    </NuxtLayout>
    <UNotifications/>
    <UModals/>
  </div>

</template>

<script setup lang="ts">
import {Loader} from "@googlemaps/js-api-loader";


const isContentReady = ref(true);
useLocationStore();
useAuthStore();


</script>

<style>
.leaflet-div-icon{
  border: none;
}
::-webkit-scrollbar {
  display: none;
}
.slide-enter-active,
.slide-leave-active {
  transition: all 0.2s ease-in-out;
}

.slide-enter-to {
  position: absolute;
  right: 0;
}

.slide-enter-from {
  position: absolute;
  right: -100%;
}

.slide-leave-to {
  position: absolute;
  left: -100%;
}

.slide-leave-from {
  position: absolute;
  left: 0;
}
</style>