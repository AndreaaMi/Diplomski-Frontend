import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { LiveLocation } from '../models/liveLocation';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RabbitmqLiveLocationService {

  private apiServerUrl = 'http://localhost:8081';
  //private socket$: WebSocketSubject<LiveLocation>;

  constructor(private http: HttpClient, private router:Router) { 
    //this.socket$ = webSocket('ws://localhost:15672/ws');
    
  }

  public sendLiveLocationMessage(liveLocation: LiveLocation,headers:HttpHeaders) : Observable<LiveLocation> {
    return this.http.post<LiveLocation>(`${this.apiServerUrl}/CityFlow/liveLocation/publish/json`, liveLocation,{headers:headers});
    
  }

  /*public receiveLiveLocationMessages(): Observable<LiveLocation> {
    return this.socket$.asObservable();
  }*/
}
