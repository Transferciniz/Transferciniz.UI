import {ITripType} from "~/core/app/ITripType";
import {
    type ICreateTripLocation,
    type ILocationSearchResult,
    type ITripLocation,
    type IUserLocationSearchResult,
    ITripLocationType, type IWaypoint, type IWaypointUser,
} from "~/core/app/ITripLocation";
import {GoogleProvider} from "leaflet-geosearch";
import {useApi} from "~/core/api/useApi";
import type {
    IVehicleCombinationPricePair, IVehicleFillPair,
    IVehicleUsageInformation
} from "~/core/api/modules/trip/models/IVehicleCombination";
import {OpenRouteService} from "~/core/OpenRouteService";
import type {LatLng} from "leaflet";
import type {
    IVehicleRoutePlan,
    IVehicleRoutePlanWaypoint,
    IVehicleRoutePlanWaypointUser
} from "~/core/api/modules/trip/models/ICreateTrip";

export const useCreateTripStore = defineStore('createTripStore', () => {
    const {$L: L} = useNuxtApp();
    const {location} = storeToRefs(useLocationStore())

    const tripName = ref('');
    const date = ref<Date>();

    const map = ref<L.Map>();
    const waypoints = ref<IWaypoint[]>([]);
    const selectedWaypoint = ref<IWaypoint>();
    const isWaypointEditModalVisible = ref(false);
    const finalDestination = ref<{latitude: number, longitude: number} | null>(null);
    const finalDestinationMarker = ref<L.Marker | null>(null);
    const totalPeople = computed(() => {
        let amount = 0;
        waypoints.value.forEach(waypoint => {
            amount += waypoint.users.length
        })
        return amount;
    })

    const tempMarker = ref<L.Marker>();


    const searchInput = ref('');
    const isSearching = ref(false);
    const isSearchPanelVisible = ref(false);
    const searchResults = ref<ILocationSearchResult[]>([]);
    const userSearchResults = ref<IUserLocationSearchResult[]>([])
    const selectedLocation = ref<ILocationSearchResult | null>(null);



    const vehicleCombinations = ref<IVehicleCombinationPricePair[]>([]);
    const selectedVehicleCombination = ref<IVehicleCombinationPricePair>()

    const waypointIcon = L.divIcon({
        html: '<span class="border-blue-700 border-2 rounded-sm text-sm text-black bg-white py-0.5 px-2 font-black flex items-center justify-center">D</span>',
    })

    const finalDestinationIcon = L.divIcon({
        html: '<span class="border-red-700 border-2 rounded-sm text-sm text-white bg-red-700 py-0.5 px-2 font-black flex items-center justify-center">V</span>',
    })


    watchDebounced(
        searchInput,
        () => onMapSearchInputChange(),
        {debounce: 300}
    );

    watch(selectedWaypoint, value => {
        console.log(value)
        isWaypointEditModalVisible.value = !!value;
    })

    watch(isWaypointEditModalVisible, value => {
        console.log(value)

        if(value == false){
            selectedWaypoint.value = undefined
        }
    })

    function createWaypoint(name :string) {
        const id = Date.now()
        const marker = L.marker({lat: tempMarker.value!.getLatLng().lat, lng: tempMarker.value!.getLatLng().lng}, {draggable: false, riseOnHover: true, icon: waypointIcon}).addTo(map.value!);

        const waypoint = {
            id: id,
            name: name,
            latitude: tempMarker.value!.getLatLng().lat,
            longitude: tempMarker.value!.getLatLng().lng,
            users: [],
            marker: marker,
            ordering: waypoints.value.length + 1
        }
        waypoints.value.push(waypoint)
        selectedWaypoint.value = waypoint
        marker.on('click', event => {
            console.log('durak click')
            selectedWaypoint.value = waypoint
        })
    }

    function addUserToWaypoint(waypointId: number, name: string, surname: string, userId?: string, profilePicture?: string){
        if(userId!!){
            const users = waypoints.value.map(x => x.users).flat(2);
            const user = users.find(x => x.userId == userId)
            if(user != null) return;
        }
        waypoints.value.find(x => x.id === waypointId)?.users.push({
            name: name,
            surname: surname,
            userId: userId,
            profilePicture: profilePicture
        })
    }

    function deleteUserFromWaypoint(waypointId: number, user: IWaypointUser){
        const waypoint = waypoints.value.find(x => x.id === waypointId);
        if(waypoint){
            waypoint.users = waypoint.users.filter(x => x !== user)
        }
    }

    function deleteWaypoint(waypointId: number) {
        const waypoint = waypoints.value.find(x => x.id === waypointId);
        if(waypoint){
            const marker = waypoint.marker as L.Marker;
            marker.remove()
            waypoints.value = waypoints.value.filter(x => x.id !== waypointId);
        }
    }

    function setFinalDestination(){
        const {lat, lng} = tempMarker.value!.getLatLng();
        finalDestination.value = {longitude: lng, latitude: lat};
        finalDestinationMarker.value = L.marker({lat: lat, lng: lng}, {draggable: false, riseOnHover: true, icon: finalDestinationIcon}).addTo(map.value!);
    }







    function onMapSearchInputChange(): void{
        if(searchInput.value == ""){
            isSearching.value = false;
            return;
        }
        isSearchPanelVisible.value = true
        isSearching.value = true;
        Promise.all([
            fetch(`/autocomplete?searchInput=${searchInput.value}`).then(res => {
                res.json().then(data => {
                    searchResults.value = data.map((x: any) => {
                        return {
                            name: x.name,
                            address: x.address,
                            latitude: x.location.latitude,
                            longitude: x.location.longitude,
                        }
                    });
                })
            }),
            useApi().account.SearchProfileLocation({search: searchInput.value}).then(locations => {
                userSearchResults.value = locations.data;
            })
        ]).then(results => {
            isSearching.value = false;
        })


    }

    function createMap(id: string = 'map'){
        map.value = L.map(id, {
            zoomControl: false,
            zoomAnimation: true,            // Yakınlaştırma animasyonunu etkinleştirir
            fadeAnimation: true,            // Katmanların solma animasyonunu etkinleştirir
            worldCopyJump: false
        });


        map.value.on('click', e => {
            tempMarker.value?.setLatLng(e.latlng)
            console.log(e);

        })

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map.value);
        const icon = L.divIcon({
            html: '<span></span>',
            className: 'rounded-full ring-1 ring-white flex items-center justify-center text-white font-medium whitespace-nowrap h-2 min-w-[0.5rem] text-[7px] p-0.5 transform bg-blue-500 ',
        });
        L.circle({lat: location.value.latitude, lng: location.value.longitude}, {radius: location.value.accuracy, fillColor: '#3b82f6', fillOpacity: 0.5, interactive:false}).addTo(map.value);
        L.marker({lat: location.value.latitude, lng: location.value.longitude}, {draggable: false, riseOnHover: true, title: 'Konumunuz', icon: icon}).addTo(map.value);
        tempMarker.value = L.marker([location.value.latitude, location.value.longitude], {
            draggable: true,
            title: '',
        }).addTo(map.value);
        tempMarker.value?.on('dragend', (e: any) => {
            console.log(e)
        })
        setView();

    }

    function setTempMarker(latitude: number, longitude: number) {
        tempMarker.value!.setLatLng({
            lat: latitude,
            lng: longitude
        });
        setView(latitude, longitude);
    }

    function setView(latitude: number = location.value.latitude, longitude: number = location.value.longitude) {
        map?.value?.setView([latitude, longitude], 17, {animate: true, duration: 1});
    }

    function addLocation(type: ITripLocationType) {
        const markerLocation = <L.LatLng>tempMarker.value?.getLatLng();
        addMarker({
            type: type,
            waitTimeAsMinute: 0,
            latitude: markerLocation!.lat,
            longitude: markerLocation!.lng,
            title: '',
            id: `marker-${markers.value.length+1}`
        })
        searchResults.value = [];
        isSearching.value = false;
        isSearchPanelVisible.value = false;
        selectedLocation.value = null
    }

    function addMarker(payload: ICreateTripLocation, isDraggable: boolean = false){
        if(payload.type === ITripLocationType.finalDestination && markers.value.some(x => x.type === ITripLocationType.finalDestination)) {
            markers.value.find(x => x.type === ITripLocationType.finalDestination)!.marker.setLatLng({
                lat: payload.latitude,
                lng: payload.longitude
            })
        }else{
            const marker  = L.marker([payload.latitude, payload.longitude], {
                draggable: isDraggable,
                title: payload.title,
            }).addTo(<L.Map>map.value);

            markers.value.push({...payload, marker});
            if(payload.type === ITripLocationType.station){
                const circle = L.circle([payload.latitude, payload.longitude], {
                    color: 'green',        // Dairenin kenar rengi
                    fillColor: 'green',    // Dairenin iç rengi
                    fillOpacity: 0.5,      // Dairenin opaklık seviyesi (0-1 arası değer alır)
                    radius: 50             // Dairenin yarıçapı (metre cinsinden)
                }).addTo(<L.Map>map.value);
                circles.value.push(circle);
            }
            if(payload.type === ITripLocationType.waitPoint){
                const circle = L.circle([payload.latitude, payload.longitude], {
                    color: 'gray',        // Dairenin kenar rengi
                    fillColor: 'gray',    // Dairenin iç rengi
                    fillOpacity: 0.5,      // Dairenin opaklık seviyesi (0-1 arası değer alır)
                    radius: 50             // Dairenin yarıçapı (metre cinsinden)
                }).addTo(<L.Map>map.value);
                circles.value.push(circle);
            }
        }
    }


    function selectLocation(payload: ILocationSearchResult){
        setTempMarker(payload.latitude, payload.longitude)
        isSearchPanelVisible.value = false;
        selectedLocation.value = payload;
    }

    function getAvailableVehicleCombinations(){
        useApi().trip.GetAvailableVehicles({
            extraServices: [],
            totalLengthOfRoad: 1473,
            totalPerson: totalPeople.value,
            segments: [],
            types: []
        }).then(x => {
            vehicleCombinations.value = x.data
        })
    }

    function setSelectedVehicleCombination(payload: IVehicleCombinationPricePair){
        selectedVehicleCombination.value = payload;
    }

    async function createTrip(){
        const name = tripName.value;
        const tripDate = date.value;
        const vehicleUsages = selectedVehicleCombination.value!.vehicles.map(x => {
            return <IVehicleUsageInformation>{
                id: x.vehicle.id,
                usage: x.usage,
                capacity: x.vehicle.vehicleModel.capacity,
                basePrice: x.vehicle.basePrice
            }
        });
        const vehicleIds = selectedVehicleCombination.value!.vehicles.map(x => x.vehicle.id)

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
                            users: y.users.map(z => {
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
                startDate: new Date(date!.value!.toString()),
                name: tripName.value,
                vehicleIds: vehicleIds,
                vehicleRoutePlans: vehicleRoutePlans
            })
        })



       /* const waypoints = markers.value.map(x => {
            const {lat: latitude, lng: longitude} = x.marker.getLatLng()
            return {latitude, longitude};
        });
        if(selectedVehicleCombination.value){
            return useApi().trip.CreateTrip({
                waypoints: waypoints,
                startDate: <Date>date.value,
                selectedVehicleCombinations:  [selectedVehicleCombination.value],
                name: tripName.value
            })
        }*/
    }


    function setCosts(payload: IVehicleFillPair[], finalLat: number, finalLng: number): Promise<void>{
        return new Promise((resolve, reject) => {
            let processedCount = 0;
            payload.forEach((x, index) => {
                x.waypoints.push({
                    id: Date.now(),
                    users: [],
                    name: "Varış Noktası",
                    longitude: finalLng,
                    latitude: finalLat,
                    ordering: 9999,
                    marker: {}
                })
                const waypointLatLangs = x.waypoints.map(y => {
                    return {lat: y.latitude, lng: y.longitude};
                });
                const routing =  L.Routing.control({
                    router: new OpenRouteService({}),
                    show: false,
                    routeWhileDragging: false,
                    waypoints: waypointLatLangs as LatLng[]
                }).addTo(map.value!)

                routing.on('routesfound', e =>  {
                    const routes = e.routes;
                    x.totalLengthOfRoad = routes[0].summary.totalDistance
                    x.totalTime = routes[0].summary.totalTime;
                    processedCount++;
                    if(processedCount === payload.length){
                        resolve()
                    }
                });
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
        tripName,
        selectedLocation,
        searchInput,
        isSearching,
        isSearchPanelVisible,
        searchResults,
        vehicleCombinations,
        userSearchResults,
        waypoints,
        selectedWaypoint,
        isWaypointEditModalVisible,
        totalPeople,
        date,

        createMap,
        setView,
        addLocation,
        selectLocation,
        getAvailableVehicleCombinations,
        setSelectedVehicleCombination,
        createTrip,
        createWaypoint,
        addUserToWaypoint,
        deleteUserFromWaypoint,
        deleteWaypoint,
        setFinalDestination
    }
})