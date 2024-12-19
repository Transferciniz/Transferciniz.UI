import { useApi } from "~/core/api/useApi";
import type { ICombinationVehicle, IVehicleCombinationPricePair } from "./IVehicleCombination";
import type { VroomResponse } from "./IVroom";
import type { IEmployee } from "../../account/models/IEmployee";
import type { IVroomJob, IVroomVehicle } from "./IOptimizeRoute";
import type { ILocationSearchResult, IWaypoint } from "~/core/app/ITripLocation";
import { decode } from "@mapbox/polyline";
import mapboxgl from "mapbox-gl";

export class VehicleCombination {
    totalPrice: number;
    twoWayTotalPrice: number;
    combinations: ICombinationVehicle[];
    vehicles: IVehicleCombinationVehicle[];
    twoWayVehicles: IVehicleCombinationVehicle[];
    vroom: VroomResponse | null;
    vroomTwoWay: VroomResponse | null;
    users: IEmployee[];

    constructor(combinations: ICombinationVehicle[], users: IEmployee[]) {
        this.vroom = null
        this.vroomTwoWay = null
        this.totalPrice = 0;
        this.twoWayTotalPrice = 0;
        this.combinations = combinations;
        this.users = users;
        this.vehicles = [];
        this.twoWayVehicles = [];
        let vehicleId = 0;
        this.combinations.forEach(combination => {
            for (let i = 1; i <= combination.usage; i++) {
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
                this.twoWayVehicles.push({
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

    private GetVehicles(type: 'to' | 'from', serviceLocation: ILocationSearchResult): IVroomVehicle[] {
        if (type == 'to') {
            return this.vehicles.map(vehicle => {
                return <IVroomVehicle>{
                    capacity: vehicle.capacity,
                    description: vehicle.description,
                    id: vehicle.id,
                    start: [serviceLocation.longitude, serviceLocation.latitude]
                };
            })
        } else {
            return this.vehicles.map(vehicle => {
                return <IVroomVehicle>{
                    capacity: vehicle.capacity,
                    description: vehicle.description,
                    id: vehicle.id,
                    end: [serviceLocation.longitude, serviceLocation.latitude]
                };
            })
        }
    }

    private GetJobs(): IVroomJob[] {
        return this.users.map((x, i) => {
            return <IVroomJob>{
                location: [x.longitude, x.latitude],
                amount: [1],
                description: x.id,
                id: i + 1
            };
        })
    }

    private ProcessRoute(useTwoWay: boolean = false){
        if(useTwoWay == false){
            this.vroom!.routes.forEach(route => {

                const vehicle = this.vehicles.find(x => x.id == route.vehicle);
                if (vehicle) {
                    vehicle.geometryText = route.geometry;
                    vehicle.decodedGeometry = decode(vehicle.geometryText).map(([lat, lng]) => [lng, lat]);
                    vehicle.totalDistance = route.distance;
                    vehicle.totalTime = route.duration;
                    vehicle.users = route.steps.filter(x => x.type == 'job').map(x => {
                        const user = this.users.find(y => y.id == x.description);
                        return {
                            user: user!,
                            duration: x.arrival,
                            waypoint: useGetNearestPoint([user!.longitude, user!.latitude], vehicle.decodedGeometry)
                        }
                    })
                    this.totalPrice += vehicle.basePrice * vehicle.totalDistance / 1000
                }
    
            })
        }else{
            this.vroomTwoWay!.routes.forEach(route => {

                const vehicle = this.twoWayVehicles.find(x => x.id == route.vehicle);
                if (vehicle) {
                    vehicle.geometryText = route.geometry;
                    vehicle.decodedGeometry = decode(vehicle.geometryText).map(([lat, lng]) => [lng, lat]);
                    vehicle.totalDistance = route.distance;
                    vehicle.totalTime = route.duration;
                    vehicle.users = route.steps.filter(x => x.type == 'job').map(x => {
                        const user = this.users.find(y => y.id == x.description);
                        return {
                            user: user!,
                            duration: x.arrival,
                            waypoint: useGetNearestPoint([user!.longitude, user!.latitude], vehicle.decodedGeometry)
                        }
                    })
                    this.twoWayTotalPrice += vehicle.basePrice * vehicle.totalDistance / 1000
                }
    
            })
        }
  
    }

    public async GetRoutes(serviceLocation: ILocationSearchResult, type: 'to' | 'from' | 'both'): Promise<void> {
        this.totalPrice = 0;
        this.twoWayTotalPrice = 0;
        if(type != 'both'){
            this.vroom = (await useApi().trip.OptimizeRoute({
                jobs: this.GetJobs(),
                vehicles: this.GetVehicles(type, serviceLocation),
                options: {
                    format: "geojson"
                }
            })).data
            this.ProcessRoute();
        }else{
            this.vroom = (await useApi().trip.OptimizeRoute({
                jobs: this.GetJobs(),
                vehicles: this.GetVehicles('from', serviceLocation),
                options: {
                    format: "geojson"
                }
            })).data
            this.ProcessRoute();

            this.vroomTwoWay = (await useApi().trip.OptimizeRoute({
                jobs: this.GetJobs(),
                vehicles: this.GetVehicles('to', serviceLocation),
                options: {
                    format: "geojson"
                }
            })).data;
            this.ProcessRoute(true);
        }
   
    }



    public drawRoutes(map: mapboxgl.Map) {
        this.vehicles.forEach(vehicle => {
            useMapbox().drawRoute(map, this.getRouteGeoJSONTemplate(), `route-${vehicle.id}`, `route-${vehicle.id}`, false, '#3b9ddd', vehicle.isRouteSelected);
            if (vehicle.isRouteSelected) {
                this.animateRoute(vehicle.decodedGeometry, this.getRouteGeoJSONTemplate(), 0, `route-${vehicle.id}`, map);
            }

        })
    }

    public toggleSelected(id: number) {
        this.vehicles.find(x => x.id == id)!.isRouteSelected = true;
        this.vehicles.filter(x => x.id != id).forEach(vehicle => {
            vehicle.isRouteSelected = false;
        })

    }

    private getRouteGeoJSONTemplate() {
        return {
            type: "Feature",
            geometry: {
                type: "LineString",
                coordinates: []
            }
        };
    }

    private animateRoute(coordinates: number[][], geoJson: any, index: number, sourceName: string, map: mapboxgl.Map) {
        if (index >= coordinates.length) return;
        geoJson.geometry.coordinates.push(coordinates[index]);
        map!.getSource(sourceName)!.setData(geoJson);
        index++

        setTimeout(() => this.animateRoute(coordinates, geoJson, index, sourceName, map), 10)
    }
}

export interface IVehicleCombinationVehicle {
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

interface IEmployeeMarkerPair {
    user: IEmployee
    waypoint: { lat: number, lng: number, distance: number };
    duration: number;
}