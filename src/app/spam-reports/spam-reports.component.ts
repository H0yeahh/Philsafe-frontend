import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CaseQueueService } from '../case-queue.service';
import { Router } from '@angular/router';
import { CaseService, IReport } from '../case.service';
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
import { catchError, forkJoin, map, Observable, Subscription, tap, throwError } from 'rxjs';
import { PoliceDashbordService } from '../police-dashbord.service';
import { environment } from '../environment';

@Component({
  selector: 'app-spam-reports',
  templateUrl: './spam-reports.component.html',
  styleUrl: './spam-reports.component.css'
})
export class SpamReportsComponent implements OnInit {
  spamreportsForm!: FormGroup; // Form group for report submission
  isLoading = false;
  successMessage: string | null = null;
  errorMessage: string | null = null;
  reports: IReport[] = [];  // Array to hold fetched reports`3
  // reports: any;
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
  adminData: any;
  adminDetails: any;
  // personId: any;
  policePersonData: any;
  reportSubscription: Subscription | undefined;
  // filteredReports: IReport[] = [];



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
    private caseService: CaseService,
  private policeDashbordService: PoliceDashbordService,
  ) {}

  // Initialize the form and fetch reports, stations, and ranks
  ngOnInit(): void {
    this.initializeForm();
    //this.getOfficerStationId(); // Fetch officer's station ID on init
    this.fetchRanks();
    this.fetchStations();
 

    // this.fetchnationwideReports();
    // this.fetchReports();
    this.fetchCitizens();
    this.fetchPersons();
    this.fetchAccounts();
    this.fetchSpammedReports();
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
    }

    if (reportsData) {
      const allReports = JSON.parse(reportsData);
    
      // Filter out spam reports
      const nonSpamReports = allReports.filter(report => !report.is_spam);
    
      // Assign the filtered reports to this.reports and sort them by reported_date
      this.reports = nonSpamReports.sort((a, b) => {
        return new Date(b.reported_date).getTime() - new Date(a.reported_date).getTime();
      });
    
      console.log('Reports with no spam', this.reports);
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

    const userData = localStorage.getItem('userData');
    this.adminDetails = JSON.parse(userData);
    this.fetchAdminData(this.adminDetails.acc_id)
    console.log('Fetched Admin', this.adminDetails)
    
   
  }

  // Define the form controls
  initializeForm(): void {
    this.spamreportsForm = this.fb.group({
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
            // this.fetchPoliceData(this.policePersonData.police_id);
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

  fetchSpammedReports(): void {
    this.caseService.getAllSpamReports().subscribe(
      (response: IReport[]) => {
        this.reports = response;
      },
      (error) => {
        console.error('Error fetching reports:', error);
        this.errorMessage = 'Failed to load reports. Please try again.';
      }
    );
  }

  fetchAdminData(accountID: number) {
    this.policeDashbordService.getAdmin(accountID).subscribe(
      (res) => {
        // Find the matching police data by policeId
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

  // fetchAccounts(): Observable<any> {
  //     return this.accountService.getAccount().pipe(
  //       tap((response) => {
  //         this.accounts = response;
  //         console.log('Fetched Accounts', this.accounts)
  //         localStorage.setItem('accounts', JSON.stringify(response));
  //         this.tryFetchProfilePics();
  //       })
  //     );
  //   }

  // Submit the form
  onSubmit(): void {
    if (this.spamreportsForm.invalid) {
      alert('Please fill all required fields correctly.');
      return;
    }

    this.isLoading = true;
    const formData = this.spamreportsForm.value;

    const report: IReport = {
      reportBody: formData.reportBody,
      citizen_id: formData.citizenID,
      reportSubCategoryID: formData.reportSubCategoryID,
      locationID: formData.locationID || null, // Handle optional fields
      stationID: formData.stationID,
      crimeID: formData.crimeID || null, // Handle optional fields
      // reportedDate: formData.reportedDate,
      incidentDate: formData.incidentDate || null, // Handle optional fields
      blotterNum: formData.blotterNum,
      hasAccount: formData.hasAccount,
      eSignature: formData.eSignature,
      report_id: 0, // This will be set by the server
      type: formData.type,
      complainant: formData.complainant,
      reported_date: formData.reported_date,
      ReportBody: formData.reportBody, // Use reportBody from form
      subcategory_name: formData.subcategory_name,
      reportSubCategory: formData.reportSubCategory,
      ReportSubCategoryId: formData.reportSubCategoryID.toString(),
      DateTimeReportedDate: new Date().toISOString(),
      HasAccount: formData.hasAccount.toString(),
      status: formData.staus,
      is_spam: formData.is_spam,
      color: formData.color,
    };

    console.log('Submitting report with data:', report);

    // this.submitReportForm(report);
  }

  //   navigateToReportEndorse(reportIndex: number): void {
  //     const citizenId = this.reports[reportIndex]?.citizen_id;
  //     this.router.navigate(['/report-endorse'], { state: { citizenId } });
  // }


  activateReport(repId: number): void {
    if (confirm('Are you sure you want to activate this report?')) {
      //const apiUrl = (`${environment.ipAddUrl}api/report/retrieve/archivedReports`);
      const apiUrl = (`${environment.ipAddUrl}api/report/updatespam/${repId}`);
      this.http.put(apiUrl, {}).subscribe(
        () => {
          this.successMessage = 'Report was activated successfully.';
          this.reports = this.reports.filter((r) => r.report_id !== repId);
          this.filteredReports = this.filteredReports.filter((reports) => reports.repId !== repId);
        },
        (error) => {
          console.error('Error activating the report:', error);
          this.errorMessage = 'Failed to activate the report. Please try again.';
        }
      );
    }
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


}