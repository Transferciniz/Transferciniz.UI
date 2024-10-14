<template>
  <div ref="container" class="fixed w-screen bg-gray-900 rounded-t-2xl h-[600px] z-[1000] bottom-0 left-0 border">
    <pre>{{lengthY}}</pre>
  </div>
</template>

<script setup  lang="ts">
const container = ref(null);
const {lengthY} = useSwipe(container);

watch(lengthY, value => {
})
</script>