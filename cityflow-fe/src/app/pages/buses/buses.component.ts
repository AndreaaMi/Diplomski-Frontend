import { Component, OnInit } from '@angular/core';
import { BusCardComponent } from '../../components/bus-card/bus-card.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faSearch, faPlus } from '@fortawesome/free-solid-svg-icons';
import { Bus } from '../../models/bus';
import { BusService } from '../../service/bus.service';
import { HttpErrorResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CreateBusFormComponent } from '../../components/create-bus-form/create-bus-form.component';

@Component({
	selector: 'app-buses',
	standalone: true,
	imports: [BusCardComponent, FontAwesomeModule],
	templateUrl: './buses.component.html',
	styleUrl: './buses.component.css'
})
export class BusesComponent implements OnInit{
	faSearch = faSearch;
	faPlus = faPlus;

	buses : Bus[] = [];

	constructor(private busService : BusService,
				private modalService: NgbModal,){}
	
	ngOnInit(): void {
		this.fetchBuses();
	}

	public fetchBuses() : void {
		this.busService.getAll().subscribe({
			next: (data) => {
				this.buses = data.map(bus => ({
					...bus,
					routeNames: bus.routes.map(route => route.name)
				}));
			},
			error: (error) => console.error('Error fetching buses', error)
		});
	}

	openCreateBusForm() {
		const modalRef = this.modalService.open(
		  CreateBusFormComponent,
		  { backdrop: 'static', keyboard: true }
		);
	}
}
