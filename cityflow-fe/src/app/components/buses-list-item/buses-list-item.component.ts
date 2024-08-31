import { Component, Input, OnInit } from '@angular/core';
import { RoutesService } from '../../service/routes.service';
import { NgToastService } from 'ng-angular-popup';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faPen, faTrash, faBus } from '@fortawesome/free-solid-svg-icons';
import { deleteBusFromRouteDTO } from '../../dtos/deleteBusFromRouteDTO';

@Component({
  selector: 'app-buses-list-item',
  standalone: true,
  imports: [FontAwesomeModule],
  templateUrl: './buses-list-item.component.html',
  styleUrl: './buses-list-item.component.css'
})
export class BusesListItemComponent implements OnInit{
  //Inputs
  @Input() routeId : number = 0;
  @Input() busId: number = 0;
  @Input() licencePlate: string = '';

  //Icons
  faPen = faPen;
  faTrash = faTrash;
  faBus = faBus;

  constructor(private routeService: RoutesService,
              private toast: NgToastService){}
  
  ngOnInit(): void {}

  async deleteBusFromRoute(routeId: number, busId : number) : Promise<void>{
    const dto : deleteBusFromRouteDTO = {
      routeId : routeId,
      busId : busId
    }
    this.routeService.deleteBusFromRoute(dto).subscribe(
      (response: any) => {
        console.log(response);
        this.toast.success({ detail: "SUCCESS", summary: 'Bus successfully deleted from route!' });
        setTimeout(() => {
          window.location.reload();
        }, 3000);
      }
    );
  }
}
