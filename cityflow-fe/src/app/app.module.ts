import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppComponent } from './app.component';
import { NgToastComponent } from 'ng-angular-popup';
import { NgChartsModule } from 'ng2-charts';


@NgModule({
  declarations: [ 
  ],
  imports: [
    BrowserModule, 
    HttpClientModule,
    FormsModule,
    RouterModule.forRoot([]), 
    FontAwesomeModule,
    NgbModule,
    NgChartsModule
  ],
  providers: [NgToastComponent],
  bootstrap: [] 
})
export class AppModule { }
