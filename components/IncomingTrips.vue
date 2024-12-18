<template>
    <div class="flex flex-col">
        <div>
            <UBadge icon="i-lucide-rocket" color="neutral" variant="soft" v-if="incomingTrips.length > 0">Yaklaşan Transferleriniz</UBadge>
        </div>

        <template v-for="trip in incomingTrips">
            <div class="flex flex-col gap-y-2">
                <p class="text-md font-bold">{{ trip.name }}</p>
                <UAlert color="warning" variant="soft" title="Bu transfere katılmayacağınızı belirttiniz!"
                    v-if="trip.willCome === false" />
                <div class="flex justify-start gap-x-2 items-center rounded-md">
                    <div class="flex flex-col justify-center items-center">
                        <p class=text-3xl>{{ getDay(trip.startDate) }}</p>
                        <p class="mt-[-5px] text-xs opacity-80">{{ getMonth(trip.startDate) }}</p>
                    </div>
                    <div class="flex flex-col">
                        <div class="flex justify-start items-center gap-x-1">
                            <UIcon name="material-symbols:nest-clock-farsight-analog-outline" />
                            <p class="text-lg">{{ getClock(trip.startDate) }}</p>
                        </div>
                        <UBadge :label="trip.plate" variant="subtle" size="sm" />
                    </div>
                    <USeparator orientation="vertical" class="w-4" />
                    <UButtonGroup size="lg">
                        <UButton label="İncele" icon="ic:twotone-search" color="neutral" variant="soft"
                            @click="goDetail(trip)" />
                        <UButton label="Gelmeyeceğim" trailing-icon="gridicons:cross-circle" color="warning"
                            variant="soft" loading-auto @click="updateWillComeStatus(trip)"
                            v-if="trip.willCome === true" />
                        <UButton label="Geleceğim" trailing-icon="material-symbols:check-rounded" color="success"
                            variant="soft" loading-auto @click="updateWillComeStatus(trip)"
                            v-if="trip.willCome === false" />
                    </UButtonGroup>
                </div>
                <USeparator orientation="horizontal" />

            </div>
        </template>
    </div>
</template>

<script setup lang="ts">
import { TripStatus, type ITripHeaderDto } from "~/core/api/modules/trip/models/ITripHeaderDto";
import moment from "moment";
import { useApi } from "~/core/api/useApi";

const { tripHeaders } = storeToRefs(useCustomerTripStore());
const { goTripDetails, getTripHeaders } = useCustomerTripStore();

const incomingTrips = computed(() => tripHeaders.value.filter(x => x.status == TripStatus.Approved))

onMounted(() => {
  getTripHeaders();
})

function getDay(date: Date): string {
  return moment(date).get('D').toString()
}

function getMonth(date: Date): string {
  return moment(date).format('MMMM')
}

function getClock(date: Date): string {
  return moment(date).format('HH:mm')
}

function goDetail(tripId: ITripHeaderDto){
  goTripDetails(tripId)
}

function updateWillComeStatus(trip: ITripHeaderDto){
  trip.willCome = !trip.willCome;
  return useApi().trip.UpdateUserWillCome({
    waypointUserId: trip.waypointUserId,
    willCome: trip.willCome
  });
}

</script>