<template>
  <div class="flex flex-col w-full">
    <div class="fixed bottom-5 right-0 z-10 flex items-center justify-center w-full" v-if="isRulesCompleted" @click="onFinish">
      <p class="bg-green-700 rounded border-green-900 border text-gray-900 text-center py-2 px-4">Operasyon Onayı Al</p>
    </div>
    <Camera mode="capture" v-if="isCameraVisible" @on-image-captured="onImageCaptured"/>

    <p class=" p-4 text-sm text-center">Lütfen belirtilen talimatlara göre aracınızın fotoğraflarını yükleyiniz.</p>

    <div class="flex flex-col gap-y-4 p-4">
      <UCard v-for="category in categories"  :key="category.id" :ui="{header:{base: category.images.length >= category.minSize ? 'bg-green-700' : 'bg-gray-700'}}">
        <template #header>
          <div class="flex justify-between items-center">
            <div class="flex justify-start items-center gap-x-2">
              <p>{{category.name}}</p>
              <UPopover class="flex items-center">
                <Icon name="material-symbols:info-outline" size="20" />
                <template #panel>
                  <p class="p-4 text-xs max-w-[200px]">{{category.description}}</p>
                </template>
              </UPopover>
            </div>
            <UBadge color="white" variant="solid" @click="openCamera(category.id)">Fotoğraf Ekle</UBadge>
          </div>
        </template>

        <div class="flex flex-wrap justify-start items-center gap-x-4" v-if="category.images.length > 0">
          <img :src="image" v-for="image in category.images" class="w-20 h-20 object-cover rounded" alt="captured_image"/>
        </div>

        <div v-else>
          <UAlert title="Hiç fotoğraf eklenmemiş!" />
        </div>

      </UCard>

    </div>

  </div>
</template>
<script setup lang="ts">

definePageMeta({
  layout: "fullscreen",
})
const isCameraVisible = ref(false);
const selectedCategory = ref('');
const isRulesCompleted = ref(false);
const categories = ref<{id: string; name: string, images: string[], minSize: number, description: string}[]>([
  {
    id: "inner",
    name: "Araç İçi",
    images: [],
    minSize: 3,
    description: "Lütfen aracınızın arka, orta ve ön bölümünü gösterecek şekilde en az 3 farklı açıdan fotoğraf yükleyiniz.",
  },
  {
    id: "front",
    name: "Araç Dış - Ön",
    images: [],
    minSize: 1,
    description: "Lütfen aracınızın ön tarafından plakası gözükür ve okunur biçimde fotoğrafını çekiniz."
  },
  {
    id: "right",
    name: "Araç Dış - Sağ",
    images: [],
    minSize: 1,
    description: "Lütfen aracınızın sağ tarafının tamamını gözükür biçimde fotoğrafını çekiniz."

  },
  {
    id: "left",
    name: "Araç Dış - Sol",
    images: [],
    minSize: 1,
    description: "Lütfen aracınızın sol tarafının tamamını gözükür biçimde fotoğrafını çekiniz."

  },
  {
    id: "back",
    name: "Araç Dış - Arka",
    images: [],
    minSize: 1,
    description: "Lütfen aracınızın arka tarafının plakası gözükür şekilde fotoğrafını çekiniz."

  },
  {
    id: "selfie",
    name: "Sürücü",
    images: [],
    minSize: 1,
    description: "Lütfen kendizi yüzünüz ve kıyafetiniz görünür biçimde bir öz çekim yükleyiniz."
  },
  {
    id: 'vehicleKilometer',
    name: 'Araç Güncel Kilometresi',
    images: [],
    minSize: 1,
    description: "Lütfen aracınızın güncel KM bilgisini gösterecek bir fotoğraf çekiniz."
  }
]);

function onImageCaptured(image: Blob){
  categories.value.find(x => x.id === selectedCategory.value)?.images.push(URL.createObjectURL(image));
  isCameraVisible.value = false;
  checkRules();

}

function openCamera(category: string){
  window.scroll(0,0)
  isCameraVisible.value = true;
  selectedCategory.value = category;
}

function checkRules(){
  isRulesCompleted.value = categories.value.every(x => x.images.length >= x.minSize);
}

function onFinish(){
  useVehicleModeStore().setVehicleOnline()
}
</script>