// import { Component, OnInit } from '@angular/core';
// import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { CaseQueueService } from '../case-queue.service';
// import { Router } from '@angular/router';
// import { IReport } from '../case.service';
// import { IStation, JurisdictionService } from '../jurisdiction.service';
// import { IPerson, IRank, PoliceAccountsService } from '../police-accounts.service';
// import { PersonService } from '../person.service';
// // import { CreateCaseService, ICase } from '../create-case.service';
// import { CreateCasesService, ICase } from '../create-cases.service';
// import { PoliceDashbordService } from '../police-dashbord.service';
// import { AuthService } from '../auth.service';
// import { Subscription } from 'rxjs';


// @Component({
//   selector: 'app-police-cases',
//   templateUrl: './police-cases.component.html',
//   styleUrl: './police-cases.component.css'
// })
// export class PoliceCasesComponent implements OnInit {
//   policecaseForm!: FormGroup;  // Form group for report submission
//   isLoading = false;
//   successMessage: string | null = null;
//   errorMessage: string | null = null;
//   reports: any;  // Array to hold fetched reports
//   stations: IStation[] = [];
//   persons: IPerson[] = [];
//   ranks: IRank[] = [];
//   case: ICase[] = [];
//   adminData: any;
//   adminDetails: any;
//   personId: any;
//   policePersonData: any;
//   reportSubscription: Subscription | undefined;
//   stationID: string | null = null;

//   constructor(
//     private fb: FormBuilder,
//     private caseQueueService: CaseQueueService,
//     private jurisdictionService: JurisdictionService,
//     private policeAccountsService: PoliceAccountsService,
//     private personService: PersonService,
//     // private createCaseService: CreateCaseService,
//     private createCasesService: CreateCasesService,
//     private router: Router,
//     private policeDashbordService: PoliceDashbordService,
//     private authService: AuthService,

//   ) {}

//   // Initialize the form and fetch reports, stations, and ranks
//   ngOnInit(): void {
//     this.initializeForm();
//     this.getOfficerStationId(); // Fetch officer's station ID on init
//     this.fetchRanks();
//     this.fetchStations();
//     this.fetchPersons();
//     this.fetchnationwideReports();
//     this.fetchnationwideCase();


//     const userData = localStorage.getItem('userData');
//     this.adminDetails = JSON.parse(userData);
//     this.fetchAdminData(this.adminDetails.acc_id)
//     console.log('Fetched Admin', this.adminDetails)

//     // this.onSelect();
//     // console.log('Initial form value:', this.timePeriodControl.value);
//     // console.log('Form valid:', this.policedashboardForm.valid);

//   }

//   // Define the form controls
//   initializeForm(): void {
//     this.policecaseForm = this.fb.group({
//       title: ['', Validators.required], 
//       offenseType: ['', Validators.required], 
//       citeNumber: ['', Validators.required], 
//       datetimeReported: ['', Validators.required], 
//       datetimeCommitted: ['', Validators.required], 
//       description: ['', Validators.required], 
//       status: ['', Validators.required], 
//       incidenttypeId: ['', Validators.required], 
//       datetimeCreated: ['', Validators.required], 
//       lastModified: ['', Validators.required], 
//       createdBy: ['', Validators.required], 
//       modifiedBy: ['', Validators.required], 
//       locationId: ['', Validators.required], 
//       stationId: ['', Validators.required], 
//       victim_id_list: ['', Validators.required], 
//       suspect_id_list: ['', Validators.required], 
//       police_id_list: ['', Validators.required], 
//     });
//   }

//   // Get the officer's station ID from the logged-in account
//   getOfficerStationId(): void {
//     // Assuming the officer's details are stored in localStorage after login
//     const officerDetails = JSON.parse(localStorage.getItem('officer_details') || '{}');
//     this.stationID = officerDetails.stationId || null;

//     if (this.stationID) {
//       this.fetchReports(this.stationID); // Fetch reports using the station ID
//     } else {
//       this.errorMessage = 'Station ID not found.';
//     }
//   }

