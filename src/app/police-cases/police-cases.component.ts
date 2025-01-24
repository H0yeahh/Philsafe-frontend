import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CaseQueueService } from '../case-queue.service';
import { Router } from '@angular/router';
import { IReport } from '../case.service';
import { IStation, JurisdictionService } from '../jurisdiction.service';
import {
  IPerson,
  IRank,
  PoliceAccountsService,
} from '../police-accounts.service';
import { PersonService } from '../person.service';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth.service';
import { AccountService } from '../account.service';
import { catchError, forkJoin, map, Observable, tap, throwError } from 'rxjs';
import { PoliceDashbordService } from '../police-dashbord.service';
import { environment } from '../environment';

@Component({
  selector: 'app-police-cases',
  templateUrl: './police-cases.component.html',
  styleUrl: './police-cases.component.css'
})
export class PoliceCasesComponent implements OnInit, OnDestroy{
  policecasesForm!: FormGroup; // Form group for report submission
  isLoading = false;
  successMessage: string | null = null;
  errorMessage: string | null = null;
  //reports: IReport[] = [];  // Array to hold fetched reports`3
  reports: any;
  accounts: any;
  stations: IStation[] = [];
  persons: any = [];
  ranks: IRank[] = [];

  stationID: string | null = null;
  citizenId: number = 0;
  fetch_Report: any;
  citizens: any;
  currentPage: number = 1;
  pageSize: number = 8;
  totalReports: number = 0;
  filteredReports: any[] = [];
  searchQuery = '';
  policeDetails: any = {};
  stationDetails: any = {};
  avatarUrl: string = 'assets/user-default.jpg';
  accountData: any;
  citizenData: any;
  profilePics: { [citizenId: number]: any } = {};
  reportId: any;
  specificReport: any;
  personId: any;
  profilePicMap: { [key: number]: string } = {};
  crimeId: any;currentDate: string = '';
  currentTime: string = '';
  intervalId: any;
  adminData: any;
  adminDetails: any;
  policePersonData: any;


  constructor(
    private fb: FormBuilder,
    private caseQueueService: CaseQueueService,
    private jurisdictionService: JurisdictionService,
    private policeAccountsService: PoliceAccountsService,
    private personService: PersonService,
    private router: Router,
    private http: HttpClient,
    private authService: AuthService,
    private accountService: AccountService,
    private policedashbordService: PoliceDashbordService,
  ) {}

  // Initialize the form and fetch reports, stations, and ranks
  ngOnInit(): void {

    this.fetchCases();
  

  
    const userData = localStorage.getItem('userData');
    this.adminDetails = JSON.parse(userData);
    this.fetchAdminData(this.adminDetails.acc_id)
    console.log('Fetched Admin', this.adminDetails)
   
  }

  // Define the form controls
  initializeForm(): void {
    this.policecasesForm = this.fb.group({
      reportID: ['', Validators.required],
      type: ['', Validators.required],
      complainant: ['', Validators.required],
      dateReceived: ['', Validators.required],
      reportBody: ['', Validators.required],
      citizen_id: ['', Validators.required],
      reportSubCategoryID: ['', Validators.required],
      locationID: [''], // Optional field
      stationID: ['', Validators.required],
      crimeID: [''], // Optional field
      reported_date: ['', Validators.required],
      incidentDate: [''], // Optional field
      blotterNum: ['', Validators.required],
      hasAccount: [true],
      eSignature: ['', Validators.required], // Assuming eSignature is a string or file
      rankID: ['', Validators.required], // Rank field added
      personID: ['', Validators.required], // Person field added
      reportSubCategory: ['', Validators.required],
      subcategory_name: ['', Validators.required],
      status: ['', Validators.required],
      is_spam: ['', Validators.required],
      color: ['', Validators.required],
    });
  }

  // Get the officer's station ID from the logged-in account
  // getOfficerStationId(): void {
  //   // Assuming the officer's details are stored in localStorage after login
  //   const officerDetails = JSON.parse(localStorage.getItem('officer_details') || '{}');
  //   this.stationID = officerDetails.stationId || null;

