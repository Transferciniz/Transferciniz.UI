import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import 'leaflet-polylineoffset';

export default defineNuxtPlugin(() => {
    return {
        provide: {
            L
        }
    }
});