import { Component } from '@angular/core';
import { JurisdictionService } from '../jurisdiction.service';
import { PoliceAccountsService } from '../police-accounts.service';
import { PersonService } from '../person.service';
import { CaseService, Crime } from '../case.service';
import { AuthService } from '../auth.service';
import { CaseQueueService } from '../case-queue.service';
import { ActivatedRoute, Router } from '@angular/router';
import { error } from 'console';

@Component({
  selector: 'app-add-case',
  templateUrl: './add-case.component.html',
  styleUrl: './add-case.component.css',
})
export class AddCaseComponent {
  caseData: Crime = {
    crimeId: 0,
    title: '',
    offenseType: '',
    citeNumber: '',
    dateTimeReported: '',
    dateTimeCommitted: '',
    dateTimeCreated: '',
    description: '',
    status: '',
    incidentTypeId: 0,
    lastModified: '',
    createdBy: '',
    modifiedBy: '',
    locationId: 0,
    stationId: 0,

    victim_id_list: [],
    suspect_id_list: [],
    police_id_list: [],
  };

  reportId: number = 0;
  stationId: string;

  reports: any;
  cases: any = [];


  stationDetails: any;
  caseDetails: any;
  suspectDetails: any ={};
  victimDetails: any = {};

  policeByStation: any;
  distinctTitles: any = [];
  distinctOffenseTypes: any = [];
  team: any;

  constructor(
    private jurisdictionService: JurisdictionService,
    private policeAccountsService: PoliceAccountsService,
    private personService: PersonService,
    private caseService: CaseService,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private caseQueueService: CaseQueueService
  ) {}

  ngOnInit(): void {
    const stationData = localStorage.getItem('stationDetails');
    const caseData = localStorage.getItem('cases');
    const police = localStorage.getItem('policeByStation');
    const suspects = localStorage.getItem('suspects');
    const victims = localStorage.getItem('victims');
    const reportData = localStorage.getItem('report-data');
    const suspectData = localStorage.getItem('reported-suspect');
    const victimData = localStorage.getItem('reported-victim');

    console.log('Navigation state:', history.state);
    const state =
      this.router.getCurrentNavigation()?.extras.state || history.state;

    if (state && state.reportId && state.team) {
      this.reportId = state.reportId;
      this.team = state.team;
      console.log('State values:', {
        reportId: this.reportId,
        team: this.team,
      });
    } else {
      this.route.queryParams.subscribe((params) => {
        this.reportId = +params['reportId'];
        this.team = params['team'];
        console.log('Query param values:', {
          reportId: this.reportId,
          team: this.team,
        });
      });
    }

    if (stationData) {
      this.stationDetails = JSON.parse(stationData);
      this.caseData.stationId = this.stationDetails.station_id;
    }

    if (caseData) {
      this.caseDetails = JSON.parse(caseData);
      // console.log('Cases', this.caseDetails)
      this.cases = this.caseDetails;

      this.distinctTitles = Array.from(
        new Set(this.cases.map((c: any) => c.title))
      );
      this.distinctOffenseTypes = Array.from(
        new Set(this.cases.map((c: any) => c.offense_type))
      );

      console.log('Distinct Title', this.distinctTitles);
      console.log('Distinct Offense', this.distinctOffenseTypes);
    }

    if (suspectData) {
      this.suspectDetails = JSON.parse(suspectData);
      console.log('Suspect Data', this.suspectDetails);
      this.caseData.suspect_id_list = this.suspectDetails.map((suspect) => suspect.suspect_id);
      console.log('Suspect List', this.caseData.suspect_id_list);
    } else {
      console.error('No suspect found');
    }

    if (victimData) {
      this.victimDetails = JSON.parse(victimData);
      console.log('Victim Data', this.victimDetails);
      this.caseData.victim_id_list = this.victimDetails.map((victim) => victim.victim_id);
      console.log('Victim List', this.caseData.victim_id_list);
    }
    
    if (reportData) {
      //console.log('Report Data from local storage', reportData);
      this.reports = JSON.parse(reportData);
      this.caseData.incidentTypeId = this.reports.report_subcategory_id;
      this.caseData.dateTimeReported = this.reports.reported_date;
      this.caseData.dateTimeCommitted = this.reports.incident_date;
      this.caseData.dateTimeCreated = new Date().toLocaleString();
      this.caseData.dateTimeCreated = new Date().toLocaleString();
      this.caseData.locationId = this.reports.location_id;

    } else {
      console.error('No reports found');
    }

    if (police) {
      this.policeByStation = JSON.parse(police);
      console.log('All Police:', this.policeByStation);
      console.log('Current Team:', this.team);

      this.caseData.police_id_list = this.policeByStation
        .filter((police) => {
          console.log(
            `Checking police unit: ${police.unit} against team: ${this.team}`
          );
          return police.unit === this.team;
        })
        .map((police) => police.police_id);

      console.log('Filtered Police ID List:', this.caseData.police_id_list);
    }
  }

  logout() {
    this.authService.logout().subscribe(
      (response) => {
        console.log('Signed out successfully:', response);
        this.clearSession();
        localStorage.setItem('authenticated', '0');
        this.router.navigate(['/login']);
      },
      (error) => {
        console.error('Error during sign out:', error);
      }
    );
  }

  clearSession() {
    sessionStorage.removeItem('userData');
    sessionStorage.removeItem('citizenId');
    localStorage.removeItem('sessionData');
    localStorage.clear();
    sessionStorage.clear();
  }

  isReportsActive(): boolean {
    const activeRoutes = ['/add-case', '/station-cases'];
    return activeRoutes.some((route) => this.router.url.includes(route));
  }

  submitCase() {
    console.log('Case Data to be posted', this.caseData);
    this.caseService.postCase(this.caseData).subscribe(
      (response) => {
        console.log('Case successfully added', response);
        this.caseService
          .connectDot(this.reportId, response.id, this.caseData)
          .subscribe(
            (response) => {
              console.log('Report successfully added to case', response);
            },
            (error) => {
              console.error('Error adding case to report', error);
            }
          );
      },
      (error) => {
        console.error('Error adding case', error);
      }
    );
  }
}
