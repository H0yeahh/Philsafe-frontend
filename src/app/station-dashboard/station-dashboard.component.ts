// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-station-dashboard',
//   templateUrl: './station-dashboard.component.html',
//   styleUrls: ['./station-dashboard.component.css']
// })
// export class StationDashboardComponent {}

// import { Component, OnInit, Inject } from '@angular/core';
// import { StationDashboardService } from '../station-dashboard.service';
// import { Chart } from 'chart.js';

// @Component({
//   selector: 'app-station-dashboard',
//   templateUrl: './station-dashboard.component.html',
//   styleUrls: ['./station-dashboard.component.css'],
//   providers: [StationDashboardService] // Ensure the service is provided
// })
// export class StationDashboardComponent implements OnInit {
//   dailyReports: number = 0;
//   weeklyReports: number = 0;
//   monthlyReports: number = 0;
//   annualReports: number = 0;
//   chart: any;

//   constructor(@Inject(StationDashboardService) private stationDashboardService: StationDashboardService) {}

//   ngOnInit(): void {
//     this.fetchReportData();
//   }

//   fetchReportData(): void {
//     this.stationDashboardService.getReportData().subscribe((data: { dailyReports: number; weeklyReports: number; monthlyReports: number; annualReports: number; chartData: any; }) => {
//       this.dailyReports = data.dailyReports;
//       this.weeklyReports = data.weeklyReports;
//       this.monthlyReports = data.monthlyReports;
//       this.annualReports = data.annualReports;
//       this.createChart(data.chartData);
//     }, (error: any) => {
//       console.error('Error fetching report data:', error);
//     });
//   }

//   createChart(chartData: any): void {
//     if (!chartData || !chartData.labels || !chartData.data) {
//       console.error('Invalid chart data:', chartData);
//       return;
//     }

//     const ctx = document.getElementById('myChart') as HTMLCanvasElement;
//     this.chart = new Chart(ctx, {
//       type: 'bar',
//       data: {
//         labels: chartData.labels,
//         datasets: [{
//           label: 'Reports',
//           data: chartData.data,
//           backgroundColor: 'rgba(75, 192, 192, 0.2)',
//           borderColor: 'rgba(75, 192, 192, 1)',
//           borderWidth: 1
//         }]
//       },
//       options: {
//         scales: {
//           y: {
//             beginAtZero: true
//           }
//         }
//       }
//     });
//   }
// }

// import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
// import { StationDashboardService } from '../station-dashboard.service';
// import { Subscription } from 'rxjs';
// import { Chart } from 'chart.js';
// import { CaseQueueService } from '../case-queue.service';
// import { Router } from '@angular/router';
// import { IReport } from '../case.service';
// import { IStation, JurisdictionService } from '../jurisdiction.service';
// import { IPerson, IRank, PoliceAccountsService } from '../police-accounts.service';
// import { PersonService } from '../person.service';
// // import { FormBuilder } from '@angular/forms';
// import { FormGroup, FormBuilder, Validators } from '@angular/forms';
// import { ReportService } from '../report.service';
// import { CaseService } from '../case.service';

// @Component({
//   selector: 'app-station-dashboard',
//   templateUrl: './station-dashboard.component.html',
//   styleUrls: ['./station-dashboard.component.css'],
//   providers: [StationDashboardService] // Ensure the service is provided
// })
// export class StationDashboardComponent implements OnInit, OnDestroy {
//   dashboardForm!: FormGroup;  // Form group for report submission
//   isLoading = false;
//   successMessage: string | null = null;
//   errorMessage: string | null = null;
//   reports: IReport[] = [];  // Array to hold fetched reports
//   stations: IStation[] = [];
//   persons: IPerson[] = [];
//   ranks: IRank[] = [];
  
//   stationID: string | null = null;
//   dailyReports: number = 0;
//   weeklyReports: number = 0;
//   monthlyReports: number = 0;
//   annualReports: number = 0;
//   chart: any;
//   reportSubscription: Subscription | undefined;

//   constructor(@Inject(StationDashboardService) 
//   private stationDashboardService: StationDashboardService,
//   private fb: FormBuilder,
//     private caseQueueService: CaseQueueService,
//     private jurisdictionService: JurisdictionService,
//     private policeAccountsService: PoliceAccountsService,
//     private personService: PersonService,
//     private reportService: ReportService,
//     private caseService: CaseService,
//     private router: Router
// ) {}

//   ngOnInit(): void {
//     this.fetchReportData();
//     this.getOfficerStationId(); // Fetch officer's station ID on init
//     this.fetchRanks();
//     this.fetchStations();
//     this.fetchPersons();
//     this.fetchnationwideReports();
//   }

//   initializeForm(): void {
//     this.dashboardForm = this.fb.group({
//       reportID: ['', Validators.required],
//       type: ['', Validators.required],
//       complainant: ['', Validators.required],
//       dateReceived: ['', Validators.required],
//       reportBody: ['', Validators.required],
//       citizen_id: ['', Validators.required],
//       reportSubCategoryID: ['', Validators.required],
//       locationID: [''],  // Optional field
//       stationID: ['', Validators.required],
//       crimeID: [''],  // Optional field
//       reported_date: ['', Validators.required],
//       incidentDate: [''],  // Optional field
//       blotterNum: ['', Validators.required],
//       hasAccount: [true],
//       eSignature: ['', Validators.required],  // Assuming eSignature is a string or file
//       rankID: ['', Validators.required],  // Rank field added
//       personID: ['', Validators.required],  // Person field added
//       reportSubCategory: ['', Validators.required],
//       subcategory_name:['', Validators.required], 
//     });
//   }

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

//   // Fetch reports from the backend service
//   fetchReports(stationId: string): void {
//     this.isLoading = true;  // Set loading state to true
//     this.caseQueueService.getReports(Number(stationId)).subscribe(
//       (response) => {
//         if (Array.isArray(response)) {
//           this.reports = response as IReport[];
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
//           this.reports = response as IReport[];
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

