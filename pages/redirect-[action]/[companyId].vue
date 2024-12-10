<template>
    <div class="flex flex-col justify-center items-center h-full">
      <h1 class="text-lg font-bold">Yönlendiriliyorsunuz</h1>
      <p class="text-sm opacity-50">Lütfen bekleyiniz</p>
    </div>
  </template>
  
  <script setup lang="ts">
  definePageMeta({
    layout: "fullscreen",
  })
  useSeoMeta({
    title: 'Transferciniz',
    description: 'Transfer bir tık uzağınızda!',
    ogImage: '/logo.png',
    twitterImage: '/logo-type.png',
  })
  
  useHead({
    htmlAttrs: {
      lang: 'tr'
    },
    link: [
      {
        rel: 'icon',
        type: 'image/png',
        href: '/favicon.png'
      }
    ]
  })
  const router = useRouter();
  onMounted(() => {
    const action = router.currentRoute.value.params.action as string;
    if(action){
      switch(action){
        case 'register':
          register(router.currentRoute.value.params.companyId as string);
          break;
      }
    }
  
  })
  
  function register(companyId: string){
    window.location.href = "transferciniz://register?companyId=" + companyId;
  }
  
  
  </script>