import type { ICombinationVehicle, IVehicleCombinationPricePair } from "./IVehicleCombination";
import type { VroomResponse } from "./IVroom";

export class VehicleCombination{
    totalPrice: number;
    combinations: ICombinationVehicle[];
    vehicles: IVehicle[];
    vroom: VroomResponse | null;

    constructor(totalPrice: number, combinations: ICombinationVehicle[]){
        this.vroom = null
        this.totalPrice = totalPrice;
        this.combinations = combinations;
        this.vehicles = [];
        let vehicleId = 0;
        this.combinations.forEach(combination => {
            for(let i = 1; i<= combination.usage; i++){
                vehicleId++;
                this.vehicles.push({
                    id: vehicleId,
                    description: combination.vehicle.id,
                    capacity: [combination.vehicle.vehicleModel.capacity]
                })
            }
        })
    }
}

interface IVehicle{
    id: number;
    description: string;
    capacity: number[];
}