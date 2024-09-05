import { Component, OnInit } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { AuthService } from '../../service/auth.service';
import { User } from '../../models/user';
import { HttpErrorResponse } from '@angular/common/http';
import { RegisterDTO } from '../../dtos/registerDTO';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { trigger, style, animate, transition } from '@angular/animations';  // Import Angular animations


@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [FontAwesomeModule, FormsModule, CommonModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css',
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

export class SignupComponent implements OnInit {
  //Icons
  faArrowLeft = faArrowLeft;
  faArrowRight = faArrowRight;

  newUser!: RegisterDTO;

  constructor(private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
  }
  public navigateToSignIn(): void {
    this.router.navigate(['/signin']);
}

  public registerUser(RegisterForm: NgForm): void {
    console.log(this.newUser);
    this.authService.register(RegisterForm.value).subscribe(
      (response: RegisterDTO) => {
        console.log('User registered successfully:', response);
      },
      (error) => {
        console.error('Error registering user:', error);
      }
    );
  }
}
