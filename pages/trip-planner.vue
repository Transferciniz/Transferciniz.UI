<template>
<div class="w-full h-full flex flex-col">
  <trip-stepper/>
  <trip-step1 v-if="currentStep==0"/>
  <trip-step2 class="flex-grow" v-if="currentStep==1"/>
  <trip-step3 v-if="currentStep==2"/>
</div>

</template>
<script setup lang="ts">
import L from 'leaflet';
import 'leaflet-routing-machine';
import 'leaflet/dist/leaflet.css'
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css'
import 'leaflet-routing-machine/dist/leaflet.routing.icons.png'
import TripStep1 from "~/components/trip-step-1.vue";
import {useTripPlannerStore} from "~/stores/trip-planner.store";
import TripStep2 from "~/components/trip-step-2.vue";
import TripStep3 from "~/components/trip-step-3.vue";

const {location} = storeToRefs(useLocationStore())
const {currentStep} = storeToRefs(useTripPlannerStore())


</script>

<style>
#map > div.leaflet-control-container > div.leaflet-bottom.leaflet-right > div > a{
  display: none !important;
}
</style>