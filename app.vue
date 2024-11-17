<template>
  <div>
    <UApp :toaster="{position:'top-center'}">
      <div class="bg-[var(--ui-bg)] !antialiased" vaul-drawer-wrapper>
        <NuxtLayout>
          <NuxtPage/>
        </NuxtLayout>
      </div>
    </UApp>


  </div>

</template>

<script setup lang="ts">

useLocationStore();
useAuthStore();
</script>

<style>
.leaflet-div-icon {
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

.leaflet-div-icon {
  background: unset !important;
}

.leaflet-routing-container {
  display: none;
}

.mapboxgl-ctrl-logo {
  display: none !important;
}
</style>