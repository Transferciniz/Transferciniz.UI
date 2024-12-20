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
import type {IFavoriteTrip} from "~/core/api/modules/trip/models/IFavoriteTrip";
import {useStorage} from "@vueuse/core";
import { TimeType, type CreateTripDto, type CreateWaypointDto, type CreateWaypointUserDto } from "~/core/api/modules/trip/models/ICreateTripV2";
import { VehicleCombination } from "~/core/api/modules/trip/models/VehicleCombination";
import type { IEmployee } from "~/core/api/modules/account/models/IEmployee";
import { AccountType } from "~/core/api/modules/auth/models/AccountType";
import { DateFormatter, getLocalTimeZone } from "@internationalized/date";


export const useCreateTransferStore = defineStore('useCreateTransferStore', () => {
    const toHour = ref('09');
    const toMinute = ref('00')
    const toDates = ref<any>();
    const df = new DateFormatter('tr-TR', {
        dateStyle: 'medium'
    })
    const toDatesView = computed(() => {
        if(toDates.value!!){
            return df.format(toDates.value.toDate(getLocalTimeZone())) 
        }else{
            return 'Tarih Seçin'
        }
    })
    const hours = ref(['00','02','04','05','06','07','08','09','10','11','12','13','14','15','16','17','18','19','20','21','22','23']);
    const minutes = ref(['00', '10', '15', '20' ,'30','40','45','50']);


    const vehicleCombinationsDataSource  = ref<VehicleCombination[]>(<VehicleCombination[]>[]);
    const waypoints = ref<IWaypoint[]>([]);
    const totalWaypoints = computed<IWaypoint[]>((): IWaypoint[] =>  {
        return [...waypoints.value, finalDestination.value] as IWaypoint[]
    })
    const date = ref(new Date(moment().startOf("day").add("day", 1).toDate().toString()))
    const finalDestination = ref<IWaypoint>();
    const preDefinedPeopleCount = ref(4);
    const totalAddedPeopleCount = computed(() => {
        if(waypoints.value.length > 0){
            return waypoints.value?.map(x => x.users.length)?.reduce((a, b) => a + b)
        }
        return 0;
    });
    const routingSummary = ref<any>();
    const vehicleCombinations = ref<IVehicleCombinationPricePair[]>([]);
    const isAddFavorite = ref(false);
    const isAddPeople = ref(false);
    const favoriteName = ref("");
    const favoriteTrips = useStorage("favoriteTrips", <IFavoriteTrip[]>[])


    function addWaypoint(payload: IWaypoint){
        waypoints.value.push(payload);
    }

    function setFinalDestination(payload: IWaypoint){
        finalDestination.value = payload;
    }

    function addUserToWaypoint(waypoint: IWaypoint, user: IWaypointUser){
        if(waypoint.users.filter(x => x.userId != null).some(x => x.userId == user.userId)){
            useToast().add({
                color: 'error',
                title: 'Kişi zaten bu durakta!',
                description: 'Aynı kişiyi birden fazla kez aynı durağa ekleyemezsiniz.'
            })
            return;
        }
        waypoints.value.filter(x => x != waypoint).forEach(x => {
            if(x.users.filter(x => x.userId != "").some(y => y.userId == user.userId)){
                useToast().add({
                    color: 'error',
                    title: 'Kişi başka durakta!',
                    description: 'Aynı kişiyi birden fazla durağa ekleyemezsiniz!'
                })
                return;
            }
            
        })
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

    async function getVehicleCombinations(){
        try {
        
            const res = await useApi().trip.GetAvailableVehicles({
                extraServices: [],
                segments: [],
                totalLengthOfRoad: 0,
                totalPerson: totalAddedPeopleCount.value,
                types: []
            });

            let employees: IEmployee[] = []; 
            waypoints.value.forEach((waypoint, waypointIndex) => {
                employees = [...employees, ...waypoint.users.map((x, userIndex) => {
                    return <IEmployee>{
                        accountType: AccountType.Customer,
                        id: x.userId ?? `waypoint${waypointIndex}-${userIndex}`,
                        isSelected: true,
                        latitude: waypoint.latitude,
                        longitude: waypoint.longitude,
                        name: x.name!,
                        surname: x.surname!,
                        username: '',
                        profilePicture: x.profilePicture
                    }
                })]
            })
        
            const combinationsData = res.data;
            const vehicleCombinations = combinationsData.map(
                x => new VehicleCombination(x.vehicles, employees)
            );

            const {latitude, longitude, name} = finalDestination.value!
            
            // OptimizeRoute çağrılarını topluca beklemek için `Promise.all` kullanılıyor
            await Promise.all(
                vehicleCombinations.map(async combination => {
                await combination.GetRoutes({
                    address: name,
                    latitude: latitude,
                    longitude: longitude,
                    name: name
                }, 'from')
                })
            );

            vehicleCombinationsDataSource.value = vehicleCombinations;
            //useRouter().push('/service-vehicles')
        } catch (error) {
        console.error("An error occurred:", error);
        }
    }

    function createBasicTransferWaypoints(locations: ILocationSearchResult[]) {
        waypoints.value = [];
        finalDestination.value = undefined;
        locations.forEach((location, index) => {
            const iteratorWaypoint = {
                id: Date.now()+index,
                name: location.name,
                latitude: location.latitude,
                longitude: location.longitude,
                users: [],
                marker: useMapbox().createMarker(location.longitude, location.latitude),
                ordering: index + 1
            }
            index == 0 ?  waypoints.value.push(iteratorWaypoint) : finalDestination.value = iteratorWaypoint;
        })
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
                if(isAddPeople.value == false){
                    waypoints.value.forEach(x => {
                        x.users = [];
                    })
                }
                if(isAddFavorite.value){
                    favoriteTrips.value.push({
                        name: favoriteName.value,
                        finalDestination: finalDestination.value!,
                        waypoints: waypoints.value
                    })
                }
                useRouter().push('/')
            })
        })

    }

    async function createTripV2(payload: VehicleCombination){
        useApi().trip.CreateTripV2({
            name: `${finalDestination.value!.name} Gidiş`,
            timeType: TimeType.StartAtTime,
            cost: payload.totalPrice,
            dates: [moment(`${toDates.value.year}-${toDates.value.month}-${toDates.value.day}`).format('YYYY-MM-DDTHH:mm:ssZ')],
            hour: Number.parseInt(toHour.value),
            minute: Number.parseInt(toMinute.value),
            trips: payload.vehicles.map(vehicle => {
          return <CreateTripDto>{
            cost: vehicle.basePrice * vehicle.totalDistance / 1000,
            vehicleId: vehicle.description,
            route: vehicle.geometryText,
            duration: vehicle.totalTime,
            waypoints: vehicle.users.map(user => {
              return <CreateWaypointDto>{
                latitude: user.waypoint.lat,
                longitude: user.waypoint.lng,
                duration: user.duration,
                name: `${user.user.name} ${user.user.surname} Durağı`,
                users: <CreateWaypointUserDto[]>[{
                  accountId: user.user.id.startsWith('waypoint') ? null : user.user.id,
                  name: user.user.name,
                  surname: user.user.surname
                }]
              }
            })
          }
        })
        }).then(() => {
            useRouter().push('/')
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

    function deleteFavorite(payload: IFavoriteTrip){
        favoriteTrips.value = favoriteTrips.value.filter(x => x != payload)
    }


    return {
        waypoints,
        preDefinedPeopleCount,
        vehicleCombinations,
        routingSummary,
        totalWaypoints,
        totalAddedPeopleCount,
        date,
        isAddFavorite,
        isAddPeople,
        favoriteName,
        favoriteTrips,
        vehicleCombinationsDataSource,
        toHour,
        toMinute,
        toDates,
        toDatesView,
        hours,
        minutes,

        addWaypoint,
        setFinalDestination,
        addUserToWaypoint,
        deleteUserFromWaypoint,
        createBasicTransferWaypoints,
        increasePeopleCount,
        decreasePeopleCount,
        setRoutingSummary,
        createTrip,
        updateWaypointLatLang,
        deleteFavorite,
        getVehicleCombinations,
        createTripV2
    }
})

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useCreateTransferStore, import.meta.hot))
}