//   // Fetch report data using the service
//   fetchReportData(): void {
//     this.reportSubscription = this.stationDashboardService.getReportData(this.dashboardForm.value.timePeriod).subscribe(
//       (data: { dailyReports: number; weeklyReports: number; monthlyReports: number; annualReports: number; chartData: any; }) => {
//         this.dailyReports = data.dailyReports;
//         this.weeklyReports = data.weeklyReports;
//         this.monthlyReports = data.monthlyReports;
//         this.annualReports = data.annualReports;

//         // Create or update the chart with the fetched data
//         this.createChart(data.chartData);
//       },
//       (error: any) => {
//         console.error('Error fetching report data:', error);
//       }
//     );
//   }

//   onRefresh(): void {
//     console.log('Refreshing data for period:', this.dashboardForm.value.timePeriod);
//     this.fetchReportData(); // Re-fetch data when the user clicks refresh
//   }

//   // Method to create or update the Chart.js instance
//   createChart(chartData: any): void {
//     if (!chartData || !chartData.labels || !chartData.data) {
//       console.error('Invalid chart data:', chartData);
//       return;
//     }

//     // Check if a chart instance exists and destroy it before creating a new one
//     if (this.chart) {
//       this.chart.destroy();
//     }

//     const ctx = document.getElementById('myChart') as HTMLCanvasElement;
//     this.chart = new Chart(ctx, {
//       type: 'bar',
//       data: {
//         labels: chartData.labels,
//         datasets: [{
//           label: 'Reports',
//           data: chartData.data,
//           backgroundColor: 'rgba(75, 192, 192, 0.2)',
//           borderColor: 'rgba(75, 192, 192, 1)',
//           borderWidth: 1
//         }]
//       },
//       options: {
//         responsive: true,
//         scales: {
//           y: {
//             beginAtZero: true
//           }
//         }
//       }
//     });
//   }

//   // Clean up subscription to avoid memory leaks
//   ngOnDestroy(): void {
//     if (this.reportSubscription) {
//       this.reportSubscription.unsubscribe();
//     }

//     // Destroy the chart when the component is destroyed
//     if (this.chart) {
//       this.chart.destroy();
//     }
//   }
// }

// import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
// import { StationDashboardService } from '../station-dashboard.service';
// import { Subscription } from 'rxjs';
// import { Chart } from 'chart.js';
// import { CaseQueueService } from '../case-queue.service';
// import { Router } from '@angular/router';
// import { IReport } from '../case.service';
// import { IStation, JurisdictionService } from '../jurisdiction.service';
// import { IPerson, IRank, PoliceAccountsService } from '../police-accounts.service';
// import { PersonService } from '../person.service';
// import { FormGroup, FormBuilder, Validators } from '@angular/forms';
// import { ReportService } from '../report.service';
// import { CaseService } from '../case.service';

// @Component({
//   selector: 'app-station-dashboard',
//   templateUrl: './station-dashboard.component.html',
//   styleUrls: ['./station-dashboard.component.css'],
//   providers: [StationDashboardService] // Ensure the service is provided
// })
// export class StationDashboardComponent implements OnInit, OnDestroy {
//   dashboardForm!: FormGroup;  // Form group for report submission
//   isLoading = false;
//   successMessage: string | null = null;
//   errorMessage: string | null = null;
//   reports: IReport[] = [];  // Array to hold fetched reports
//   stations: IStation[] = [];
//   persons: IPerson[] = [];
//   ranks: IRank[] = [];

//   stationID: string | null = null;
//   dailyReports: number = 0;
//   weeklyReports: number = 0;
//   monthlyReports: number = 0;
//   annualReports: number = 0;
//   chart: any;
//   reportSubscription: Subscription | undefined;

//   // New variables for counting cases
//   totalReportedCases: number = 0;
//   solvedCases: number = 0;
//   underInvestigationCases: number = 0;

//   constructor(
//     @Inject(StationDashboardService) private stationDashboardService: StationDashboardService,
//     private fb: FormBuilder,
//     private caseQueueService: CaseQueueService,
//     private jurisdictionService: JurisdictionService,
//     private policeAccountsService: PoliceAccountsService,
//     private personService: PersonService,
//     private reportService: ReportService,
//     private caseService: CaseService,
//     private router: Router
//   ) {}

//   ngOnInit(): void {
//     this.initializeForm();
//     this.fetchReportData();
//     this.getOfficerStationId(); // Fetch officer's station ID on init
//     this.fetchRanks();
//     this.fetchStations();
//     this.fetchPersons();
//     this.fetchNationwideReports();
//   }

//   initializeForm(): void {
//     this.dashboardForm = this.fb.group({
//       reportID: ['', Validators.required],
//       type: ['', Validators.required],
//       complainant: ['', Validators.required],
//       dateReceived: ['', Validators.required],
//       reportBody: ['', Validators.required],
//       citizen_id: ['', Validators.required],
//       reportSubCategoryID: ['', Validators.required],
//       locationID: [''],  // Optional field
//       stationID: ['', Validators.required],
//       crimeID: [''],  // Optional field
//       reported_date: ['', Validators.required],
//       incidentDate: [''],  // Optional field
//       blotterNum: ['', Validators.required],
//       hasAccount: [true],
//       eSignature: ['', Validators.required],  // Assuming eSignature is a string or file
//       rankID: ['', Validators.required],  // Rank field added
//       personID: ['', Validators.required],  // Person field added
//       reportSubCategory: ['', Validators.required],
//       subcategory_name: ['', Validators.required], 
//     });
//   }

//   getOfficerStationId(): void {
//     const officerDetails = JSON.parse(localStorage.getItem('officer_details') || '{}');
//     this.stationID = officerDetails.stationId || null;
    
//     if (this.stationID) {
//       this.fetchReports(this.stationID); // Fetch reports using the station ID
//     } else {
//       this.errorMessage = 'Station ID not found.';
//     }
//   }

