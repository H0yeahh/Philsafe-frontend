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
// import { report } from 'node:process';

@Component({
  selector: 'app-station-case-queue',
  templateUrl: './station-case-queue.component.html',
  styleUrls: ['./station-case-queue.component.css'],
})
export class StationCaseQueueComponent implements OnInit, OnDestroy{
  reportsForm!: FormGroup; // Form group for report submission
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
  pageSize: number = 10;
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
  selectedRemark: string = 'all';


  constructor(
    private fb: FormBuilder,
    private caseQueueService: CaseQueueService,
    private jurisdictionService: JurisdictionService,
    private policeAccountsService: PoliceAccountsService,
    private personService: PersonService,
    private router: Router,
    private http: HttpClient,
    private authService: AuthService,
    private accountService: AccountService
  ) {}

  // Initialize the form and fetch reports, stations, and ranks
  ngOnInit(): void {

    this.updateDateTime();
  setInterval(() => this.updateDateTime(), 60000);
  this.intervalId = setInterval(() => this.updateDateTime(), 1000);
    this.initializeForm();
    //this.getOfficerStationId(); // Fetch officer's station ID on init
    this.fetchRanks();
    this.fetchStations();
 

    // this.fetchnationwideReports();
    //this.fetchReport();
    this.fetchCitizens();
    this.fetchPersons();
    this.fetchAccounts();

    const policeData = localStorage.getItem('policeDetails');
    const stationData = localStorage.getItem('stationDetails');
    const reportsData = localStorage.getItem('reports');
    // const accountData = localStorage.getItem('accounts');
    // const citizenData = localStorage.getItem('citizens');

    // Parse and assign the data if it exists
    if (policeData) {
      this.policeDetails = JSON.parse(policeData);
    }

    if (stationData) {
      this.stationDetails = JSON.parse(stationData);
      this.fetchPageReport(this.stationDetails.station_id)
    }

    if (reportsData) {
      // this.reports = JSON.parse(reportsData);
    
     
      // // this.reports = this.reports.filter((report: any) => report.crime_id === null || report.crime_id === undefined);
    
      // this.reports.sort((b: any, a: any) => {
      //   return new Date(a.reported_date).getTime() - new Date(b.reported_date).getTime();
      // });
    } else {
      console.warn('No reports data found in localStorage');
    }
    

    // if (citizenData) {
    //   this.citizens = JSON.parse(citizenData);
    //   console.log("Citizens:", this.citizens)
    // }

    console.log('Retrieved Police Details:', this.policeDetails);
    console.log('Retrieved Station Details:', this.stationDetails);
    console.log('Retrieved Reports:', this.reports);

    
    this.filteredReports = this.reports;
    localStorage.removeItem('reported-suspect');
    localStorage.removeItem('reported-victim');
    localStorage.removeItem('report-data');


   
  }

  // Define the form controls
  initializeForm(): void {
    this.reportsForm = this.fb.group({
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


  fetchPageReport(stationId: number): void {
    this.currentPage = 1;
    let allReports: any[] = [];
  
    const fetchPage = (pageNumber: number) => {
      this.caseQueueService.getReportsPage(stationId, pageNumber, this.pageSize).subscribe(
        (response) => {
          const reports = Array.isArray(response) ? response : response.data || [];
          allReports = [...allReports, ...reports];
  
      
          if (reports.length < this.pageSize) {
            this.reports = allReports; 
            this.reports.sort((b, a) => {
              return new Date(a.date_committed || a.datetime_committed).getTime() - new Date(b.date_committed || b.datetime_committed).getTime();
            });
            console.log(`Fetched all reports for Station ${stationId}:`, this.reports);
            localStorage.setItem('reports', JSON.stringify(this.reports));
            this.filterReports();
          } else {
            // Otherwise, fetch the next page
            fetchPage(pageNumber + 1);
          }
        },
        (error) => {
          console.error('Error fetching reports:', error);
          this.errorMessage = 'Failed to load all reports. Please try again.';
        }
      );
    };
  
    // Start fetching from the first page
    fetchPage(this.currentPage);
  }

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
  
  // filterReports() {
  //   if (!this.searchQuery) {
  //     this.filteredReports = this.reports;
  //     return;
  //   }

  //   const query = this.searchQuery.toLowerCase();

  //   this.filteredReports = this.reports.filter((report) => {
  //     const reportIdMatch = report.report_id
  //       .toString()
  //       .toLowerCase()
  //       .includes(query);
  //       const nameMatch = this.getCitizenName(report.citizen_id)
  //       .toLowerCase()
  //       .includes(query);
  //     const incidentNameMatch = report.subcategory_name
  //       .toLowerCase()
  //       .includes(query);
     

  //     return reportIdMatch  || nameMatch || incidentNameMatch;
  //   });
  // }

  filterReportsByRemark() {
    if (this.selectedRemark === 'disabled') {
      return;
    }
  
    
    console.log('Filtering reports by remark:', this.selectedRemark);
  
    if (this.selectedRemark === 'all') {
     
      this.filteredReports = [...this.reports];
    } else {
     
      this.filteredReports = this.reports.filter(
        report =>
          (this.selectedRemark === 'forEndorse' && !report.is_spam) ||
          (this.selectedRemark === 'markedAsSpam' && report.is_spam)
      );
    }
  }
  

  filterReports() {
    this.filteredReports = this.reports.filter(report =>
      (this.selectedRemark === 'all' || 
       (this.selectedRemark === 'forEndorse' && !report.is_spam) ||
       (this.selectedRemark === 'markedAsSpam' && report.is_spam)) &&
      (
        this.isFieldMatched(report.report_id, this.searchQuery) ||
        this.isFieldMatched(this.getCitizenName(report.citizen_id), this.searchQuery) ||
        this.isFieldMatched(report.subcategory_name, this.searchQuery)
      )
    );
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
        localStorage.setItem('citizens', JSON.stringify(this.citizens));
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

  

  deleteReport(reportId: number) {
    const userConfirmed = window.confirm(`Please be informed that this report can no longer be retrieved. Are you sure you want to permanently delete the report?`);
  
    if (userConfirmed) {
      this.caseQueueService.spamReport(reportId).subscribe(
        () => {
          alert(`Report ${reportId} has been successfully deleted.`);
          window.location.reload(); 
          this.reports = this.reports.filter(report => report.report_id !== reportId);
        }
      );
    } else {
      console.log('Officer deletion was canceled');
    }
  }

}