//   loadUserProfile() {
//     const userData = localStorage.getItem('userData');
//     console.log('USER DATA SESSION', userData);
//     if (userData) {
//       try {
//         const parsedData = JSON.parse(userData);
//         this.personId = parsedData.personId;
//         this.policeAccountsService.getPoliceByPersonId(this.personId).subscribe(
//           (response) => {
//             this.policePersonData = response;
//             console.log('Fetched Police Person Data', this.policePersonData);
//             // this.fetchPoliceData(this.policePersonData.police_id);
//             console.log('Police ID:', this.policePersonData.police_id);
//           },
//           (error) => {
//             console.error('Errod Police Person Data', error);
//           }
//         );

//         console.log('Person ID', this.personId);
//       } catch {
//         console.error('Error fetching localStorage');
//       }
//     }
//   }

//   fetchAdminData(accountID: number) {
//     this.policeDashbordService.getAdmin(accountID).subscribe(
//       (res) => {
//         // Find the matching police data by policeId
//         const adminData = res.find((p) => p.acc_id === accountID);
//         this.adminData = adminData;
//         localStorage.setItem('adminDetails', JSON.stringify(adminData));
//         if (adminData) {

//           console.log('Found admin data:', adminData);

//         } else {
//           console.error('Police ID not found in all admin data');
//         }
//       },
//       (error) => {
//         console.error('Error Fetching All Admin Data:', error);
//       }
//     );
//   }

//   // Fetch reports from the backend service
//   fetchReports(stationId: string): void {
//     this.isLoading = true;  // Set loading state to true
//     this.caseQueueService.getReports(Number(stationId)).subscribe(
//       (response) => {
//         if (Array.isArray(response)) {
//           this.reports = response;
//           console.log('Fetched reports:', this.reports);
//         } else {
//           this.errorMessage = 'Unexpected response from server.';
//         }
//         this.isLoading = false;
//       },
//       (error) => {
//         console.error('Error fetching reports:', error);
//         this.errorMessage = 'Failed to load reports. Please try again.';
//         this.isLoading = false;
//       }
//     );
//   }

//   fetchnationwideReports(): void {
//     this.isLoading = true;  // Set loading state to true
//     this.caseQueueService.getNationwideReports().subscribe(
//       (response) => {
//         if (Array.isArray(response)) {
//           this.reports = response;
//           console.log('Fetched reports:', this.reports);
//         } else {
//           this.errorMessage = 'Unexpected response from server.';
//         }
//         this.isLoading = false;
//       },
//       (error) => {
//         console.error('Error fetching reports:', error);
//         this.errorMessage = 'Failed to load reports. Please try again.';
//         this.isLoading = false;
//       }
//     );
//   }

//   fetchnationwideCase(): void {
//     this.isLoading = true;  // Set loading state to true
//     this.createCasesService.getNationwideCase().subscribe(
//       (response) => {
//         if (Array.isArray(response)) {
//           this.case = response as ICase[];
//           console.log('Fetched case:', this.case);
//         } else {
//           this.errorMessage = 'Unexpected response from server.';
//         }
//         this.isLoading = false;
//       },
//       (error) => {
//         console.error('Error fetching case:', error);
//         this.errorMessage = 'Failed to load case. Please try again.';
//         this.isLoading = false;
//       }
//     );
//   }


//   // Fetch stations
//   fetchStations(): void {
//     this.jurisdictionService.getAll().subscribe(
//       (response: IStation[]) => {
//         this.stations = response;
//       },
//       (error) => {
//         console.error('Error fetching stations:', error);
//         this.errorMessage = 'Failed to load stations. Please try again.';
//       }
//     );
//   }

//   // Fetch ranks
//   fetchRanks(): void {
//     this.policeAccountsService.getRanks().subscribe(
//       (response: IRank[]) => {
//         this.ranks = response;
//       },
//       (error) => {
//         console.error('Error fetching ranks:', error);
//         this.errorMessage = 'Failed to load ranks. Please try again.';
//       }
//     );
//   }

