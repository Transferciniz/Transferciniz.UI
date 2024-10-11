// typescript dosyanıza ekleyin
import * as L from 'leaflet';
import 'leaflet-routing-machine';

// OpenRouteService yönlendirme sağlayıcısı tipi
interface OpenRouteServiceOptions extends L.Routing.RoutingControlOptions {
    serviceUrl: string;
    apiKey: string;
    timeout: number;
}

// OpenRouteService yönlendirme sağlayıcısı sınıfı
export class OpenRouteService implements L.Routing.IRouter {
    options: OpenRouteServiceOptions;

    constructor(options: Partial<OpenRouteServiceOptions>) {
        this.options = {
            serviceUrl: '/ors/v2/directions/driving-car/geojson',
            apiKey: '', // Kendi OpenRouteService API anahtarınızı buraya koyun
            timeout: 30 * 1000,
            ...options
        };
    }

    // OpenRouteService ile rota hesapla
    route(
        waypoints: L.Routing.Waypoint[],
        callback: (err?: L.Routing.IError, routes?: L.Routing.IRoute[]) => void,
        context?: {},
        options?: L.Routing.RoutingOptions
    ): void {
        const url = this.options.serviceUrl;
        const coordinates = waypoints.map(wp => [wp.latLng.lng, wp.latLng.lat]); // Koordinatları [lng, lat] olarak hazırlıyoruz
        let timedOut = false;

        // Zaman aşımı kontrolü
        const timer = setTimeout(() => {
            timedOut = true;
            callback.call(context || callback, { status: 'Timeout', message: 'Timeout' });
        }, this.options.timeout);

        // POST isteği için gövdeyi hazırlıyoruz
        const body = {
            coordinates: coordinates,
            profile: 'driving-car',
            format: 'geojson'
        };

        // POST isteği atıyoruz
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': this.options.apiKey // API key'i header'a ekliyoruz
            },
            body: JSON.stringify(body)
        })
            .then(response => response.json())
            .then(data => {
                clearTimeout(timer);
                if (!timedOut) {
                    callback.call(context || callback, undefined, this.convertRoute(data));
                }
            })
            .catch(err => {
                clearTimeout(timer);
                if (!timedOut) {
                    callback.call(context || callback, err);
                }
            });
    }


    // API URL'sini oluştur
    buildRouteUrl(waypoints: L.Routing.Waypoint[]): string {
        const coordinates = waypoints
            .map(wp => `${wp.latLng.lng},${wp.latLng.lat}`)
            .join('|');

        return `${this.options.serviceUrl}?api_key=${this.options.apiKey}&start=${coordinates.split('|')[0]}&end=${coordinates.split('|')[1]}`;
    }

    // OpenRouteService API yanıtını Leaflet için uygun rotaya dönüştür
    convertRoute(response: any): L.Routing.IRoute[] {
        // GeoJSON formatında gelen koordinatları alıyoruz
        const coordinates = response.features[0].geometry.coordinates;

        // Koordinatları Leaflet'in LatLng formatına dönüştür
        const latLngs = coordinates.map((coord: [number, number]) => L.latLng(coord[1], coord[0]));

        // Başlangıç ve bitiş noktalarını alıyoruz
        const startPoint = latLngs[0];  // İlk nokta (başlangıç)
        const endPoint = latLngs[latLngs.length - 1];  // Son nokta (bitiş)

        // inputWaypoints sadece başlangıç ve bitiş noktalarını içermeli
        const inputWaypoints = [{latLng: startPoint}, {latLng: endPoint}];
        // Geri döneceğimiz rota bilgisi
        return [{

            name: 'Route',  // Rota adı (opsiyonel)
            coordinates: latLngs,  // Rota boyunca geçilecek noktalar
            summary: {
                totalDistance: response.features[0].properties.segments[0].distance,  // Toplam mesafe (metre)
                totalTime: response.features[0].properties.segments[0].duration       // Toplam süre (saniye)
            },
            waypoints: latLngs,  // Rota üzerindeki waypoint'leri indeks kullanarak alıyoruz
            //@ts-ignore
            inputWaypoints: inputWaypoints,
            instructions: [],    // Yönlendirme talimatları
        }];
    }
}

