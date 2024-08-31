import { Component, Input, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { SalaryDTO } from '../../dtos/salaryDTO';
import { HrAdminService } from '../../service/hr-admin.service';
import { CommonModule } from '@angular/common';
import { UserDTO } from '../../dtos/userDTO';
import { ActivatedRoute, Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';


@Component({
  selector: 'app-assign-salary-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './assign-salary-form.component.html',
  styleUrls: []
})
export class AssignSalaryFormComponent implements OnInit {
  userId!: number;
  username!: string;
  userRole!: string;
  assignSalary: any = {
    id: 0,
    baseSalary: 0,
    overtimeHours: 0,
    holidayWorkHours: 0,
    nightShiftHours: 0,
    sickLeaveHours: 0,
    overtimePayRate: 0,
    holidayPayRate: 0,
    nightShiftPayRate: 0,
    sickLeaveType: 'None',
    totalSalary: 0
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private hrAdminService: HrAdminService,
    private toast: NgToastService  
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.userId = +params['id'];
      this.fetchUserDetails(this.userId);
    });
  }

  fetchUserDetails(userId: number): void {
    this.hrAdminService.getUserDetails(userId).subscribe(
      (user: UserDTO) => {
        this.username = user.username;
        this.userRole = this.getRoleDisplayName(user.roles);
      },
      error => {
        console.error('Error fetching user details:', error);
        this.toast.error({ detail: "ERROR", summary: 'Error fetching user details: ' + error.message });
      }
    );
  }

  getRoleDisplayName(role: string): string {
    const roleMap: {[key: string]: string} = {
      'ROLE_ROUTEADMINISTRATOR': 'Route Administrator',
      'ROLE_HRAdministrator': 'HR Administrator',
      'ROLE_DRIVER': 'Driver',
      'ROLE_SERVICER': 'Servicer',
      'ROLE_ACCOUNTANT': 'Accountant'
    };
    return roleMap[role] || role;
  }
  
  public onUpdateEmployee(assignSalaryForm: NgForm): void {
    this.hrAdminService.assignSalary(this.userId, assignSalaryForm.value).subscribe(
      (response: SalaryDTO) => {
        this.toast.success({ detail: "SUCCESS", summary: 'Salary assigned successfully!' });
        this.router.navigate(['/employees']); 
      },
      error => {
        this.toast.error({ detail: "ERROR", summary: 'Failed to assign salary: ' + error.message });
      }
    );
  }
}