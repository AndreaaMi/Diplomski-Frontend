import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faSearch, faPlus } from '@fortawesome/free-solid-svg-icons';
import { RoutesService } from '../../service/routes.service';
import { Route } from '../../models/route';
import { HttpErrorResponse } from '@angular/common/http';
import { RouteListItemComponent } from '../../components/route-list-item/route-list-item.component';

@Component({
  selector: 'app-all-routes',
  standalone: true,
  imports: [FontAwesomeModule, RouteListItemComponent],
  templateUrl: './all-routes.component.html',
  styleUrl: './all-routes.component.css'
})
export class AllRoutesComponent implements OnInit{

  faSearch = faSearch;
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

  public trackBus() : void {
    this.router.navigate(['/busLiveTracking']);
  }

}
