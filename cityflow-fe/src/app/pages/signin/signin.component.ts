import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faEye, faEyeSlash, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { AuthService } from '../../service/auth.service';
import { LoginDTO } from '../../dtos/loginDTO';
import { HttpErrorResponse } from '@angular/common/http';
import { User } from '../../models/user';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { CommonModule } from '@angular/common';
import { trigger, style, animate, transition } from '@angular/animations'; 


@Component({
  selector: 'app-signin',
  standalone: true,
  imports: [FontAwesomeModule, FormsModule, CommonModule],
  templateUrl: './signin.component.html',
  styleUrl: './signin.component.css',
  animations: [
    trigger('fadeAnimation', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('500ms ease-in', style({ opacity: 1 })),
      ]),
      transition(':leave', [
        animate('500ms ease-out', style({ opacity: 0 })),
      ]),
    ]),
  ],
})
export class SigninComponent implements OnInit{
  @ViewChild('featuresSection') featuresSection!: ElementRef<HTMLDivElement>;
  @ViewChild('homeSection') homeSection!: ElementRef<HTMLDivElement>;


  showFeatures = false;

  ngOnInit(): void {}

  constructor(private authService : AuthService, private router: Router, private toast: NgToastService){}

  scrollToFeatures(): void {
    this.featuresSection.nativeElement.scrollIntoView({ behavior: 'smooth' });
  }

  scrollToHome(): void {
    this.homeSection.nativeElement.scrollIntoView({ behavior: 'smooth' });
  }

  @HostListener('window:scroll', ['$event'])
  onWindowScroll() {
  }
  
  toggleFeatures() {
    this.showFeatures = !this.showFeatures;
  }

  public navigateToSignUp() : void {
    this.router.navigate(['/signup']);
  }
  public navigateToLogIn() : void {
    this.router.navigate(['/login']);
  }


}
