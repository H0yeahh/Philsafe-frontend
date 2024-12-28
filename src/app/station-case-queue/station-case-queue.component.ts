import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CaseQueueService } from '../case-queue.service';
import { Router } from '@angular/router';
import { IReport } from '../case.service';
import { IStation, JurisdictionService } from '../jurisdiction.service';
import { IPerson, IRank, PoliceAccountsService } from '../police-accounts.service';
import { PersonService } from '../person.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-station-case-queue',
  templateUrl: './station-case-queue.component.html',
  styleUrls: ['./station-case-queue.component.css']
})
export class StationCaseQueueComponent implements OnInit {
  reportsForm!: FormGroup;  // Form group for report submission
  isLoading = false;
  successMessage: string | null = null;
  errorMessage: string | null = null;
  //reports: IReport[] = [];  // Array to hold fetched reports`3
  reports: any;
  
  stations: IStation[] = [];
  persons: IPerson[] = [];
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

  constructor(
    private fb: FormBuilder,
    private caseQueueService: CaseQueueService,
    private jurisdictionService: JurisdictionService,
    private policeAccountsService: PoliceAccountsService,
    private personService: PersonService,
    private router: Router,
    private http: HttpClient
  ) {}

  // Initialize the form and fetch reports, stations, and ranks
  ngOnInit(): void {
    this.initializeForm();
    //this.getOfficerStationId(); // Fetch officer's station ID on init
    this.fetchRanks();
    this.fetchStations();
    this.fetchPersons();
    this.fetchnationwideReports();
    //this.fetchReport();
    this.fetchCitizens();
    this.filteredReports = this.reports;
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
      locationID: [''],  // Optional field
      stationID: ['', Validators.required],
      crimeID: [''],  // Optional field
      reported_date: ['', Validators.required],
      incidentDate: [''],  // Optional field
      blotterNum: ['', Validators.required],
      hasAccount: [true],
      eSignature: ['', Validators.required],  // Assuming eSignature is a string or file
      rankID: ['', Validators.required],  // Rank field added
      personID: ['', Validators.required],  // Person field added
      reportSubCategory: ['', Validators.required],
      subcategory_name:['', Validators.required], 
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
      const reportIdMatch = report.report_id.toString().toLowerCase().includes(query);
      const citizenIdMatch = report.citizen_id.toString().toLowerCase().includes(query);
      const nameMatch = this.getCitizenName(report.citizen_id)
        .toLowerCase()
        .includes(query);
  
      return reportIdMatch || citizenIdMatch || nameMatch;
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
  
  fetchnationwideReports(): void {
    this.isLoading = true;  // Set loading state to true
    this.caseQueueService.getNationwideReports().subscribe(
      (response) => {
        if (Array.isArray(response)) {
        this.reports = response;
      
          console.log('Fetched reports:', response);
          this.reports.forEach((report: { citizen_id: any; }) => {
            // console.log(report.citizen_id);
            this.citizenId = report.citizen_id
          });

         
        } else {
          this.errorMessage = 'Unexpected response from server.';
        }
        this.isLoading = false;
      },
      (error) => {
        console.error('Error fetching reports:', error);
        this.errorMessage = 'Failed to load reports. Please try again.';
        this.isLoading = false;
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
        console.log('Fetched citizens:', response);
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
    this.personService.getAll().subscribe(
      (response: IPerson[]) => {
        this.persons = response;
      },
      (error) => {
        console.error('Error fetching persons:', error);
        this.errorMessage = 'Failed to load persons. Please try again.';
      }
    );
  }

  // Submit the form
  onSubmit(): void {
    if (this.reportsForm.invalid) {
      alert('Please fill all required fields correctly.');
      return;
    }

    this.isLoading = true;
    const formData = this.reportsForm.value;

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
      report_id: 0,  // This will be set by the server
      type: formData.type,
      complainant: formData.complainant,
      reported_date: formData.reported_date,
      ReportBody: formData.reportBody, // Use reportBody from form
      subcategory_name:formData.subcategory_name,
      reportSubCategory: formData.reportSubCategory,
      ReportSubCategoryId: formData.reportSubCategoryID.toString(),
      DateTimeReportedDate: new Date().toISOString(),
      HasAccount: formData.hasAccount.toString(),
      status: formData.staus,
      is_spam: formData.is_spam,
      color: formData.color
    };

    console.log('Submitting report with data:', report);

    // this.submitReportForm(report);
  }

  
//   navigateToReportEndorse(reportIndex: number): void {
//     const citizenId = this.reports[reportIndex]?.citizen_id;
//     this.router.navigate(['/report-endorse'], { state: { citizenId } });
// }


navigateToReportEndorse(citizenId: number): void {
  if (citizenId) {
    console.log('Navigating with Citizen ID:', citizenId);
    this.router.navigate(['/report-endorse'], { queryParams: { citizenID: citizenId } });
  } else {
    console.error('Citizen ID not found for the selected report.');
    alert('Invalid citizen ID. Please select a valid report.');
  }
}


  goBack(): void {
    this.router.navigate(['/manage-police']);
  }
}