//   fetchReports(stationId: string): void {
//     this.isLoading = true;  // Set loading state to true
//     this.caseQueueService.getReports(Number(stationId)).subscribe(
//       (response) => {
//         if (Array.isArray(response)) {
//           this.reports = response as IReport[];
//           console.log('Fetched reports:', this.reports);
//           this.calculateCaseStats();  // Calculate case statistics
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

//   fetchNationwideReports(): void {
//     this.isLoading = true;  // Set loading state to true
//     this.caseQueueService.getNationwideReports().subscribe(
//       (response) => {
//         if (Array.isArray(response)) {
//           this.reports = response as IReport[];
//           console.log('Fetched nationwide reports:', this.reports);
//           this.calculateCaseStats();  // Calculate case statistics
//         } else {
//           this.errorMessage = 'Unexpected response from server.';
//         }
//         this.isLoading = false;
//       },
//       (error) => {
//         console.error('Error fetching nationwide reports:', error);
//         this.errorMessage = 'Failed to load reports. Please try again.';
//         this.isLoading = false;
//       }
//     );
//   }

//   private calculateCaseStats(): void {
//     this.totalReportedCases = this.reports.length;
//     this.solvedCases = this.reports.filter(report => report.status.trim().toLowerCase() === 'solved').length;
//     this.underInvestigationCases = this.reports.filter(report => report.status.trim().toLowerCase() === 'under investigation').length;

//     // Update the chart with new data
//     this.createChart({
//       labels: ['Reported Cases', 'Solved Cases', 'Under Investigation'],
//       data: [this.totalReportedCases, this.solvedCases, this.underInvestigationCases]
//     });
//   }

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

//   fetchReportData(): void {
//     const stationId = this.stationID ? Number(this.stationID) : 0; // Ensure stationId is a number
//     this.reportSubscription = this.stationDashboardService.getReportData(stationId).subscribe(
//       (data: { dailyReports: number; weeklyReports: number; monthlyReports: number; annualReports: number; chartData: any; }) => {
//         this.dailyReports = data.dailyReports;
//         this.weeklyReports = data.weeklyReports;
//         this.monthlyReports = data.monthlyReports;
//         this.annualReports = data.annualReports;

//         this.createChart(data.chartData); // Create or update the chart
//       },
//       (error: any) => {
//         console.error('Error fetching report data:', error);
//       }
//     );
//   }

//   onRefresh(): void {
//     console.log('Refreshing data for period:', this.dashboardForm.value.timePeriod);
//     this.fetchReportData(); // Re-fetch data when the user clicks refresh
//   }

//   // Create or update the Chart.js instance
//   createChart(chartData: any): void {
//     if (!chartData || !chartData.labels || !chartData.data) {
//       console.error('Invalid chart data:', chartData);
//       return;
//     }

//     if (this.chart) {
//       this.chart.destroy();
//     }

//     const ctx = document.getElementById('myChart') as HTMLCanvasElement;
//     this.chart = new Chart(ctx, {
//       type: 'bar',
//       data: {
//         labels: chartData.labels,
//         datasets: [{
//           label: 'Reports',
//           data: chartData.data,
//           backgroundColor: 'rgba(75, 192, 192, 0.2)',
//           borderColor: 'rgba(75, 192, 192, 1)',
//           borderWidth: 1
//         }]
//       },
//       options: {
//         responsive: true,
//         scales: {
//           y: {
//             beginAtZero: true
//           }
//         }
//       }
//     });
//   }

//   ngOnDestroy(): void {
//     if (this.reportSubscription) {
//       this.reportSubscription.unsubscribe();
//     }

//     if (this.chart) {
//       this.chart.destroy();
//     }
//   }
// }
// import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
// import { StationDashboardService } from '../station-dashboard.service';
// import { Subscription } from 'rxjs';
// import { Chart } from 'chart.js';
// import { FormGroup, FormBuilder, Validators } from '@angular/forms';
// import { IReport } from '../station-dashboard.service';
// import { IStation, JurisdictionService } from '../jurisdiction.service';
// import { IPerson, IRank, PoliceAccountsService } from '../police-accounts.service';
// import { PersonService } from '../person.service';
// import { Router } from '@angular/router';

// @Component({
//   selector: 'app-station-dashboard',
//   templateUrl: './station-dashboard.component.html',
//   styleUrls: ['./station-dashboard.component.css'],
//   providers: [StationDashboardService]  // Provide the service here
// })
// export class StationDashboardComponent implements OnInit, OnDestroy {
//   dashboardForm!: FormGroup;  // Form group for report submission
//   isLoading = false;
//   successMessage: string | null = null;
//   errorMessage: string | null = null;
//   reports: IReport[] = [];  // Array to hold fetched reports
//   stations: IStation[] = [];
//   persons: IPerson[] = [];
//   ranks: IRank[] = [];

//   stationID: string | null = null;
//   dailyReports: number = 0;
//   weeklyReports: number = 0;
//   monthlyReports: number = 0;
//   annualReports: number = 0;
//   chart: any;
//   reportSubscription: Subscription | undefined;

//   // Variables for case statistics
//   totalReportedCases: number = 0;
//   solvedCases: number = 0;
//   underInvestigationCases: number = 0;

//   constructor(
//     @Inject(StationDashboardService) private stationDashboardService: StationDashboardService,
//     private fb: FormBuilder,
//     private jurisdictionService: JurisdictionService,
//     private policeAccountsService: PoliceAccountsService,
//     private personService: PersonService,
//     private router: Router
//   ) {}

//   ngOnInit(): void {
//     this.initializeForm();
//     this.getOfficerStationId();  // Fetch the officer's station ID on init
//     this.fetchRanks();
//     this.fetchStations();
//     this.fetchPersons();
//     this.fetchNationwideReports();  // Ensure nationwide reports are fetched on load
//   }

