import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Bus } from '../models/bus';
import { BusDTO } from '../dtos/busDTO';

@Injectable({
  providedIn: 'root'
})
export class BusService {

  private apiServerUrl = 'http://localhost:8081'; 

  constructor(private http: HttpClient,
              private router: Router) { }

  public getAll() : Observable<Bus[]> {
    return this.http.get<Bus[]>(`${this.apiServerUrl}/CityFlow/buses`);
  }

  public save(bus : BusDTO) : Observable<Bus> {
    return this.http.post<Bus>(`${this.apiServerUrl}/CityFlow/saveBus`, bus);
  }

  public deleteBus(id: number) : Observable<any>{
    return this.http.delete<any>(`${this.apiServerUrl}/CityFlow/deleteBus/${id}`);
  }
}
