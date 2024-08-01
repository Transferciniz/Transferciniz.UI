<template>
  <div class="flex justify-between p-2 items-center bg-gray-900 z-1">
    <div class="w-1/2">
      <img src="/logo.png" alt="logo">
    </div>
    <div class="w-1/2 flex justify-end items-center gap-x-4">
      <Icon :name="'material-symbols:notifications'" size="28" class="bg-white" />
      <img class="w-10 h-10 rounded-full" src="/profile.jpg" alt="">
    </div>
  </div>
</template>