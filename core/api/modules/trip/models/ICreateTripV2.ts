export interface CreateTripV2Request {
    name: string;
    cost: number;
    dates: string[]; // ISO tarih formatında string listesi
    hour: number;
    minute: number;
    trips: CreateTripDto[];
    timeType: TimeType
  }

  export enum TimeType{
        ArriveAtTime = 1,
        StartAtTime = 2
  }
  
  export interface CreateTripDto {
    cost: number;
    duration: number;
    vehicleId: string; // UUID
    route: string;
    waypoints: CreateWaypointDto[];
  }
  
  export interface CreateWaypointDto {
    latitude: number;
    longitude: number;
    name: string;
    duration: number;
    users: CreateWaypointUserDto[];
  }
  
  export interface CreateWaypointUserDto {
    accountId: string; // UUID
    name: string;
    surname: string;
  }