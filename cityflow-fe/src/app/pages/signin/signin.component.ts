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

@Component({
  selector: 'app-signin',
  standalone: true,
  imports: [FontAwesomeModule, FormsModule],
  templateUrl: './signin.component.html',
  styleUrl: './signin.component.css'
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
