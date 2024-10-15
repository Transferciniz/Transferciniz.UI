import {OpenRouteService} from "~/core/OpenRouteService";

export function useRouteCalculation(from: L.LatLng, to: L.LatLng): Promise<Date> {
    return new Promise(resolve => {
        const {$L: L} = useNuxtApp();
        const routing =  L.Routing.control({
            router: new OpenRouteService({}),
            show: false,
            routeWhileDragging: false,
            waypoints: [from, to],
            //@ts-ignore
            createMarker: function(i: any, wp: any, n: any) {
                return null;
            },
        });

        routing.on('routesfound', e =>  {
            const routes = e.routes;
            const date  = new Date(new Date().getTime() + routes[0].summary.totalTime);
            resolve(date);
        });

        routing.route();
    })

}