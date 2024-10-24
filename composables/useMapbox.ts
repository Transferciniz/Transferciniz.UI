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
            zoom: 10,
            attributionControl: false,
            logoPosition: 'top'
        });
        map.addControl(new mapboxgl.GeolocateControl({
            positionOptions: {
                enableHighAccuracy: true
            },
            showUserHeading: true,
            showUserLocation: true,
            trackUserLocation: true,
            showAccuracyCircle: true
        }), 'top-right');
        map.addControl(new mapboxgl.FullscreenControl(), 'top-right');
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
    }

    return {
        createMap,
        fetchRouteData,
        drawRoute,
        onMapClickPosition
    }
}