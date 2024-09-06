import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { WorkCalendarService } from '../../service/calendar.service';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Shift } from '../../models/shift';
import { HrAdminService } from '../../service/hr-admin.service';
import { map, Observable, tap } from 'rxjs';
import { User } from '../../models/user';
import { DomSanitizer } from '@angular/platform-browser';
import { Bus } from '../../models/bus';
import { BusService } from '../../service/bus.service';
import L from 'leaflet';
import { Location } from '../../models/location';
import { NgbCalendar, NgbDatepickerModule, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { JsonPipe } from '@angular/common';
import { Router } from '@angular/router';
import {faExclamationTriangle, faX} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgToastService } from 'ng-angular-popup';



@Component({
  selector: 'app-add-shift-form',
  standalone: true,
  imports: [CommonModule, FormsModule,JsonPipe,NgbDatepickerModule, FontAwesomeModule],
  templateUrl: './add-shift-form.component.html',
  styleUrl: './add-shift-form.component.css'
})

export class AddShiftFormComponent implements OnInit {
  @ViewChild('mapContainer', { static: false }) mapContainer?: ElementRef;
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
  busModalOpen: boolean = false;
  locationModalOpen: boolean = false;
  map!: L.Map;
  selectedMarker?: L.Marker;
  today = inject(NgbCalendar).getToday();
  datepickerOpen: boolean = false; 
  faExclamationTriangle = faExclamationTriangle;
  faX = faX;

	model!: NgbDateStruct;
	date!: { year: number; month: number };

  users$!: Observable<User[]>;
  buses$!: Observable<Bus[]>;
  locations$!: Observable<Location[]>;


  userImages = new Map<number, any>();
  user$!: Observable<Array<{ user: User }>>;
  selectedUser?: User;
  selectedBus?: Bus;
  selectedLocation?: string;


  constructor(
    private workCalendarService: WorkCalendarService,
    private hrAdminService: HrAdminService,
    private sanitizer: DomSanitizer,
    private busService: BusService,
    private router: Router,
    private toast: NgToastService
  ) { }

  ngOnInit(): void {
    this.loadUsersAndImages();
    this.loadBuses();
    this.loadLocations();
  }
  loadLocations(): void {
    this.locations$ = this.hrAdminService.getAllLocations();
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

  loadBuses(): void {
    this.buses$ = this.busService.getAll();
  }

  public addShift(newShiftForm: NgForm): void {
    const shiftData = {
      ...newShiftForm.value,
      userId: this.newShift.userId,
      busId: this.newShift.busId,
      location: this.newShift.location
    };


    this.workCalendarService.addShift(shiftData).subscribe({
      next: () => {
        this.toast.success({ detail: "SUCCESS", summary: 'Shift added successfully!' });
        this.router.navigate(['/work-calendar']); 
      },
      error: (error) => {
        this.toast.error({ detail: "ERROR", summary: 'Failed to add sgift: ' + error.message });
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

  toggleLocationModal(): void {
    this.locationModalOpen = !this.locationModalOpen;
    if (this.locationModalOpen) {
      setTimeout(() => {
        if (!this.map && this.mapContainer) {
          this.loadMap();
        }
      }, 0);
    }
  }
  confirmLocation(): void {
    if (this.selectedMarker) {
      this.toggleLocationModal();
    }
  }

  selectUser(user: User): void {
    this.selectedUser = user;
    this.newShift.userId = user.id;
    console.log('Selected user ID:', this.newShift.userId);
    this.toggleUserModal();
  }
  toggleBusModal(): void {
    this.busModalOpen = !this.busModalOpen;
  }

  selectBus(bus: Bus): void {
    this.selectedBus = bus;
    this.newShift.busId = bus.id;
    this.toggleBusModal();
  }
  selectLocation(location: Location): void {
    this.selectedLocation = location.address;
    this.newShift.location = this.selectedLocation;
  }
  get allFieldsFilled(): boolean {
    return !!this.selectedUser && !!this.selectedBus && !!this.selectedLocation && !!this.newShift.startTime;
  }
  


  loadMap(): void {
    if (this.mapContainer) {
      this.map = L.map(this.mapContainer.nativeElement).setView([45.267136, 19.833549], 12);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(this.map);

      this.locations$.subscribe(locations => {
        locations.forEach(location => {
          const marker = L.marker([location.latitude, location.longitude]).addTo(this.map).bindPopup(location.address);

          marker.on('click', () => {
            if (this.selectedMarker) {
              this.selectedMarker.setIcon(L.icon({ iconUrl: 'assets/pin.png' }));
            }
            this.selectedMarker = marker;
            marker.setIcon(L.icon({ iconUrl: 'assets/pin.png' }));
            this.selectLocation(location);
          });
        });
      });
    }
  }
}