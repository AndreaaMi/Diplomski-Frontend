import { Component, OnInit } from '@angular/core';
import { User } from '../../models/user';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HrAdminService } from '../../service/hr-admin.service';
import { HttpErrorResponse } from '@angular/common/http';
import { UserDTO } from '../../dtos/userDTO';
import { CommonModule } from '@angular/common';
import { NgToastComponent, NgToastService } from 'ng-angular-popup';

@Component({
  selector: 'app-update-employe-form',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './update-employe-form.component.html',
  styleUrl: './update-employe-form.component.css'
})
export class UpdateEmployeFormComponent implements OnInit{
  userid!: number;
  userDTO: UserDTO = {
    username: '',
    name: '',
    lastname: '',
    password: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    roles: '',
    employed: false
  };
  constructor(private route: ActivatedRoute,
              private router: Router,
              private hrService: HrAdminService,
              private toast: NgToastService) { }

              ngOnInit(): void {
                this.route.params.subscribe(params => {
                  this.userid = +params['id'];
                  this.hrService.getUserDetails(this.userid).subscribe(
                    (userDetails: UserDTO) => {
                      this.userDTO = userDetails;
                    },
                    (error: HttpErrorResponse) => {
                      console.error('Error fetching user details:', error);
                    }
                  );
                });
  }

  public updateUser(UpdateEmployeeForm: NgForm): void {
    this.hrService.updateUser(this.userid, UpdateEmployeeForm.value).subscribe(
      (updatedUser: User) => {
        this.toast.success({ detail: "SUCCESS", summary: 'Empoyee updated successfully!' });
        this.router.navigate(['/employees']); 
      },
      error => {
        this.toast.error({ detail: "ERROR", summary: 'Failed to update empoyee: ' + error.message });
      }
    );
  }
}