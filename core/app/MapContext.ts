import L from "leaflet";
import {type ICreateTripLocation, type ITripLocation, ITripLocationType} from "~/core/app/ITripLocation";

export class MapContext {
    map: L.Map;
    markers: ITripLocation[];
    otherObjects: L.Circle[];
    tempMarker: L.Marker;
    routing: L.Routing.Control | undefined;
    totalDistance: number;
    totalTime: number;

    constructor(visible: boolean = true, mapId: string = 'map') {
        this.totalDistance = 0;
        this.totalTime = 0;
        this.markers = [];
        this.otherObjects = [];
        if(visible){
            this.map = L.map(mapId, {
                zoomControl: false,
                zoomAnimation: true,            // Yakınlaştırma animasyonunu etkinleştirir
                fadeAnimation: true,            // Katmanların solma animasyonunu etkinleştirir
                worldCopyJump: false
            })
        }else {
            const div = document.createElement('div');
            div.id = 'map';
            div.style.display = 'none';
            document.body.appendChild(div);
            this.map = L.map('map', {
                zoomControl: false,
                zoomAnimation: true,            // Yakınlaştırma animasyonunu etkinleştirir
                fadeAnimation: true,            // Katmanların solma animasyonunu etkinleştirir
                worldCopyJump: false
            })
        }
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(this.map);
        const {location}  = storeToRefs(useLocationStore())
        const icon = L.divIcon({
            html: '<span></span>',
            className: 'rounded-full ring-1 ring-white flex items-center justify-center text-white font-medium whitespace-nowrap h-2 min-w-[0.5rem] text-[7px] p-0.5 transform bg-blue-500 ',
        })
        L.circle({lat: location.value.latitude, lng: location.value.longitude}, {radius: location.value.accuracy, fillColor: '#3b82f6', fillOpacity: 0.5, interactive:false}).addTo(this.map);
        L.marker({lat: location.value.latitude, lng: location.value.longitude}, {draggable: false, riseOnHover: true, title: 'Konumunuz', icon: icon}).addTo(this.map);
        this.tempMarker = L.marker([location.value.latitude, location.value.longitude], {
            draggable: true,
            title: '',
        }).addTo(this.map);

        this.map.setView([location.value.latitude, location.value.longitude], 17, {animate: true, duration: 1});
    }


    setTempMarker(latitude: number, longitude: number) {
        this.tempMarker.setLatLng({
            lat: latitude,
            lng: longitude
        });
        this.map.setView([latitude, longitude], 17, {animate: true, duration: 1});
    }

    addMarker(payload: ICreateTripLocation, isDraggable: boolean = false){
        if(payload.type === ITripLocationType.finalDestination && this.markers.some(x => x.type === ITripLocationType.finalDestination)) {
            this.markers.find(x => x.type === ITripLocationType.finalDestination)!.marker.setLatLng({
                lat: payload.latitude,
                lng: payload.longitude
            })
        }else{
            const marker  = L.marker([payload.latitude, payload.longitude], {
                draggable: isDraggable,
                title: payload.title,
            }).addTo(this.map);

            this.markers.push({...payload, marker});
            if(payload.type === ITripLocationType.station){
                const circle = L.circle([payload.latitude, payload.longitude], {
                    color: 'green',        // Dairenin kenar rengi
                    fillColor: 'green',    // Dairenin iç rengi
                    fillOpacity: 0.5,      // Dairenin opaklık seviyesi (0-1 arası değer alır)
                    radius: 50             // Dairenin yarıçapı (metre cinsinden)
                }).addTo(this.map);
                this.otherObjects.push(circle);
            }
            if(payload.type === ITripLocationType.waitPoint){
                const circle = L.circle([payload.latitude, payload.longitude], {
                    color: 'gray',        // Dairenin kenar rengi
                    fillColor: 'gray',    // Dairenin iç rengi
                    fillOpacity: 0.5,      // Dairenin opaklık seviyesi (0-1 arası değer alır)
                    radius: 50             // Dairenin yarıçapı (metre cinsinden)
                }).addTo(this.map);
                this.otherObjects.push(circle);
            }
        }


        return this;
    }

    calculateRoute(){
        if(this.routing){
            this.routing.remove()
        }
        this.routing = undefined;
        const finalDestination = <ITripLocation>this.markers.find(x => x.type === ITripLocationType.finalDestination);
        const wayPoints = this.markers.filter(x => x.type !== ITripLocationType.finalDestination).map(x => {
            return x.marker.getLatLng()
        })
        this.routing =  L.Routing.control({
            show: false,
            routeWhileDragging: false,
            waypoints: [...wayPoints, finalDestination.marker.getLatLng()]
        }).addTo(this.map)

        this.routing.on('routesfound', e =>  {
            const routes = e.routes;
            this.totalDistance = routes[0].summary.totalDistance / 1000;
            this.totalTime = routes[0].summary.totalTime / 60;
            const bounds = L.latLngBounds(routes[0].coordinates[0], routes[0].coordinates[1]);// Sınırlar için boş bir obje oluştur
            routes[0].coordinates.forEach((coord: any) => {
                bounds.extend(L.latLng(coord.lat, coord.lng)); // Tüm koordinatları sınırlara ekle
            });
            this.map.fitBounds(bounds, {animate: true, duration: 2}); // Haritayı sınırlarla ortala ve zoom'u ayarla
        });

    }

    focusMarker(id: string){
        const markerInstance = this.markers.find(x => x.id === id);
        if(markerInstance){
            const {lat, lng} = markerInstance.marker.getLatLng()
            this.map.setView([lat, lng], 17, {animate: true, duration: 1});
        }
        return this;

    }


}