  //   if (this.stationID) {
  //     this.fetchReports(this.stationID); // Fetch reports using the station ID
  //   } else {
  //     this.errorMessage = 'Station ID not found.';
  //   }
  // }

  // // Fetch reports from the backend service
  // fetchReports(stationId: string): void {
  //   this.isLoading = true;  // Set loading state to true
  //   this.caseQueueService.getReports(Number(stationId)).subscribe(
  //     (response) => {
  //       if (Array.isArray(response)) {
  //         this.reports = response as IReport[];
  //         console.log('Fetched reports:', this.reports);
  //       } else {
  //         this.errorMessage = 'Unexpected response from server.';
  //       }
  //       this.isLoading = false;
  //     },
  //     (error) => {
  //       console.error('Error fetching reports:', error);
  //       this.errorMessage = 'Failed to load reports. Please try again.';
  //       this.isLoading = false;
  //     }
  //   );
  // }

  updateDateTime(): void {
    const now = new Date();
    this.currentDate = now.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    this.currentTime = now.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: true // Use 12-hour format
    });
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId); // Clear the interval when the component is destroyed
    }
  }
  
  filterReports() {
    if (!this.searchQuery) {
      this.filteredReports = this.reports;
      return;
    }

    const query = this.searchQuery.toLowerCase();

    this.filteredReports = this.reports.filter((report) => {
      const reportIdMatch = report.report_id
        .toString()
        .toLowerCase()
        .includes(query);
        const nameMatch = this.getCitizenName(report.citizen_id)
        .toLowerCase()
        .includes(query);
      const incidentNameMatch = report.subcategory_name
        .toLowerCase()
        .includes(query);
     

      return reportIdMatch  || nameMatch || incidentNameMatch;
    });
  }

  isFieldMatched(fieldValue: any, query: string): boolean {
    if (!query) return false;
    const fieldStr = fieldValue ? fieldValue.toString().toLowerCase() : '';
    return fieldStr.includes(query.toLowerCase());
  }

  highlight(fieldValue: any): string {
    if (!this.searchQuery) return fieldValue;
    const fieldStr = fieldValue ? fieldValue.toString() : '';
    const regex = new RegExp(`(${this.searchQuery})`, 'gi');
    return fieldStr.replace(regex, '<mark>$1</mark>');
  }

  isRowMatched(report: any): boolean {
    if (!this.searchQuery) return false;
    const query = this.searchQuery.toLowerCase().trim();
    return Object.values(report).some((value) =>
      value?.toString().toLowerCase().includes(query)
    );
  }

  // fetchnationwideReports(): void {
  //   this.isLoading = true;  // Set loading state to true
  //   this.caseQueueService.getNationwideReports().subscribe(
  //     (response) => {
  //       if (Array.isArray(response)) {
  //       this.reports = response;

  //         console.log('Fetched reports:', response);
  //         this.reports.forEach((report: { citizen_id: any; }) => {
  //           // console.log(report.citizen_id);
  //           this.citizenId = report.citizen_id
  //         });

  //       } else {
  //         this.errorMessage = 'Unexpected response from server.';
  //       }
  //       this.isLoading = false;
  //     },
  //     (error) => {
  //       console.error('Error fetching reports:', error);
  //       this.errorMessage = 'Failed to load reports. Please try again.';
  //       this.isLoading = false;
  //     }
  //   );
  // }

  // Fetch stations
  fetchStations(): void {
    this.jurisdictionService.getAll().subscribe(
      (response: IStation[]) => {
        this.stations = response;
      },
      (error) => {
        console.error('Error fetching stations:', error);
        this.errorMessage = 'Failed to load stations. Please try again.';
      }
    );
  }

  fetchCitizens(): void {
    this.caseQueueService.getCitizens().subscribe(
      (response) => {
        this.citizens = response;
        // localStorage.setItem('citizens', JSON.stringify(this.citizens));
        console.log('Fetched citizens:', this.citizens);
      },
      (error) => {
        console.error('Error fetching citizens:', error);
        this.errorMessage = 'Failed to load citizens. Please try again.';
      }
    );
  }

  getCitizenName(citizenId: number): string {
    const citizen = this.citizens.find((c: any) => c.citizen_id === citizenId);
    return citizen ? `${citizen.firstname} ${citizen.lastname}` : 'Unknown';
  }

  // Fetch ranks
  fetchRanks(): void {
    this.policeAccountsService.getRanks().subscribe(
      (response: IRank[]) => {
        this.ranks = response;
      },
      (error) => {
        console.error('Error fetching ranks:', error);
        this.errorMessage = 'Failed to load ranks. Please try again.';
      }
    );
  }

  // Fetch persons
  fetchPersons(): void {
    this.personService.getPersons().subscribe(
      (response) => {
        this.persons = response;
        localStorage.setItem('persons', JSON.stringify(this.persons));
        console.log('Fetched persons', this.persons);
       
      },
      (error) => {
        console.error('Error fetching persons:', error);
        this.errorMessage = 'Failed to load persons. Please try again.';
      }
    );
  }

  fetchAccounts(): void {
    this.accountService.getAccount().subscribe(
      (response) => {
        this.accounts = response;
        localStorage.setItem('accounts', JSON.stringify(response));
        console.log('Fetched Accounts', this.accounts);
       
      },
      (error) => {
        console.error('Error fetching persons:', error);
        this.errorMessage = 'Failed to load persons. Please try again.';
      }
    );
  }

  loadUserProfile() {
    const userData = localStorage.getItem('userData');
    console.log('USER DATA SESSION', userData);
    if (userData) {
      try {
        const parsedData = JSON.parse(userData);
        this.personId = parsedData.personId;
        this.policeAccountsService.getPoliceByPersonId(this.personId).subscribe(
          (response) => {
            this.policePersonData = response;
            console.log('Fetched Police Person Data', this.policePersonData);
            console.log('Police ID:', this.policePersonData.police_id);
          },
          (error) => {
            console.error('Errod Police Person Data', error);
          }
        );

        console.log('Person ID', this.personId);
      } catch {
        console.error('Error fetching localStorage');
      }
    }
  }


  fetchAdminData(accountID: number) {
    this.policedashbordService.getAdmin(accountID).subscribe(
      (res) => {
        const adminData = res.find((p) => p.acc_id === accountID);
        this.adminData = adminData;
        localStorage.setItem('adminDetails', JSON.stringify(adminData));
        if (adminData) {

          console.log('Found admin data:', adminData);

        } else {
          console.error('Police ID not found in all admin data');
        }
      },
      (error) => {
        console.error('Error Fetching All Admin Data:', error);
      }
    );
  }

