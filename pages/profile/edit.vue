<template>
  <div class="flex flex-col p-4 gap-y-4">
    <div class="flex flex-col gap-y-2 bg-gray-800 rounded-md p-4">
      <p class="text-lg font-medium">Profil Fotoğrafı</p>
      <div class="flex flex-col gap-y-4 justify-center items-center">
        <img :src="user.profilePicture" alt="profile-picture" class="size-40 object-cover text-center rounded-full" />
        <UButton color="primary" variant="solid" class="justify-center w-full" @click="uploadPicture">Profil Fotoğrafı Yükle</UButton>
        <p>Progress: {{ progress }}</p>
      </div>
    </div>
    <div class="flex flex-col gap-y-2 bg-gray-800 rounded-md p-4">
      <p class="text-lg font-medium">Kişisel Bilgiler</p>
      <div class="flex flex-col gap-y-4">
        <UFormField
            label="Ad"
            :required="true"
            size="lg"
        >
          <UInput placeholder="Adınızı Yazınız" v-model:model-value="form.name" class="w-full" />
        </UFormField>

        <UFormField
            label="Soyad"
            :required="true"
            size="lg"
        >
          <UInput placeholder="Soyadınızı Yazınız"  v-model:model-value="form.surname" class="w-full" />
        </UFormField>
        <UFormField
            label="Mail Adresi"
            :required="true"
            size="lg"
            help="Lütfen geçerli bir mail adresi giriniz, onay mailiniz girmiş olduğunuz mail adresine gönderilecektir."
        >
          <UInput placeholder="Mail Adresinizi Yazınız" v-model:model-value="form.email" class="w-full" />
        </UFormField>
        <UButton color="primary" variant="solid" class="justify-center w-full" >Kaydet</UButton>
      </div>
    </div>


  </div>
</template>
<script setup lang="ts">
import { useImagePicker } from '~/composables/useImagePicker';
import { useApi } from '~/core/api/useApi';

definePageMeta({
  layout: "title-layout",
})
usePageTitleStore().setTitle("Profil Düzenle")


const {user} = storeToRefs(useAuthStore())
const progress = ref(0);

const form = ref({
  name: user.value.name,
  surname: user.value.surname,
  email: user.value.email,
})

function uploadPicture(){
  useImagePicker().then((file: File) => {
    useApi().account.UploadProfilePicture(file, (payload) => {progress.value = payload}).then(res => {
    useAuthStore().onProfilePictureChange(res.data.token);
  })
  })
}
</script>