import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faSearch, faArrowDown, faPlus, faEllipsis, faPen, faFilter } from '@fortawesome/free-solid-svg-icons';
import { User } from '../../models/user';
import { UserService } from '../../service/user.service';
import { combineLatest, map, Observable, tap } from 'rxjs';
import { HrAdminService } from '../../service/hr-admin.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SalaryDTO } from '../../dtos/salaryDTO';
import { DomSanitizer } from '@angular/platform-browser';
import { FlowbiteService } from '../../service/flowbite.service';


@Component({
  selector: 'app-employees',
  standalone: true,
  imports: [FontAwesomeModule, CommonModule, FormsModule],
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.css'],
})
export class EmployeesComponent implements OnInit {
  
  users$!: Observable<User[]>;
  dropdownOpen: boolean[] = [];
  user$!: Observable<Array<{ user: User; salary: SalaryDTO }>>;
  reason: string = '';
  selectedEmployee: User | null = null;
  nameFilter: string = '';
  roleFilter: string = '';

  faSearch = faSearch;
  faFilter = faFilter;
  faPlus = faPlus;
  faEllipsis = faEllipsis;
  faPen = faPen;

  userImages = new Map<number, any>();
  selectedImage: any;
  isModalOpen = false;
  roleDropdownOpen = false;

  selectedRoles: Set<string> = new Set();
  roles: string[] = ['Route Administrator', 'HR Administrator', 'Driver', 'Servicer', 'Accountant'];

  @ViewChild('modal') modalElement!: ElementRef;

  constructor(
    private router: Router, 
    private userService: UserService,
    private hrAdminService: HrAdminService,
    private sanitizer: DomSanitizer, 
    private modalService: NgbModal,
    private flowbiteService: FlowbiteService
  ) {}

  ngOnInit(): void {
    this.flowbiteService.loadFlowbite(flowbite => {
    this.users$ = combineLatest([
      this.hrAdminService.searchUsersByName(this.nameFilter),
    ]).pipe(
      map(([nameResults]) => {
        return [...new Set([...nameResults])];
      })
    );
    this.loadUsersAndImages();
    this.users$.subscribe(users => {
      this.dropdownOpen = new Array(users.length).fill(false); 
    });
    console.log('Flowbite loaded', flowbite);
    });

  }

  toggleRoleDropdown(): void {
    this.roleDropdownOpen = !this.roleDropdownOpen;
  }

  onRoleChange(event: any): void {
    const role = event.target.value;
    if (event.target.checked) {
      this.selectedRoles.add(role);
    } else {
      this.selectedRoles.delete(role);
    }
    this.searchUsersByRole();
  }

  toggleDropdown(index: number): void {
    this.dropdownOpen = this.dropdownOpen.map((open, i) => i === index ? !open : false);
  }

  loadUsersAndImages(): void {
    this.users$ = this.hrAdminService.searchUsersByName('').pipe(
      map(users => users.filter(user => user.employed)), 
      tap(users => {
        users.forEach(user => {
          if (user.profilePicture) {
            this.hrAdminService.getUserProfilePicture(user.id).subscribe(
              base64Image => {
                this.userImages.set(user.id, this.sanitizer.bypassSecurityTrustUrl(`data:image/png;base64,${base64Image}`));
              },
              error => console.error('Error loading image for user:', user.id, error)
            );
          }
        });
      })
    );
  }
  


  onNameFilterChange(newFilter: string): void {
    this.nameFilter = newFilter;
    this.refreshData();
  }
  searchUsersByName(): void {
    this.users$ = this.hrAdminService.searchUsersByName(this.nameFilter).pipe(
      map(users => users.filter(user => user.employed))
    );
  }
  
  searchUsersByRole(): void {
    if (this.selectedRoles.size === 0) {
      this.users$ = this.hrAdminService.searchUsersByName(this.nameFilter).pipe(
        map(users => users.filter(user => user.employed))
      );
    } else {
      const rolesQuery = [...this.selectedRoles].join(',');
  
      this.users$ = this.hrAdminService.searchUsersByRole(rolesQuery).pipe(
        map(users => users.filter(user => user.employed))
      );
    }
  }
  

  onRoleFilterChange(newFilter: string): void {
    this.roleFilter = newFilter;
    this.refreshData();
  }

  private refreshData(): void {
    this.users$ = this.hrAdminService.searchUsersByName(this.nameFilter).pipe(
      map(users => users.filter(user => user.employed)),
      map(users => [...new Set(users)])  
    );
    this.searchUsersByRole();

  }

  editEmployee(userId: number): void {
    this.router.navigate(['/update-employee', userId]);
  }

  openAssignSalaryForm(userId: number) {
    this.router.navigate(['/assign-salary', userId]);
  }

  navigateToAddNewEmployee(): void {
    this.router.navigate(['/newEmployee']);
  }

  openImageModal(imageUrl: any): void {
    this.selectedImage = imageUrl;
    this.isModalOpen = true;
    setTimeout(() => {
      this.modalElement.nativeElement.classList.add('open');
    }, 10); 
  }
  
  closeModal(): void {
    this.modalElement.nativeElement.classList.remove('open');
    setTimeout(() => {
      this.isModalOpen = false;
    }, 250);
  }
  navigateToDeleteEmployee(userId: number): void {
    this.router.navigate(['/deleteEmployee', userId]);
  }
  getRoleDisplayName(role: string): string {
    const roleMap: { [key: string]: string } = {
      'ROLE_ROUTEADMINISTRATOR': 'Route Administrator',
      'ROLE_HRAdministrator': 'HR Administrator',
      'ROLE_DRIVER': 'Driver',
      'ROLE_SERVICER': 'Servicer',
      'ROLE_ACCOUNTANT': 'Accountant'
    };
    return roleMap[role] || role;
  }
  

}