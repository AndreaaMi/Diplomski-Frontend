import { Bus } from "./bus";

export interface Route{
    id: number;
    name: string;
    startingPoint: Location;
    stations: Location[];
    buses : Bus[];
    endPoint: Location;
    openingTime: string;
    closingTime: string;
}