import { Route } from "../models/route";

export interface BusDTO {
    licencePlate : string,
    routes: Route[]
}