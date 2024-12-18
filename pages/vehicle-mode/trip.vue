<template>
  <div class="h-screen w-screen">
    <div ref="mapBoxContainer"  class="h-screen w-screen"></div>
    <div class="fixed w-screen bottom-10 left-0 flex justify-center gap-x-4">
      <UButton color="neutral" class="justify-center font-bold" trailing-icon="i-lucide-arrow-right" v-if="isNavigationStarted === false" @click="getRouteForStartPoint">Navigasyonu Başlat</UButton>
      <UButton color="neutral" class="justify-center font-bold" v-if="isNavigationStarted === true" @click="isNavigationStarted = false">Navigasyonu Durdur</UButton>
      <UButton color="error" class="justify-center font-bold" @click="navigateToVehicleMode">Araç Moduna Dön</UButton>
    </div>

    <UDrawer
        v-if="selectedWaypoint"
        :title="selectedWaypoint.name + ' Durağına Geldiniz'"
        description="Lütfen araca binen kişileri onaylayınız."
        v-model:open="isWaypointDrawerOpen"
    >
      <UButton label="Open" color="neutral" variant="subtle" trailing-icon="i-lucide-chevron-up" />

      <template #body>
        <div class="rounded-t-md flex flex-col w-full p-4">
          <div class="flex justify-between items-center mt-2" v-for="user in selectedWaypoint.users">
            <UAvatar :src="user.profilePicture" :alt="user.name + ' ' + user.surname " size="3xl" class="size-20" />

            <div class="flex flex-col rounded-md p-4 justify-center items-center">
              <p class="text-lg">{{user.name}}</p>
              <p class="text-xs">{{user.surname}}</p>
            </div>
            <CustomerCheckBox :is-came="user.isCame" @on-value-changed="user.isCame = $event" />
          </div>
        </div>
      </template>
      <template #footer>
        <UButton color="neutral" class="justify-center" trailing-icon="i-lucide-arrow-right" loading-auto @click="confirmWaypoint(selectedWaypoint)">Kişileri Onayla ve Sonraki Adrese Devam Et</UButton>
      </template>
    </UDrawer>

    <UDrawer
        v-model:open="isFinishDrawerOpen"
        direction="bottom"
        title="Varış Noktasına Ulaştınız"
        description="Lütfen tüm kontrollerinizi yaptıktan sonra transferi sonlandırın.">
      <template #body>
        <div class="flex flex-col p-2 gap-y-4">

          <div class="flex justify-start items-center gap-x-4">
            <Icon name="material-symbols:search-check-2-outline" class="w-2/12" size="50"/>
            <div class="flex flex-col w-10/12">
              <p class="text-md font-bold">Aracınızı Kontrol Edin</p>
              <p class="text-sm text-justify">Aracınızda hiç bir kişi kalmadığından, unutulan kişisel eşya olmadığından emin olun.</p>
            </div>
          </div>

          <div class="flex justify-start items-center gap-x-4">
            <Icon name="ic:outline-cleaning-services" class="w-2/12" size="50"/>
            <div class="flex flex-col w-10/12">
              <p class="text-md font-bold">Aracınızın Temizlik ve Düzenini Kontrol Edin</p>
              <p class="text-sm text-justify">Aracınızın var ise, perdelerini, koltuk aralarında bırakılan çöpleri, kokusunu kontrol edin, bir sonraki transferinize hazır olun.</p>
            </div>
          </div>


          <div class="flex justify-start items-center gap-x-4">
            <Icon name="ri:shut-down-line" class="w-2/12" size="50"/>
            <div class="flex flex-col w-10/12">
              <p class="text-md font-bold">Mevcut oturumunuz sonlandırılacaktır</p>
              <p class="text-sm text-justify">Şu an ki transferiniz sonlandırılacaktır, bu transfer sonlandırıldıktan sonra başka işlem yapılamaz. Araç modundaki mevcut oturumunuz sonlandırılacak ve tekrardan operasyon onayı almanız gerekecektir.</p>
            </div>
          </div>


        </div>
      </template>
      <template #footer>
        <UButton color="success" class="justify-center font-bold" trailing-icon="i-lucide-arrow-right" loading-auto @click="finishTrip">Kontrolleri Sağladım, Transferi Bitir!</UButton>
        <UButton color="neutral" class="justify-center" trailing-icon="i-lucide-arrow-right" loading-auto @click="isFinishDrawerOpen = false">Hayır, kontrollerime devam edeceğim.</UButton>
        <p class="text-[8pt] opacity-50 text-justify mt-2">Transferi bitirerek yukarıdaki kontrolleri sağladığımı, sürücü ve yolcular arasındaki anlaşmazlıkların Transferciniz® sorumlu olmadığını beyan ederim. Transferciniz® araç içindeki yolcuların yolculuk sonu yapacağı değerlendirmeler ile araç ve sürücüsünün operasyonel önceliklendirmesini değiştirmek/cezalandırma hakkını saklı tutar. </p>
      </template>
    </UDrawer>
  </div>
