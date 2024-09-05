import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faEye, faEyeSlash, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { AuthService } from '../../service/auth.service';
import { LoginDTO } from '../../dtos/loginDTO';
import { HttpErrorResponse } from '@angular/common/http';
import { User } from '../../models/user';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { CommonModule } from '@angular/common';
import { trigger, style, animate, transition } from '@angular/animations';  // Import Angular animations


@Component({
  selector: 'app-signin',
  standalone: true,
  imports: [FontAwesomeModule, FormsModule, CommonModule],
  templateUrl: './signin.component.html',
  styleUrl: './signin.component.css',
  animations: [
    trigger('fadeAnimation', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('500ms ease-in', style({ opacity: 1 })),
      ]),
      transition(':leave', [
        animate('500ms ease-out', style({ opacity: 0 })),
      ]),
    ]),
  ],
})
export class SigninComponent implements OnInit{
  hidePassword: boolean = true;
  faEye = faEye;
  faEyeSlash = faEyeSlash;
  faArrowRight = faArrowRight;

  ngOnInit(): void {}

  constructor(private authService : AuthService, private router: Router, private toast: NgToastService){}

  togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword;
  }
  
  navigateToSignUp() {
    this.router.navigate(['/signup']);
  } 

  public signIn(SignInForm: NgForm) : void{
    this.authService.logIn(SignInForm.value).subscribe(
      (response: LoginDTO) => {
        this.toast.success({ detail: "SUCCESS", summary: 'WELCOME!' });
        setTimeout(() => {
          this.router.navigate(['/home']);
        }, 990);
        setTimeout(() => {
          window.location.reload();
        }, 1000); 
        

      },
      (error: HttpErrorResponse) => {
        this.toast.error({ detail: "ERROR", summary: 'Failed to sign in: ' + error.message });
      }
    )
  }
}
