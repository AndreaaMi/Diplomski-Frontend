import { Component, OnInit } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faSignOut, faCircle } from '@fortawesome/free-solid-svg-icons';
import { AuthService } from '../../service/auth.service';
import { User } from '../../models/user';
import { HttpErrorResponse } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';
import { HrAdminService } from '../../service/hr-admin.service';
import { CommonModule } from '@angular/common';
import { NgToastService } from 'ng-angular-popup';
import { Router } from '@angular/router';

@Component({
  selector: 'app-side-panel-profile',
  standalone: true,
  imports: [FontAwesomeModule, CommonModule],
  templateUrl: './side-panel-profile.component.html',
  styleUrl: './side-panel-profile.component.css'
})


export class SidePanelProfileComponent implements OnInit{
  faSignOut = faSignOut;
  faCircle = faCircle;

  token = localStorage.getItem('token');
  userImage: any;
  loggedUser: User = {
    id: 0,
    username: '',
    name: '',
    lastname: '',
    password: '',
    roles: '',
    dateOfBirth: '',
    email: '',
    employed: true,
    phoneNumber: '',
    profilePicture: ''
  };
  
  constructor(private authService : AuthService, private hrAdminService: HrAdminService, private sanitizer: DomSanitizer, private toast: NgToastService, private router: Router){}

  ngOnInit(): void {
    this.fetchUser();
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
          this.toast.success({ detail: "SUCCESS", summary: 'Profile picture uploaded successfully!' });
          setTimeout(() => {
            window.location.reload();
          }, 1000); 
        },
        error => {
          this.toast.error({ detail: "ERROR", summary: 'Failed to upload profile picture: ' + error.message });
        }
      );
    }
  }

  public signOut() : void {
    localStorage.removeItem('token');
    this.router.navigate(['/signin']);
    setTimeout(() => {
			window.location.reload();
		  }, 5);
  }


getRoleDisplayName(role: string): string {
  const roleMap: {[key: string]: string} = {
    'ROLE_ROUTEADMINISTRATOR': 'Route Administrator',
    'ROLE_HRAdministrator': 'HR Administrator',
    'ROLE_DRIVER': 'Driver',
    'ROLE_SERVICER': 'Servicer',
    'ROLE_Accountant': 'Accountant'
  };
  return roleMap[role] || role;
}

}
