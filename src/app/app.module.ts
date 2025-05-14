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
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { EditCaseComponent } from './edit-case/edit-case.component';
import { StationPoliceArchivesComponent } from './station-police-archives/station-police-archives.component';

import { PoliceMapComponent } from './police-map/police-map.component';
import { SpammerUsersComponent } from './spammer-users/spammer-users.component';
import { SpamReportsComponent } from './spam-reports/spam-reports.component'; 
import { AuthInterceptor } from './auth.interceptor';
import { StatDetailsModalComponent } from './stats/stat-details-modal/stat-details-modal.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StationGeoanalysisComponent } from './station-geoanalysis/station-geoanalysis.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ConfirmationModalComponent } from './confirmation-modal/confirmation-modal.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ConfirmationDialogComponent } from './dialog/confirmation-dialog.component';
import { SuccessDialogComponent } from './dialog/success-dialog.component';
import { LoadingDialogComponent } from './dialog/loading-dialog.component';
import { UpdateStatusDialogComponent } from './dialog/update-status-dialog.component';
import { DialogService } from './dialog/dialog.service';
import { StationCitizensComponent } from './station-citizens/station-citizens.component';
import { StationAdminDashboardComponent } from './station-admin-dashboard/station-admin-dashboard.component';
import { StationAdminReportsManagementComponent } from './station-admin-reports-management/station-admin-reports-management.component';
import { StationAdminCitizensManagementComponent } from './station-admin-citizens-management/station-admin-citizens-management.component';
import { StationAdminLogsComponent } from './station-admin-logs/station-admin-logs.component';
import { StationAdminPoliceManagementComponent } from './station-admin-police-management/station-admin-police-management.component';
import { StationAdminPoliceAddComponent } from './station-admin-police-add/station-admin-police-add.component';
import { PoliceRoosterComponent } from './police-rooster/police-rooster.component';
import { PoliceArchivesComponent } from './police-archives/police-archives.component';
import { PoliceStationsComponent } from './police-stations/police-stations.component';
import { StationEditpoliceComponent } from './station-editpolice/station-editpolice.component';
import { PoliceReportsConsolidatedComponent } from './police-reports-consolidated/police-reports-consolidated.component';
import { PoliceCasesConsolidatedComponent } from './police-cases-consolidated/police-cases-consolidated.component';


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
    PoliceMapComponent,
    SpammerUsersComponent,
    SpamReportsComponent,
    StatDetailsModalComponent,
    StationGeoanalysisComponent,
    ConfirmationModalComponent,
    ConfirmationDialogComponent,
    SuccessDialogComponent,
    LoadingDialogComponent,
    UpdateStatusDialogComponent,
    StationCitizensComponent,
    StationAdminDashboardComponent,
    StationAdminReportsManagementComponent,
    StationAdminCitizensManagementComponent,
    StationAdminLogsComponent,
    StationAdminPoliceManagementComponent,
    StationAdminPoliceAddComponent,
    PoliceRoosterComponent,
    PoliceArchivesComponent,
    PoliceStationsComponent,
    StationEditpoliceComponent,
    PoliceReportsConsolidatedComponent,
    PoliceCasesConsolidatedComponent],

  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule,
    NgxPaginationModule,
    BrowserAnimationsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatDialogModule,
    MatButtonModule,
  ],
  providers: [
    MapboxService,
    DataSuspectService,
    provideHttpClient(withFetch()),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
   
  ], 
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent]
})
export class AppModule { }
