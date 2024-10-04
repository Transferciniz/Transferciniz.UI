import type {IVehicleCombinationPricePair} from "~/core/api/modules/trip/models/IVehicleCombination";

export interface ICreateTrip {
    selectedVehicleCombinations: IVehicleCombinationPricePair[];
    waypoints: Waypoints[];
    startDate: Date,
    name: string
}

interface Waypoints {
    latitude: number;
    longitude: number;
}