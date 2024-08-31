import { CommonModule, NgClass } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AuthService } from '../../service/auth.service';
import { User } from '../../models/user';
import { HttpErrorResponse, HttpHeaderResponse, HttpHeaders } from '@angular/common/http';
import { UserService } from '../../service/user.service';
import { EditProfileDTO } from '../../dtos/editProfileDTO';
import { HrAdminService } from '../../service/hr-admin.service';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [NgClass, FormsModule, FontAwesomeModule, CommonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit{
  
  token = localStorage.getItem('token');
  loggedUser! : User;
  userImage: any;
  user: User = {} as User;

  
  constructor(private authService : AuthService,
              private userService : UserService,
              private hrAdminService : HrAdminService,
              private sanitizer: DomSanitizer,
              private router: Router) {}

  ngOnInit(): void {
    this.fetchUser();
  }

  public editProfile(RegisterForm : NgForm) : void {
    if(this.token != null){
      const headers = new HttpHeaders({
        'Content-Type' : 'application/json',
        'Authorization' : `Bearer ${this.token}`
      });
      this.userService.updateProfile(RegisterForm.value, headers).subscribe(
        (response: string) => {
          this.router.navigate(['/profile']);
        },
        (error : HttpErrorResponse) => {
          console.log("Error while updating profile:\n", error.message);
        }
      )
    }
  }

  public fetchUser() : void {
    if(this.token != null){
      this.authService.getUserFromToken(this.token).subscribe(
        (response : User) => {
          this.loggedUser = response;
          if (this.loggedUser.profilePicture) {
            this.hrAdminService.getUserProfilePicture(this.loggedUser.id).subscribe(
              base64Image => {
                this.userImage = this.sanitizer.bypassSecurityTrustUrl(`data:image/png;base64,${base64Image}`);
              },
              error => {
                console.log('No image found:', error);
                this.userImage = null; 
              }
            );
          }
        },
        (error: HttpErrorResponse) => {
          console.log('Error fetching user data:\n', error.message);
        }
      )
    }
  }
  public uploadImage(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.hrAdminService.uploadProfilePicture(this.loggedUser.id, file).subscribe(
        () => {
          this.fetchUser();
        },
        error => console.error('Error uploading image:', error)
      );
    }
  }
}
