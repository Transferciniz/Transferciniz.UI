import L from "leaflet";

export interface ITripLocation{
    id: string;
    latitude: number;
    longitude: number;
    title: string
    type: ITripLocationType,
    waitTimeAsMinute: number;
    marker: L.Marker;
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