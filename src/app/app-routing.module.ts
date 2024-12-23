import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { CreateAccountComponent } from './create-account/create-account.component'; // Import your component
// import { VictimRegisterComponent } from './victim-register/victim-register.component';
// import { WitnessRegisterComponent } from './witness-register/witness-register.component';
import { ReportingPersonComponent } from './reporting-person/reporting-person.component';
import { SuspectDataComponent } from './suspect-data/suspect-data.component';
import { VictimDataComponent } from './victim-data/victim-data.component';
import { NarrativeOfIncidentComponent } from './narrative-of-incident/narrative-of-incident.component';
import { StationEditOfficersComponent } from './station-edit-officers/station-edit-officers.component';
import { AddNewOfficerComponent } from './add-new-officer/add-new-officer.component';
import { StationCrimeMapComponent } from './station-crime-map/station-crime-map.component';// Import SuspectDataComponent
import { StationDashboardComponent } from './station-dashboard/station-dashboard.component';// Add route for SuspectDataComponent
import { PoliceLoginComponent } from './police-login/police-login.component';
import { PoliceRegisterComponent } from './police-register/police-register.component';
import { PoliceEditProfileComponent } from './police-edit-profile/police-edit-profile.component';
import { PoliceJurisdictionComponent } from './police-jurisdiction/police-jurisdiction.component';
import { PolicePrivacyComponent } from './police-privacy/police-privacy.component';
import { PoliceDashboardComponent } from './police-dashboard/police-dashboard.component';
import { CrimeMapComponent } from './crime-map/crime-map.component';
import { PlotLongitudeAndLatitudeComponent } from './plot-longitude-and-latitude/plot-longitude-and-latitude.component';
import { PaymentMethodComponent } from './payment-method/payment-method.component';
import { HomePageComponent } from './home-page/home-page.component';
import { roleGuard } from './auth.guard';
import { AccessDeniedComponent } from './access-denied/access-denied.component';
import { StationRegistrationComponent } from './station-registration/station-registration.component'; // Import your component
import { StationLoginComponent } from './station-login/station-login.component'; // Import your login component
import { StationListOfOfficersComponent } from './station-list-of-officers/station-list-of-officers.component';
import { StationReportsComponent } from './station-reports/station-reports.component'; // Import your component
import { StationCaseQueueComponent } from './station-case-queue/station-case-queue.component';
import { ManageUsersComponent } from './manage-users/manage-users.component'; // Import the Manage Users component
import { TicketRequestComponent } from './ticket-request/ticket-request.component'; // Import your Ticket R
import { TicketRequestDetailsComponent } from './ticket-request-details/ticket-request-details.component'; // Import Ticket Request Details component
import { ManageStationComponent } from './manage-station/manage-station.component'; // Import Manage Station component
import { StationAddLocationComponent } from './station-add-location/station-add-location.component';
import { AddPersonComponent } from './add-person/add-person.component';
import { EditReportComponent } from './edit-report/edit-report.component';
import { ReportEndorseComponent } from './reportendorse/reportendorse.component';
import { EmailComponent } from './email/email.component';
import { StationPoliceAccountsComponent } from './station-police-accounts/station-police-accounts.component';
import { CaseManagementComponent } from './case-management/case-management.component';
import { PoliceReportsComponent } from './police-reports/police-reports.component';
import { PoliceCasesComponent } from './police-cases/police-cases.component';
// station-edit-officers
// , canActivate: [roleGuard], data: { roles: ['chief'] } 

