import {useApi} from "~/core/api/useApi";
import {IVehicleStatus} from "~/core/api/modules/accountVehicle/models/IUpdateVehicleStatusCommand";
import type {IAccountVehicle} from "~/core/api/modules/accountVehicle/models/IAccountVehicle";
import type {IGetVehicleTripsResponse} from "~/core/api/modules/trip/models/IGetVehicleTripsResponse";


export const useDriverStore = defineStore('driverStore', () => {
    const { location} = storeToRefs(useLocationStore())
    const accountVehicle = ref<IAccountVehicle | null>(null)

    const trips = ref<IGetVehicleTripsResponse[]>([]);
    const selectedTrip = ref<IGetVehicleTripsResponse>();



    async function setAccountVehicle(vehicleId: string): Promise<void> {
        return new Promise(resolve => {
            useApi().accountVehicle.GetAccountVehicle(vehicleId).then((response) => {
                accountVehicle.value = response.data;
                resolve();
            })
        })
    }

    async function setVehicleOnline(){
       return  useApi().accountVehicle.UpdateAccountVehicleStatus({
            latitude: location.value.latitude,
            longitude: location.value.longitude,
            status: IVehicleStatus.Online,
            id: accountVehicle.value!.id
        })
    }

    function getVehicleTrips(){
        useApi().trip.GetVehicleTrips(accountVehicle.value!.id).then((response) => {
            trips.value = response.data
        })
    }

    function startTrip(trip: IGetVehicleTripsResponse){
        selectedTrip.value = trip;
        useApi().trip.StartTrip(trip.trip.id).then(() => {
            useRouter().push('/vehicle-trip')
        })
    }


    return {
        accountVehicle,
        trips,
        selectedTrip,

        setAccountVehicle,
        setVehicleOnline,
        getVehicleTrips,
        startTrip
    }
})