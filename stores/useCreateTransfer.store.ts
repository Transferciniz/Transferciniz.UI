import type {ILocationSearchResult, IWaypoint, IWaypointUser} from "~/core/app/ITripLocation";
import {useApi} from "~/core/api/useApi";
import type {
    IVehicleCombinationPricePair, IVehicleFillPair,
    IVehicleUsageInformation
} from "~/core/api/modules/trip/models/IVehicleCombination";
import type {
    IVehicleRoutePlan,
    IVehicleRoutePlanWaypoint,
    IVehicleRoutePlanWaypointUser
} from "~/core/api/modules/trip/models/ICreateTrip";
import moment from "moment/moment";

export const useCreateTransferStore = defineStore('useCreateTransferStore', () => {
    const waypoints = ref<IWaypoint[]>([]);
    const totalWaypoints = computed<IWaypoint[]>((): IWaypoint[] =>  {
        return [...waypoints.value, finalDestination.value] as IWaypoint[]
    })
    const date = ref(new Date(moment().startOf("day").add("day", 1).toDate().toString()))
    const finalDestination = ref<IWaypoint>();
    const preDefinedPeopleCount = ref(4);
    const totalAddedPeopleCount = computed(() => waypoints.value.map(x => x.users.length).reduce((a, b) => a + b));
    const routingSummary = ref<any>();

    const vehicleCombinations = ref<IVehicleCombinationPricePair[]>([])

    watchDebounced(preDefinedPeopleCount, value => {
        getVehicleCombinations();
    }, {debounce:500})

    function addWaypoint(payload: IWaypoint){
        waypoints.value.push(payload);
    }

    function setFinalDestination(payload: IWaypoint){
        finalDestination.value = payload;
    }

    function addUserToWaypoint(waypoint: IWaypoint, user: IWaypointUser){
        waypoints.value.find(x => x.id == waypoint.id)?.users.push(user)
    }

    function deleteUserFromWaypoint(waypoint: IWaypoint, user: IWaypointUser){
        const foundedWaypoint = waypoints.value.find(x => x.id == waypoint.id);
        if(foundedWaypoint){
            foundedWaypoint.users = foundedWaypoint.users.filter(x => x != user)
        }
    }

    function increasePeopleCount(){
        preDefinedPeopleCount.value = preDefinedPeopleCount.value + 1;
    }

    function decreasePeopleCount(){
        if(preDefinedPeopleCount.value > 1){
            preDefinedPeopleCount.value = preDefinedPeopleCount.value - 1;
        }
    }

    function setRoutingSummary(payload: any): void {
        routingSummary.value = payload;
    }

    function updateWaypointLatLang(latitude: number, longitude: number, waypointId: number){
        const waypoint = waypoints.value.find(x => x.id === waypointId);
        if(waypoint){
            waypoint.latitude = latitude;
            waypoint.longitude = longitude;
        }
    }

    function getVehicleCombinations(){
        useApi().trip.GetAvailableVehicles({
            extraServices: [],
            totalLengthOfRoad: 1473,
            totalPerson: preDefinedPeopleCount.value,
            segments: [],
            types: []
        }).then(x => {
            //TODO: Burada hesaplama lazım
            vehicleCombinations.value = x.data
        })
    }

    function createBasicTransferWaypoints(locations: ILocationSearchResult[]) {
        waypoints.value = [];
        finalDestination.value = undefined;
        if(locations.length == 1){
            const {location} = storeToRefs(useLocationStore())
            const fromWaypoint = {
                id: Date.now(),
                name: 'Başlangıç Noktası',
                latitude: location.value.latitude,
                longitude: location.value.longitude,
                users: [],
                marker: useMapbox().createMarker(location.value.longitude, location.value.latitude),
                ordering: waypoints.value.length + 1
            }
            waypoints.value.push(fromWaypoint);
            const toWaypoint = {
                id: Date.now()+1,
                name: 'Varış Noktası',
                latitude: locations[0].latitude,
                longitude: locations[0].longitude,
                users: [],
                marker: useMapbox().createMarker(location.value.longitude, location.value.latitude),
                ordering: 9999
            }
            finalDestination.value = toWaypoint;
        }else{
            locations.forEach((location, index) => {
                const iteratorWaypoint = {
                    id: Date.now()+index,
                    name: index == 0 ? location.name : 'Varış Noktası',
                    latitude: location.latitude,
                    longitude: location.longitude,
                    users: [],
                    marker: useMapbox().createMarker(location.longitude, location.latitude),
                    ordering: index + 1
                }
                index == 0 ?  waypoints.value.push(iteratorWaypoint) : finalDestination.value = iteratorWaypoint;

            })
        }
        getVehicleCombinations();
        useRouter().push('/basic-transfer-preview')
    }

    async function createTrip(selectedVehicleCombination: IVehicleCombinationPricePair){
        const name = `${waypoints.value[0].name} - ${finalDestination.value?.name}`;
        const vehicleUsages = selectedVehicleCombination.vehicles.map(x => {
            return <IVehicleUsageInformation>{
                id: x.vehicle.id,
                usage: x.usage,
                capacity: x.vehicle.vehicleModel.capacity,
                basePrice: x.vehicle.basePrice
            }
        });
        const vehicleIds = selectedVehicleCombination.vehicles.map(x => x.vehicle.id)

        const adjustedWaypointsVehiclePair = adjustWaypoints(vehicleUsages, waypoints.value)
        const finalLat = finalDestination.value!.latitude;
        const finalLng = finalDestination.value!.longitude
        setCosts(adjustedWaypointsVehiclePair, finalLat, finalLng).then(() => {
            const vehicleRoutePlans = adjustedWaypointsVehiclePair.map(x => {
                return <IVehicleRoutePlan>{
                    vehicleId: x.id,
                    totalLengthOfRoad: x.totalLengthOfRoad,
                    waypoints: x.waypoints.map(y => {
                        return <IVehicleRoutePlanWaypoint>{
                            latitude: y.latitude,
                            name: y.name,
                            longitude: y.longitude,
                            ordering: y.ordering,
                            users: y.users.map(z => {
                                console.log('user', z)
                                return <IVehicleRoutePlanWaypointUser>{
                                    name: z.name ?? "",
                                    surname: z.surname ?? "",
                                    userId: z.userId,
                                }
                            }),

                        }
                    })
                }
            })
            useApi().trip.CreateTrip({
                startDate: new Date(date.value.toString()),
                name: name,
                vehicleIds: vehicleIds,
                vehicleRoutePlans: vehicleRoutePlans
            }).then(x => {
                useRouter().push('/')
            })
        })

    }

    function setCosts(payload: IVehicleFillPair[], finalLat: number, finalLng: number): Promise<void>{
        return new Promise((resolve, reject) => {
            let processedCount = 0;
            payload.forEach((x, index) => {
                x.waypoints.push({
                    id: Date.now(),
                    users: [],
                    name: finalDestination.value?.name ?? "Varış Noktası",
                    longitude: finalLng,
                    latitude: finalLat,
                    ordering: 9999,
                    marker: {}
                })

                useMapbox().fetchRouteData(x.waypoints).then(res => {
                    const routeSummary = res.features[0].properties.summary;
                    x.totalLengthOfRoad = routeSummary.distance;
                    x.totalTime = routeSummary.duration;
                    processedCount++;
                    if(processedCount === payload.length){
                        resolve()
                    }
                })

            })
        })
    }

    function adjustWaypoints(vehicleUsages: IVehicleUsageInformation[], waypoints: IWaypoint[]): IVehicleFillPair[]{
        const vehicles: IVehicleFillPair[] = [];
        vehicleUsages.sort((a,b) => b.capacity - a.capacity);
        vehicleUsages.forEach(vehicleUsage => {
            for (let i =1; vehicleUsage.usage >= i; i++){
                vehicles.push({
                    id: vehicleUsage.id,
                    capacity: vehicleUsage.capacity,
                    basePrice: vehicleUsage.basePrice,
                    filled: 0,
                    waypoints: [],
                    totalLengthOfRoad: 0,
                    totalTime: 0
                })
            }
        })
        waypoints.forEach((waypoint, index) => {
            for(let user of waypoint.users){
                for(let vehicle of vehicles){
                    if(vehicle.filled === vehicle.capacity) continue;
                    if (vehicle.waypoints.some(x => x.id === waypoint.id)) {
                        vehicle.waypoints.find(x => x.id === waypoint.id)!.users.push(user)
                        vehicle.filled++
                        break;
                    }else{
                        vehicle.waypoints.push({
                            id: waypoint.id,
                            name: waypoint.name,
                            latitude: waypoint.latitude,
                            longitude: waypoint.longitude,
                            marker: waypoint.marker,
                            ordering: index,
                            users: [user]
                        })
                        vehicle.filled++
                        break;
                    }
                }
            }
        })

        return vehicles;
    }


    return {
        waypoints,
        preDefinedPeopleCount,
        vehicleCombinations,
        routingSummary,
        totalWaypoints,
        totalAddedPeopleCount,
        date,

        addWaypoint,
        setFinalDestination,
        addUserToWaypoint,
        deleteUserFromWaypoint,
        createBasicTransferWaypoints,
        increasePeopleCount,
        decreasePeopleCount,
        setRoutingSummary,
        createTrip,
        updateWaypointLatLang
    }
})

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useCreateTransferStore, import.meta.hot))
}