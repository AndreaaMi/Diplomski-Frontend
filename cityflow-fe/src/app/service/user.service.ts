import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { EditProfileDTO } from '../dtos/editProfileDTO';
import { Observable } from 'rxjs';
import { User } from '../models/user';
import { BalanceDTO } from '../dtos/balanceDTO';
import { KYCBalanceDTO } from '../dtos/kycBalanceDTO';
import { StringDTO } from '../dtos/stringDTO';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiServerUrl = 'http://localhost:8081'; 

  constructor(private http: HttpClient,
              private router: Router) { }
  
  public updateProfile(requestBody : EditProfileDTO,headers : HttpHeaders) : Observable<string>{
    return this.http.post<string>(`${this.apiServerUrl}/Account/updateProfile`, requestBody,{headers});  
  }
  
  public getUsersByRole(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiServerUrl}/CityFlow/usersByRole`);
  }

  public updateUserBalance(requestBody : BalanceDTO, headers : HttpHeaders) : Observable<string>{
    return this.http.post<string>(`${this.apiServerUrl}/Account/updateBalance`, requestBody,{headers});  
  }
  public updateUserCardBalance(requestBody : KYCBalanceDTO, headers : HttpHeaders) : Observable<string>{
    return this.http.post<string>(`${this.apiServerUrl}/KYC/updateBalance`, requestBody,{headers});  
  }
  public getStudentUsernames(headers : HttpHeaders) : Observable<String[]>{
    return this.http.get<String[]>(`${this.apiServerUrl}/document/getStudentUsernames`,{headers});
  }
  public getPensionerUsernames(headers : HttpHeaders) : Observable<Map<String, String[]>>{
    return this.http.get<Map<String, String[]>>(`${this.apiServerUrl}/document/getPensionerUsernames`,{headers});
  }
  public getHealthcareUsernames(headers : HttpHeaders) : Observable<Map<String, String[]>>{
    return this.http.get<Map<String, String[]>>(`${this.apiServerUrl}/document/getHealthcareUsernames`,{headers});
  }
  public getVacationUsernames(headers : HttpHeaders) : Observable<Map<String, String[]>>{
    return this.http.get<Map<String, String[]>>(`${this.apiServerUrl}/document/getVacationUsernames`,{headers});
  }
  public downloadStudentRequests(string : StringDTO, headers : HttpHeaders) : Observable<String>{
    return this.http.post<String>(`${this.apiServerUrl}/document/getStudentFiles`, string, {headers});  
  }
  public downloadPensionerRequests(string : StringDTO, headers : HttpHeaders) : Observable<String>{
    return this.http.post<String>(`${this.apiServerUrl}/document/getPensionerFiles`, string, {headers});  
  }
  public downloadVacationRequests(string : StringDTO, headers : HttpHeaders) : Observable<String>{
    return this.http.post<String>(`${this.apiServerUrl}/document/getVacationFiles`, string, {headers});  
  }
  public downloadHealthcareRequests(string : StringDTO, headers : HttpHeaders) : Observable<String>{
    return this.http.post<String>(`${this.apiServerUrl}/document/getHealthcareFiles`, string, {headers});  
  }
  public uploadStudentFiles(formData : FormData, headers : HttpHeaders) : Observable<String>{
    return this.http.post<String>(`${this.apiServerUrl}/document/studentRequestUpload`, formData, {headers});  
  }
  public uploadPensionerFiles(formData : FormData, headers : HttpHeaders) : Observable<String>{
    return this.http.post<String>(`${this.apiServerUrl}/document/pensionerRequestUpload`, formData, {headers});  
  }
  public uploadHealthcareFiles(formData : FormData, headers : HttpHeaders) : Observable<String>{
    return this.http.post<String>(`${this.apiServerUrl}/document/healthcareRequestUpload`, formData, {headers});  
  }
  public uploadVacationFiles(formData : FormData, headers : HttpHeaders) : Observable<String>{
    return this.http.post<String>(`${this.apiServerUrl}/document/vacationRequestUpload`, formData, {headers});  
  }
}
