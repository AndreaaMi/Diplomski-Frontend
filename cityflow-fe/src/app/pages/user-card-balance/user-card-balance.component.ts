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
  selector: 'app-user-card-balance',
  standalone: true,
  imports: [NgClass, FormsModule, FontAwesomeModule],
  templateUrl: './user-card-balance.component.html',
  styleUrl: './user-card-balance.component.css'
})
export class UserCardBalanceComponent implements OnInit{

  token = localStorage.getItem('token');
  
  constructor(private authService : AuthService,
              private userService : UserService) {}

  ngOnInit(): void {}

  public UpdateBalance(BalanceForm : NgForm) : void {
    if(this.token != null){
      const headers = new HttpHeaders({
        'Content-Type' : 'application/json',
        'Authorization' : `Bearer ${this.token}`
      });
      this.userService.updateUserBalance(BalanceForm.value, headers).subscribe(
        (response: string) => {
          console.log(response);
        },
        (error : HttpErrorResponse) => {
          console.log("Error while updating balance:\n", error.message);
        }
      )
    }
  }
}
