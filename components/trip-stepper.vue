<template>
  <div class="flex justify-between items-center px-5 py-5 w-full text-gray-400 bg-gray-800">
    <div class="flex items-center gap-x-1" v-if="currentStep !== 0" @click="prevStep">
      <Icon name="material-symbols:arrow-back-ios-rounded" class="w-5 h-5"></Icon>
      <p>Önceki</p>
    </div>
    <div v-else class="min-w-20"></div>
    <div class="flex-grow text-center text-lg text-white">{{ step }}</div>
    <div class="flex items-center gap-x-1" v-if="currentStep !== steps.length - 1" @click="nextStep">
      <p>Sonraki</p>
      <Icon name="material-symbols:arrow-forward-ios-rounded" class="w-5 h-5"></Icon>
    </div>
    <div v-else></div>
  </div>
</template>

<script setup lang="ts">

import {useTripPlannerStore} from "~/stores/trip-planner.store";

const tripPlanningStore = useTripPlannerStore();
const {currentStep, steps} = storeToRefs(tripPlanningStore)
const step = computed(() => steps.value[currentStep.value])
const {prevStep, nextStep} = tripPlanningStore;
</script>