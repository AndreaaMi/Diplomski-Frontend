import { Component, Input } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faPlus, faPen, faTrash, faRoute } from '@fortawesome/free-solid-svg-icons';
import { RoutesService } from '../../service/routes.service';
import { HttpErrorResponse } from '@angular/common/http';
import { NgToastService } from 'ng-angular-popup'

@Component({
  selector: 'app-route-list-item',
  standalone: true,
  imports: [FontAwesomeModule],
  templateUrl: './route-list-item.component.html',
  styleUrl: './route-list-item.component.css'
})
export class RouteListItemComponent {
  //Inputs
  @Input() routeId: number = 0;
  @Input() routeName: string = '';
  @Input() startTime: string = '';
  @Input() endTime: string = '';
  @Input() isUser: boolean = false;

  //Icons
  faPlus = faPlus
  faPen = faPen;
  faTrash = faTrash;
  faRoute = faRoute;

  constructor(private routeService: RoutesService,
              private toast: NgToastService){}

  public showRoute(routeId : number) : void {
    this.routeService.showRoute(routeId);
  }

  public deleteRoute(routeId: number): void {
    this.routeService.deleteRoute(routeId).subscribe(response => {
      console.log(response);
      this.toast.success({ detail: "SUCCESS", summary: 'Route deleted successfully' });
      setTimeout(() => {
        window.location.reload();
      }, 3000);
    });
  }

}
