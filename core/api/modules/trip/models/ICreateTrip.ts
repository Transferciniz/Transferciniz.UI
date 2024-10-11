import type {IVehicleCombinationPricePair} from "~/core/api/modules/trip/models/IVehicleCombination";

export interface ICreateTrip {
    name: string
    startDate: Date,
    vehicleIds: string[];
    vehicleRoutePlans:IVehicleRoutePlan[]
}

export interface IVehicleRoutePlan{
    vehicleId: string;
    totalLengthOfRoad: number;
    waypoints: IVehicleRoutePlanWaypoint[]
}

export interface IVehicleRoutePlanWaypoint{
    latitude: number;
    longitude: number;
    name: string;
    users: IVehicleRoutePlanWaypointUser[]
}

export interface IVehicleRoutePlanWaypointUser{
    userId?: string;
    name: string;
    surname: string;
}

interface Waypoints {
    latitude: number;
    longitude: number;
}