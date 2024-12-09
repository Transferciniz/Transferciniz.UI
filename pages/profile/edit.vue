<template>
  <div class="flex flex-col p-4 gap-y-4">
    <UTabs :items="tabs" v-model:model-value="currentTab" />
    <div class="flex flex-col gap-y-2 p-4" v-if="currentTab === '0'">
      <ProfilePictureUploader/>
    </div>
    <div class="flex flex-col gap-y-2 rounded-md p-4" v-if="currentTab === '1'">
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
const tabs = ref([
  {
    label: 'Profil Fotoğrafı',
    id: 0
  },
  {
    label: 'Kişisel Bilgiler',
    id: 1
  },
  {
    label: 'Bildirim İzinleri',
    id: 2
  }
])
const currentTab = ref('0')

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