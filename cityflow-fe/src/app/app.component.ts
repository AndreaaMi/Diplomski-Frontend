import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidePannelComponent } from './components/side-panel/side-panel.component';
import { NgToastModule } from 'ng-angular-popup';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FullCalendarModule } from '@fullcalendar/angular';
import { initFlowbite } from 'flowbite';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SidePannelComponent, NgToastModule, FullCalendarModule, NgbModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{
  title = 'cityflow-fe';
  ngOnInit(): void {
    initFlowbite();
  }
}
