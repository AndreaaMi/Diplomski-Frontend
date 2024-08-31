import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { HrAdminService } from '../../service/hr-admin.service';
import { UserDTO } from '../../dtos/userDTO';
import { newUserDTO } from '../../dtos/newUserDTO';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';

@Component({
  selector: 'app-new-employee-form',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './new-employee-form.component.html',
  styleUrl: './new-employee-form.component.css'
})
export class NewEmployeeFormComponent implements OnInit{
  roles: string = 'ROLE_ROUTEADMINISTRATOR';

  newUser!: newUserDTO;

  constructor(private hrService : HrAdminService,
              private router: Router,
              private toast: NgToastService
  ){}

  ngOnInit(): void {}

  public registerUser(RegisterForm : NgForm) : void {
    this.hrService.addUser(RegisterForm.value).subscribe(
      (response: UserDTO) => {
        this.toast.success({ detail: "SUCCESS", summary: 'New employee added successfully!' });
        this.router.navigate(['/employees']);  
      },
      error => {
        this.toast.error({ detail: "ERROR", summary: 'Failed to add new employee: ' + error.message });
      }
    );
  }
}