//   initializeForm(): void {
//     this.dashboardForm = this.fb.group({
//       reportID: ['', Validators.required],
//       type: ['', Validators.required],
//       complainant: ['', Validators.required],
//       dateReceived: ['', Validators.required],
//       reportBody: ['', Validators.required],
//       citizen_id: ['', Validators.required],
//       reportSubCategoryID: ['', Validators.required],
//       locationID: [''],  // Optional field
//       stationID: ['', Validators.required],
//       crimeID: [''],  // Optional field
//       reported_date: ['', Validators.required],
//       incidentDate: [''],  // Optional field
//       blotterNum: ['', Validators.required],
//       hasAccount: [true],
//       eSignature: ['', Validators.required],  // Assuming eSignature is a string or file
//       rankID: ['', Validators.required],  // Rank field added
//       personID: ['', Validators.required],  // Person field added
//       reportSubCategory: ['', Validators.required],
//       subcategory_name: ['', Validators.required], 
//     });
//   }

//   getOfficerStationId(): void {
//     const officerDetails = JSON.parse(localStorage.getItem('officer_details') || '{}');
//     this.stationID = officerDetails.stationId || null;

//     if (this.stationID) {
//       this.fetchReports(this.stationID);  // Fetch reports using the station ID
//     } else {
//       this.errorMessage = 'Station ID not found.';
//     }
//   }

//   fetchReports(stationId: string): void {
//     this.isLoading = true;  // Set loading state to true
//     this.stationDashboardService.getReports(Number(stationId)).subscribe(
//       (response) => {
//         this.reports = response.result || [];  // Handle the fetched reports
//         console.log('Fetched reports:', this.reports);
//         this.calculateCaseStats();  // Calculate case statistics
//         this.isLoading = false;
//       },
//       (error) => {
//         console.error('Error fetching reports:', error);
//         this.errorMessage = error.message || 'Failed to load reports. Please try again.';
//         this.isLoading = false;
//       }
//     );
//   }

//   fetchNationwideReports(): void {
//     this.isLoading = true;  // Set loading state to true
//     this.stationDashboardService.getNationwideReports().subscribe(
//       (response) => {
//         this.reports = response.result || [];  // Handle the fetched nationwide reports
//         console.log('Fetched nationwide reports:', this.reports);
//         this.calculateCaseStats();  // Calculate case statistics
//         this.isLoading = false;
//       },
//       (error) => {
//         console.error('Error fetching nationwide reports:', error);
//         this.errorMessage = error.message || 'Failed to load nationwide reports. Please try again.';
//         this.isLoading = false;
//       }
//     );
//   }

//   private calculateCaseStats(): void {
//     this.totalReportedCases = this.reports.length;
//     this.solvedCases = this.reports.filter(report => report.status.trim().toLowerCase() === 'solved').length;
//     this.underInvestigationCases = this.reports.filter(report => report.status.trim().toLowerCase() === 'under investigation').length;

//     // Update the chart with new data
//     this.createChart({
//       labels: ['Reported Cases', 'Solved Cases', 'Under Investigation'],
//       data: [this.totalReportedCases, this.solvedCases, this.underInvestigationCases]
//     });
//   }

//   fetchStations(): void {
//     this.jurisdictionService.getAll().subscribe(
//       (response: IStation[]) => {
//         this.stations = response;
//       },
//       (error) => {
//         console.error('Error fetching stations:', error);
//         this.errorMessage = error.message || 'Failed to load stations. Please try again.';
//       }
//     );
//   }

//   fetchRanks(): void {
//     this.policeAccountsService.getRanks().subscribe(
//       (response: IRank[]) => {
//         this.ranks = response;
//       },
//       (error) => {
//         console.error('Error fetching ranks:', error);
//         this.errorMessage = error.message || 'Failed to load ranks. Please try again.';
//       }
//     );
//   }

//   fetchPersons(): void {
//     this.personService.getAll().subscribe(
//       (response: IPerson[]) => {
//         this.persons = response;
//       },
//       (error) => {
//         console.error('Error fetching persons:', error);
//         this.errorMessage = error.message || 'Failed to load persons. Please try again.';
//       }
//     );
//   }

//   fetchReportData(): void {
//     const stationId = this.stationID ? Number(this.stationID) : 0;  // Ensure stationId is a number
//     this.reportSubscription = this.stationDashboardService.getReportData(stationId).subscribe(
//       (data: { dailyReports: number; weeklyReports: number; monthlyReports: number; annualReports: number; chartData: any; }) => {
//         this.dailyReports = data.dailyReports;
//         this.weeklyReports = data.weeklyReports;
//         this.monthlyReports = data.monthlyReports;
//         this.annualReports = data.annualReports;

//         this.createChart(data.chartData);  // Create or update the chart
//       },
//       (error: any) => {
//         console.error('Error fetching report data:', error);
//       }
//     );
//   }

//   onSubmit(): void {
//     if (this.dashboardForm.invalid) {
//       this.errorMessage = 'Please fill out all required fields correctly.';
//       return;
//     }

//     this.stationDashboardService.submitReport(this.dashboardForm.value).subscribe(
//       (response) => {
//         this.successMessage = 'Report successfully submitted!';
//         this.dashboardForm.reset();  // Reset the form after successful submission
//         console.log('Report submitted successfully:', response);
//       },
//       (error) => {
//         console.error('Error submitting report:', error);
//         this.errorMessage = error.message || 'Failed to submit the report. Please try again.';
//       }
//     );
//   }

//   onRefresh(): void {
//     this.fetchReportData();  // Re-fetch data when the user clicks refresh
//   }

//   // Create or update the Chart.js instance
//   createChart(chartData: any): void {
//     if (!chartData || !chartData.labels || !chartData.data) {
//       console.error('Invalid chart data:', chartData);
//       return;
//     }

//     if (this.chart) {
//       this.chart.destroy();
//     }

