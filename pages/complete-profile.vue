<template>
  <div class="flex flex-col items-center justify-center p-4 h-full">
    <p class="text-xl mb-3">Profilinizi Tamamlayın</p>
    <UStepper :model-value="activeStep" disabled :items="steps" />

    <div class="flex flex-col mt-5 h-full">
      <ProfilePictureUploader @on-uploaded="nextStep" v-if="activeStep == 0"/>
      <AddAccountAddress @on-completed="nextStep" :is-default="true" v-if="activeStep == 1"/>
      <div class="flex flex-col items-center justify-center gap-y-4 mt-10" v-if="activeStep == 2">
        <div class="flex flex-col justify-center items-center">
          <p class="text-2xl">Artık Hazırsınız</p>
          <p class="text-sm opacity-50 text-center">Sizde transferciniz dünyasının avantajlı yolculuklarından faydalanabilirsiniz.</p>
        </div>

        <UButton label="Uygulamayı Kullanmaya Başlayın" color="success" variant="subtle" @click="onCompleted"/>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
definePageMeta({
  layout: "fullscreen",
})

const steps = ref([
  {
    title: 'Profil Fotoğrafı',
    description: 'Bir profil fotoğrafı yükleyin',
  },
  {
    title: 'Adres Ekleyin',
    description: 'Varsayılan adresinizi ekleyin',
  },
  {
    title: 'Bitti!',
  }
]);
const activeStep = ref(2)

function nextStep(){
  activeStep.value = activeStep.value++
}

function onCompleted(){
  useAuthStore().completeProfile();
  useRouter().push('/')
}
</script>

<style>

</style>