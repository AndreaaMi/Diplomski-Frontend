import { NgClass } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faArrowDown, faArrowUp } from '@fortawesome/free-solid-svg-icons';
import { RoutesService } from '../../service/routes.service';
import { Route } from '../../models/route';
import { HttpErrorResponse } from '@angular/common/http';
import { BusDTO } from '../../dtos/busDTO';
import { BusService } from '../../service/bus.service';
import { Bus } from '../../models/bus';
import { NgToastService } from 'ng-angular-popup';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-create-bus-form',
  standalone: true,
  imports: [FormsModule, NgClass, FontAwesomeModule],
  templateUrl: './create-bus-form.component.html',
  styleUrl: './create-bus-form.component.css'
})
export class CreateBusFormComponent implements OnInit{

  faArrowDown = faArrowDown;
  faArrowUp = faArrowUp;

  licencePlate : string = '';
  routes : Route[] = [];
  selectedRoutes : Route[] = [];

  public isOpen = false;

  constructor(private routeService : RoutesService,
              private modalService : NgbActiveModal,
              private busService : BusService,
              private toast : NgToastService,
              private router: Router){}

  ngOnInit(): void {
    this.fetchRoutes();
  }

  public selectRoute(selectedRoute : Route) : void {
    if (!this.selectedRoutes.some(route => route.id === selectedRoute.id)) {
      this.selectedRoutes.push(selectedRoute);
    }
  }

  public deselectRoute() : void {
    this.selectedRoutes.pop();
  }

  onCheckboxChange(event: Event, selectedRoute: Route): void {
    const checkbox = event.target as HTMLInputElement;
    if (checkbox.checked) {
      this.selectRoute(selectedRoute)
    } else {
      this.deselectRoute();
    }
  }

  public fetchRoutes() : void {
    this.routeService.getAll().subscribe(
      (response : Route[]) => {
        this.routes = response;
        console.log(this.routes);
      },
      (error : HttpErrorResponse) => {
        console.log("Error fetching routes: ", error.message);
      }
    )
  }

  public createBus() : void {
    const busDTO : BusDTO = {
      licencePlate : this.licencePlate,
      routes : this.selectedRoutes
    }

    this.busService.save(busDTO).subscribe(
      (response : Bus) => {
        console.log(response);
        this.toast.success({detail:"SUCCESS",summary:'Bus created successfully!'});
        setTimeout(() => {
          this.modalService.close();
          window.location.reload();
        }, 3000);
      },
      (error : HttpErrorResponse) => {
        console.log("Error while creating new bus: ", error.message);
        this.toast.error({detail:"Error",summary:'Error while creating new bus!'});
      }
    );
  }

  toggleDropdown() {
    this.isOpen = !this.isOpen;
  }

}
