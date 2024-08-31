import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Route } from '../models/route';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { RouteDTO } from '../dtos/routeDTO';
import { deleteBusFromRouteDTO } from '../dtos/deleteBusFromRouteDTO';

@Injectable({
  providedIn: 'root'
})
export class RoutesService {

  private apiServerUrl = 'http://localhost:8081'; 

  constructor(private http: HttpClient,
              private router: Router) { }

  public getAll() : Observable<Route[]> {
    return this.http.get<Route[]>(`${this.apiServerUrl}/CityFlow/allRoutes`);
  }

  public getRoute(id : number) : Observable<Route>{
    return this.http.get<Route>(`${this.apiServerUrl}/CityFlow/route/${id}`);
  }

  public showRoute(id: number) : void{
    this.router.navigate([`/route/${id}`]);
  }

  public saveRoute(route: RouteDTO) : Observable<Route> {
    return this.http.post<Route>(`${this.apiServerUrl}/CityFlow/saveRoute`, route);
  }

  public deleteRoute(id: number) : Observable<any>{
    return this.http.delete<any>(`${this.apiServerUrl}/CityFlow/deleteRoute/${id}`);
  }

  public deleteBusFromRoute(dto: deleteBusFromRouteDTO) : Observable<any>{
    return this.http.put<any>(`${this.apiServerUrl}/CityFlow/deleteBusFromRoute`, dto);
  }
}
