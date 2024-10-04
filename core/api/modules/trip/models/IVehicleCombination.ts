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