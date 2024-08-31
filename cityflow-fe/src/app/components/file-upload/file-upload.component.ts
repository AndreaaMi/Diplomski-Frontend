import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { UserService } from '../../service/user.service';
import { AuthService } from '../../service/auth.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faArrowDown } from '@fortawesome/free-solid-svg-icons';
import { faArrowUp } from '@fortawesome/free-solid-svg-icons';
import { NgToastService } from 'ng-angular-popup';

@Component({
  selector: 'app-file-upload',
  standalone: true,
  imports: [FontAwesomeModule,],
  templateUrl: './file-upload.component.html',
  styleUrl: './file-upload.component.css'
})
export class FileUploadComponent implements OnInit{

  selectedFiles: { [key: string]: File } = {};
  token = localStorage.getItem('token');
  isOpen = false;
  faArrowDown = faArrowDown;
  faArrowUp = faArrowUp;
  selectedRequest : string = "";

  constructor(private http: HttpClient,
              private toast : NgToastService,
              private authService : AuthService,
              private userService : UserService) {}
              
  ngOnInit(): void {}
  toggleDropdown() {
    this.isOpen = !this.isOpen;
  }
  public selectStudentRequest() : void{
    this.selectedRequest = "Student";
    this.isOpen = !this.isOpen;
  }
  public selectPensionerRequest() : void{
    this.selectedRequest = "Pensioner";
    this.isOpen = !this.isOpen;
  }
  public selectHealthcareRequest() : void{
    this.selectedRequest = "Healthcare";
    this.isOpen = !this.isOpen;
  }
  public selectVacationRequest() : void{
    this.selectedRequest = "Vacation";
    this.isOpen = !this.isOpen;
  }
  onFileSelected(event: any, fileType: string) {
    this.selectedFiles[fileType] = event.target.files[0];
    console.log(this.selectedFiles['zahtev'])
  }

  public uploadStudentFiles(): void {
    const formData = new FormData();
    formData.append('zahtev', this.selectedFiles['zahtev']);
    formData.append('obrada', this.selectedFiles['obrada']);
    formData.append('fotografija', this.selectedFiles['fotografija']);
    formData.append('indeks', this.selectedFiles['indeks']);

    if(this.token != null){
      const headers = new HttpHeaders({
        'Authorization' : `Bearer ${this.token}`
      });
      this.userService.uploadStudentFiles(formData,headers).subscribe(
        (response : String) => {
          console.log(response);
          this.toast.success({detail:"SUCCESS",summary:'You have successfully submitted a request for issuing a student card.'});
        },
        (error : HttpErrorResponse) => {
          console.log("Error while updating balance with kyc:\n", error.message);
          this.toast.error({detail:"Error",summary:'An error occurred while submitting the request.\nPlease try again.'});
        }
      )
    }
  }
  
  public uploadPensionerFiles(): void {
    const formData = new FormData();
    formData.append('zahtev', this.selectedFiles['zahtev']);
    formData.append('obrada', this.selectedFiles['obrada']);
    formData.append('penzioniCek', this.selectedFiles['penzioniCek']);
    formData.append('licna', this.selectedFiles['licna']);
    formData.append('fotografija', this.selectedFiles['fotografija']);
  
    if(this.token != null){
      const headers = new HttpHeaders({
        'Authorization' : `Bearer ${this.token}`
      });
      this.userService.uploadPensionerFiles(formData,headers).subscribe(
        (response : String) => {
          console.log(response);
          //this.toast.success({detail:"SUCCESS",summary:'You have successfully submitted a request for issuing a pensioner card.'});
        },
        (error : HttpErrorResponse) => {
          console.log("Error while updating balance with kyc:\n", error.message);
          //this.toast.error({detail:"Error",summary:'An error occurred while submitting the request.\nPlease try again.'});
        }
      )
    }
  }
  public uploadVacationFiles(): void {
    const formData = new FormData();
    formData.append('zahtev', this.selectedFiles['zahtev']);

    if(this.token != null){
      const headers = new HttpHeaders({
        'Authorization' : `Bearer ${this.token}`
      });
      this.userService.uploadVacationFiles(formData,headers).subscribe(
        (response : String) => {
          console.log(response);
          //this.toast.success({detail:"SUCCESS",summary:'You have successfully submitted your request for annual leave.'});
        },
        (error : HttpErrorResponse) => {
          console.log("Error while updating balance with kyc:\n", error.message);
          //this.toast.error({detail:"Error",summary:'An error occurred while submitting the request.\nPlease try again.'});
        }
      )
    }
  }
  public uploadHealthcareFiles(): void {
    const formData = new FormData();
    formData.append('zahtev', this.selectedFiles['zahtev']);
    if(this.token != null){
      const headers = new HttpHeaders({
        'Authorization' : `Bearer ${this.token}`
      });
      this.userService.uploadHealthcareFiles(formData,headers).subscribe(
        (response : String) => {
          console.log(response);
          //this.toast.success({detail:"SUCCESS",summary:'You have successfully sent a request for opening/closing sick leave.'});
        },
        (error : HttpErrorResponse) => {
          console.log("Error while updating balance with kyc:\n", error.message);
          //this.toast.error({detail:"Error",summary:'An error occurred while submitting the request.\nPlease try again.'});
        }
      )
    }
  }
}