//     const ctx = document.getElementById('myChart') as HTMLCanvasElement;
//     this.chart = new Chart(ctx, {
//       type: 'bar',
//       data: {
//         labels: chartData.labels,
//         datasets: [{
//           label: 'Reports',
//           data: chartData.data,
//           backgroundColor: 'rgba(75, 192, 192, 0.2)',
//           borderColor: 'rgba(75, 192, 192, 1)',
//           borderWidth: 1
//         }]
//       },
//       options: {
//         responsive: true,
//         scales: {
//           y: {
//             beginAtZero: true
//           }
//         }
//       }
//     });
//   }

//   ngOnDestroy(): void {
//     if (this.reportSubscription) {
//       this.reportSubscription.unsubscribe();
//     }
//   }
// }

// import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
// import { StationDashboardService } from '../station-dashboard.service';
// import { Subscription } from 'rxjs';
// import { Chart } from 'chart.js';
// import { FormGroup, FormBuilder, Validators } from '@angular/forms';
// import { IReport } from '../station-dashboard.service';
// import { IStation, JurisdictionService } from '../jurisdiction.service';
// import { IPerson, IRank, PoliceAccountsService } from '../police-accounts.service';
// import { PersonService } from '../person.service';
// import { Router } from '@angular/router';
// import { CaseService } from '../case.service';


// @Component({
//   selector: 'app-station-dashboard',
//   templateUrl: './station-dashboard.component.html',
//   styleUrls: ['./station-dashboard.component.css'],
//   providers: [StationDashboardService]  // Provide the service here
// })
// export class StationDashboardComponent implements OnInit, OnDestroy {
//   dashboardForm!: FormGroup;  // Form group for report submission
//   isLoading = false;
//   successMessage: string | null = null;
//   errorMessage: string | null = null;
//   reports: IReport[] = [];  // Array to hold fetched reports
//   stations: IStation[] = [];
//   persons: IPerson[] = [];
//   ranks: IRank[] = [];

//   stationID: string | null = null;
//   dailyReports: number = 0;
//   weeklyReports: number = 0;
//   monthlyReports: number = 0;
//   annualReports: number = 0;
//   chart: any;
//   reportSubscription: Subscription | undefined;

//   // Variables for case statistics
//   totalReportedCases: number = 0;
//   solvedCases: number = 0;
//   underInvestigationCases: number = 0;

//   constructor(
//     @Inject(StationDashboardService) private stationDashboardService: StationDashboardService,
//     private fb: FormBuilder,
//     private jurisdictionService: JurisdictionService,
//     private policeAccountsService: PoliceAccountsService,
//     private personService: PersonService,
//     private caseService: CaseService,
//     private router: Router
//   ) {}

//   ngOnInit(): void {
//     this.initializeForm();
//     this.getOfficerStationId();  // Fetch the officer's station ID on init
//     this.fetchRanks();
//     this.fetchStations();
//     this.fetchPersons();
//     this.fetchNationwideReports();  // Ensure nationwide reports are fetched on load
//   }

//   initializeForm(): void {
//     this.dashboardForm = this.fb.group({
//       reportID: ['', Validators.required],
//       type: ['', Validators.required],
//       complainant: ['', Validators.required],
//       dateReceived: ['', Validators.required],
//       reportBody: ['', Validators.required],
//       citizen_id: ['', Validators.required],
//       reportSubCategoryID: ['', Validators.required],
//       locationID: [''],  // Optional field
//       stationID: ['', Validators.required],
//       crimeID: [''],  // Optional field
//       reported_date: ['', Validators.required],
//       incidentDate: [''],  // Optional field
//       blotterNum: ['', Validators.required],
//       hasAccount: [true],
//       eSignature: ['', Validators.required],  // Assuming eSignature is a string or file
//       rankID: ['', Validators.required],  // Rank field added
//       personID: ['', Validators.required],  // Person field added
//       reportSubCategory: ['', Validators.required],
//       subcategory_name: ['', Validators.required], 
//       status: ['', Validators.required], 
//     });
//   }

//   getOfficerStationId(): void {
//     const officerDetails = JSON.parse(localStorage.getItem('officer_details') || '{}');
//     this.stationID = officerDetails.stationId || null;

//     if (this.stationID) {
//       this.fetchReports(this.stationID);  // Fetch reports using the station ID
//     } else {
//       this.errorMessage = 'Station ID not found.';
//     }
//   }

//   fetchReports(stationId: string): void {
//     this.isLoading = true;  // Set loading state to true
//     this.stationDashboardService.getReports(Number(stationId)).subscribe(
//       (response) => {
//         this.reports = response || [];  // Handle the fetched reports
//         console.log('Fetched reports:', this.reports);
//         this.calculateCaseStats();  // Calculate case statistics
//         this.isLoading = false;
//       },
//       (error) => {
//         console.error('Error fetching reports:', error);
//         this.errorMessage = error.message || 'Failed to load reports. Please try again.';
//         this.isLoading = false;
//       }
//     );
//   }

//   fetchNationwideReports(): void {
//     this.isLoading = true;  // Set loading state to true
//     this.stationDashboardService.getNationwideReports().subscribe(
//       (response) => {
//         this.reports = response || [];  // Handle the fetched nationwide reports
//         console.log('Fetched nationwide reports:', this.reports);
//         this.calculateCaseStats();  // Calculate case statistics
//         this.isLoading = false;
//       },
//       (error) => {
//         console.error('Error fetching nationwide reports:', error);
//         this.errorMessage = error.message || 'Failed to load nationwide reports. Please try again.';
//         this.isLoading = false;
//       }
//     );
//   }

//   private calculateCaseStats(): void {
//     this.totalReportedCases = this.reports.length;
//     this.solvedCases = this.reports.filter(report => report.status.trim().toLowerCase() === 'solved').length;
//     this.underInvestigationCases = this.reports.filter(report => report.status.trim().toLowerCase() === 'under investigation').length;

//     // Update the chart with new data
//     this.createChart({
//       labels: ['Reported Cases', 'Solved Cases', 'Under Investigation'],
//       data: [this.totalReportedCases, this.solvedCases, this.underInvestigationCases]
//     });
//   }

