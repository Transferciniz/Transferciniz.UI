<template>
  <div class="h-screen w-screen m-0 p-0 flex flex-col bg-gray-900 select-none">
    <div class="bg-gray-900 flex justify-start items-center border-b-white/20 border-b p-4">
      <Icon name="material-symbols:arrow-back-ios-rounded" size="30" class="w-[40px]" @click="prev"/>
      <p class="flex-grow ml-[-40px] text-center w-full text-lg font-medium">{{title}}</p>
    </div>
    <div class="flex-grow flex-1 overflow-y-scroll">
      <slot class="overflow-y-scroll flex-grow"/>
    </div>
    <Navigation/>
  </div>

</template>
<script setup lang="ts">
import Navigation from "~/components/navigation.vue";

const {
  title
} = storeToRefs(usePageTitleStore())

function prev(){
  useRouter().back();
}
</script>