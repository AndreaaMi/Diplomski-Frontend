import { Component, OnInit } from '@angular/core';
import { WorkCalendarService } from '../../service/calendar.service';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Shift } from '../../models/shift';
import { HrAdminService } from '../../service/hr-admin.service';
import { map, Observable, tap } from 'rxjs';
import { User } from '../../models/user';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-add-shift-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-shift-form.component.html',
  styleUrl: './add-shift-form.component.css'
})
export class AddShiftFormComponent implements OnInit {
  newShift: Shift =
    {
      id: 0,
      userId: 0,
      busId: 0,
      startTime: '',
      endTime: '',
      location: '',
      extraHours: 0
    }
  formOpen: boolean = true;
  userModalOpen: boolean = false;

  users$!: Observable<User[]>;
  userImages = new Map<number, any>();
  user$!: Observable<Array<{ user: User}>>;
  selectedUser?: User;


  constructor(
    private workCalendarService: WorkCalendarService,
    private hrAdminService: HrAdminService,
    private sanitizer: DomSanitizer,
  ) { }

  ngOnInit(): void {
    this.loadUsersAndImages();

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

  public addShift(newShiftForm: NgForm): void {
    const shiftData = {
      ...newShiftForm.value,
      userId: this.newShift.userId  // Explicitly include userId
    };
  
    console.log('Submitting shift with data:', shiftData);
  
    this.workCalendarService.addShift(shiftData).subscribe({
      next: () => {
        console.log('Shift added successfully');
        this.clearForm(newShiftForm);
        this.toggleForm();
      },
      error: (error) => {
        console.error('Failed to add shift:', error);
      }
    });
  }
  
  toggleForm(): void {
    this.formOpen = !this.formOpen;
  }

  clearForm(newShiftForm: NgForm) {
    newShiftForm.resetForm();
  }

  clearIdAndFocus(newShiftForm: NgForm) {
    newShiftForm.resetForm({ userId: null });
  }

  toggleUserModal(): void {
    this.userModalOpen = !this.userModalOpen;
  }

  selectUser(user: User): void {
    this.selectedUser = user;
    this.newShift.userId = user.id;  // Ensure this line correctly assigns the user ID
    console.log('Selected user ID:', this.newShift.userId);  // Add this to check the value
    this.toggleUserModal();
  }
  
}
