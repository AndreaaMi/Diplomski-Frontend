import { AfterViewInit, Component, OnInit } from '@angular/core';
import { User } from '../../models/user';
import { AuthService } from '../../service/auth.service';
import { UserService } from '../../service/user.service';
import { HrAdminService } from '../../service/hr-admin.service';
import { DomSanitizer } from '@angular/platform-browser';
import { HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Chart, PieController, ArcElement, Tooltip, Legend, ChartConfiguration, LinearScale, BarController, BarElement, CategoryScale } from 'chart.js';
import { CommonModule } from '@angular/common';
import { map, Observable, tap } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faSearch, faCog, faUsers, faFemale, faMale, faCalendarDay, faBusinessTime, faMoneyBillTrendUp, faEnvelope} from '@fortawesome/free-solid-svg-icons';
import { UserMessages } from '../../models/userMessages';

Chart.register(
  PieController,
  ArcElement,
  Tooltip,
  Legend,
  BarController,
  BarElement,
  CategoryScale,
  LinearScale
);

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, FontAwesomeModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})

export class HomeComponent implements OnInit {
  token = localStorage.getItem('token');
  loggedUser!: User;
  userImage: any;
  user: User = {} as User;
  employmentChart: any;
  hasStatistics: boolean = false;
  employedCount: number = 0;
  terminatedCount: number = 0;
  users$!: Observable<User[]>;
  nameFilter: string = '';
  roleFilter: string = '';
  userImages = new Map<number, any>();
  selectedRoles: Set<string> = new Set();
  faSearch = faSearch;
  faCog = faCog;
  faUsers = faUsers;
  faFemale = faFemale;
  faMale = faMale;
  faCalendarDay = faCalendarDay;
  faBusinessTime = faBusinessTime;
  faMoneyBillTrendUp = faMoneyBillTrendUp;
  faEnvelope = faEnvelope;
  currentDate = new Date();
  unreadMessagesCount: number = 0;


  constructor(
    private authService: AuthService,
    private hrAdminService: HrAdminService,
    private sanitizer: DomSanitizer,
    private router: Router
  ) { }


  ngOnInit(): void {
    this.loadEmploymentStatistics();
    this.createDoughnutChart();
    this.createBarChart();
    this.loadUsersAndImages();
    this.fetchUser();
    setInterval(() => {
      this.currentDate = new Date(); // Update the current date and time every minute
    }, 60000);
  }

  fetchUnreadMessages(): void {
    if (this.loggedUser) {
      console.log('Fetching unread messages for user:', this.loggedUser.id); // Log the user ID
      this.hrAdminService.getUnreadMessages(this.loggedUser.id).subscribe(
        (messages: UserMessages[]) => {
          console.log('Unread messages response:', messages); // Log the response from the API
          this.unreadMessagesCount = messages.length;
          console.log('Unread messages count set to:', this.unreadMessagesCount); // Log the count
        },
        (error: HttpErrorResponse) => {
          console.error('Error fetching unread messages:', error);
        }
      );
    } else {
      console.log('Logged user is not set, skipping unread messages fetch');
    }
  }
  
  
  navigateToChats(): void {
    this.router.navigate(['/inbox']);
  }


