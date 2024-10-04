<template>
  <div class="flex flex-col p-4">
    <p class="text-xl">Araçlarınız</p>
    <div class="flex flex-col mt-5">
      <p class="text-sm text-gray-400 border-b border-gray-700 w-full py-2 mb-2">İş Bekleyenler (1)</p>
      <NuxtLink to="/vehicle-detail">
      <div class="flex flex-wrap items-center justify-start">
        <div class="bg-gray-700 rounded p-2 flex flex-col items-center justify-center">
          <UAvatar :alt="'AGV'" :chip-color="'yellow'" size="lg" />
          <p class="text-gray-400 text-xs">Mercedes</p>
          <p>Vito</p>
          <div class="bg-white border border-black text-xs text-black px-2 py-1 rounded">07 AGV 123</div>
        </div>
      </div>
      </NuxtLink>

    </div>
    <div class="flex flex-col mt-5">
      <p class="text-sm text-gray-400 border-b border-gray-700 w-full py-2 mb-2">Transfer Sürecindekiler</p>
      <div class="flex flex-wrap items-center justify-start">
        <UAlert title="Hiç Araç Yok!" />
      </div>

    </div>
    <div class="flex flex-col mt-5">
      <p class="text-sm text-gray-400 border-b border-gray-700 w-full py-2 mb-2">Çevrimdışı Araçlar</p>
      <div class="flex flex-wrap items-center justify-start">
        <UAlert title="Hiç Araç Yok!" />
      </div>

    </div>
    <div class="flex flex-col mt-5">
      <p class="text-sm text-gray-400 border-b border-gray-700 w-full py-2 mb-2">Arızalı Araçlar</p>
      <div class="flex flex-wrap items-center justify-start">
        <UAlert title="Hiç Araç Yok!" />
      </div>

    </div>
  </div>
</template>
<script setup lang="ts">
</script>