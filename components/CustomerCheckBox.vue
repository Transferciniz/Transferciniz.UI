<template>
  <USwitch
      unchecked-icon="i-lucide-x"
      checked-icon="i-lucide-check"
      :label="checkBoxValue ? 'Araca Bindi' : 'Araca Binmedi'"
      size="xl"
      v-model="checkBoxValue"
  />
</template>

<script setup lang="ts">
const props = defineProps<{
  isCame: boolean
}>();

const emit = defineEmits<{
  (e: 'onValueChanged', value: boolean): void
}>()

const checkBoxValue = ref(props.isCame)

watch(checkBoxValue,  value => {
  emit('onValueChanged', value)
})
</script>