  navigateToEmployees(): void {
    this.router.navigate(['/employees']);
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
  

  onNameFilterChange(newName: string): void {
    this.nameFilter = newName;
    this.refreshData();
  }

  onRoleFilterChange(newRole: string): void {
    this.roleFilter = newRole;
    this.refreshData();
  }

  private refreshData(): void {
    this.users$ = this.hrAdminService.searchUsersByName(this.nameFilter).pipe(
      map(users => users.filter(user => user.employed)),
      map(users => [...new Set(users)])  
    );
    this.searchUsersByRole();

  }

  createChart(employedCount: number, terminatedCount: number): void {
    const data = {
      labels: ['Employed', 'Terminated'],
      datasets: [{
        data: [employedCount, terminatedCount],
        backgroundColor: ['rgba(75, 200, 100, 0.7)', 'rgba(235, 40, 45, 0.7)'],
        borderColor: ['rgba(75, 200, 100, 0.9)', 'rgba(255, 40, 45, 0.9)'],
        borderWidth: 1.5
      }]
    };

    const config: ChartConfiguration<'pie', number[], string> = {
      type: 'pie',
      data: data,
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top'
          },
          tooltip: {
            enabled: true
          }
        }
      }
    };

    this.employmentChart = new Chart('employmentChartCanvas', config);
  }

  loadEmploymentStatistics(): void {
    if (this.token) {
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.token}`
      });
      this.hrAdminService.getEmploymentStatistics(headers).subscribe({
        next: (stats) => {
          this.employedCount = stats.employedCount;
          this.terminatedCount = stats.terminatedCount;
          this.createChart(this.employedCount, this.terminatedCount);
        },
        error: (error: HttpErrorResponse) => {
          console.error('Error fetching statistics:', error);
          this.hasStatistics = false;
        }
      });
    } else {
      console.error('Authentication token is missing for statistics');
      this.hasStatistics = false;
    }
  }
  public fetchUser(): void {
    if (this.token != null) {
      this.authService.getUserFromToken(this.token).subscribe(
        (response: User) => {
          this.loggedUser = response;
          if (this.loggedUser.profilePicture) {
            this.hrAdminService.getUserProfilePicture(this.loggedUser.id).subscribe(
              base64Image => {
                this.userImage = this.sanitizer.bypassSecurityTrustUrl(`data:image/png;base64,${base64Image}`);
              },
              error => {
                console.log('No image found:', error);
                this.userImage = null;
              }
            );
          }
          this.fetchUnreadMessages();
        },
        (error: HttpErrorResponse) => {
          console.log('Error fetching user data:\n', error.message);
        }
      )
    }
  }

  createDoughnutChart(): void {
    const data = {
      labels: ['Driver', 'Accountant', 'Servicer', 'HR Administrator', 'Route Administrator'],
      datasets: [{
        data: [3, 1, 1, 2, 2],
        backgroundColor: [
          'rgba(235, 40, 45, 0.7)',
          'rgba(24, 122, 235, 0.7)',
          'rgba(245, 170, 30, 0.7)',
          'rgba(75, 200, 100, 0.7)',
          'rgba(153, 112, 255, 0.7)'
        ],
        borderColor: [
          'rgba(235, 40, 45, 1)',
          'rgba(24, 122, 235, 1)',
          'rgba(245, 170, 30, 1)',
          'rgba(75, 200, 100, 0.9)',
          'rgba(153, 112, 255, 1)'
        ],
        borderWidth: 1.5
      }]
    };

    const config: ChartConfiguration<'doughnut', number[], string> = {
      type: 'doughnut',
      data: data,
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top'
          },
          tooltip: {
            enabled: true
          }
        }
      }
    };

    this.employmentChart = new Chart('rolesChartCanvas', config);
  }

  createBarChart(): void {
    const data = {
      labels: ['1980', '1985', '1990', '1995', '2000', '2005'],
      datasets: [{
        label: 'Number of employees / Year of birth',
        data: [2, 1, 1, 2, 3, 0],
        backgroundColor: 'rgba(53, 162, 235, 0.8)',
        borderColor: 'rgba(53, 162, 235, 1)',
        borderWidth: 1
      }]
    };

    const config: ChartConfiguration<'bar', number[], string> = {
      type: 'bar',
      data: data,
      options: {
        responsive: true,
        scales: {
          x: {
            type: 'category',
            display: true,
            title: {
              display: true,
              text: 'Godina Rođenja'
            }
          },
          y: {
            type: 'linear',
            display: true,
            beginAtZero: true,
            title: {
              display: true,
              text: 'Broj Zaposlenih'
            }
          }
        },
        plugins: {
          legend: {
            position: 'top'
          },
          tooltip: {
            enabled: true
          }
        }
      }
    };
    this.employmentChart = new Chart('employmentAgeChartCanvas', config);
  }

}