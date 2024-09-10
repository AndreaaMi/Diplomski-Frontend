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
import { NgToastModule, NgToastService } from 'ng-angular-popup';

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

  public firstname : string = '';
  public lastname : string = '';
  public dateOfBirth : string = '';
  public phoneNumber : string = '';
  public username : string = '';
  public email : string = '';
  public password : string = '';

  public toggleEditPersonal : boolean = false;
  public toggleEditAddress : boolean = false;
  public toggleEditAccount : boolean = false;

  public usernameChanged = false;
  public passwordChanged = false;

  constructor(private authService : AuthService,
              private userService : UserService,
              private hrAdminService : HrAdminService,
              private sanitizer: DomSanitizer,
              private router: Router,
              private toast: NgToastService) {}

  ngOnInit(): void {
    this.fetchUser();
  }
  
  public fetchUser() : void {
    if(this.token != null){
      this.authService.getUserFromToken(this.token).subscribe(
        (response : User) => {
          this.loggedUser = response;
          this.firstname = this.loggedUser.name;
          this.lastname = this.loggedUser.lastname;
          this.dateOfBirth = this.loggedUser.dateOfBirth;
          this.phoneNumber = this.loggedUser.phoneNumber;
          this.username = this.loggedUser.username;
          this.email = this.loggedUser.email;
          this.password = this.loggedUser.password;
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

  public saveChanges(): void {
    const updateDto: EditProfileDTO = {
        username: this.username,
        name: this.firstname,
        lastname: this.lastname,
        email: this.email,
        password: this.password,
        dateOfBirth: this.dateOfBirth,
        phoneNumber: this.phoneNumber
    };

    this.userService.updateProfile(updateDto).subscribe(
        (response: any) => {
          this.toast.error({detail:"ERROR", summary:'Failed to update profile!', duration:3000});
        },
        (error: HttpErrorResponse) => {
          this.fetchUser(); 
          if (this.usernameChanged || this.passwordChanged) {
            localStorage.removeItem('token');
            this.router.navigate(['/signin']);
            setTimeout(() => {
              window.location.reload();
              }, 5);
          } else {
              this.resetEditingFlags();
          }
            this.toast.success({detail:"SUCCESS", summary:'Profile data successfully updated!', duration:3000});

        }
    );
}

private resetEditingFlags(): void {
    this.toggleEditAccount = false;
    this.toggleEditAddress = false;
    this.toggleEditPersonal = false;
}


  public toggleEditing(section : string) {
    if(section === "personal"){
      this.toggleEditPersonal = !this.toggleEditPersonal;
    } 
    if(section === "address"){
      this.toggleEditAddress = !this.toggleEditAddress;
    }
    if(section === "account"){
      this.toggleEditAccount = !this.toggleEditAccount;
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