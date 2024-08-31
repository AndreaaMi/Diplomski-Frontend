import { Component, OnInit } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faSearch, faArrowDown, faPlus } from '@fortawesome/free-solid-svg-icons';
import { RouteListItemComponent } from '../../components/route-list-item/route-list-item.component';
import { RoutesService } from '../../service/routes.service';
import { Route } from '../../models/route';
import { HttpErrorResponse } from '@angular/common/http';
import { NgClass } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-routes',
  standalone: true,
  imports: [FontAwesomeModule, RouteListItemComponent, NgClass],
  templateUrl: './routes.component.html',
  styleUrl: './routes.component.css'
})
export class RoutesComponent implements OnInit{
  //Icons
  faSearch = faSearch;
  faArrowDown = faArrowDown;
  faPlus = faPlus;

  routes : Route[] = [];

  constructor(private routeService : RoutesService,
              private router: Router) {}

  ngOnInit(): void {
    this.fetchRoutes();
  }

  public fetchRoutes() : void {
    this.routeService.getAll().subscribe(
      (response: Route[]) => {
        this.routes = response;
        console.log("ROUTES: \n", this.routes);
      },
      (error: HttpErrorResponse) => {
        console.log("Error while fetching routes:\n", error.message);
      }
    )
  }

  public navigateToNewRoute() : void {
    this.router.navigate(['/newRoute']);
  }

}
