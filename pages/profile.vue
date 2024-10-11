<template>
  <div class="h-screen w-screen flex flex-col p-4">
    <div class="bg-red-800 text-white px-4 py-1" @click="logout">Çıkış Yap</div>
  </div>
</template>

<script setup lang="ts">

const {logout} = useAuthStore()
</script>