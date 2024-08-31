import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import * as L from 'leaflet';
import 'leaflet-routing-machine';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { Location } from '../../models/location';
import { FormsModule } from '@angular/forms';
import { RouteDTO } from '../../dtos/routeDTO';
import { RoutesService } from '../../service/routes.service';
import { Route } from '../../models/route';
import { HttpErrorResponse } from '@angular/common/http';
import { NgToastService } from 'ng-angular-popup';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-route',
  standalone: true,
  imports: [FontAwesomeModule, FormsModule],
  templateUrl: './create-route.component.html',
  styleUrl: './create-route.component.css'
})
export class CreateRouteComponent implements AfterViewInit {
  @ViewChild('mapContainer', { static: true }) mapContainer!: ElementRef;
  faPlus = faPlus;

  private map!: L.Map;
  private routingControl: any; // Promenljiva za čuvanje rutiranja
  private coordinates: L.LatLng[] = []; // Niz za čuvanje koordinata
  private toleranceRadius = 30; // Tolerancija u metrima
  private routeFinished = false; // Promenljiva koja prati da li je ruta završena
  
  routeName: string = "";
  openingTime: string = "";
  closingTime: string = "";
  startingStation!: L.LatLng;
  endingStation!: L.LatLng;
  stations: L.LatLng[] = [];

  constructor(private routeService : RoutesService,
              private toast: NgToastService,
              private router: Router){}

  ngAfterViewInit(): void {
    this.loadMap();
  }

  loadMap() {
    this.map = L.map(this.mapContainer.nativeElement).setView(
      [45.267136, 19.833549],
      16
    );
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(this.map);

    this.routingControl = L.Routing.control({
      waypoints: [],
      routeWhileDragging: true,
    }).addTo(this.map);

    this.map.on('click', this.onMapClick.bind(this));
  }

  onMapClick(event: L.LeafletMouseEvent) {
    if (this.routeFinished) return;

    const clickedPoint = event.latlng;

    if (this.coordinates.length > 0) {
      const lastCoordinate = this.coordinates[this.coordinates.length - 1];
      const distance = lastCoordinate.distanceTo(clickedPoint);

      if (distance <= this.toleranceRadius) {
        alert('Route finished');
        this.routeFinished = true;
        this.markStartingAndEnding();
        return;
      }
    }

    this.coordinates.push(L.latLng(clickedPoint.lat, clickedPoint.lng));
    this.routingControl.setWaypoints(this.coordinates);

    if (this.coordinates.length > 1) {
      this.routingControl.route();
    }
  }

  markStartingAndEnding() {
    const startingPoint = this.coordinates[0];
    this.startingStation = startingPoint;
    console.log(this.startingStation);
  
    const endingPoint = this.coordinates[this.coordinates.length - 1];
    this.endingStation = endingPoint;
    console.log(this.endingStation);
  
    this.stations = this.coordinates.slice(1, -1).map(coordinate => L.latLng(coordinate.lat, coordinate.lng));
    console.log(this.stations);
  
    L.marker(startingPoint, { icon: this.startingIcon }).addTo(this.map).bindPopup('Starting Point');
    L.marker(endingPoint, { icon: this.endingIcon }).addTo(this.map).bindPopup('Ending Point');
  }

  private startingIcon = L.icon({
    iconUrl: 'assets/flag.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  private endingIcon = L.icon({
    iconUrl: 'assets/pin.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  public saveRoute() : void {
    const startingPoint: Location = { latitude: this.startingStation.lat, longitude: this.startingStation.lng };
    const endingPoint: Location = { latitude: this.endingStation.lat, longitude: this.endingStation.lng };

    const stationsArray: Location[] = this.stations.map(station => ({ latitude: station.lat, longitude: station.lng }));
    const routeDTO: RouteDTO = {
      routeName: this.routeName,
      startingPoint: startingPoint,
      endingPoint: endingPoint,
      stations: stationsArray,
      openingTime: this.openingTime,
      closingTime: this.closingTime
    };

    this.routeService.saveRoute(routeDTO).subscribe(
      (response : Route) => {
        console.log(response);
        this.toast.success({detail:"SUCCESS",summary:'Route created successfully!'});
        setTimeout(() => {
          this.router.navigate(['/routes'])
        }, 3000);
      },
      (error : HttpErrorResponse) => {
        console.log("Error while creating route: \n", error.message);
      }
    );
  } 
}
