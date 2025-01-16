import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, provideHttpClient, withFetch } from '@angular/common/http'; 
import { AppRoutingModule } from './app-routing.module';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { VictimRegisterComponent } from './victim-register/victim-register.component';
import { WitnessRegisterComponent } from './witness-register/witness-register.component';
import { ReportingPersonComponent } from './reporting-person/reporting-person.component';
import { SuspectDataComponent } from './suspect-data/suspect-data.component';
import { VictimDataComponent } from './victim-data/victim-data.component';
import { NarrativeOfIncidentComponent } from './narrative-of-incident/narrative-of-incident.component';
import { StationEditOfficersComponent } from './station-edit-officers/station-edit-officers.component';
import { AddNewOfficerComponent } from './add-new-officer/add-new-officer.component';
import { StationCrimeMapComponent } from './station-crime-map/station-crime-map.component';
import { StationDashboardComponent } from './station-dashboard/station-dashboard.component';
import { PoliceLoginComponent } from './police-login/police-login.component';
import { PoliceRegisterComponent } from './police-register/police-register.component';
import { PoliceEditProfileComponent } from './police-edit-profile/police-edit-profile.component';
import { PoliceJurisdictionComponent } from './police-jurisdiction/police-jurisdiction.component';
import { PolicePrivacyComponent } from './police-privacy/police-privacy.component';
import { PoliceDashboardComponent } from './police-dashboard/police-dashboard.component';
import { CrimeMapComponent } from './crime-map/crime-map.component';
import { MapboxService } from './mapbox.service';
import { PlotLongitudeAndLatitudeComponent } from './plot-longitude-and-latitude/plot-longitude-and-latitude.component';
import { PaymentMethodComponent } from './payment-method/payment-method.component';
import { CreateAccountComponent } from './create-account/create-account.component';
import { HomePageComponent } from './home-page/home-page.component';
import { MyReportsWitnessComponent } from './my-reports-witness/my-reports-witness.component';
import { DataSuspectService } from './data-suspect.service';
import { AccessDeniedComponent } from './access-denied/access-denied.component';
import { StationRegistrationComponent } from './station-registration/station-registration.component';
import { StationLoginComponent } from './station-login/station-login.component';
import { StationCaseQueueComponent } from './station-case-queue/station-case-queue.component';
import { ManageUsersComponent } from './manage-users/manage-users.component';
import { TicketRequestComponent } from './ticket-request/ticket-request.component';
import { TicketRequestDetailsComponent } from './ticket-request-details/ticket-request-details.component';
import { ManageStationComponent } from './manage-station/manage-station.component';
import { StationAddLocationComponent } from './station-add-location/station-add-location.component';
import { AddPersonComponent } from './add-person/add-person.component';
import { StationReportsComponent } from './station-reports/station-reports.component';
import { EditReportComponent } from './edit-report/edit-report.component';
import { ReportEndorseComponent } from './reportendorse/reportendorse.component';
import { EmailComponent } from './email/email.component';
import { StationPoliceAccountsComponent } from './station-police-accounts/station-police-accounts.component';
import { CaseManagementComponent } from './case-management/case-management.component';
import { StationListOfOfficersComponent } from './station-list-of-officers/station-list-of-officers.component';
import { PoliceReportsComponent } from './police-reports/police-reports.component';
import { PoliceCasesComponent } from './police-cases/police-cases.component';
import { CasesComponent } from './cases/cases.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { StationCasesComponent } from './station-cases/station-cases.component';
import { AddCaseComponent } from './add-case/add-case.component';
import { EditCaseComponent } from './edit-case/edit-case.component';
import { StationPoliceArchivesComponent } from './station-police-archives/station-police-archives.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    VictimRegisterComponent,
    WitnessRegisterComponent,
    ReportingPersonComponent,
    SuspectDataComponent,
    VictimDataComponent,
    NarrativeOfIncidentComponent,
    StationEditOfficersComponent,
    AddNewOfficerComponent,
    StationCrimeMapComponent,
    StationDashboardComponent,
    PoliceLoginComponent,
    PoliceRegisterComponent,
    PoliceEditProfileComponent,
    PoliceJurisdictionComponent,
    PolicePrivacyComponent,
    PoliceDashboardComponent,
    CrimeMapComponent,
    PlotLongitudeAndLatitudeComponent,
    PaymentMethodComponent,
    CreateAccountComponent,
    HomePageComponent,
    MyReportsWitnessComponent,
    SuspectDataComponent,
    AccessDeniedComponent,
    StationRegistrationComponent,
    StationLoginComponent,
    StationCaseQueueComponent,
    ManageUsersComponent,
    TicketRequestComponent,
    TicketRequestDetailsComponent,
    ManageStationComponent,
    StationAddLocationComponent,
    AddPersonComponent,
    StationReportsComponent,
    EditReportComponent,
    ReportEndorseComponent,
    EmailComponent,
    StationPoliceAccountsComponent,
    CaseManagementComponent,
    StationListOfOfficersComponent,
    PoliceReportsComponent,
    PoliceCasesComponent,
    CasesComponent,
    StationCasesComponent,
    AddCaseComponent,
    EditCaseComponent,
    StationPoliceArchivesComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule, // Add this line
    HttpClientModule,
    FormsModule,
    NgxPaginationModule,
  ],
  providers: [
    MapboxService,
    DataSuspectService,
    provideHttpClient(withFetch()) // Enable fetch API
  ], 
  bootstrap: [AppComponent]
})
export class AppModule { }
