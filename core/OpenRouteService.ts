interface OpenRouteServiceOptions {
    serviceUrl: string;
    apiKey: string;
    timeout: number;
}

// OpenRouteService yönlendirme sağlayıcısı sınıfı
export class OpenRouteService {
    options: OpenRouteServiceOptions;

    constructor(options: Partial<OpenRouteServiceOptions>) {
        this.options = {
            serviceUrl: '/ors/v2/directions/car/geojson',
            apiKey: '', // Kendi OpenRouteService API anahtarınızı buraya koyun
            timeout: 30 * 1000,
            ...options
        };
    }

    // OpenRouteService ile rota hesapla
    route(
        waypoints: any[],
        callback: (err?: any, routes?: any[]) => void,
        context?: {},
        options?: any
    ): void {
        const url = this.options.serviceUrl;
        //@ts-ignore
        const coordinates = waypoints.map(wp => [wp.lng, wp.lat]); // Koordinatları [lng, lat] olarak hazırlıyoruz
        let timedOut = false;

        // Zaman aşımı kontrolü
        const timer = setTimeout(() => {
            timedOut = true;
            callback.call(context || callback, { status: 'Timeout', message: 'Timeout' });
        }, this.options.timeout);

        // POST isteği için gövdeyi hazırlıyoruz
        const body = {
            coordinates: coordinates,
            profileName: 'car',
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
                    callback.call(context || callback, undefined, data);
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
    buildRouteUrl(waypoints: any[]): string {
        const coordinates = waypoints
            .map(wp => `${wp.latLng.lng},${wp.latLng.lat}`)
            .join('|');

        return `${this.options.serviceUrl}?api_key=${this.options.apiKey}&start=${coordinates.split('|')[0]}&end=${coordinates.split('|')[1]}`;
    }

    // OpenRouteService API yanıtını Leaflet için uygun rotaya dönüştür
    convertRoute(response: any): any[] {
        // GeoJSON formatında gelen koordinatları alıyoruz
        const coordinates = response.features[0].geometry.coordinates;

        // Koordinatları Leaflet'in LatLng formatına dönüştür
        const latLngs = coordinates.map((coord: [number, number]) => {
            return {
                lat: coord[1],
                lng: coord[0]
            }
        });


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

