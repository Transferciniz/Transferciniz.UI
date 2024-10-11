export interface IWaypoint {
    id: number;
    name: string;
    latitude: number;
    longitude: number;
    ordering: number;
    users: IWaypointUser[];
    marker: any;
}

export interface IWaypointUser {
    userId?: string;
    name: string;
    surname: string;
    profilePicture?: string;
}








export interface ITripLocation{
    id: string;
    latitude: number;
    longitude: number;
    title: string
    type: ITripLocationType,
    waitTimeAsMinute: number;
    marker: any;
}

export interface ICreateTripLocation{
    id: string;
    latitude: number;
    longitude: number;
    title: string
    type: ITripLocationType,
    waitTimeAsMinute: number;
}

export interface ILocationSearchResult{
    name: string;
    latitude:number;
    longitude:number;
    address: string;
}

export interface IUserLocationSearchResult{
    profilePicture: string;
    id: string;
    name: string;
    surname: string;
    latitude: number;
    longitude: number;
}

export interface IUserLocationSearchQuery{
    search: string;

}

export enum ITripLocationType{
    point,
    station,
    waitPoint,
    finalDestination
}