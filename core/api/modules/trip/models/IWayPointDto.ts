import type {IWayPointsUserDto} from "~/core/api/modules/trip/models/IWayPointsUserDto";

export interface IWayPointDto {
    id: string;
    name: string;
    latitude: number;
    longitude: number;
    users: IWayPointsUserDto[]
}