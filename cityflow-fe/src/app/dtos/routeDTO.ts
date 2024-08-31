import { Location } from "../models/location";

export interface RouteDTO{
    routeName: string;
    startingPoint: Location;
    endingPoint: Location;
    stations: Location[];
    openingTime: string;
    closingTime: string;
}