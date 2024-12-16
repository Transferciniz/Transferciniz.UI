export interface IOptimizeRoute {
    vehicles: IVroomVehicle[];
    jobs: IVroomJob[];
    options: IOptions;
}

export interface IVroomVehicle{
 id: number;
 capacity: number[];
 start?: number[];
 end?: number[];
 description: string;
}

export interface IVroomJob{
    id: number;
    location: number[];
    description: string;
    amount: number[]
}

interface IOptions{
    format: 'geojson'
}

