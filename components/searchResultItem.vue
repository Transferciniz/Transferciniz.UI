<template>
  <div class="p-4 text-white text-md flex items-center justify-around">
    <div class="flex flex-col w-8/12">
      <div class="font-medium text-md">{{title}}</div>
      <div class="font-light text-sm text-gray-400">{{description}}</div>
    </div>
    <div class="font-light text-md text-gray-300 flex flex-col gap-y-0 w-2/12">
      <span>{{distance}}</span>
      <span>{{eta}}</span>
    </div>
    <div class="w-2/12 flex justify-end">
      <Icon name="material-symbols:directions-alt" class="bg-white" size="40" />
    </div>
  </div>
</template>

<script setup lang="ts">

defineProps<{
  title: string,
  description: string,
  distance: string,
  eta: string
}>()
</script>