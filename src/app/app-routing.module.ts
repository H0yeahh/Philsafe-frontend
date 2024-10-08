import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { CreateAccountComponent } from './create-account/create-account.component'; // Import your component
import { VictimRegisterComponent } from './victim-register/victim-register.component';
import { WitnessRegisterComponent } from './witness-register/witness-register.component';
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


// station-edit-officers
// , canActivate: [roleGuard], data: { roles: ['chief'] } 

// station-crime-map
// , canActivate: [roleGuard], data: { roles: ['police'] } 

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'create-account', component: CreateAccountComponent }, // Route for CreateAccountComponent
  // { path: 'victim-register', component: VictimRegisterComponent },
  // { path: 'witness-register', component: WitnessRegisterComponent },
  { path: 'reporting-person', component: ReportingPersonComponent, canActivate: [roleGuard], data: { roles: ['user'] } },
  { path: 'suspect-data', component: SuspectDataComponent },
  { path: 'victim-data', component: VictimDataComponent },
  { path: 'narrative-of-incident', component: NarrativeOfIncidentComponent },
  { path: 'station-edit-officers', component: StationEditOfficersComponent},
  { path: 'add-new-officer', component: AddNewOfficerComponent },
  { path: 'station-crime-map', component: StationCrimeMapComponent},
  { path: 'station-dashboard', component: StationDashboardComponent },
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
  // { path: '', redirectTo: '/home-page', pathMatch: 'full' },
  { path: '', redirectTo: '/create-account', pathMatch: 'full' }, // Redirect to create-account by default
  { path: '**', redirectTo: '/create-account' }, // Wildcard route for a 404 page
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
