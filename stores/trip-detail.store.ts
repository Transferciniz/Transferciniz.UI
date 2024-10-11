import {useApi} from "~/core/api/useApi";


export const useTripDetailStore = defineStore('tripDetail', () => {
    const tripHeader = ref();
    const tripDetail = ref<any[]>([]);

    function selectTrip(trip: any){
        tripHeader.value = trip;
        useApi().trip.GetTripDetails(trip.id).then(response => {
            tripDetail.value = response.data;
        })

    }
    return {
        tripHeader,
        tripDetail,


        selectTrip
    }
})