import { useApi } from "~/core/api/useApi";
import type { ICombinationVehicle, IVehicleCombinationPricePair } from "./IVehicleCombination";
import type { VroomResponse } from "./IVroom";
import type { IEmployee } from "../../account/models/IEmployee";
import type { IVroomJob, IVroomVehicle } from "./IOptimizeRoute";
import type { ILocationSearchResult, IWaypoint } from "~/core/app/ITripLocation";
import { decode } from "@mapbox/polyline";
import mapboxgl from "mapbox-gl";

export class VehicleCombination{
    totalPrice: number;
    combinations: ICombinationVehicle[];
    vehicles: IVehicle[];
    vroom: VroomResponse | null;

    constructor(combinations: ICombinationVehicle[]){
        this.vroom = null
        this.totalPrice = Number.NaN;
        this.combinations = combinations;
        this.vehicles = [];
        let vehicleId = 0;
        this.combinations.forEach(combination => {
            for(let i = 1; i<= combination.usage; i++){
                vehicleId++;
                this.vehicles.push({
                    id: vehicleId,
                    description: combination.vehicle.id,
                    capacity: [combination.vehicle.vehicleModel.capacity],
                    name: `${combination.vehicle.vehicleBrand.name} ${combination.vehicle.vehicleModel.name}`,
                    photo: combination.vehicle.vehicleModel.photo,
                    totalDistance: 0,
                    totalTime: 0,
                    users: [],
                    geometryText: '',
                    decodedGeometry: [],
                    basePrice: combination.vehicle.basePrice,
                    isRouteSelected: true
                })
            }
        })
    }

    public async GetRoutes(users: IEmployee[], serviceLocation: ILocationSearchResult, type: 'to' | 'from'): Promise<void>{
        this.totalPrice =0;
        const vehicles = type == 'from' ? 
        this.vehicles.map(vehicle => {
            return <IVroomVehicle>{
                capacity: vehicle.capacity,
                description: vehicle.description,
                id: vehicle.id,
                end: [serviceLocation.longitude, serviceLocation.latitude]
            };
        })
        :
        this.vehicles.map(vehicle => {
            return <IVroomVehicle>{
                capacity: vehicle.capacity,
                description: vehicle.description,
                id: vehicle.id,
                start: [serviceLocation.longitude, serviceLocation.latitude]
            };
        })
        this.vroom= (await useApi().trip.OptimizeRoute({
                    jobs: users.map((x, i) => {
                    return <IVroomJob>{
                        location: [x.longitude, x.latitude],
                        amount: [1],
                        description: x.id,
                        id: i + 1
                    };
                    }),
                    vehicles: vehicles,
                    options: {
                    format: "geojson"
                    }
                })).data
        this.vroom.routes.forEach(route => {
        
            const vehicle = this.vehicles.find(x => x.id == route.vehicle);
            if(vehicle){
                vehicle.geometryText = route.geometry;
                vehicle.decodedGeometry = decode(vehicle.geometryText).map(([lat, lng]) => [lng, lat]) ;
                vehicle.totalDistance = route.distance;
                vehicle.totalTime = route.duration;
                vehicle.users = route.steps.filter(x => x.type == 'job').map(x => {
                    const user = users.find(y => y.id == x.description);
                    return {
                        user: user!,
                        duration: x.arrival,
                        waypoint: useGetNearestPoint([user!.longitude, user!.latitude], vehicle.decodedGeometry)
                    }
                })
                this.totalPrice += vehicle.basePrice * vehicle.totalDistance / 1000

            }
            
        })
      

    }

    public async recalculateRoutes(serviceLocation: ILocationSearchResult, type: 'to' |'from'): Promise<any>{
        return new Promise(async (resolve, reject) => {
            const users = this.vehicles.map(x => x.users).flat(1)
            const jobs: IVroomJob[] = users.map((x, index) => {
                return <IVroomJob>{
                    amount: [1],
                    description: x.user.id,
                    id: index + 1,
                    location: [x.user.longitude, x.user.latitude]
                }
            })
            const vehicles = type == 'from' ? this.vehicles.map(vehicle => {
                return <IVroomVehicle>{
                  capacity: vehicle.capacity,
                  description: vehicle.description,
                  id: vehicle.id,
                  end: [serviceLocation.longitude, serviceLocation.latitude]
                };
              })
              :
              this.vehicles.map(vehicle => {
                return <IVroomVehicle>{
                  capacity: vehicle.capacity,
                  description: vehicle.description,
                  id: vehicle.id,
                  start: [serviceLocation.longitude, serviceLocation.latitude]
                };
              })
            this.vroom = (await useApi().trip.OptimizeRoute({
                jobs: jobs,
                vehicles: vehicles,
                options: {format: 'geojson'}
            })).data
            this.totalPrice = 0;
            this.vroom.routes.forEach((route, index) => {
                const vehicle = this.vehicles.find(x => x.id == route.vehicle);
                if(vehicle){
                    vehicle.geometryText = route.geometry;
                    vehicle.decodedGeometry = decode(vehicle.geometryText).map(([lat, lng]) => [lng, lat]);
                    vehicle.totalDistance = route.distance;
                    vehicle.totalTime = route.duration;
                    vehicle.users = route.steps.filter(x => x.type == 'job').map(x => {
                        const user = users.find(y => y.user.id == x.description);
                        return {
                            user: user!.user,
                            waypoint: useGetNearestPoint([user!.user.longitude, user!.user.latitude], vehicle.decodedGeometry),
                            duration: x.arrival
                        }
                    })
                    this.totalPrice += vehicle.basePrice * vehicle.totalDistance / 1000
                    if(index == this.vroom!.routes.length -1){
                        console.log('Recalculate Routes', this)
                        resolve({});
                    }
                }
             
            })
        })
    }

    public drawRoutes(map: mapboxgl.Map){
        this.vehicles.forEach(vehicle => {
            console.log('isSelected', vehicle.isRouteSelected)
            useMapbox().drawRoute(map, this.getRouteGeoJSONTemplate(), `route-${vehicle.id}`, `route-${vehicle.id}`, false, '#3b9ddd', vehicle.isRouteSelected);
            if(vehicle.isRouteSelected){
                this.animateRoute(vehicle.decodedGeometry, this.getRouteGeoJSONTemplate(), 0, `route-${vehicle.id}`, map);
            }
    
        })
    }

    public toggleSelected(id: number){
        this.vehicles.find(x => x.id == id)!.isRouteSelected = true;
        this.vehicles.filter(x => x.id != id).forEach(vehicle => {
            vehicle.isRouteSelected = false;
        })
    
    }

    private getRouteGeoJSONTemplate(){
        return  {
            type: "Feature",
            geometry: {
              type: "LineString",
              coordinates: []
            }
          };
    }

    private animateRoute(coordinates: number[][], geoJson: any, index: number, sourceName: string, map: mapboxgl.Map){
        if(index >= coordinates.length) return;
        geoJson.geometry.coordinates.push(coordinates[index]);
        map!.getSource(sourceName)!.setData(geoJson);
        index++
    
        setTimeout(() => this.animateRoute(coordinates, geoJson, index, sourceName, map), 10)
    }
}

interface IVehicle{
    id: number;
    description: string;
    capacity: number[];
    name: string;
    photo: string;
    totalDistance: number;
    totalTime: number;
    users: IEmployeeMarkerPair[];
    geometryText: string;
    decodedGeometry: any[],
    basePrice: number;
    isRouteSelected: boolean;
}

interface IEmployeeMarkerPair{
    user: IEmployee
    waypoint: {lat: number, lng: number, distance: number};
    duration: number;
}