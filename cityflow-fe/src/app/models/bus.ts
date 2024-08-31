import { Route } from "./route";

export interface Bus {
    id: number,
    licencePlate: string,
    routes: Route[],
    routeNames: string[],
}