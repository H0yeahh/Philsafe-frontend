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
import { StationCrimeMapComponent } from './station-crime-map/station-crime-map.component'; // Import SuspectDataComponent
import { StationDashboardComponent } from './station-dashboard/station-dashboard.component'; // Add route for SuspectDataComponent
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
import { StationCasesComponent } from './station-cases/station-cases.component';
import { AddCaseComponent } from './add-case/add-case.component';

import { EditCaseComponent } from './edit-case/edit-case.component';
import { StationPoliceArchivesComponent } from './station-police-archives/station-police-archives.component';

import { PoliceMapComponent } from './police-map/police-map.component';
import { SpammerUsersComponent } from './spammer-users/spammer-users.component';
import { SpamReportsComponent } from './spam-reports/spam-reports.component'; 
import { StationGeoanalysisComponent } from './station-geoanalysis/station-geoanalysis.component';
import { StationCitizensComponent } from './station-citizens/station-citizens.component';
import { StationAdminDashboardComponent } from './station-admin-dashboard/station-admin-dashboard.component';
import { StationAdminCitizensManagementComponent } from './station-admin-citizens-management/station-admin-citizens-management.component';
import { StationAdminPoliceManagementComponent } from './station-admin-police-management/station-admin-police-management.component';
import { StationAdminReportsManagementComponent } from './station-admin-reports-management/station-admin-reports-management.component';
import { StationAdminLogsComponent } from './station-admin-logs/station-admin-logs.component';
import { PoliceRoosterComponent } from './police-rooster/police-rooster.component';
import { PoliceArchivesComponent } from './police-archives/police-archives.component';
import { PoliceStationsComponent } from './police-stations/police-stations.component';
import { StationEditpoliceComponent } from './station-editpolice/station-editpolice.component';
import { PoliceReportsConsolidatedComponent } from './police-reports-consolidated/police-reports-consolidated.component';
import { PoliceCasesConsolidatedComponent } from './police-cases-consolidated/police-cases-consolidated.component';


// station-edit-officers
// , canActivate: [roleGuard], data: { roles: ['chief'] }

// station-crime-map
// , canActivate: [roleGuard], data: { roles: ['police'] }

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'create-account', component: CreateAccountComponent }, // Route for CreateAccountComponent
  // { path: 'victim-register', component: VictimRegisterComponent },
  // { path: 'witness-register', component: WitnessRegisterComponent },
  // { path: 'station-register', component: StationRegistrationComponent },
  { path: 'station-add-location', component: StationAddLocationComponent },
  { path: 'station-login', component: StationLoginComponent },
  { path: 'station-police-accounts', component: StationPoliceAccountsComponent }, 
  


    //POLICE STATION ACCESS
  
  { path: 'station-crime-map', component: StationCrimeMapComponent, 
    canActivate: [roleGuard], data: { roles: ['Police'] } },
  { path: 'station-dashboard', component: StationDashboardComponent, 
    canActivate: [roleGuard], data: { roles: ['Police'] } },
  { path: 'edit-profile', component: PoliceEditProfileComponent, 
    canActivate: [roleGuard], data: { roles: ['Police'] } }, 
  { path: 'plot-longitude-and-latitude', component: PlotLongitudeAndLatitudeComponent, 
    canActivate: [roleGuard], data: { roles: ['Police'] } },
  { path: 'access-denied', component: AccessDeniedComponent, 
    canActivate: [roleGuard], data: { roles: ['Police'] } },
  { path: 'station-case-queue', component: StationCaseQueueComponent, 
    canActivate: [roleGuard], data: { roles: ['Police'] } },
  { path: 'report-endorse', component: ReportEndorseComponent, 
    canActivate: [roleGuard], data: { roles: ['Police'] } },
  { path: 'station-police-accounts', component: StationPoliceAccountsComponent, 
    canActivate: [roleGuard], data: { roles: ['Police'] } },
  { path: 'station-cases', component: StationCasesComponent, 
    canActivate: [roleGuard], data: { roles: ['Police'] } },
    { path: 'add-case', component: AddCaseComponent, 
      canActivate: [roleGuard], data: { roles: ['Police'] } },
  { path: 'edit-case', component: EditCaseComponent, 
    canActivate: [roleGuard], data: { roles: ['Police'] }, },
  { path: 'station-police-archives', component: StationPoliceArchivesComponent, 
      canActivate: [roleGuard], data: { roles: ['Police'] } },
  { path: 'station-citizens', component: StationCitizensComponent, 
      canActivate: [roleGuard], data: { roles: ['Police'] } },
   { path: 'map', component: StationGeoanalysisComponent, 
      canActivate: [roleGuard], data: { roles: ['Police'] } },
  { path: 'station-editpolice', component: StationEditpoliceComponent, 
      canActivate: [roleGuard], data: { roles: ['Police'] } },




// STATION ADMIN ACCESS
    
  { path: 'station-admin-dashboard', component: StationAdminDashboardComponent, 
      canActivate: [roleGuard], data: { roles: ['StationAdmin'] } },
  { path: 'station-admin-citizens', component: StationAdminCitizensManagementComponent, 
      canActivate: [roleGuard], data: { roles: ['StationAdmin'] } },
  { path: 'station-admin-police', component: StationAdminPoliceManagementComponent, 
      canActivate: [roleGuard], data: { roles: ['StationAdmin'] } },
  { path: 'station-admin-reports', component: StationAdminReportsManagementComponent, 
      canActivate: [roleGuard], data: { roles: ['StationAdmin'] } },
  { path: 'station-admin-logs', component: StationAdminLogsComponent, 
      canActivate: [roleGuard], data: { roles: ['StationAdmin'] } },
  
 
  //SUPER ADMIN ACCESS
  {
    path: 'dashboard',
    component: PoliceDashboardComponent,
    canActivate: [roleGuard],
    data: { roles: ['Admin'] },
  },
  {
    path: 'police-officers',
    component: PoliceRoosterComponent,
    canActivate: [roleGuard],
    data: { roles: ['Admin'] },
  },
  
  {
    path: 'manage-users',
    component: ManageUsersComponent,
    canActivate: [roleGuard],
    data: { roles: ['Admin'] },
  },

  {
    path: 'police-archives',
    component: PoliceArchivesComponent,
    canActivate: [roleGuard],
    data: { roles: ['Admin'] },
  },

  {
    path: 'police-stations',
    component: PoliceStationsComponent,
    canActivate: [roleGuard],
    data: { roles: ['Admin'] },
  },

    {
    path: 'police-reports',
    component: PoliceReportsConsolidatedComponent,
    canActivate: [roleGuard],
    data: { roles: ['Admin'] },
  },

  {
    path: 'police-cases',
    component: PoliceCasesConsolidatedComponent,
    canActivate: [roleGuard],
    data: { roles: ['Admin'] },
  },



  //Default

  { path: '', redirectTo: '/login', pathMatch: 'full' }, // Redirect to registration by default

 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
