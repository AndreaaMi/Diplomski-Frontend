import { NgClass } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AuthService } from '../../service/auth.service';
import { User } from '../../models/user';
import { HttpErrorResponse, HttpHeaderResponse, HttpHeaders } from '@angular/common/http';
import { UserService } from '../../service/user.service';
import { EditProfileDTO } from '../../dtos/editProfileDTO';

@Component({
  selector: 'app-user-balance',
  standalone: true,
  imports: [NgClass, FormsModule, FontAwesomeModule],
  templateUrl: './user-balance.component.html',
  styleUrl: './user-balance.component.css'
})
export class UserBalanceComponent implements OnInit {

  token = localStorage.getItem('token');
  
  constructor(private authService : AuthService,
              private userService : UserService) {}

  ngOnInit(): void {}

  public UpdateCardBalance(KYCBalanceForm : NgForm) : void {
    if(this.token != null){
      const headers = new HttpHeaders({
        'Content-Type' : 'application/json',
        'Authorization' : `Bearer ${this.token}`
      });
      this.userService.updateUserCardBalance(KYCBalanceForm.value, headers).subscribe(
        (response: string) => {
          console.log(response);
        },
        (error : HttpErrorResponse) => {
          console.log("Error while updating balance with kyc:\n", error.message);
        }
      )
    }
  }

}