// station-crime-map
// , canActivate: [roleGuard], data: { roles: ['police'] } 

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'create-account', component: CreateAccountComponent }, // Route for CreateAccountComponent
  // { path: 'victim-register', component: VictimRegisterComponent },
  // { path: 'witness-register', component: WitnessRegisterComponent },
  { path: 'station-register', component: StationRegistrationComponent },
  { path: 'station-add-location', component: StationAddLocationComponent },
  { path: 'station-login', component: StationLoginComponent }, // Route for login
  { path: 'reporting-person', component: ReportingPersonComponent, canActivate: [roleGuard], data: { roles: ['user'] } },
  { path: 'suspect-data', component: SuspectDataComponent },
  { path: 'victim-data', component: VictimDataComponent },
  { path: 'narrative-of-incident', component: NarrativeOfIncidentComponent },
  { path: 'station-edit-officers', component: StationEditOfficersComponent},
  { path: 'add-new-officer', component: AddNewOfficerComponent },
  { path: 'station-crime-map', component: StationCrimeMapComponent},
  { path: 'station-dashboard', component: StationDashboardComponent },
  { path: 'station-list-of-officers', component: StationListOfOfficersComponent },
  { path: 'station-reports', component: StationReportsComponent }, // Add route for StationReportsComponent
  { path: 'police-login', component: PoliceLoginComponent },
  { path: 'police-register', component: PoliceRegisterComponent },
  { path: 'edit-profile', component: PoliceEditProfileComponent },
  { path: 'police-jurisdiction', component: PoliceJurisdictionComponent },
  { path: 'police-privacy', component: PolicePrivacyComponent },
  { path: 'dashboard', component: PoliceDashboardComponent },
  { path: 'crime-map', component: CrimeMapComponent },
  { path: 'plot-longitude-and-latitude', component: PlotLongitudeAndLatitudeComponent },
  { path: 'payment-method', component: PaymentMethodComponent },
  { path: 'home-page', component: HomePageComponent },
  { path: 'access-denied', component: AccessDeniedComponent },
  { path: 'station-case-queue', component: StationCaseQueueComponent },
  { path: 'manage-users', component: ManageUsersComponent }, 
  { path: 'ticket-request', component: TicketRequestComponent },
  { path: 'ticket-request-details', component: TicketRequestDetailsComponent }, // Route for Ticket Request Details with a parameter // Add route for Ticket Request
  { path: 'manage-station', component: ManageStationComponent },
  { path: 'add-person', component: AddPersonComponent },// Route for Manage Station
  { path: 'edit-report', component: EditReportComponent},
  { path: 'report-endorse', component: ReportEndorseComponent },
  { path: 'station-police-accounts', component: StationPoliceAccountsComponent},
  { path: 'email', component: EmailComponent},
  { path: 'manage-users', component: ManageStationComponent},
  { path: 'case-management', component: CaseManagementComponent},
  { path: 'police-reports', component: PoliceReportsComponent},
  { path: 'police-cases', component: PoliceCasesComponent},

 

  // { path: '', redirectTo: '/home-page', pathMatch: 'full' },
  { path: '', redirectTo: '/station-register', pathMatch: 'full' }, // Redirect to registration by default
  { path: '**', redirectTo: '/station-register' },
  { path: '', redirectTo: '/station-login', pathMatch: 'full' }, // Redirect to login by default
  { path: '**', redirectTo: '/station-login' },
  { path: '', redirectTo: '/create-account', pathMatch: 'full' }, // Redirect to create-account by default
  { path: '**', redirectTo: '/create-account' },
  // { path: '', redirectTo: '/station-add-police'}, // Wildcard route for a 404 page
  // { path: '', redirectTo: '/payment-method', pathMatch: 'full' },
  // { path: '', redirectTo: '/plot-longitude-and-latitude', pathMatch: 'full' },
  // { path: '**', redirectTo: '/plot-longitude-and-latitude' },
  // { path: '', redirectTo: '/crime-map', pathMatch: 'full' },
  // { path: '**', redirectTo: '/crime-map' },
  // { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  // { path: '', redirectTo: '/police-privacy', pathMatch: 'full' }, // Default route
  // { path: '**', redirectTo: '/police-privacy' }, // Wildcard route for a 404 page
  // { path: '', redirectTo: '/police-jurisdiction', pathMatch: 'full' }, // Default route
  // { path: '**', redirectTo: '/police-jurisdiction' }, // Wildcard route for a 404 page
  // { path: '', redirectTo: '/police-register', pathMatch: 'full' }, // Default route
  // { path: '**', redirectTo: '/police-register' }, // Wildcard route for a 404 page
  // { path: '', redirectTo: '/station-inbox', pathMatch: 'full' }, // Default route
  // { path: '', redirectTo: '/station-crime-map', pathMatch: 'full' }, 
  // { path: '', redirectTo: '/login', pathMatch: 'full' },
  // { path: '**', redirectTo: '/login' },// Wildcard route for handling 404
  // { path: '', redirectTo: '/victim-data', pathMatch: 'full' },
  // { path: '', redirectTo: '/narrative-of-incident', pathMatch: 'full' },
  // { path: '', redirectTo: '/station-dashboard', pathMatch: 'full' }, // Default route
  // { path: '**', redirectTo: '/station-dashboard' }// Wildcard route for a 404 page

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
