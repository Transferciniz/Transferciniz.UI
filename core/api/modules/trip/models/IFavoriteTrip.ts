import type {IWaypoint} from "~/core/app/ITripLocation";

export interface IFavoriteTrip {
    name: string;
    waypoints: IWaypoint[];
    finalDestination: IWaypoint
}