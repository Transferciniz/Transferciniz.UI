export function useMap(containerId: string, initCoordinate?:{lat: number, long: number}) {
    const {$L: L} = useNuxtApp();
    const map = L.map(containerId, {
        zoomControl: false,
        zoomAnimation: true,
        fadeAnimation: true,
        worldCopyJump: false,
        attributionControl: false
    });
    /*var gl = L.mapboxGL({
        accessToken: 'pk.eyJ1IjoiZXJkb2dhbnNvbm1leiIsImEiOiJjbTJrZ2xqd3IwMTB2MnFxc3FqY2xyM3I3In0.DwavTLYFuZs-BDfuA9RR6w',
        style: 'mapbox://styles/erdogansonmez/cm2kgqzz4009501qs6hf8coxt'
    }).addTo(map);*/
    L.tileLayer('https://api.mapbox.com/v4/{id}/{z}/{x}/{y}?access_token={accessToken}', {
        maxZoom: 18,
        id: 'erdogansonmez.cm2kgqzz4009501qs6hf8coxt', // Mapbox'ın raster tile'ları için kullanılan stil
        tileSize: 512,
        zoomOffset: -1,
        accessToken: 'pk.eyJ1IjoiZXJkb2dhbnNvbm1leiIsImEiOiJjbTJrZ2xqd3IwMTB2MnFxc3FqY2xyM3I3In0.DwavTLYFuZs-BDfuA9RR6w' // Buraya kendi Mapbox API anahtarınızı ekleyin
    }).addTo(map);
    //L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
    if(initCoordinate) {
        const latLang = new L.LatLng(initCoordinate.lat, initCoordinate.long);
        map.setView(latLang, 17, {animate: true, duration: 1});

    }


    return map;
}