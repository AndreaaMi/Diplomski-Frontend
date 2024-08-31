import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HrAdminService } from '../../service/hr-admin.service';
import { User } from '../../models/user';
import { ActivatedRoute, Router } from '@angular/router';
import { UserDTO } from '../../dtos/userDTO';
import { FormsModule } from '@angular/forms';
import { NgToastService } from 'ng-angular-popup';

@Component({
  selector: 'app-delete-employee-form',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './delete-employee-form.component.html',
  styleUrl: './delete-employee-form.component.css'
})
export class DeleteEmployeeFormComponent implements OnInit{
  @ViewChild('reasonInput') reasonInput!: ElementRef;
  selectedEmployee!: User;
  reason: string = '';
  userId!: number;
  username!: string;
  userRole!: string;
  successMessage: string = '';
  errorMessage: string = '';

  constructor(private hrAdminService: HrAdminService, private router: Router, private route: ActivatedRoute, private toast: NgToastService) {}

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
        this.errorMessage = 'Error fetching user details. ' + error.message;
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

  deleteEmployee(): void {
    if (!this.reason.trim()) {
      this.toast.error({ detail: "ERROR", summary: 'Please enter a reason for termination.' });
      this.reasonInput.nativeElement.focus(); 
      return;
    }

    this.hrAdminService.deleteUser(this.userId, this.reason).subscribe(
      () => {
        this.toast.success({ detail: "SUCCESS", summary: 'Employee terminated successfully!' });
        this.router.navigate(['/employees']); 
      },
      error => {
        this.toast.error({ detail: "ERROR", summary: 'Failed to terminate employee: ' + error.message });
      }
    );
  }
}