//   fetchStations(): void {
//     this.jurisdictionService.getAll().subscribe(
//       (response: IStation[]) => {
//         this.stations = response;
//       },
//       (error) => {
//         console.error('Error fetching stations:', error);
//         this.errorMessage = error.message || 'Failed to load stations. Please try again.';
//       }
//     );
//   }

//   fetchRanks(): void {
//     this.policeAccountsService.getRanks().subscribe(
//       (response: IRank[]) => {
//         this.ranks = response;
//       },
//       (error) => {
//         console.error('Error fetching ranks:', error);
//         this.errorMessage = error.message || 'Failed to load ranks. Please try again.';
//       }
//     );
//   }

//   fetchPersons(): void {
//     this.personService.getAll().subscribe(
//       (response: IPerson[]) => {
//         this.persons = response;
//       },
//       (error) => {
//         console.error('Error fetching persons:', error);
//         this.errorMessage = error.message || 'Failed to load persons. Please try again.';
//       }
//     );
//   }

//   fetchReportData(): void {
//     const stationId = this.stationID ? Number(this.stationID) : 0;  // Ensure stationId is a number
//     this.reportSubscription = this.stationDashboardService.getReportData(stationId).subscribe(
//       (data: { dailyReports: number; weeklyReports: number; monthlyReports: number; annualReports: number; chartData: any; }) => {
//         this.dailyReports = data.dailyReports;
//         this.weeklyReports = data.weeklyReports;
//         this.monthlyReports = data.monthlyReports;
//         this.annualReports = data.annualReports;

//         this.createChart(data.chartData);  // Create or update the chart
//       },
//       (error: any) => {
//         console.error('Error fetching report data:', error);
//       }
//     );
//   }

//   onSubmit(): void {
//     if (this.dashboardForm.invalid) {
//       this.errorMessage = 'Please fill out all required fields correctly.';
//       return;
//     }

//     this.stationDashboardService.submitReport(this.dashboardForm.value).subscribe(
//       (response) => {
//         this.successMessage = 'Report successfully submitted!';
//         this.dashboardForm.reset();  // Reset the form after successful submission
//         console.log('Report submitted successfully:', response);
//       },
//       (error) => {
//         console.error('Error submitting report:', error);
//         this.errorMessage = error.message || 'Failed to submit the report. Please try again.';
//       }
//     );
//   }

//   onRefresh(): void {
//     this.fetchReportData();  // Re-fetch data when the user clicks refresh
//   }

//   // Create or update the Chart.js instance
//   createChart(chartData: any): void {
//     if (!chartData || !chartData.labels || !chartData.data) {
//       console.error('Invalid chart data:', chartData);
//       return;
//     }

//     if (this.chart) {
//       this.chart.destroy();
//     }

//     const ctx = document.getElementById('myChart') as HTMLCanvasElement;
//     this.chart = new Chart(ctx, {
//       type: 'bar',
//       data: {
//         labels: chartData.labels,
//         datasets: [{
//           label: 'Reports',
//           data: chartData.data,
//           backgroundColor: 'rgba(75, 192, 192, 0.2)',
//           borderColor: 'rgba(75, 192, 192, 1)',
//           borderWidth: 1
//         }]
//       },
//       options: {
//         responsive: true,
//         scales: {
//           y: {
//             beginAtZero: true
//           }
//         }
//       }
//     });
//   }

//   ngOnDestroy(): void {
//     if (this.reportSubscription) {
//       this.reportSubscription.unsubscribe();
//     }
//   }
// }



// import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
// import { StationDashboardService } from '../station-dashboard.service';
// import { Subscription } from 'rxjs';
// import { Chart } from 'chart.js';
// import { FormGroup, FormBuilder, Validators } from '@angular/forms';
// import { IReport } from '../station-dashboard.service';
// import { IStation, JurisdictionService } from '../jurisdiction.service';
// import { IPerson, IRank, PoliceAccountsService } from '../police-accounts.service';
// import { PersonService } from '../person.service';
// import { Router } from '@angular/router';
// import { CaseService } from '../case.service';

// @Component({
//   selector: 'app-station-dashboard',
//   templateUrl: './station-dashboard.component.html',
//   styleUrls: ['./station-dashboard.component.css'],
//   providers: [StationDashboardService],
// })
// export class StationDashboardComponent implements OnInit, OnDestroy {
//   dashboardForm!: FormGroup;
//   isLoading = false;
//   successMessage: string | null = null;
//   errorMessage: string | null = null;
//   reports: IReport[] = [];
//   stations: IStation[] = [];
//   persons: IPerson[] = [];
//   ranks: IRank[] = [];

//   stationID: string | null = null;
//   dailyReports = 0;
//   weeklyReports = 0;
//   monthlyReports = 0;
//   annualReports = 0;
//   chart: any;
//   reportSubscription: Subscription | undefined;

//   totalReportedCases = 0;
//   solvedCases = 0;
//   underInvestigationCases = 0;

//   constructor(
//     @Inject(StationDashboardService) private stationDashboardService: StationDashboardService,
//     private fb: FormBuilder,
//     private jurisdictionService: JurisdictionService,
//     private policeAccountsService: PoliceAccountsService,
//     private personService: PersonService,
//     private caseService: CaseService,
//     private router: Router
//   ) {}

//   ngOnInit(): void {
//     this.initializeForm();
//     this.getOfficerStationId();
//     this.fetchRanks();
//     this.fetchStations();
//     this.fetchPersons();
//     this.fetchNationwideReports();
//   }

//   initializeForm(): void {
//     this.dashboardForm = this.fb.group({
//       reportID: ['', Validators.required],
//       type: ['', Validators.required],
//       complainant: ['', Validators.required],
//       dateReceived: ['', Validators.required],
//       reportBody: ['', Validators.required],
//       citizen_id: ['', Validators.required],
//       reportSubCategoryID: ['', Validators.required],
//       locationID: [''],
//       stationID: ['', Validators.required],
//       crimeID: [''],
//       reported_date: ['', Validators.required],
//       incidentDate: [''],
//       blotterNum: ['', Validators.required],
//       hasAccount: [true],
//       eSignature: ['', Validators.required],
//       rankID: ['', Validators.required],
//       personID: ['', Validators.required],
//       reportSubCategory: ['', Validators.required],
//       subcategory_name: ['', Validators.required],
//       status: ['', Validators.required],
//     });
//   }

