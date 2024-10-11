import type {IWayPointDto} from "~/core/api/modules/trip/models/IWayPointDto";
import {OpenRouteService} from "~/core/OpenRouteService";

//@ts-ignore
export function useRouting(map: L.Map, waypoints: IWayPointDto[], routeIndex: number = 0): L.Routing.Control {
    const {$L: L} = useNuxtApp()
    const colors = ['#ff0000', '#0d26a8', '#19a90c', '#4974c9', '#000000']
    const offsets = [0, 0.00001, -0.00001, 0.00002, -0.00002, 0.00003, -0.00003, 0.00004,-0.00004, 0.00005, -0.00005]
    const latLangs = waypoints.map(x => new L.LatLng(x.latitude, x.longitude));
    const routing =  L.Routing.control({
        router: new OpenRouteService({}),
        show: false,
        routeWhileDragging: false,
        waypoints: latLangs,
        //@ts-ignore
        createMarker: function(i: any, wp: any, n: any) {
            if (i === 0 || i === n - 1) {
                return L.marker(wp.latLng, {
                    icon: L.icon({
                        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
                        iconSize: [25, 41], // İkon boyutu
                        iconAnchor: [12, 41], // İkonun yerleşim noktası
                        popupAnchor: [1, -34], // Popup'ın yerleşim noktası
                        shadowSize: [41, 41] // Gölge boyutu
                    })
                });
            }
            return null;
        },
    }).addTo(map)
    routing.on('routesfound', e =>  {
        const routes = e.routes;
        const bounds = L.latLngBounds(routes[0].coordinates[0], routes[0].coordinates[routes[0].coordinates.length - 1]);// Sınırlar için boş bir obje oluştur
        const offsettedCoordinates = offsetCoordinates(routes[0].coordinates.map((x: any) =>  [x.lat, x.lng]), offsets[routeIndex])
        const coordinates = offsettedCoordinates.map((x: any) => new L.LatLng(x[0], x[1]));
        const polyline = L.polyline(coordinates, { color: colors[routeIndex], weight: 3 }).addTo(map)
        coordinates.forEach((coord: any) => {
            bounds.extend(coord); // Tüm koordinatları sınırlara ekle
        });
        map.fitBounds(bounds, {animate: true, duration: 2}); // Haritayı sınırlarla ortala ve zoom'u ayarla
    });
    return routing;
}

function offsetCoordinates(coords: any[], offset: number) {
    return coords.map(coord => {
        return [coord[0] + offset, coord[1] + offset]; // Lat ve Lng kayması ekle
    });
}