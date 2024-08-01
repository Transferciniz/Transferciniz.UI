<script lang="ts" setup>
const props = defineProps<{
  title: string
}>()

const isOpened = ref(false);
const isAnimating = ref(false)

function open() {
  document.body.style.overflow = 'hidden'
  isOpened.value = true;
  setTimeout(() => {
    isAnimating.value = true;
  },1)
}

function close() {
  document.body.style.overflow = 'unset'
  isAnimating.value = false;
  setTimeout(() => {
    isOpened.value = false;
  }, 300)
}

defineExpose({
  open,
  close
});

</script>

<template>
  <div>
    <template v-if="isOpened">
      <div class="fixed top-0 left-0 w-screen h-screen bg-black/50 z-50 transition-all opacity-0 ease-in-out duration-300 backdrop-blur-sm" :class="{'opacity-100': isAnimating && isOpened}" @click="close()"></div>
      <div class="fixed bottom-0 z-50 left-0 bg-gray-900/60 rounded-t-2xl backdrop-blur-xl translate-y-[100%] transition-all ease-in-out duration-300"  :class="{'!translate-y-[0%]': isOpened && isAnimating}">
        <div class="w-screen h-14 border-b border-gray-600 flex justify-center items-center text-center text-xl text-white">{{title}}</div>
        <div class="w-screen max-h-[500px] overflow-y-scroll">
          <slot/>
        </div>
      </div>
    </template>
  </div>
</template>

