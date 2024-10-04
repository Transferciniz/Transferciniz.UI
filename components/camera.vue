<template>
  <div class="relative">
    <video id="camera" ref="video" muted autoplay class="w-screen h-screen object-cover"></video>
    <canvas class="hidden" width="400" height="400" ref="canvas"/>
    <!-- QR Kod tarayıcı çerçevesi -->
    <div v-if="mode === 'qr'" class="absolute inset-0 flex items-center justify-center pointer-events-none">
      <div class="border-4 border-gray-500 bg-gray-500/30 text-gray-600 animate-pulse w-64 h-64 rounded-xl grid place-items-center">
        <Icon name="material-symbols:qr-code" size="100"/>
      </div>
    </div>

    <div v-if="mode === 'qr'" class="absolute top-0 flex flex-col items-center justify-center bg-gray-800/80 p-4 w-full gap-y-1">
      <p class="text-sm">Lütfen aracınızın QR kodunu okutun ya da plakasını yazınız</p>
      <UInput color="gray" variant="outline" placeholder="Plaka Yazınız..." v-model="textInput" />
    </div>

    <div v-if="mode === 'capture'" class="absolute bottom-0 flex flex-col items-center justify-center bg-gray-800/50 backdrop-blur-md p-4 w-full gap-y-1">
      <div class="flex justify-around items-center w-full">
        <Icon name="material-symbols:flashlight-on-outline" size="40"/>
        <div class="bg-red-800 rounded-full border-white border-2 w-14 h-14 flex justify-center items-center" @click="capture">
          <Icon name="material-symbols:android-camera-outline" class="bg-white" size="30"/>
        </div>
        <Icon name="material-symbols:flip-camera-ios-outline" size="40"/>
      </div>

    </div>


  </div>

</template>
<script setup lang="ts">
import { useDevicesList, useUserMedia } from '@vueuse/core'
import { ref, watchEffect } from 'vue'
import jsQR from "jsqr";

const props = defineProps<{
  mode: 'qr' | 'capture'
}>();
const emit = defineEmits<{
  (e: 'onQrReaded', value: string): void,
  (e: 'onImageCaptured', value: any): void,
  (e: 'onCancelled'): void,
  (e: 'onTextInputUsed', value: string): void
}>()
const canvas = ref<HTMLCanvasElement>();
const textInput = ref("");
const currentCamera = ref<string>()
let interval: NodeJS.Timeout | undefined = undefined;
const { videoInputs: cameras } = useDevicesList({
  requestPermissions: true,
  onUpdated() {
    if (!cameras.value.find(i => i.deviceId === currentCamera.value))
      currentCamera.value = cameras.value[0]?.deviceId
  },
})

const video = ref<HTMLVideoElement>()
const { stream, enabled } = useUserMedia({
  constraints: { video: { deviceId: currentCamera.value } },
})



function capture(){
  getImageBlob().then(blob => {
    emit('onImageCaptured', blob)
  })

}

onMounted(() => {
  enabled.value = true;
  if(props.mode === 'qr'){
    interval = setInterval(() => {
      detectQR();
      console.log('çalışıyor')
    },500)
  }
})
onBeforeUnmount(() => {
  if(props.mode === 'qr'){
    clearInterval(interval)
  }
})

function detectQR(){
  const image = getImage()
  const qrData = jsQR(image!.data, image!.width, image!.height);
  if(qrData){
    useRouter().push('/vehicle-online-request')
    emit('onQrReaded', qrData.data)
  }
}

function getImage(){
  if(canvas.value && video.value){
    canvas.value.height = video.value.videoHeight;
    canvas.value.width = video.value.videoWidth;
    const ctx = canvas.value.getContext('2d');
    ctx!.drawImage(video.value, 0, 0, video.value.videoWidth, video.value.videoHeight)
    return ctx!.getImageData(0, 0, canvas.value.width, canvas.value.height);
  }
}

function getImageBlob(){
  return new Promise((resolve) => {
    if(canvas.value && video.value){
      canvas.value.height = video.value.videoHeight;
      canvas.value.width = video.value.videoWidth;
      const ctx = canvas.value.getContext('2d');
      ctx!.drawImage(video.value, 0, 0, video.value.videoWidth, video.value.videoHeight)
      canvas.value.toBlob(blob => {
          resolve(blob)
      })
    }
  })

}

watchEffect(() => {
  if (video.value)
    video.value.srcObject = stream.value!
})
</script>