//   // Fetch persons
//   fetchPersons(): void {
//     this.personService.getAll().subscribe(
//       (response: IPerson[]) => {
//         this.persons = response;
//       },
//       (error) => {
//         console.error('Error fetching persons:', error);
//         this.errorMessage = 'Failed to load persons. Please try again.';
//       }
//     );
//   }

//   // Submit the form
//   onSubmit(): void {
//     if (this.policecaseForm.invalid) {
//       alert('Please fill all required fields correctly.');
//       return;
//     }

//     this.isLoading = true;
//     const formData = this.policecaseForm.value;

//     const cases: ICase = {
//       title: formData.title,
//       offenseType: formData.offenseType,
//       citeNumber: formData.citeNumber,
//       datetimeReported: new Date().toISOString(),
//       datetimeCommitted: new Date().toISOString(),
//       description: formData.description,
//       status: formData.status,
//       incidenttypeId: formData.incidenttypeId.toSting(),
//       datetimeCreated: new Date().toISOString(),
//       lastModified: formData.lastModified,
//       createdBy: formData.createdBy,
//       modifiedBy: formData.modifiedBy,
//       locationId: formData.locationId || null,
//       stationId: formData.stationId,
//       victim_id_list: formData.victim_id_list,
//       suspect_id_list: formData.suspect_id_list,
//       police_id_list: formData.police_id_list,
//     };

//     console.log('Submitting case with data:', cases);

//     // this.submitReportForm(report);
//   }

//   // Submit the form data to the service
//   // submitReportForm(report: IReport): void {
//   //   this.caseQueueService.submitReport(report).subscribe(
//   //     (response: any) => {
//   //       this.isLoading = false;
//   //       this.successMessage = 'Report submitted successfully!';
//   //       this.errorMessage = null;
//   //       this.casesForm.reset();  // Clear the form after successful submission
//   //       this.router.navigate(['/station-case-queue']);  // Redirect
//   //     },
//   //     (error) => {
//   //       this.isLoading = false;
//   //       console.error('Error during report submission:', error);
//   //       this.errorMessage = 'Submission failed. Please try again.';
//   //     }
//   //   );
//   // }

//   goBack(): void {
//     this.router.navigate(['/manage-police']);
//   }


//   logout() {
//     this.authService.logout().subscribe(
//       (response) => {
//         console.log('Signed out successfully:', response);
//         this.clearSession();
//         localStorage.setItem('authenticated', '0');
//         this.router.navigate(['/login']);
//       },
//       (error) => {
//         console.error('Error during sign out:', error);
//       }
//     );
//   }

//   clearSession() {
//     sessionStorage.removeItem('userData');
//     sessionStorage.removeItem('citizenId');
//     localStorage.removeItem('sessionData');
//     localStorage.clear();
//     sessionStorage.clear();
//   }

//   ngOnDestroy(): void {
//     if (this.reportSubscription) {
//       this.reportSubscription.unsubscribe();
//     }
//   }
// }






import { Component } from '@angular/core';
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
import { PoliceDashbordService } from '../police-dashbord.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-police-cases',
  templateUrl: './police-cases.component.html',
  styleUrl: './police-cases.component.css'
})
export class PoliceCasesComponent {



  isLoading = false;
  successMessage: string | null = null;
  errorMessage: string | null = null;
  //reports: IReport[] = [];  // Array to hold fetched reports`3
  reports: any;

  stations: IStation[] = [];
  persons: IPerson[] = [];
  ranks: IRank[] = [];

  stationID: number = 0;
  citizenId: number = 0;
  fetch_Report: any;
  citizens: any;
  policeDetails: any;
  stationDetails: any;
  personData: any = {};
  accountData: any = {};
  cases: any;
  currentPage: number = 1;
  pageSize: number = 10;
  totalCases: number = 0;
  filteredCases: any[] = [];
  searchQuery = '';
  adminData: any;
  adminDetails: any;
  personId: any;
  policePersonData: any;
  reportSubscription: Subscription | undefined;


