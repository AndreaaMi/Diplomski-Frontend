import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Route } from '../../models/route';
import { RoutesService } from '../../service/routes.service';
import { ActivatedRoute } from '@angular/router';
import { HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faRoute, faPen, faTrash, faFilePdf } from '@fortawesome/free-solid-svg-icons';
import * as L from 'leaflet';
import { Routing } from 'leaflet';
import { Bus } from '../../models/bus';
import { BusesListItemComponent } from '../../components/buses-list-item/buses-list-item.component';
import { User } from '../../models/user';
import { AuthService } from '../../service/auth.service';

import { LiveLocation } from '../../models/liveLocation';
import { RabbitmqLiveLocationService } from '../../service/rabbitmq-live-location.service';

import {jsPDF} from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-route-details',
  standalone: true,
  imports: [FontAwesomeModule, BusesListItemComponent],
  templateUrl: './route-details.component.html',
  styleUrl: './route-details.component.css'
})
export class RouteDetailsComponent implements OnInit, AfterViewInit{
  @ViewChild('pdfContent', { static: true }) pdfContent!: ElementRef;
  @ViewChild('mapContainer', { static: true }) mapContainer!: ElementRef;

  //Icons
  faPen = faPen;
  faTrash = faTrash;
  faRoute = faRoute;
  faFilePdf = faFilePdf;

  routeId : number = 0;
  route!: Route;
  startingPoint!: L.LatLng;
  endingPoint!: L.LatLng;
  stations: L.LatLng[] = []; 
  routeBuses : Bus[] = [];

  token : string | null = localStorage.getItem('token');
  loggedUser! : User;
  loggedUserRole : string  = '';

  map: L.Map | null = null;
  busMarker: L.Marker | null = null;
  routeCoordinates : any;

  numberOfPassengers : number = 0;
  numberOfBoughtTickets : number = 0;
  numberOfPassengersWithCard : number = 0;
  ticketPrice : number = 100;
  numberOfBusesOnRoute : number = 0;
  averageNumberOfPassengersPerBus : number = 0;

  constructor(private routeService: RoutesService,
              private routes: ActivatedRoute,
              private authService: AuthService,
              private rabbitmqLiveLocationService: RabbitmqLiveLocationService){}

  ngOnInit(): void {
    this.fetchUser();
    const idFromRoute = this.routes.snapshot.paramMap.get('id');
    if(idFromRoute != null){
      this.routeId =+ idFromRoute;
      this.fetchRoute();
    }

    this.simulate();
  }

  public fetchUser() : void {
    if(this.token != null){
      this.authService.getUserFromToken(this.token).subscribe(
        (response : User) => {
          this.loggedUser = response;
          this.loggedUserRole = this.loggedUser.roles;
          console.log(this.loggedUserRole);
        },
        (error: HttpErrorResponse) => {
          console.log('Error fetching user data:\n', error.message);
        }
      )
    }
  }

  public fetchRoute() : void{
    this.routeService.getRoute(this.routeId).subscribe(
      (response : Route) => {
        this.route = response;
        this.routeBuses = this.route.buses;
        this.fetchStations();

        console.log("ROUTE: \n", this.route);
      },
      (error : HttpErrorResponse) => {
        console.log("Error while fetching route: \n", error.message);
      }
    )
  }

  fetchStations() : void {
    const startingPoint: any = this.route.startingPoint;
    this.startingPoint = L.latLng(startingPoint.latitude, startingPoint.longitude);

    const endingPoint: any = this.route.endPoint;
    this.endingPoint = L.latLng(endingPoint.latitude, endingPoint.longitude);

    const stations: any[] = this.route.stations;
    this.stations = stations.map(station => L.latLng(station.latitude, station.longitude));

    console.log('Starting station: \n', this.startingPoint);
    console.log('Ending station: \n', this.endingPoint);
    console.log('Stations: \n', this.stations);
  }

  ngAfterViewInit(): void {
    this.loadMap();
    // if(this.loggedUserRole !== "ROLE_ROUTEADMINISTRATOR"){
    //   this.establishWebSocketConnection();
    //   this.simulate();
    // }
  }

