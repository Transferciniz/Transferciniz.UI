<template>
  <div class="h-screen w-screen m-0 p-0 flex flex-col bg-gray-900 select-none">
    <AppLauncher/>
    <div class="flex-grow flex-1 overflow-y-scroll">
      <slot class="overflow-y-scroll flex-grow"/>
    </div>
    <Navigation/>
  </div>

</template>
<script setup lang="ts">
import Navigation from "~/components/navigation.vue";

</script>