</template>

<script setup lang="ts">


import mapboxgl from "mapbox-gl";
import type {IWayPointDto} from "~/core/api/modules/trip/models/IWayPointDto";
import {useApi} from "~/core/api/useApi";

definePageMeta({
  layout: "fullscreen",
})
const mapBoxContainer = ref();
const mapbox = ref<mapboxgl.Map>()

const isNavigationStarted = ref(false);
const carMarker = ref<mapboxgl.Marker>();
const selectedWaypoint = ref<IWayPointDto>();
const isWaypointDrawerOpen = ref(false);
const lastWaypointId = ref("");
const isFinishDrawerOpen = ref(false);
const coordinates = ref<any[][]>([]);

const {
  selectedTrip
} = storeToRefs(useVehicleModeStore());

const {
  location,
  bearing
} = storeToRefs(useLocationStore());

watch(location, value => {
  carMarker.value?.setLngLat([location.value.longitude, location.value.latitude]);
  checkWaypointDistances(value);
  if(isNavigationStarted.value){
    mapbox.value?.easeTo({
      center: [value.longitude, value.latitude],
      bearing: bearing.value ?? 0,
      duration: 1000,
    })
  }
})


watch(bearing, value => {
  if(isNavigationStarted.value && value){
    mapbox.value?.easeTo({
      center: [location.value.longitude, location.value.latitude],
      bearing: value,
      duration: 1000,
    })
  }
})

function checkWaypointDistances(value: any){
  const finishPoint = coordinates.value[coordinates.value.length -1];
  if(useHaversineDistance([value.longitude, value.latitude], finishPoint) < 30){
    if(lastWaypointId.value != 'finish'){
      lastWaypointId.value = 'finish';
      isFinishDrawerOpen.value = true;
      return;
    }
  }
  for(let i = 1; i<= selectedTrip.value.trip.waypoints.length; i++){
    const waypoint = selectedTrip.value.trip.waypoints[i];
    if(useHaversineDistance([value.longitude, value.latitude], [waypoint.longitude, waypoint.latitude]) < 15){
      if(lastWaypointId.value != waypoint.id){
        lastWaypointId.value = waypoint.id;
        selectedWaypoint.value = waypoint;
        isWaypointDrawerOpen.value = true;
        break;
      }
    }
  }
}

function navigateToVehicleMode(){
  useRouter().push('/vehicle-mode');
}

function getRouteForStartPoint(){
  const startPoint = coordinates.value[0]
  useMapbox().fetchRouteData([
      {latitude: location.value.latitude, longitude: location.value.longitude},
      {longitude: startPoint[0], latitude: startPoint[1]},
  ]).then(res => {
    useMapbox().drawRoute(mapbox.value!, res, 'startNavigationSource', 'startNavigationLayer', false, '#3bdd4b');
    mapbox.value?.easeTo({
      center: [location.value.longitude, location.value.latitude],
      bearing: bearing.value ?? 0,
      duration: 0,
      zoom: 18
    })
    isNavigationStarted.value = true;
  })
}

