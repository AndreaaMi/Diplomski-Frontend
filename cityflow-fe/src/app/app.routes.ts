import { Routes } from '@angular/router';
import { SigninComponent } from './pages/signin/signin.component';
import { SignupComponent } from './pages/signup/signup.component';
import { RoutesComponent } from './pages/route/routes.component';
import { EmployeesComponent } from './pages/employees/employees.component';
import { RouteDetailsComponent } from './pages/route-details/route-details.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { NewEmployeeFormComponent } from './components/new-employee-form/new-employee-form.component';
import { UpdateEmployeFormComponent } from './components/update-employe-form/update-employe-form.component';
import { CreateRouteComponent } from './pages/create-route/create-route.component';
import { UserBalanceComponent } from './pages/user-balance/user-balance.component';
import { UserCardBalanceComponent } from './pages/user-card-balance/user-card-balance.component';
import { AssignSalaryFormComponent } from './components/assign-salary-form/assign-salary-form.component';
import { DocumentRequestsComponent } from './components/document-requests/document-requests.component';
import { BusesComponent } from './pages/buses/buses.component';
import { FileUploadComponent } from './components/file-upload/file-upload.component';
import { WorkCalendarComponent } from './components/work-calendar/work-calendar.component';
import { AddShiftFormComponent } from './components/add-shift-form/add-shift-form.component';
import { AllRoutesComponent } from './pages/all-routes/all-routes.component';
import { DeleteEmployeeFormComponent } from './components/delete-employee-form/delete-employee-form.component';
import { HomeComponent } from './pages/home/home.component';
import { InboxComponent } from './pages/inbox/inbox.component';

export const routes: Routes = [
    {path:"signin" , component:  SigninComponent},
    {path:"signup", component: SignupComponent},
    {path:"routes", component: RoutesComponent},
    {path:"employees", component: EmployeesComponent},
    {path:"route/:id", component: RouteDetailsComponent},
    {path:"inbox", component: InboxComponent},
    {path:"home", component: HomeComponent},
    {path:"profile", component: ProfileComponent},
    {path:"newEmployee", component: NewEmployeeFormComponent},
    {path:'update-employee/:id', component: UpdateEmployeFormComponent },
    {path:'assign-salary/:id', component: AssignSalaryFormComponent },
    {path:"newRoute", component: CreateRouteComponent},
    {path:"updateUserBalance", component: UserBalanceComponent},
    {path:"updateUserCardBalance", component: UserCardBalanceComponent},
    {path:"documentRequests", component: DocumentRequestsComponent},
    {path:"buses", component: BusesComponent},
    {path:"fileUpload", component: FileUploadComponent},
    {path:"work-calendar", component: WorkCalendarComponent},
    {path:"add-shift", component: AddShiftFormComponent},
    {path:"allRoutes", component: AllRoutesComponent},
    {path:"deleteEmployee/:id", component: DeleteEmployeeFormComponent},

];
