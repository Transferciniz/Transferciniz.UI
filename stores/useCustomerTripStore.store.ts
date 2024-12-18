import {useApi} from "~/core/api/useApi";
import type {ITripHeaderDto} from "~/core/api/modules/trip/models/ITripHeaderDto";
import type { IWaypointStatus } from "~/core/api/modules/trip/models/IWaypointStatus";

export const useCustomerTripStore = defineStore('useCustomerTripStore', () => {
    
    const tripHeaders = ref<ITripHeaderDto[]>([]);
    const selectedTrip = ref<ITripHeaderDto>();
    const vehicleCoordinate = ref({latitude: 0, longitude: 0})


    function getTripHeaders() {
        useApi().trip.GetTripHeadersForCustomer().then(res => {
            tripHeaders.value = res.data;
        });
    }

    function goTripDetails(payload: ITripHeaderDto) {
        selectedTrip.value = payload;
        useSocketStore().joinGroup(`trip@${payload.id}`)
        useRouter().push('/customer/trip-detail');
    }

    function setVehicleCoordinate(latitude: number, longitude: number) {
        vehicleCoordinate.value = {latitude: latitude, longitude: longitude};
    }

    function updateWaypointStatus(payload: IWaypointStatus){
        selectedTrip.value!.waypointStatus = payload;
    }

    return {
        tripHeaders,
        selectedTrip,
        vehicleCoordinate,

        getTripHeaders,
        goTripDetails,
        setVehicleCoordinate,
        updateWaypointStatus
    }
})