async function confirmWaypoint(waypoint: IWayPointDto): Promise<void>{
  return new Promise((resolve, reject) => {
    useApi().trip.UpdateWaypoint(waypoint).then(() => {
      lastWaypointId.value = waypoint.id;
      isWaypointDrawerOpen.value = false;
      resolve();
    }).catch((e) => {reject()})

  })
}

async function finishTrip(): Promise<void>{
  return new Promise((resolve, reject) => {
    useApi().trip.FinishTrip({
      tripId: selectedTrip.value.trip.id
    })
        .then(() => {
          resolve();
          useRouter().push('/')
        })
        .catch(() => reject())
  })
}

onMounted(() => {
  mapbox.value = useMapbox().createMap(mapBoxContainer.value, {latitude: 0, longitude:0}, false);
  mapbox.value.on('load', () => {
    const routeGeoJSON = useDecodePolyline(selectedTrip.value.trip.route)
    coordinates.value = routeGeoJSON.geometry.coordinates;
    useMapbox().drawRoute(mapbox.value!, routeGeoJSON)
    
    carMarker.value = new mapboxgl.Marker({
      element: useMapbox().createBlueMarker(),
      draggable: false,
    }).setLngLat([location.value.longitude, location.value.latitude]).addTo(mapbox.value!);
    new mapboxgl.Marker({
      element: useMapbox().createRouteStartMarker(),
      draggable: false,
    }).setLngLat(routeGeoJSON.geometry.coordinates[0] as any).addTo(mapbox.value!);
   const finishMarker =  new mapboxgl.Marker({
      element: useMapbox().createRouteFinishMarker(),
      draggable: false,
    }).setLngLat(routeGeoJSON.geometry.coordinates[routeGeoJSON.geometry.coordinates.length -1] as any).addTo(mapbox.value!);

    finishMarker.getElement().addEventListener('click', () => {
         isFinishDrawerOpen.value = true;
    })

    selectedTrip.value.trip.waypoints.forEach(waypoint => {
       const waypointMarker =  new mapboxgl.Marker({
        element: useMapbox().createLiveWaypointMarker(),
        draggable: false,
        offset: [0, -36]
      }).setLngLat([waypoint.longitude, waypoint.latitude]).addTo(mapbox.value!);
      waypointMarker.getElement().addEventListener('click', () => {
          selectedWaypoint.value = waypoint;
          isWaypointDrawerOpen.value = true;
        })
    })
  })

  /*
  useMapbox().fetchRouteData(selectedTrip.value!.trip.waypoints as any[]).then((res) => {
  
    carMarker.value = new mapboxgl.Marker({
      element: useMapbox().createBlueMarker(),
      draggable: false,
    }).setLngLat([location.value.longitude, location.value.latitude]).addTo(mapbox.value!);
    selectedTrip.value!.trip.waypoints.forEach((waypoint, index) => {
      if(index === selectedTrip.value!.trip.waypoints.length-1){
       const finishMarker =  new mapboxgl.Marker({
          element: useMapbox().createRouteStartMarker(),
          draggable: false,
        }).setLngLat([waypoint.longitude, waypoint.latitude]).addTo(mapbox.value!);
        finishMarker.getElement().addEventListener('click', () => {
         isFinishDrawerOpen.value = true;
        })
      }else{
        const waypointMarker = new mapboxgl.Marker({
          element: useMapbox().createWaypointMarker(waypoint.users.length),
          draggable: false,

        }).setLngLat([waypoint.longitude, waypoint.latitude]).addTo(mapbox.value!);
        waypointMarker.getElement().addEventListener('click', () => {
          selectedWaypoint.value = waypoint;
          isWaypointDrawerOpen.value = true;
        })
      }

    })
  })*/
})

onBeforeUnmount(() => {
  mapbox.value?.remove();
})

</script>

<style>
@layer utilities {
  .clip-path-triangle {
    clip-path: polygon(50% 0%, 100% 100%, 0% 100%);
  }
}
</style>