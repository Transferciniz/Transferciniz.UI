<template>
  <div class="flex justify-between items-center p-4 bg-gray-800 gap-x-3 border-b border-gray-600" v-if="isViewingInWebView == false">
    <div class="flex flex-col justify-center items-center w-36">
      <img src="/appIcon.jpg" alt="Application Icon" class="size-12 rounded-md shadow" />
    </div>
    <p class="text-xs">En iyi deneyim için Transferciniz'i mobil uygulamamız üzerinden kullanmanızı öneriyoruz.</p>
    <UButton color="neutral" variant="subtle" size="lg" class="px-8" @click="openApp">Aç</UButton>
  </div>
</template>
<script setup lang="ts">

const isViewingInWebView = ref(isWebView())
function openApp(){
  window.location.href = 'transferciniz://home'
}

function isWebView() {
  const isIOS = /iPhone|iPad|iPod/.test(navigator.userAgent);
  const hasMessageHandlers = !!(window.webkit && window.webkit.messageHandlers);
  const modifiesWindowOpen = typeof window.open !== 'function';
  return isIOS && hasMessageHandlers && modifiesWindowOpen;
}
</script>