  constructor(
    private fb: FormBuilder,
    private caseQueueService: CaseQueueService,
    private jurisdictionService: JurisdictionService,
    private policeAccountsService: PoliceAccountsService,
    private personService: PersonService,
    private router: Router,
    private http: HttpClient,
    private authService: AuthService,
    private policeDashbordService: PoliceDashbordService,
  ) { }

  // Initialize the form and fetch reports, stations, and ranks
  ngOnInit(): void {

    const storedStationDetails = localStorage.getItem('stationDetails');
    if (storedStationDetails) {
      try {
        this.stationDetails = JSON.parse(storedStationDetails);
        this.stationID = this.stationDetails.station_id || 0;
        console.log('Station ID:', this.stationID);

        // Fetch reports after setting stationID
        if (this.stationID !== 0) {
          this.fetchCases(this.stationID);
        }
      } catch (error) {
        console.error('Error parsing stationDetails:', error);
      }
    } else {
      console.warn('No stationDetails found in localStorage.');
    }

    const userData = localStorage.getItem('userData');
    this.adminDetails = JSON.parse(userData);
    this.fetchAdminData(this.adminDetails.acc_id)
    console.log('Fetched Admin', this.adminDetails)
  }


  // filterCases() {
  //   if (!this.searchQuery) {
  //     this.filteredCases = this.cases;
  //     return;
  //   }

  //   const query = this.searchQuery.toLowerCase();

  //   this.filteredCases = this.cases.filter((crime) => {
  //     const crimeIdMatch = crime.crime_id.toString().toLowerCase().includes(query);
  //     const citeNumMatch = crime.cite_number.toString().toLowerCase().includes(query);
  //     const statusMatch = crime.status.toLowerCase().includes(query);
  //     const incidentNameMatch = crime.incident_type 
  //     ? crime.incident_type.toString().toLowerCase().includes(query) 
  //     : false;



  //     return crimeIdMatch || citeNumMatch || incidentNameMatch || statusMatch;
  //   });
  // }

  filterCases() {
    if (!this.searchQuery) {
      this.filteredCases = this.cases;
      return;
    }

    const query = this.searchQuery.toLowerCase();

    this.filteredCases = this.cases.filter((crime) => {
      const crimeIdMatch = crime.crime_id?.toString().toLowerCase().includes(query);
      const citeNumMatch = crime.cite_number?.toString().toLowerCase().includes(query);
      const incidentNameMatch = crime.incident_type
        ? crime.incident_type.toString().toLowerCase().includes(query)
        : false;
      const statusMatch = crime.status?.toLowerCase().includes(query);

      return crimeIdMatch || citeNumMatch || incidentNameMatch || statusMatch;
    });
  }


  isFieldMatched(fieldValue: any, query: string): boolean {
    if (!query) return false;
    const fieldStr = fieldValue ? fieldValue.toString().toLowerCase() : '';
    return fieldStr.includes(query.toLowerCase());
  }

  highlight(fieldValue: any): string {
    if (!this.searchQuery) return fieldValue || '';
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

  fetchCases(stationId) {
    this.caseQueueService.fetchCases(stationId).subscribe(
      (response) => {
        if (Array.isArray(response)) {
          this.cases = response;
        } else {
          this.cases = response.data || [];
          this.totalCases = this.cases.length;
        }
        console.log("Station ID", stationId);
        console.log(`List of Cases in Station ${stationId}`, this.cases);
        localStorage.setItem('cases', JSON.stringify(this.cases))
      },
      (error) => {
        console.error('Error fetching cases:', error);
        this.errorMessage = 'Failed to load cases. Please try again.';
      }
    );
  }

  pagedCases(): any[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return this.cases.slice(startIndex, startIndex + this.pageSize);
  }


  navigateToReportEndorse(citizenId: number): void {
    if (citizenId) {
      console.log('Navigating with Citizen ID:', citizenId);
      this.router.navigate(['/report-endorse'], {
        queryParams: { citizenID: citizenId },
      });
    } else {
      console.error('Citizen ID not found for the selected report.');
      alert('Invalid citizen ID. Please select a valid report.');
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

  ngOnDestroy(): void {
    if (this.reportSubscription) {
      this.reportSubscription.unsubscribe();
    }
  }
}
