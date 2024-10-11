
export const useClientTripStore = defineStore('useClientTripStore', () => {
    const trip = ref<any>(null)
    const waypoints = computed(() => {
        console.log(trip.value)
        if (trip.value == null) return [];
        return trip.value.trips[0].waypoints
    });
    const myWaypoint = computed(() => {
        return waypoints.value[0];
    })

    function setTrip(payload: any) {
        trip.value = payload;
        useRouter().push('/client-trip')
    }

    return {
        trip,
        waypoints,
        myWaypoint,

        setTrip
    }
})