import { Component, OnInit } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faUser, faHome, faIdCard, faInbox, faCalendar, faBus, faMoneyBillTransfer, faRoute } from '@fortawesome/free-solid-svg-icons';
import { AuthService } from '../../service/auth.service';
import { User } from '../../models/user';
import { response } from 'express';
import { faSignOut } from '@fortawesome/free-solid-svg-icons';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-side-panel-menu',
  standalone: true,
  imports: [FontAwesomeModule, CommonModule],
  templateUrl: './side-panel-menu.component.html',
  styleUrl: './side-panel-menu.component.css'
})
export class SidePanelMenuComponent implements OnInit{
  //Icons
  faSignOut = faSignOut;
  faUser = faUser;
  faHome = faHome;
  faIdCard = faIdCard;
  faInbox = faInbox;
  faBus = faBus;
  faMoneyBillTransfer = faMoneyBillTransfer;
  faRoute = faRoute;

  faCalendar = faCalendar;
  showHome : boolean = true;
  showProfile : boolean = false;
  showCards : boolean = false;
  showInbox : boolean = false;
  showRoutes : boolean = false;
  showBuses : boolean = false;
  showEmployees: boolean = false;
  showUserBalance: boolean = false;
  showUserCardBalance: boolean = false;
  showRequests : boolean = false;
  showWorkCalendar: boolean = false
  showUserRoutes : boolean = false;

  token : string | null = localStorage.getItem('token');
  loggedUser! : User;
  loggedUserRole : string  = '';

  constructor(private authService : AuthService,
              private router: Router){}

  ngOnInit(): void {
    this.fetchUser();
  }

  public fetchUser() : void {
    if(this.token != null){
      this.authService.getUserFromToken(this.token).subscribe(
        (response : User) => {
          this.loggedUser = response;
          this.loggedUserRole = this.loggedUser.roles;
        },
        (error: HttpErrorResponse) => {
          console.log('Error fetching user data:\n', error.message);
        }
      )
    }
  }

  public viewHome() : void{
    this.navigateToHome();
    this.showProfile = false;
    this.showCards = false;
    this.showInbox = false;
    this.showRoutes = false;
    this.showEmployees = false;
    this.showUserBalance = false;
    this.showUserCardBalance = false;
    this.showRequests = false;
    this.showBuses = false;
    this.showWorkCalendar = false;
    this.showUserRoutes = false;
  }
  
  public viewProfile() : void{
    this.showHome = false;
    this.showProfile = true;
    this.showCards = false;
    this.showInbox = false;
    this.showRoutes = false;
    this.showEmployees = false;
    this.showUserBalance = false;
    this.showUserCardBalance = false;
    this.showRequests = false;
    this.showBuses = false;
    this.navigateToProfile();
    this.showWorkCalendar = false;
    this.showUserRoutes = false;

  }

  public viewCards() : void{
    this.showHome = false;
    this.showProfile = false;
    this.showCards = true;
    this.showInbox = false;
    this.navigateToCards();
    this.showWorkCalendar = false;
    this.showUserRoutes = false;
    this.showUserCardBalance = false;

  }

  public viewUserRoutes() : void{
    this.showHome = false;
    this.showProfile = false;
    this.showCards = false;
    this.showInbox = false;
    this.navigateToUserRoutes();
    this.showWorkCalendar = false;
    this.showUserRoutes = true;
    this.showUserCardBalance = false;

  }
  
  public viewInbox() : void{
    this.showHome = false;
    this.showProfile = false;
    this.showCards = false;
    this.showInbox = true;
    this.navigateInbox();
    this.showRoutes = false;
    this.showEmployees = false;
    this.showUserBalance = false;
    this.showUserCardBalance = false;
    this.showRequests = false;
    this.showBuses = false;
    this.showWorkCalendar = false;
    this.showUserRoutes = false;

  }

  public viewRoutes() : void{
    this.showHome = false;
    this.showProfile = false;
    this.showRoutes = true;
    this.showInbox = false;
    this.showBuses = false;
    this.navigateToRoutes();
    this.showWorkCalendar = false;

  }

  public viewBuses() : void{
    this.showHome = false;
    this.showProfile = false;
    this.showRoutes = false;
    this.showInbox = false;
    this.showBuses = true;
    this.navigateToBuses();

  }

  public viewEmployees() : void{
    this.showHome = false;
    this.showProfile = false;
    this.showEmployees = true;
    this.showInbox = false;
    this.navigateToEmployees();
    this.showWorkCalendar = false;

  }
  public viewUserBalance() : void{
    this.showHome = false;
    this.showProfile = false;
    this.showInbox = false;
    this.showUserBalance = true;
    this.showUserCardBalance = false;
    this.showRequests = false;
    this.navigateToUserBalance();

  }
  public viewUserRequests() : void{
    this.showHome = false;
    this.showProfile = false;
    this.showInbox = false;
    this.showUserBalance = false;
    this.showUserCardBalance = false;
    this.showRequests = true;
    this.navigateToDocumentRequests();
    this.showWorkCalendar = false;
  }
  public viewUserCardBalance() : void{
    this.showHome = false;
    this.showProfile = false;
    this.showInbox = false;
    this.showUserBalance = false;
    this.showUserCardBalance = true;
    this.showCards = false;
    this.navigateToUserCardBalance();
    this.showWorkCalendar = false;
    this.showUserRoutes = false;

  }
  public viewWorkCalendar() : void{
    this.showHome = false;
    this.showProfile = false;
    this.showCards = false;
    this.showInbox = false;
    this.showRoutes = false;
    this.showEmployees = false;
    this.showUserBalance = false;
    this.showUserCardBalance = false;
    this.showWorkCalendar = true;
    this.navigateToWorkCalendar();

  }
 
  public navigateToHome() : void {
    this.router.navigate(['/home']);
  }
  public navigateToRoutes() : void {
    this.router.navigate(['/routes']);
  }
  public navigateToEmployees() : void {
    this.router.navigate(['/employees']);
  }
  public navigateToProfile() : void {
    this.router.navigate(['/profile']);
  }
  public navigateToUserBalance() : void {
    this.router.navigate(['/updateUserBalance']);
  }
  public navigateToUserCardBalance() : void {
    this.router.navigate(['/updateUserCardBalance']);
  }
  public navigateToDocumentRequests() : void {
    this.router.navigate(['/documentRequests']);
  }
  public navigateToBuses() : void {
    this.router.navigate(['/buses']);
  }
  public navigateToCards() : void {
    this.router.navigate(['/fileUpload']);
  }
  public navigateToWorkCalendar() : void {
    this.router.navigate(['/work-calendar']);
  }
  public navigateToUserRoutes() : void {
    this.router.navigate(['/allRoutes']);
  }
  public navigateInbox() : void {
    this.router.navigate(['/inbox']);
  }

}
