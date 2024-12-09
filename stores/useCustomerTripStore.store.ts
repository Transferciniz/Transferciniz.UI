import {useApi} from "~/core/api/useApi";
import type {ITripHeaderDto} from "~/core/api/modules/trip/models/ITripHeaderDto";
import type {ITripDto} from "~/core/api/modules/trip/models/ITripDto";
import type {IWayPointDto} from "~/core/api/modules/trip/models/IWayPointDto";
import type { IWaypointStatus } from "~/core/api/modules/trip/models/IWaypointStatus";

export const useCustomerTripStore = defineStore('useCustomerTripStore', () => {
    const {user} = storeToRefs(useAuthStore())
    const {
        GetTripHeadersForCustomer,
        GetTripDetailsForCustomer
    } = useApi().trip

    const tripHeaders = ref<ITripHeaderDto[]>([]);
    const tripDetails = ref<ITripDto>();
    const myWaypoint = computed((): IWayPointDto => {
        return tripDetails.value
            ?.waypoints
            .find(waypoint => waypoint.users.some(x => x.accountId == user.value.id))!;
    })
    const myTrip = computed(() => {
        return tripDetails.value
   
    })

    const vehicleCoordinate = ref({latitude: 0, longitude: 0})


    function getTripHeaders() {
        GetTripHeadersForCustomer().then(res => {
            tripHeaders.value = res.data;
        });
    }

    function goTripDetails(tripId: string) {
        GetTripDetailsForCustomer(tripId).then(res => {
            tripDetails.value = res.data;
            useSocketStore().joinGroup(`trip@${tripId}`)
            useRouter().push('/customer/trip-detail');
        })
    }

    function setVehicleCoordinate(latitude: number, longitude: number) {
        vehicleCoordinate.value = {latitude: latitude, longitude: longitude};
    }

    function updateWaypointStatus(payload: IWaypointStatus){
        tripDetails.value!.waypointStatus = payload;
    }

    return {
        tripHeaders,
        tripDetails,
        myWaypoint,
        vehicleCoordinate,
        myTrip,

        getTripHeaders,
        goTripDetails,
        setVehicleCoordinate,
        updateWaypointStatus
    }
})