import {ITripType} from "~/core/app/ITripType";
import {
    type ICreateTripLocation,
    type ILocationSearchResult,
    type ITripLocation,
    type IUserLocationSearchResult,
    ITripLocationType,
} from "~/core/app/ITripLocation";
import L from "leaflet";
import {GoogleProvider} from "leaflet-geosearch";
import {useApi} from "~/core/api/useApi";
import type {IVehicleCombinationPricePair} from "~/core/api/modules/trip/models/IVehicleCombination";
import {OpenRouteService} from "~/core/OpenRouteService";

export const useCreateTripStore = defineStore('createTripStore', () => {

    const {location} = storeToRefs(useLocationStore())

    const tripName = ref('');
    const startDate = ref<Date>();
    const endDate = ref<Date>();
    const totalPeople = ref<number>(0);
    const tripType = ref<ITripType>(ITripType.OneDirection)

    const map = ref<L.Map>();
    const markers = ref<ITripLocation[]>([]);
    const tempMarker = ref<L.Marker>();
    const circles = ref<L.Circle[]>([]);
    const routing = ref<L.Routing.Control>();
    const totalDistance = ref(0);
    const totalTime = ref(0);

    const searchProvider = ref(new GoogleProvider({
        apiKey: 'AIzaSyCae-E5TDMSu-LNPlf7AevPHzUDTqft-TU',
        region: 'TR',
        language: 'tr',
    }))
    const searchInput = ref('');
    const isSearching = ref(false);
    const isSearchPanelVisible = ref(false);
    const searchResults = ref<ILocationSearchResult[]>([]);
    const userSearchResults = ref<IUserLocationSearchResult[]>([])
    const selectedLocation = ref<ILocationSearchResult | null>(null);
    const isRouteShowing = ref(false);
    const isRouteCanShow = computed(() => {
        const lengthCondition = markers.value.length ?? 0 > 1
        const finalDestinationCondition = markers.value.some(x => x.type === ITripLocationType.finalDestination) ?? false
        return lengthCondition && finalDestinationCondition
    })

    const totalDistanceTextAsKilometer = computed(() => (totalDistance.value / 1000).toFixed(2));
    const totalTimeAsMinute = computed(() => (totalTime.value / 60).toFixed(2));

    const vehicleCombinations = ref<IVehicleCombinationPricePair[]>([]);
    const selectedVehicleCombination = ref<IVehicleCombinationPricePair>()
    watchDebounced(
        searchInput,
        () => onMapSearchInputChange(),
        {debounce: 300}
    );

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

    function calculateRoute(){
        if(routing.value){
            routing.value.remove()
        }
        routing.value = undefined;
        const finalDestination = <ITripLocation>markers.value.find(x => x.type === ITripLocationType.finalDestination);
        const wayPoints = markers.value.filter(x => x.type !== ITripLocationType.finalDestination).map(x => {
            return x.marker.getLatLng()
        })


        routing.value =  L.Routing.control({
            router: new OpenRouteService({}),
            show: false,
            routeWhileDragging: false,
            waypoints: [...wayPoints, finalDestination.marker.getLatLng()]
        }).addTo(<L.Map>map.value)

        routing.value.on('routesfound', e =>  {
            const routes = e.routes;
            totalDistance.value = routes[0].summary.totalDistance
            totalTime.value = routes[0].summary.totalTime;
            const bounds = L.latLngBounds(routes[0].coordinates[0], routes[0].coordinates[1]);// Sınırlar için boş bir obje oluştur
            routes[0].coordinates.forEach((coord: any) => {
                bounds.extend(L.latLng(coord.lat, coord.lng)); // Tüm koordinatları sınırlara ekle
            });
            map.value?.fitBounds(bounds, {animate: true, duration: 2}); // Haritayı sınırlarla ortala ve zoom'u ayarla
        });
        isRouteShowing.value = true;

    }

    function selectLocation(payload: ILocationSearchResult){
        setTempMarker(payload.latitude, payload.longitude)
        isSearchPanelVisible.value = false;
        selectedLocation.value = payload;
    }

    function getAvailableVehicleCombinations(){
        useApi().trip.GetAvailableVehicles({
            extraServices: [],
            totalLengthOfRoad: totalDistance.value,
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
        const waypoints = markers.value.map(x => {
            const {lat: latitude, lng: longitude} = x.marker.getLatLng()
            return {latitude, longitude};
        });
        if(selectedVehicleCombination.value){
            return useApi().trip.CreateTrip({
                waypoints: waypoints,
                startDate: <Date>startDate.value,
                selectedVehicleCombinations:  [selectedVehicleCombination.value],
                name: tripName.value
            })
        }

    }

    return {
        tripName,
        startDate,
        endDate,
        totalPeople,
        tripType,
        selectedLocation,
        isRouteCanShow,
        isRouteShowing,
        totalDistanceTextAsKilometer,
        totalTimeAsMinute,
        searchInput,
        isSearching,
        isSearchPanelVisible,
        searchResults,
        vehicleCombinations,
        userSearchResults,

        createMap,
        setView,
        addLocation,
        selectLocation,
        calculateRoute,
        getAvailableVehicleCombinations,
        setSelectedVehicleCombination,
        createTrip
    }
})