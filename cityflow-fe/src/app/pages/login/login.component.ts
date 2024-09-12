import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faArrowLeft, faEye, faEyeSlash, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { AuthService } from '../../service/auth.service';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { HttpErrorResponse } from '@angular/common/http';
import { LoginDTO } from '../../dtos/loginDTO';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FontAwesomeModule, FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit{
  faArrowLeft = faArrowLeft;
  faArrowRight = faArrowRight;

  hidePassword: boolean = true;
  faEye = faEye;
  faEyeSlash = faEyeSlash;
  
  constructor(private authService: AuthService,
    private router: Router, private toast: NgToastService
  ) { }

  ngOnInit(): void {
  }

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
