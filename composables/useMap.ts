export function useMap(containerId: string, initCoordinate?:{lat: number, long: number}) {
    const {$L: L} = useNuxtApp();
    const map = L.map(containerId, {
        zoomControl: false,
        zoomAnimation: true,
        fadeAnimation: true,
        worldCopyJump: false
    });
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
    if(initCoordinate) {
        const latLang = new L.LatLng(initCoordinate.lat, initCoordinate.long);
        map.setView(latLang, 17, {animate: true, duration: 1});

    }
    return map;
}