<template>
  <UPopover  overlay :popper="{ arrow: true }" v-model:open="isPopoverVisible" @click="isPopoverVisible = true">
    <div class="bg-gray-700 rounded p-2 flex flex-col items-center justify-center" >
      <UAvatar :src="vehicle.vehicle.vehicleModel.photo" :alt="vehicle.vehicle.vehicleBrand.name + ' ' + vehicle.vehicle.vehicleModel.name" :chip-color="chipColor" size="3xl" />
      <p class="text-gray-400 text-xs">{{vehicle.vehicle.vehicleBrand.name}}</p>
      <p>{{vehicle.vehicle.vehicleModel.name}}</p>
      <div class="bg-white border border-black text-xs text-black px-2 py-1 rounded">{{vehicle.plate}}</div>
    </div>
    <template #content>
      <div class="p-2 flex flex-col w-[300px] gap-y-2">
        <div class="flex justify-center items-center gap-x-4">
          <div class="bg-gray-700 w-1/2 rounded-md px-4 text-sm py-2 text-center flex-grow" @click="openQR($event)">QR Kod</div>
          <div class="bg-gray-700 w-1/2 rounded-md px-4 text-sm py-2 text-center flex-grow">Transfler</div>
        </div>
        <div class="flex justify-center items-center gap-x-4">
          <div class="bg-gray-700 w-1/2 rounded-md px-4 text-sm py-2 text-center flex-grow">Raporlar</div>
          <div class="bg-red-700 w-1/2 text-white  rounded-md px-4 text-sm py-2 text-center flex-grow">Aracı Sil</div>
        </div>
      </div>
    </template>
  </UPopover>

  <UDrawer should-scale-background v-model:open="isQRVisible">
      <template #header>
        <p>Araç QR Kodu</p>
      </template>
      <template class="p-0 h-40" #body>
        <img :src="qrImage" class="w-full" alt="QRCode">
      </template>
      <template #footer>
          <div class="bg-gray-700 text-white px-10 py-2 w-full text-center text-sm rounded-lg" @click="saveQR">QR Kodu İndir</div>
          <div class="bg-gray-700 text-white px-10 py-2 w-full text-center text-sm rounded-lg" @click="isQRVisible = false">Onayla</div>
      </template>

  </UDrawer>
</template>

<script setup lang="ts">
import { useQRCode } from '@vueuse/integrations/useQRCode'

const isPopoverVisible = ref(false);
const isQRVisible = ref(false)
const props = defineProps<{
  vehicle: any
  chipColor: string
}>()
const qrImage = useQRCode(props.vehicle.id, {
  scale:20
})

function openQR(event: Event){
//  event.stopPropagation();
//  event.preventDefault();
  isPopoverVisible.value = false;
  isQRVisible.value = true;
}
function saveQR(){
  downloadBase64File(qrImage.value, `${props.vehicle.plate}.png`)
  isQRVisible.value = false;
}

function downloadBase64File(base64Data: string, fileName: string) {
  // Base64 verisini ayır ve sadece veri kısmını al
  const base64String = base64Data.split(',')[1];

  // Base64'ü binary formatına dönüştür
  const binaryString = window.atob(base64String);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }

  // Blob objesi oluştur
  const blob = new Blob([bytes], { type: 'image/png' });

  // Blob'dan bir URL oluştur
  const url = window.URL.createObjectURL(blob);

  // Bir <a> etiketi oluştur ve bu URL ile bağlantı ver
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;

  // <a> etiketini body'ye ekle, tıklat ve sonra kaldır
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  // URL'yi serbest bırak
  window.URL.revokeObjectURL(url);
}

</script>