//   getOfficerStationId(): void {
//     const officerDetails = JSON.parse(localStorage.getItem('officer_details') || '{}');
//     this.stationID = officerDetails.stationId || null;

//     if (this.stationID) {
//       this.fetchReports(this.stationID);
//     } else {
//       this.errorMessage = 'Station ID not found.';
//     }
//   }

//   fetchReports(stationId: string): void {
//     this.isLoading = true;
//     this.stationDashboardService.getReports(Number(stationId)).subscribe(
//       (response) => {
//         this.reports = response || [];
//         this.calculateCaseStats();
//         this.isLoading = false;
//       },
//       (error) => {
//         this.errorMessage = error.message || 'Failed to load reports. Please try again.';
//         this.isLoading = false;
//       }
//     );
//   }

//   fetchNationwideReports(): void {
//     this.isLoading = true;
//     this.stationDashboardService.getNationwideReports().subscribe(
//       (response) => {
//         this.reports = response || [];
//         this.calculateCaseStats();
//         this.isLoading = false;
//       },
//       (error) => {
//         this.errorMessage = error.message || 'Failed to load nationwide reports. Please try again.';
//         this.isLoading = false;
//       }
//     );
//   }

//   private calculateCaseStats(): void {
//     this.totalReportedCases = this.reports.length;
//     this.solvedCases = this.reports.filter(
//       (report) => report.status.trim().toLowerCase() === 'solved'
//     ).length;
//     this.underInvestigationCases = this.reports.filter(
//       (report) => report.status.trim().toLowerCase() === 'under investigation'
//     ).length;

//     this.createChart({
//       labels: ['Reported Cases', 'Solved Cases', 'Under Investigation'],
//       data: [
//         this.totalReportedCases,
//         this.solvedCases,
//         this.underInvestigationCases,
//       ],
//     });
//   }

//   fetchStations(): void {
//     this.jurisdictionService.getAll().subscribe(
//       (response: IStation[]) => {
//         this.stations = response;
//       },
//       (error) => {
//         this.errorMessage = error.message || 'Failed to load stations. Please try again.';
//       }
//     );
//   }

//   fetchRanks(): void {
//     this.policeAccountsService.getRanks().subscribe(
//       (response: IRank[]) => {
//         this.ranks = response;
//       },
//       (error) => {
//         this.errorMessage = error.message || 'Failed to load ranks. Please try again.';
//       }
//     );
//   }

//   fetchPersons(): void {
//     this.personService.getAll().subscribe(
//       (response: IPerson[]) => {
//         this.persons = response;
//       },
//       (error) => {
//         this.errorMessage = error.message || 'Failed to load persons. Please try again.';
//       }
//     );
//   }

//   fetchReportData(): void {
//     const stationId = this.stationID ? Number(this.stationID) : 0;
//     this.reportSubscription = this.stationDashboardService
//       .getReportData(stationId)
//       .subscribe(
//         (data: {
//           dailyReports: number;
//           weeklyReports: number;
//           monthlyReports: number;
//           annualReports: number;
//           chartData: any;
//         }) => {
//           this.dailyReports = data.dailyReports;
//           this.weeklyReports = data.weeklyReports;
//           this.monthlyReports = data.monthlyReports;
//           this.annualReports = data.annualReports;
//           this.createChart(data.chartData);
//         },
//         (error: any) => {
//           console.error('Error fetching report data:', error);
//         }
//       );
//   }

//   onSubmit(): void {
//     if (this.dashboardForm.invalid) {
//       this.errorMessage = 'Please fill out all required fields correctly.';
//       return;
//     }

//     this.stationDashboardService.submitReport(this.dashboardForm.value).subscribe(
//       () => {
//         this.successMessage = 'Report successfully submitted!';
//         this.dashboardForm.reset();
//       },
//       (error) => {
//         this.errorMessage = error.message || 'Failed to submit the report. Please try again.';
//       }
//     );
//   }

//   onRefresh(): void {
//     this.fetchReportData();
//   }

//   createChart(chartData: any): void {
//     if (!chartData || !chartData.labels || !chartData.data) {
//       return;
//     }

//     if (this.chart) {
//       this.chart.destroy();
//     }

//     const ctx = document.getElementById('myChart') as HTMLCanvasElement;
//     this.chart = new Chart(ctx, {
//       type: 'bar',
//       data: {
//         labels: chartData.labels,
//         datasets: [
//           {
//             label: 'Reports',
//             data: chartData.data,
//             backgroundColor: 'rgba(75, 192, 192, 0.2)',
//             borderColor: 'rgba(75, 192, 192, 1)',
//             borderWidth: 1,
//           },
//         ],
//       },
//       options: {
//         responsive: true,
//         scales: {
//           y: {
//             beginAtZero: true,
//           },
//         },
//       },
//     });
//   }

//   ngOnDestroy(): void {
//     if (this.reportSubscription) {
//       this.reportSubscription.unsubscribe();
//     }
//   }
// }


import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { StationDashboardService } from '../station-dashboard.service';
import { Subscription } from 'rxjs';
import { Chart } from 'chart.js';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { IReport } from '../station-dashboard.service';
import { IStation, JurisdictionService } from '../jurisdiction.service';
import { IPerson, IRank, PoliceAccountsService } from '../police-accounts.service';
import { PersonService } from '../person.service';
import { Router } from '@angular/router';
import { CaseService } from '../case.service';

