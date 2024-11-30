<template>
  <div class="flex flex-col h-full">
    <div ref="mapContainer" class="h-1/2 w-full"></div>
    <div class="px-6 mt-6">
      <UAlert description="Tam konumu ayarlamak için lütfen haritadaki pini sürükleyiniz."  color="neutral" variant="soft"/>
    </div>
    <div class="flex flex-col p-6 gap-y-4">
      <UFormField label="Adres Adı" size="lg" description="Sizin hatırlayabileceğiniz bir isim verin.">
        <UInput v-model:model-value="address.displayAddress" class="w-full" />
      </UFormField>
      <UFormField label="Tam Adres" size="lg">
        <UTextarea  autoresize v-model:model-value="address.address" class="w-full" />
      </UFormField>
      <UButton label="Konumu Kaydet" color="success" variant="solid" class="flex justify-center" loading-auto @click="addAddress"/>
    </div>
  </div>
</template>

<script lang="ts" setup>
import mapboxgl, { Marker } from 'mapbox-gl';
import type { IReverseGeocodingResponse } from '~/core/api/modules/account/models/IReverseGeocodingResponse';
import { useApi } from '~/core/api/useApi';

definePageMeta({
  layout: "title-layout",
})
usePageTitleStore().setTitle("Yeni Adres Ekle")

const mapContainer = ref();
const mapbox = ref<mapboxgl.Map>();

const { location } = storeToRefs(useLocationStore());
const address = ref<IReverseGeocodingResponse>({
  address: '',
  displayAddress: ''
});
const marker = ref<Marker>()

onMounted(() => {
  mapbox.value = useMapbox().createMap(mapContainer.value, { latitude: location.value.latitude, longitude: location.value.longitude });
  marker.value = new mapboxgl.Marker({
    element: useMapbox().createDefaultMarker(),
    draggable: true,
  }).setLngLat([location.value.longitude, location.value.latitude]).addTo(mapbox.value!);
  getAddress(location.value.latitude, location.value.longitude)
  marker.value.on('dragend', () => {
    const { lat, lng } = marker.value!.getLngLat()
    getAddress(lat, lng);
  })
  mapbox.value.easeTo({
    center: { lat: location.value.latitude, lng: location.value.longitude },
    zoom: 14
  })

})

function getAddress(latitude: number, longitude: number) {
  useAccountLocations().getAddress(latitude, longitude).then(res => {
    address.value = res.data
  })
}

async function addAddress() {
  const { lat, lng } = marker.value!.getLngLat()
  return useApi().account.AddLocation(address.value!.displayAddress, address.value!.address, lat, lng).then(() => {
    useRouter().push('/profile')
  })

}
</script>
