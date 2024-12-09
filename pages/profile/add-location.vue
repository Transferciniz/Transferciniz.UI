<template>
  <div class="flex flex-col h-full">
    <AddAccountAddress :is-default="false" @on-completed="onCompleted"/>
  </div>
</template>

<script lang="ts" setup>

definePageMeta({
  layout: "title-layout",
})
usePageTitleStore().setTitle("Yeni Adres Ekle")

function onCompleted(){
  useRouter().push('/profile');
}
</script>
