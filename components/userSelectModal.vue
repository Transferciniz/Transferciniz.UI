<script lang="ts" setup>
defineProps({
  title: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['success'])

function onSuccess () {
  emit('success')
}
</script>

<template>
  <UModal >
    <UCard>
      <template #header>
        <p>{{title}}</p>
      </template>
      <template #default>
        <div class="flex flex-col gap-y-2">
          <div class="relative">
            <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
              <svg class="w-4 h-4 text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
              </svg>
            </div>
            <input type="search" id="default-search" class="block w-full p-2 ps-10 text-sm border rounded-lg bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-base-500 focus:border-base-500" placeholder="Ara..." required />
          </div>
          <div class="flex flex-start gap-x-2 items-center" v-for="item in 10">
            <UCheckbox :color="'green'"/>
            <UAvatar alt="Erdoğan Sönmez" size="md"/>
            <div class="flex flex-col">
              <p class="text-sm">Erdoğan Sönmez</p>
              <p class="text-xs">erdogansonmez</p>
            </div>
          </div>
        </div>
      </template>
      <template #footer>
        <div class="flex justify-between">
          <div class="bg-gray-700 text-white px-10 py-2 w-full text-center text-sm rounded-lg">Seçilenleri Ekle</div>
        </div>
      </template>

    </UCard>
  </UModal>
</template>

