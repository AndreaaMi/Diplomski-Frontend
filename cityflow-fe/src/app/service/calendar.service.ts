import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
  })
  export class WorkCalendarService  {
    private apiServerUrl = 'http://localhost:8081'; 
    
    constructor(private http: HttpClient) { }

  public getAllShifts(): Observable<any> {
    return this.http.get<any>(`${this.apiServerUrl}/CityFlow/shift/all`);
  }

  public addShift(shift: any): Observable<any> {
    return this.http.post<any>(`${this.apiServerUrl}/CityFlow/shift/add`, shift);
  }
  }