import { Component, OnInit } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
//import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { AuthService } from '../../service/auth.service';
import { User } from '../../models/user';
import { HttpErrorResponse } from '@angular/common/http';
import { RegisterDTO } from '../../dtos/registerDTO';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [FontAwesomeModule,FormsModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent implements OnInit{
  //Icons
  //faArrowRight = faArrowRight;

  newUser!: RegisterDTO;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
  }

  public registerUser(RegisterForm : NgForm) : void {
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
