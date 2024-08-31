import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginDTO } from '../dtos/loginDTO';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { User } from '../models/user';
import { RegisterDTO } from '../dtos/registerDTO';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private authStatusSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public authStatus: Observable<boolean> = this.authStatusSubject.asObservable();

  constructor(private http: HttpClient) { }

  private apiServerUrl = 'http://localhost:8081'; 

  public logIn(logInDTO: LoginDTO):Observable<LoginDTO>{      
    return this.http.post<LoginDTO>(`${this.apiServerUrl}/CityFlow/Login`, logInDTO).pipe(
      tap(
        (response:LoginDTO) => {
          localStorage.setItem('token', response.username);
        }
      )
    )
  }

  public register(requestBody:RegisterDTO):Observable<RegisterDTO>{
    return this.http.post<RegisterDTO>(`${this.apiServerUrl}/CityFlow/RegisterUser`, requestBody);
  }

  public getUserFromToken(token: String): Observable<User>{
    return this.http.get<User>(`${this.apiServerUrl}/CityFlow/getUserByToken?token=${token}`);
  }

  public isLoggedIn(): boolean {
    const token = localStorage.getItem('token');
    return !!token;
  }
}
