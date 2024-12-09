<template>
  <div>
    <div class="flex flex-col justify-center items-center">
      <UAvatar :src="user.profilePicture" :alt="`${user.name} ${user.surname}`" size="3xl" class="size-72"/>

        <div class="mt-5 flex flex-col w-full">
          <UButton color="primary" variant="solid" class="justify-center w-full" @click="uploadPicture" v-if="isUploading == false">Profil Fotoğrafı Yükle</UButton>
          <div class="flex flex-col gap-y-2 justify-center items-center" v-if="isUploading">
            <p class="text-md">Yükleniyor Lütfen Bekleyiniz</p>
            <USlider :min="0" :max="100" v-model:model-value="progress" disabled color="success"/>
          </div>
        </div>

      </div>
  </div>
</template>

<script lang="ts" setup>
import { useApi } from '~/core/api/useApi';

const {user} = storeToRefs(useAuthStore())
const progress = ref(0);
const isUploading = ref(false);

function uploadPicture(){
  useImagePicker().then((file: File) => {
    progress.value = 0;
    useApi().account.UploadProfilePicture(file, (payload) => {
      isUploading.value = true;
      progress.value = payload
    }).then(res => {
    useAuthStore().onProfilePictureChange(res.data.token);
    isUploading.value = false;
    progress.value = 0;
  })
  })
}
</script>

