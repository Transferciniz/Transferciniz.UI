import type {IWaypoint} from "~/core/app/ITripLocation";

export interface IGetAvailableVehiclesQuery{
    segments: string[];
    extraServices: string[];
    types: string[];
    totalLengthOfRoad: number;
    totalPerson: number;
}

export interface IVehicleCombinationPricePair{
    vehicles: ICombinationVehicle[];
    totalPrice: number;
}

export interface IVehicleUsageInformation{
    id: string;
    usage: number;
    capacity: number;
    basePrice: number
}

export interface  IVehicleFillPair{
    id: string;
    capacity: number;
    basePrice: number;
    filled: number;
    totalLengthOfRoad: number;
    totalTime: number;
    waypoints: IWaypoint[]
}

export interface ICombinationVehicle {
    vehicle: IVehicle
    usage: number;
}

export interface IVehicle{
    id: string;
    vehicleBrandId: string;
    vehicleModelId: string;
    basePrice: number;
    vehicleModel: IVehicleModel;
    vehicleBrand: IVehicleBrand;
}

export interface IVehicleModel {
    id: string;
    name: string;
    capacity: number;
    extraCapacity: number;
    totalCapacity: number;
    vehicleBrandId: string;
}

export interface IVehicleBrand {
    id: string;
    name: string;
}