  loadMap() {
    if (!this.mapContainer) return;

    this.map = L.map(this.mapContainer.nativeElement).setView(
      [this.startingPoint.lat, this.startingPoint.lng],
      12
    );
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(this.map);
  
    L.marker([this.startingPoint.lat, this.startingPoint.lng], { icon: this.startingIcon }).addTo(this.map);
  
    this.stations.forEach(station => {
      if (this.map) {
        L.marker([station.lat, station.lng], { icon: this.busIcon }).addTo(this.map);
      }
    });
  
    if (this.map) {
      L.marker([this.endingPoint.lat, this.endingPoint.lng], { icon: this.endingIcon }).addTo(this.map);
    }
  
    const waypoints = [
      L.latLng(this.startingPoint.lat, this.startingPoint.lng),
      ...this.stations.map(station => L.latLng(station.lat, station.lng)),
      L.latLng(this.endingPoint.lat, this.endingPoint.lng)
    ];

    const plan = new L.Routing.Plan(waypoints, {
      createMarker: function() { return false; }
    });

    const routingControl = L.Routing.control({
      plan: plan,
      routeWhileDragging: false
    }).addTo(this.map);

    routingControl.on('routesfound', (e) => {
        const routes = e.routes;
        this.routeCoordinates = [];
        routes[0].coordinates.forEach((coord: { lat: any; lng: any; }) => {
            this.routeCoordinates.push([coord.lat, coord.lng]);
        });
        console.log('Total route coordinates extracted:', this.routeCoordinates.length);
    });
  }



  private updateMarkerPosition(latitude: number, longitude: number): void {
    if (this.map) {
      if (this.busMarker) {
        this.busMarker.remove();
      }

      this.busMarker = L.marker([latitude, longitude], { icon: this.busMarkerIcon }).addTo(this.map);

      this.map.panTo(new L.LatLng(latitude, longitude));
    }
}

  sendCoordinateToRabbitMQ(latitude: number, longitude: number): void{
		const liveLocation : LiveLocation = {
			latitude: latitude,
			longitude: longitude,
		};

		const token = localStorage.getItem('token');
		const headers = new HttpHeaders({
		'Content-Type': 'application/json',
		'Authorization': `Bearer ${token}`
		});
		this.rabbitmqLiveLocationService.sendLiveLocationMessage(liveLocation,headers).subscribe();
	}

  simulate(): void {
    let index = 0;
    let forward = true;
  
    const intervalId = setInterval(() => {
      if (index === this.routeCoordinates.length - 1 && forward) {
        forward = false;
      } 
      else if (index === 0 && !forward) {
        forward = true;
      }
  
      const currentCoordinate = this.routeCoordinates[index];
      console.log(currentCoordinate[0], currentCoordinate[1]); 
      this.sendCoordinateToRabbitMQ(currentCoordinate[0], currentCoordinate[1]);
  
      index += forward ? 1 : -1;
    }, 3000);
  }

  public generatePDF() : void {
    const doc = new jsPDF();

    const imgData = 'assets/LogoWithNameGrey.png';
    doc.addImage(imgData, 'PNG', 10, 10, 60, 30);
    
    doc.setFontSize(24);
    doc.text('ROUTE STATISTICS, 2024', 10, 60);

    doc.setFontSize(14);
    doc.text('June, 2024', 10, 50);
    doc.text(`Statistics for route ${this.route.name}`, 10, 80);
  
    this.numberOfBusesOnRoute = this.route.buses.length;
    this.numberOfBoughtTickets = this.numberOfPassengers - this.numberOfPassengersWithCard;
    doc.setFontSize(12);
    doc.text(`Total Number of passengers: ${this.numberOfPassengers}`, 10, 90);
    doc.text(`Number of passengers who bought a ticket: ${this.numberOfBoughtTickets}`, 10, 100);
    doc.text(`Number of passengers with a city transport card: ${this.numberOfPassengersWithCard}`, 10, 110);
    doc.text(`Number of buses on the route: ${this.numberOfBusesOnRoute}`, 10, 120);
    this.averageNumberOfPassengersPerBus = this.numberOfPassengers / this.numberOfBusesOnRoute;
    doc.text(`Average number of passengers per bus: ${this.averageNumberOfPassengersPerBus}`, 10, 130);
  
    doc.setFontSize(16);
    doc.text('Earnings from ticket sales', 10, 140);
    doc.setFontSize(14);
    const profit = this.numberOfBoughtTickets * this.ticketPrice;
    doc.text(`${profit} DIN`, 10, 150);
  
    doc.save('Route_statistics.pdf');
  }

  public increaseNumberOfPassengers() : void {
    this.numberOfPassengers ++;
  }

  public increaseNumberOfPassengersWithCard() : void {
    this.numberOfPassengersWithCard ++;
    this.numberOfPassengers ++;
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
  
  private busIcon = L.icon({
    iconUrl: 'assets/bus.png',
    iconSize: [30, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  busMarkerIcon = L.icon({
    iconUrl: 'assets/busMarker.png',
    iconSize: [35, 35],
    iconAnchor: [17, 35],
    popupAnchor: [0, -35]
  });
}
