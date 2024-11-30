import mapboxgl from "mapbox-gl";
import type {IWaypoint} from "~/core/app/ITripLocation";
import {OpenRouteService} from "~/core/OpenRouteService";

export function useMapbox(){
    mapboxgl.accessToken = 'pk.eyJ1IjoiZXJkb2dhbnNvbm1leiIsImEiOiJjbTJrZ2xqd3IwMTB2MnFxc3FqY2xyM3I3In0.DwavTLYFuZs-BDfuA9RR6w';

    function createMap(container: any, initLocation: any, showGeoLocatePlugin: boolean = true){
        const map = new mapboxgl.Map({
            container: container,
            style: 'mapbox://styles/erdogansonmez/cm3x00h4f001b01sg0lm310p5',
            center: [initLocation.latitude, initLocation.longitude],
            zoom: 0,
            attributionControl: false,
            logoPosition: 'top'
        })
        if(showGeoLocatePlugin){
            const geoLocatePlugin = new mapboxgl.GeolocateControl({
                positionOptions: {
                    enableHighAccuracy: true
                },
                showUserHeading: true,
                showUserLocation: true,
                trackUserLocation: true,
                showAccuracyCircle: true
            });
            map.addControl(geoLocatePlugin, 'top-right');
        }

        map.addControl(new mapboxgl.FullscreenControl({

        }), 'top-right');
        map.addControl( new mapboxgl.NavigationControl({
                showCompass: true,
            showZoom: false,
            visualizePitch: true,

            }), 'top-left')
        //map.on('load', () => {     geoLocatePlugin.trigger(); });
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

    function drawRoute(map: mapboxgl.Map, geoJsonData: any, sourceId: string = "route", layerId: string = "routeLayer", center:boolean = true){
        try{
            map.removeLayer(layerId)
            map.removeSource(sourceId)
        } catch (e) {

        }finally {
            map.addSource(sourceId, {
                type: 'geojson',
                data: geoJsonData,
            });
            map.addLayer({
                id: layerId,
                type: 'line',
                source: sourceId,
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
            if(center){
                map.fitBounds(bounds, {
                    padding: 50
                });
            }

        }

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

    function createStartMarker(){
        const innerHtml='<div><svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path fill="#ff0000" d="m10.65 15.75l4.875-3.125q.35-.225.35-.625t-.35-.625L10.65 8.25q-.375-.25-.763-.038t-.387.663v6.25q0 .45.388.663t.762-.038M12 22q-2.075 0-3.9-.788t-3.175-2.137T2.788 15.9T2 12t.788-3.9t2.137-3.175T8.1 2.788T12 2t3.9.788t3.175 2.137T21.213 8.1T22 12t-.788 3.9t-2.137 3.175t-3.175 2.138T12 22"/></svg></div>';
        const htmlElement = document.createElement('div');
        htmlElement.innerHTML = innerHtml;
        return htmlElement;
    }

    function createDefaultMarker(){
        const innerHtml='<div><svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path fill="#ffffff" d="M12 22c5.523 0 10-2.014 10-4.5c0-1.266-1.163-2.41-3.035-3.229c-1.142 2.096-2.883 3.903-5.095 4.848a4.78 4.78 0 0 1-3.74 0c-2.212-.945-3.953-2.752-5.095-4.847C3.163 15.089 2 16.234 2 17.5C2 19.986 6.477 22 12 22"/><path fill="#fff" fill-rule="evenodd" d="M5 8.515C5 4.917 8.134 2 12 2s7 2.917 7 6.515c0 3.57-2.234 7.735-5.72 9.225a3.28 3.28 0 0 1-2.56 0C7.234 16.25 5 12.084 5 8.515M12 11a2 2 0 1 0 0-4a2 2 0 0 0 0 4" clip-rule="evenodd"/></svg></div>';
        const htmlElement = document.createElement('div');
        htmlElement.innerHTML = innerHtml;
        return htmlElement;

    }

    function createCustomerCarMarker(){
        const innerHtml='<div><svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path fill="#000000" d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01l-1.97 5.67c-.07.21-.11.43-.11.66v7.16c0 .83.67 1.5 1.5 1.5S6 20.33 6 19.5V19h12v.5c0 .82.67 1.5 1.5 1.5c.82 0 1.5-.67 1.5-1.5v-7.16c0-.22-.04-.45-.11-.66zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16m11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5s1.5.67 1.5 1.5s-.67 1.5-1.5 1.5M5 11l1.27-3.82c.14-.4.52-.68.95-.68h9.56c.43 0 .81.28.95.68L19 11z"/></svg></div>';
        const htmlElement = document.createElement('div');
        htmlElement.innerHTML = innerHtml;
        return htmlElement;
    }

    function createFinishMarker(){
        const innerHtml = '<div><svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 100 100"><path fill="#ff0000" d="M50 0a3.5 3.5 0 0 0-3.5 3.5v80A3.5 3.5 0 0 0 50 87a3.5 3.5 0 0 0 3.5-3.5V47h43a3.5 3.5 0 0 0 3.5-3.5v-40A3.5 3.5 0 0 0 96.5 0h-46a4 4 0 0 0-.254.01A4 4 0 0 0 50 0m13.8 7h9.8v7.43h9.8V7H93v7.43h-9.6v9.799H93v9.8h-9.6V40h-9.8v-5.97h-9.8V40H54v-5.97h9.8v-9.801H54v-9.8h9.8zm0 7.43v9.799h9.8v-9.8zm9.8 9.799v9.8h9.8v-9.8z" color="#ff0000"/><path fill="#ff0000" d="M38.004 76.792C27.41 78.29 20 81.872 20 87.143C20 94.243 32.381 100 50 100s30-5.756 30-12.857c0-5.272-7.41-8.853-18.003-10.35l-1.468 2.499C68.514 80.399 74 82.728 74 85.429c0 3.787-10.745 6.857-24 6.857s-24-3.07-24-6.857c-.001-2.692 5.45-5.018 13.459-6.13z" color="#ff0000"/></svg></div>';
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
        createVehicleMarker,
        createStartMarker,
        createFinishMarker,
        createDefaultMarker,
        createCustomerCarMarker
    }
}