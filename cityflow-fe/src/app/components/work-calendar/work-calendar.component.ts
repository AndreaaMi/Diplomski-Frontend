import { Component, OnInit } from '@angular/core';
import { CalendarOptions, EventInput } from '@fullcalendar/core';
import { WorkCalendarService } from '../../service/calendar.service';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { FullCalendarModule } from '@fullcalendar/angular';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { isWeekend } from 'date-fns';
import { HrAdminService } from '../../service/hr-admin.service';
import { forkJoin, map } from 'rxjs';
import {faPlus} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';


@Component({
  standalone: true,
  selector: 'app-work-calendar',
  templateUrl: './work-calendar.component.html',
  imports: [FullCalendarModule, CommonModule, FormsModule,FontAwesomeModule],
  styleUrls: ['./work-calendar.component.css']
})
export class WorkCalendarComponent implements OnInit {
  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin, interactionPlugin],
    editable: true,
    selectable: true,
    events: [],
    dayCellDidMount: (arg) => this.customizeDayCell(arg),
  };

  customizeDayCell(arg: any): void {
    const isWeekendDay = isWeekend(arg.date);
    if (isWeekendDay) {
      arg.el.style.backgroundColor = '#f0f0f0'; // Light gray for weekends
      arg.el.style.color = '#1f2630'; // Dark gray text

    } else {
      arg.el.style.backgroundColor = '#ffffff'; // White for regular days
      arg.el.style.color = '#1f2630'; // Darker text for weekdays
    }
  }

  faPlus = faPlus;
  currentMonth: string = '';
  currentYear: number = 0;

  appointmentSelected: boolean = false;
  selectedAppointment: any = null;

  constructor(private workCalendarService: WorkCalendarService,
    private router: Router,
    private modalService: NgbModal,
    private hrAdminService: HrAdminService) { }

    ngOnInit(): void {
      this.workCalendarService.getAllShifts().subscribe((shifts: any[]) => {
        const eventSources = shifts.map((shift: any) => {
          return this.hrAdminService.getUserDetails(shift.userId).pipe(
            map(user => ({
              title: `User: ${user.username}`,
              start: shift.startTime,
              end: shift.endTime,
              location: shift.location,
              extendedProps: {
                role: user.roles
              }
            }) as EventInput)
          );
        });
    
        forkJoin(eventSources).subscribe({
          next: (events: EventInput[]) => {
            this.calendarOptions.events = events;
          },
          error: (error) => {
            console.error('Failed to fetch shifts:', error);
          }
        });
      });
    }
    

  getColorByRole(role: string): string {
    const roleColors: { [key: string]: string } = { // Index signature added
      'Driver': '#1d343b',
      'HR Administrator': '#3d3427',
      'Route Administrator': '#3e452e',
      'Servicer': '#3b272d',
      'Accountant': '#342b40'
    };
    return roleColors[role] || '#ffffff'; // Now TypeScript knows role can be any string
  }

  getTextColorByRole(role: string): string {
    const textColors: { [key: string]: string } = { // Index signature added
      'Driver': '#5b9fb3',
      'HR Administrator': '#e6c79c',
      'Route Administrator': '#cce394',
      'Servicer': '#de99ad',
      'Accountant': '#b799de'
    };
    return textColors[role] || '#000000'; // This line is now type-safe
  }


  addShift(): void {
    this.router.navigate(['/add-shift']);
  }

  public getEventStyles(extendedProps: any): any {
    return {
      backgroundColor: '#5f7783', // Light blue for event background
      color: 'white', // Darker text for the event
      borderRadius: '0.375rem', // Rounded corners
      border: '2px solid #5f7783', // Light border around the event
      boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.1)', // Soft shadow
    };
  }

}
