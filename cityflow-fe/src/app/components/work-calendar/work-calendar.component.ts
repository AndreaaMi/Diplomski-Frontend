import { Component, OnInit } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/core';
import { WorkCalendarService } from '../../service/calendar.service';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { FullCalendarModule } from '@fullcalendar/angular';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddShiftFormComponent } from '../add-shift-form/add-shift-form.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { isWeekend } from 'date-fns';


@Component({
  standalone: true,
  selector: 'app-work-calendar',
  templateUrl: './work-calendar.component.html',
  imports: [FullCalendarModule, CommonModule, FormsModule],
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
      arg.el.classList.add('bg-white-500', 'text-white');
      arg.el.style.backgroundColor = '#37404f'; // Fallback if Tailwind doesn't apply
      arg.el.style.color = '#ffffff';
    } else {
      arg.el.classList.add('bg-white/20', 'text-white');
      arg.el.style.backgroundColor = ''; // Fallback if Tailwind doesn't apply
      arg.el.style.color = 'white';
    }
  }

  

  currentMonth: string = '';
  currentYear: number = 0;

  appointmentSelected: boolean = false;  // To track if any appointment is selected
  selectedAppointment: any = null;

  constructor(private workCalendarService: WorkCalendarService, 
              private router: Router,
              private modalService: NgbModal ) { }

  ngOnInit(): void {
    const today = new Date();
    this.currentMonth = today.toLocaleString('default', { month: 'long' });
    this.currentYear = today.getFullYear();

    this.workCalendarService.getAllShifts().subscribe((shifts: any) => {
      this.calendarOptions.events = shifts.map((shift: any) => ({
        title: `User: ${shift.userId} - Route: ${shift.routeId || 'N/A'}`,
        start: shift.startTime,
        end: shift.endTime,
        location: `${shift.location}`
      }));
    }, (error) => {
      console.error('Failed to fetch shifts:', error);
    });
  }

  
  addShift(): void {
    this.router.navigate(['/add-shift']);
  }

  public getEventStyles(extendedProps: any): any {
    return {
      'background-image': 'linear-gradient(to right, #ffffff, #f7fafc)',
      'border': '1px solid #404752',
      'border-radius': '0.375rem',
      'color': '#1f2937' 
    };
  }
  
}
