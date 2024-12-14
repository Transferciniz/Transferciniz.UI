export interface IOptimizeRoute {
    vehicles: IVehicle[];
    jobs: IJob[];
    options: IOptions;
}

interface IVehicle{
 id: number;
 capacity: number[];
 start?: number[];
 end?: number[];
 description: string;
}

interface IJob{
    id: number;
    location: number[];
    description: string;
    amount: number[]
}

interface IOptions{
    format: 'geojson'
}

