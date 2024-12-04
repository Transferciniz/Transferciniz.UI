<template>
  <div class="inline">
    <UBadge label="İşleme Alınmadı" color="neutral" variant="subtle" v-if="status == 0" />
    <UBadge label="İşlem Sürüyor" color="warning" variant="subtle" v-if="status == 1" />
    <UBadge label="Bitti" color="success" variant="subtle" v-if="status == 2" />
  </div>
</template>

<script lang="ts" setup>
defineProps<{
  status: number
}>()
</script>
