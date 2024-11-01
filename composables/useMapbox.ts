import mapboxgl from "mapbox-gl";
import {latLng} from "leaflet";
import type {IWaypoint} from "~/core/app/ITripLocation";
import {OpenRouteService} from "~/core/OpenRouteService";

export function useMapbox(){
    mapboxgl.accessToken = 'pk.eyJ1IjoiZXJkb2dhbnNvbm1leiIsImEiOiJjbTJrZ2xqd3IwMTB2MnFxc3FqY2xyM3I3In0.DwavTLYFuZs-BDfuA9RR6w';

    function createMap(container: any, initLocation: any){
        const map = new mapboxgl.Map({
            container: container,
            style: 'mapbox://styles/erdogansonmez/cm2kgqzz4009501qs6hf8coxt',
            center: [initLocation.latitude, initLocation.longitude],
            zoom: 0,
            attributionControl: false,
            logoPosition: 'top'
        })
        map.addControl(new mapboxgl.GeolocateControl({
            positionOptions: {
                enableHighAccuracy: true
            },
            showUserHeading: true,
            showUserLocation: true,
            trackUserLocation: true,
            showAccuracyCircle: true
        }), 'top-right');
        map.addControl(new mapboxgl.FullscreenControl({

        }), 'top-right');
        map.addControl( new mapboxgl.NavigationControl({
                showCompass: true,
            showZoom: false,
            visualizePitch: true
            }), 'top-left')

        return map;
    }

    function onMapClickPosition(map: mapboxgl.Map, callback: Function){
        map.on('click', event => {
            const {lngLat} = event;
            callback(lngLat);
        });
    }

    function fetchRouteData(waypoints: IWaypoint[]): Promise<any>{
        return new Promise(resolve => {
            const service = new OpenRouteService({});
            service.route(waypoints.map(x => {
                return {
                    lat: x.latitude,
                    lng: x.longitude,
                } as any
            }),(err, routes) => {
                resolve(routes);
            })
        })
    }

    function drawRoute(map: mapboxgl.Map, geoJsonData: any){
        try{
            map.removeLayer('routeLayer')
            map.removeSource('route')
        } catch (e) {

        }
         map.addSource('route', {
            type: 'geojson',
            data: geoJsonData,
        });
        map.addLayer({
            id: 'routeLayer',
            type: 'line',
            source: 'route',
            layout: {
                'line-join': 'round',
                'line-cap': 'round'
            },
            paint: {
                'line-color': '#3b9ddd',
                'line-width': 6
            }
        });
        const coordinates = geoJsonData.features[0].geometry.coordinates;
        const bounds = coordinates.reduce((bounds: any, coord: any) => bounds.extend(coord), new mapboxgl.LngLatBounds(coordinates[0], coordinates[0]));
        map.fitBounds(bounds, {
            padding: 50
        });
    }

    function createMarker(longitude: number, latitude: number): mapboxgl.Marker{
        return new mapboxgl.Marker({color: 'blue'})
            .setLngLat([longitude, latitude])
    }

    function createWaypointMarker(personCount: number){
        const innerHtml = '<div class="bg-red-500 text-white rounded-full px-4 py-1 flex justify-center items-center gap-x-2 min-w-[70px]"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="#ffffff" d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5s-3 1.34-3 3s1.34 3 3 3m-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5S5 6.34 5 8s1.34 3 3 3m0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5m8 0c-.29 0-.62.02-.97.05c1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5"/></svg>' + personCount + '</div>';
        const htmlElement = document.createElement('div');
        htmlElement.innerHTML = innerHtml;
        return htmlElement;
    }

    function createVehicleMarker(plate: string){
        const innerHtml = '<div class="bg-white text-black rounded-md text-xs border-2 border-black px-2 py-1 flex justify-center items-center gap-x-2 min-w-[70px]">' + plate + '</div>';
        const htmlElement = document.createElement('div');
        htmlElement.innerHTML = innerHtml;
        return htmlElement;
    }

    return {
        createMap,
        fetchRouteData,
        drawRoute,
        onMapClickPosition,
        createMarker,
        createWaypointMarker,
        createVehicleMarker
    }
}