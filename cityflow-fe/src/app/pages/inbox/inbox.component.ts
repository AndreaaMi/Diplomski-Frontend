import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { User } from '../../models/user';
import { AuthService } from '../../service/auth.service';
import { HrAdminService } from '../../service/hr-admin.service';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserMessages } from '../../models/userMessages';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';


import { Observable } from 'rxjs';

@Component({
  selector: 'app-inbox',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, FontAwesomeModule],
  templateUrl: './inbox.component.html',
  styleUrl: './inbox.component.css'
})
export class InboxComponent implements OnInit {
  token = localStorage.getItem('token');
  loggedUser!: User;
  userImage: any;
  user: User = {} as User;
  receivedMessages: any[] = [];
  sentMessages: any[] = [];
  receiverId!: number;
  chatUsers: User[] = [];
  selectedUser!: User;
  messages: UserMessages[] = [];
  newMessageContent: string = '';
  nameFilter: string = '';
  faSearch = faSearch;
  communicationPartners: any[] = [];
  faPaperPlane = faPaperPlane;
  userImages = new Map<number, any>();

  constructor(
    private authService: AuthService,
    private hrAdminService: HrAdminService,
    private sanitizer: DomSanitizer,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.fetchUser();
    this.fetchCommunicationPartners();
  }

  private fetchUserProfilePicture(userId: number): void {
    this.hrAdminService.getUserProfilePicture(userId).subscribe(
      base64Image => {
        this.userImages.set(userId, this.sanitizer.bypassSecurityTrustUrl(`data:image/png;base64,${base64Image}`));
      },
      error => {
        console.error('Error loading image for user:', userId, error);
        this.userImages.set(userId, null);
      }
    );
  }

  fetchCommunicationPartners(): void {
    if (this.loggedUser && this.loggedUser.id) {
      this.hrAdminService.getCommunicationPartners(this.loggedUser.id).subscribe(partners => {
        this.communicationPartners = partners;
        partners.forEach(partner => {
          if (partner.user.profilePicture && !this.userImages.has(partner.user.id)) {
            this.fetchUserProfilePicture(partner.user.id);
          }
        });
      }, error => {
        console.error('Failed to fetch communication partners:', error);
      });
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
          this.fetchCommunicationPartners();
        },
        (error: HttpErrorResponse) => {
          console.log('Error fetching user data:\n', error.message);
        }
      )
    }
  }

  searchUsersByName(): void {
    if (this.nameFilter.trim()) {
      this.hrAdminService.searchUsersByName(this.nameFilter).subscribe(users => {
        this.chatUsers = users;
        // Fetch profile pictures for the searched users
        users.forEach(user => {
          if (user.profilePicture && !this.userImages.has(user.id)) {
            this.fetchUserProfilePicture(user.id);
          }
        });
      }, error => {
        console.error('Search failed:', error);
      });
    } else {
      this.chatUsers = [];
      // Optionally clear previously searched users' images if you want to save memory
    }
  }

  selectUser(user: User): void {
    this.selectedUser = user;
    this.messages = [];
    this.loadMessages();
    this.nameFilter = '';
    this.fetchCommunicationPartners();
    this.cdr.detectChanges();
  }


  loadMessages(): void {
    if (this.loggedUser && this.selectedUser) {
      this.hrAdminService.getMessagesBetweenUsers(this.loggedUser.id, this.selectedUser.id).subscribe(messages => {
        this.messages = messages;
      }, error => {
        console.error('Failed to load messages:', error);
      });
    }
  }


  sendMessage(): void {
    console.log('Send button clicked!');
    console.log('Message content:', this.newMessageContent);
    console.log('Selected user:', this.selectedUser); if (this.newMessageContent && this.selectedUser) {
      this.hrAdminService.sendMessage(this.loggedUser.id, this.selectedUser.id, this.newMessageContent).subscribe(message => {
        this.messages.push(message);
        this.newMessageContent = '';
        this.fetchCommunicationPartners();
        this.loadMessages();
      });
    }
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