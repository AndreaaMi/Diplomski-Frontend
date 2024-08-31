import { Component, OnInit } from '@angular/core';
import { UserService } from '../../service/user.service';
import { AuthService } from '../../service/auth.service';
import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faArrowDown } from '@fortawesome/free-solid-svg-icons';
import { faArrowUp } from '@fortawesome/free-solid-svg-icons';
import { HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { StringDTO } from '../../dtos/stringDTO';
import { faFile, faDownload } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-document-requests',
  standalone: true,
  imports: [
    FontAwesomeModule,
  ],
  templateUrl: './document-requests.component.html',
  styleUrl: './document-requests.component.css'
})
export class DocumentRequestsComponent implements OnInit{
  token = localStorage.getItem('token');
  isOpen = false;
  faArrowDown = faArrowDown;
  faArrowUp = faArrowUp;
  constructor(private authService : AuthService,
              private userService : UserService) {}

  selected : String[] = [] 
  requestType : String = "";
  selectedUsername: StringDTO = {
    string: ''
  };
  requestCategory : string = '';

  faFile = faFile;
  faDownload = faDownload;

  ngOnInit(): void {}
  toggleDropdown() {
    this.isOpen = !this.isOpen;
  }

  public collectUsername(username: String) : void {
    this.selectedUsername.string = username;
    console.log(this.selectedUsername.string);
    this.downloadRequests();
  }

  getStudentRequests() : void {
    this.isOpen = !this.isOpen;
    this.requestType = "Student";
    this.requestCategory = 'Applications for issuing a student card';
    if(this.token != null){
      const headers = new HttpHeaders({
        'Content-Type' : 'application/json',
        'Authorization' : `Bearer ${this.token}`
      });
      this.userService.getStudentUsernames(headers).subscribe(
        (response: String[]) => {
          this.selected = response;
          console.log(this.selected);
        },
        (error : HttpErrorResponse) => {
          console.log("Error while updating balance with kyc:\n", error.message);
        }
      )
    }
  } 

  getPensionerRequests() : void {
    this.isOpen = !this.isOpen;
    this.requestType = "Pensioner";
    this.requestCategory = 'Applications for issuing a pensioner card';
    if(this.token != null){
      const headers = new HttpHeaders({
        'Content-Type' : 'application/json',
        'Authorization' : `Bearer ${this.token}`
      });
      this.userService.getPensionerUsernames(headers).subscribe(
        (response: Map<String, String[]>) => {
          console.log(response);
        },
        (error : HttpErrorResponse) => {
          console.log("Error while updating balance with kyc:\n", error.message);
        }
      )
    }
  }

  getVacationRequests() : void {
    this.isOpen = !this.isOpen;
    this.requestType = "Vacation";
    this.requestCategory = 'Requests for annual leave';
    if(this.token != null){
      const headers = new HttpHeaders({
        'Content-Type' : 'application/json',
        'Authorization' : `Bearer ${this.token}`
      });
      this.userService.getVacationUsernames(headers).subscribe(
        (response: Map<String, String[]>) => {
          console.log(response);
        },
        (error : HttpErrorResponse) => {
          console.log("Error while updating balance with kyc:\n", error.message);
        }
      )
    }
  } 
  getHealthcareRequests() : void {
    this.isOpen = !this.isOpen;
    this.requestType = "Healthcare";
    this.requestCategory = 'Requests for opening or closing sick leave';
    if(this.token != null){
      const headers = new HttpHeaders({
        'Content-Type' : 'application/json',
        'Authorization' : `Bearer ${this.token}`
      });
      this.userService.getHealthcareUsernames(headers).subscribe(
        (response: Map<String, String[]>) => {
          console.log(response);
        },
        (error : HttpErrorResponse) => {
          console.log("Error while updating balance with kyc:\n", error.message);
        }
      )
    }
  } 

  downloadRequests() : void {
    if(this.token != null){
      const headers = new HttpHeaders({
        'Content-Type' : 'application/json',
        'Authorization' : `Bearer ${this.token}`
      });
      if (this.requestType == "Student"){
      this.userService.downloadStudentRequests(this.selectedUsername,headers).subscribe(
        (response: String) => {
          console.log(response);
        },
        (error : HttpErrorResponse) => {
          console.log("Error while updating balance with kyc:\n", error.message);
        }
      )
    }else if (this.requestType == "Pensioner"){
      this.userService.downloadPensionerRequests(this.selectedUsername,headers).subscribe(
        (response: String) => {
          console.log(response);
        },
        (error : HttpErrorResponse) => {
          console.log("Error while updating balance with kyc:\n", error.message);
        }
      )
    }else if (this.requestType == "Vacation"){
      this.userService.downloadVacationRequests(this.selectedUsername,headers).subscribe(
        (response: String) => {
          console.log(response);
        },
        (error : HttpErrorResponse) => {
          console.log("Error while updating balance with kyc:\n", error.message);
        }
      )
    }else if (this.requestType == "Healthcare"){
      this.userService.downloadHealthcareRequests(this.selectedUsername,headers).subscribe(
        (response: String) => {
          console.log(response);
        },
        (error : HttpErrorResponse) => {
          console.log("Error while updating balance with kyc:\n", error.message);
        }
      )
    }
  }
  }
}
