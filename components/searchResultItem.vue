<template>
  <div class="p-4 text-white text-md flex items-center justify-around">
    <div class="flex flex-col w-8/12">
      <div class="font-medium text-md">{{location.name}}</div>
      <div class="font-light text-sm text-gray-400">{{location.address}}</div>
      <div class="flex justify-start items-center gap-x-2">
        <Icon name="material-symbols:kid-star" size="20" v-for="i in Number.parseInt((location.rating ?? 0).toFixed())" />
      </div>
    </div>
    <div class="font-light text-md text-gray-300 flex flex-col gap-y-0 w-2/12">

    </div>
    <div class="w-2/12 flex justify-end">
      <Icon name="material-symbols:directions-alt" class="bg-white" size="40" @click="emit('onLocationSelected', location)" />
    </div>
  </div>
</template>

<script setup lang="ts">

defineProps<{
  location: any
}>()

const emit = defineEmits<{
  (e: 'onLocationSelected', value: any): void
}>()
</script>