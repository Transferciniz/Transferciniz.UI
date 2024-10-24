import {useApi} from "~/core/api/useApi";
import type {ITripHeaderDto} from "~/core/api/modules/trip/models/ITripHeaderDto";
import type {ITripDto} from "~/core/api/modules/trip/models/ITripDto";
import type {IWayPointDto} from "~/core/api/modules/trip/models/IWayPointDto";

export const useCustomerTripStore = defineStore('useCustomerTripStore', () => {
    const {user} = storeToRefs(useAuthStore())
    const {
        GetTripHeadersForCustomer,
        GetTripDetailsForCustomer
    } = useApi().trip

    const tripHeaders = ref<ITripHeaderDto[]>([]);
    const tripDetails = ref<ITripDto[]>([]);
    const vehicleCoordinate = ref({latitude: 0, longitude: 0})
    const myWaypoint = computed((): IWayPointDto => {
       return tripDetails.value
            .flatMap(trip => trip.waypoints)
            .find(waypoint => waypoint.users.some(x => x.accountId == user.value.id))!;
    })

    function getTripHeaders() {
        GetTripHeadersForCustomer().then(res => {
            tripHeaders.value = res.data;
        });
    }

    function goTripDetails(tripId: string) {
        GetTripDetailsForCustomer(tripId).then(res => {
            tripDetails.value = res.data;
            useSocketStore().joinGroup(`vehicle@${res.data[0].id}`)
            useRouter().push('/customer/trip-detail');
        })
    }

    function setVehicleCoordinate(latitude: number, longitude: number) {
        vehicleCoordinate.value = {latitude: latitude, longitude: longitude};
    }

    return {
        tripHeaders,
        tripDetails,
        myWaypoint,
        vehicleCoordinate,

        getTripHeaders,
        goTripDetails,
        setVehicleCoordinate
    }
})