@Component({
  selector: 'app-station-dashboard',
  templateUrl: './station-dashboard.component.html',
  styleUrls: ['./station-dashboard.component.css'],
  providers: [StationDashboardService],
})
export class StationDashboardComponent implements OnInit, OnDestroy {
  dashboardForm!: FormGroup;
  isLoading = false;
  successMessage: string | null = null;
  errorMessage: string | null = null;
  reports: IReport[] = [];
  stations: IStation[] = [];
  persons: IPerson[] = [];
  ranks: IRank[] = [];

  stationID: string | null = null;
  dailyReports = 0;
  weeklyReports = 0;
  monthlyReports = 0;
  annualReports = 0;
  chart: any;
  reportSubscription: Subscription | undefined;

  constructor(
    @Inject(StationDashboardService) private stationDashboardService: StationDashboardService,
    private fb: FormBuilder,
    private jurisdictionService: JurisdictionService,
    private policeAccountsService: PoliceAccountsService,
    private personService: PersonService,
    private caseService: CaseService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.getOfficerStationId();
    this.fetchRanks();
    this.fetchStations();
    this.fetchPersons();
    this.fetchNationwideReports();
  }

  initializeForm(): void {
    this.dashboardForm = this.fb.group({
      reportID: ['', Validators.required],
      type: ['', Validators.required],
      complainant: ['', Validators.required],
      dateReceived: ['', Validators.required],
      reportBody: ['', Validators.required],
      citizen_id: ['', Validators.required],
      reportSubCategoryID: ['', Validators.required],
      locationID: [''],
      stationID: ['', Validators.required],
      crimeID: [''],
      reported_date: ['', Validators.required],
      incidentDate: [''],
      blotterNum: ['', Validators.required],
      hasAccount: [true],
      eSignature: ['', Validators.required],
      rankID: ['', Validators.required],
      personID: ['', Validators.required],
      reportSubCategory: ['', Validators.required],
      subcategory_name: ['', Validators.required],
      status: ['', Validators.required],
    });
  }

  getOfficerStationId(): void {
    const officerDetails = JSON.parse(localStorage.getItem('officer_details') || '{}');
    this.stationID = officerDetails.stationId || null;

    if (this.stationID) {
      this.fetchReports(this.stationID);
    } else {
      this.errorMessage = 'Station ID not found.';
    }
  }

  fetchReports(stationId: string): void {
    this.isLoading = true;
    this.stationDashboardService.getReports(Number(stationId)).subscribe(
      (response) => {
        this.reports = response || [];
        this.calculateReportStats();
        this.isLoading = false;
      },
      (error) => {
        this.errorMessage = error.message || 'Failed to load reports. Please try again.';
        this.isLoading = false;
      }
    );
  }

  fetchNationwideReports(): void {
    this.isLoading = true;
    this.stationDashboardService.getNationwideReports().subscribe(
      (response) => {
        this.reports = response || [];
        this.calculateReportStats();
        this.isLoading = false;
      },
      (error) => {
        this.errorMessage = error.message || 'Failed to load nationwide reports. Please try again.';
        this.isLoading = false;
      }
    );
  }

  private calculateReportStats(): void {
    this.weeklyReports = this.reports.filter(
      (report) => report.status.trim().toLowerCase() === 'weekly'
    ).length;
    this.monthlyReports = this.reports.filter(
      (report) => report.status.trim().toLowerCase() === 'monthly'
    ).length;
    this.annualReports = this.reports.filter(
      (report) => report.status.trim().toLowerCase() === 'annual'
    ).length;

    this.createChart({
      labels: ['Weekly Reports', 'Monthly Reports', 'Annual Reports'],
      data: [
        this.weeklyReports,
        this.monthlyReports,
        this.annualReports,
      ],
    });
  }

  fetchStations(): void {
    this.jurisdictionService.getAll().subscribe(
      (response: IStation[]) => {
        this.stations = response;
      },
      (error) => {
        this.errorMessage = error.message || 'Failed to load stations. Please try again.';
      }
    );
  }

  fetchRanks(): void {
    this.policeAccountsService.getRanks().subscribe(
      (response: IRank[]) => {
        this.ranks = response;
      },
      (error) => {
        this.errorMessage = error.message || 'Failed to load ranks. Please try again.';
      }
    );
  }

  fetchPersons(): void {
    this.personService.getAll().subscribe(
      (response: IPerson[]) => {
        this.persons = response;
      },
      (error) => {
        this.errorMessage = error.message || 'Failed to load persons. Please try again.';
      }
    );
  }

  fetchReportData(): void {
    const stationId = this.stationID ? Number(this.stationID) : 0;
    this.reportSubscription = this.stationDashboardService
      .getReportData(stationId)
      .subscribe(
        (data: {
          dailyReports: number;
          weeklyReports: number;
          monthlyReports: number;
          annualReports: number;
          chartData: any;
        }) => {
          this.dailyReports = data.dailyReports;
          this.weeklyReports = data.weeklyReports;
          this.monthlyReports = data.monthlyReports;
          this.annualReports = data.annualReports;
          this.createChart(data.chartData);
        },
        (error: any) => {
          console.error('Error fetching report data:', error);
        }
      );
  }

  onSubmit(): void {
    if (this.dashboardForm.invalid) {
      this.errorMessage = 'Please fill out all required fields correctly.';
      return;
    }

    this.stationDashboardService.submitReport(this.dashboardForm.value).subscribe(
      () => {
        this.successMessage = 'Report successfully submitted!';
        this.dashboardForm.reset();
      },
      (error) => {
        this.errorMessage = error.message || 'Failed to submit the report. Please try again.';
      }
    );
  }

  onRefresh(): void {
    this.fetchReportData();
  }

  createChart(chartData: any): void {
    if (!chartData || !chartData.labels || !chartData.data) {
      return;
    }

    if (this.chart) {
      this.chart.destroy();
    }

    const ctx = document.getElementById('myChart') as HTMLCanvasElement;
    this.chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: chartData.labels,
        datasets: [
          {
            label: 'Reports',
            data: chartData.data,
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  }

  ngOnDestroy(): void {
    if (this.reportSubscription) {
      this.reportSubscription.unsubscribe();
    }
  }
}
