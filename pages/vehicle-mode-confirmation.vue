<template>
  <Camera mode="qr" @on-qr-readed="onQrReaded" />

</template>
<script setup lang="ts">
definePageMeta({
  layout: "fullscreen",
})

function onQrReaded(vehicleId: string): void {
  useDriverStore().setAccountVehicle(vehicleId).then(x => {
    useRouter().push('/vehicle-online-request')
  })
}
</script>

