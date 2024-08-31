import { Component, Input, OnInit } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faBus, faTrash, faPen } from '@fortawesome/free-solid-svg-icons';
import { BusService } from '../../service/bus.service';
import { NgToastService } from 'ng-angular-popup';

@Component({
	selector: 'app-bus-card',
	standalone: true,
	imports: [FontAwesomeModule],
	templateUrl: './bus-card.component.html',
	styleUrl: './bus-card.component.css'
})
export class BusCardComponent implements OnInit{
	//Icons
	faBus = faBus;
	faTrash = faTrash;
	faPen = faPen;

	@Input() busId: number = 0;
	@Input() licencePlate: string = '';
  	@Input() routes: string[] = [];

	constructor(private busService : BusService,
				private toast : NgToastService){}

	ngOnInit(): void {}

	public deleteBus(busId: number): void {
		this.busService.deleteBus(busId).subscribe(response => {
		  this.toast.success({ detail: "SUCCESS", summary: 'Route deleted successfully' });
		  setTimeout(() => {
			window.location.reload();
		  }, 3000);
		});
	}
}