<<<<<<< HEAD
  fetchCases(stationId) {
    this.caseQueueService.fetchCasesPage(stationId, this.currentPage, this.pageSize).subscribe(
=======
  fetchCases() {
    this.caseService.getAllCases().subscribe(
>>>>>>> bfb0cd8c1589b2f7fbfcf71e73a92c17c66b37cc
      (response) => {
        
          this.cases = response;
       
        console.log(`List of Cases Nationwide`, this.cases);
        localStorage.setItem('cases', JSON.stringify(this.cases))
      },
      (error) => {
        console.error('Error fetching cases:', error);
        this.errorMessage = 'Failed to load cases. Please try again.';
      }
    );
  }


  //   navigateToReportEndorse(reportIndex: number): void {
  //     const citizenId = this.reports[reportIndex]?.citizen_id;
  //     this.router.navigate(['/report-endorse'], { state: { citizenId } });
  // }

  navigateToReportEndorse(reportId: number): void {
    if (reportId) {
      console.log('Navigating with Report ID:', reportId);
      this.router.navigate(['/report-endorse'], {
        queryParams: { reportID: reportId },
      });
    } else {
      console.error('report ID not found for the selected report.');
      alert('Invalid report id. Please select a valid report.');
    }
  }

  goBack(): void {
    this.router.navigate(['/manage-police']);
  }

  clearSession() {
    sessionStorage.removeItem('userData');
    sessionStorage.removeItem('citizenId');
    localStorage.removeItem('sessionData');
    localStorage.clear();
    sessionStorage.clear();
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


}
