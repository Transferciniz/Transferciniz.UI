import {useApi} from "~/core/api/useApi";
import {IVehicleStatus} from "~/core/api/modules/accountVehicle/models/IUpdateVehicleStatusCommand";
import type {IAccountVehicle} from "~/core/api/modules/accountVehicle/models/IAccountVehicle";


export const useDriverStore = defineStore('driverStore', () => {
    const { location} = storeToRefs(useLocationStore())
    const accountVehicle = ref<IAccountVehicle | null>(null)
    const isUpdateIntervalEnabled = ref(false);
    const trips = ref<any[]>([]);
    const selectedTrip = ref<any>();

    watch(location, value => {
        if(isUpdateIntervalEnabled.value) {
            updateLocation(value.latitude, value.longitude)
        }
    })

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

    function startTrip(trip: any){
        selectedTrip.value = trip;
        useApi().trip.StartTrip(trip.trip.id).then(() => {
            useRouter().push('/vehicle-trip')
        })
    }

    function updateLocation(lat: number, long: number){
        const waypoints = selectedTrip.value.wayPoints
        useApi().accountVehicle.UpdateAccountVehicleStatus({
            id: accountVehicle.value!.id,
            longitude: long,
            latitude: lat,
            status: IVehicleStatus.Online
        })
    }
    return {
        accountVehicle,
        trips,
        selectedTrip,

        setAccountVehicle,
        setVehicleOnline,
        getVehicleTrips,
        updateLocation,
        startTrip
    }
})