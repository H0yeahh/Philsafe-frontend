import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { StationDashboardService } from '../station-dashboard.service';
import { Subscription } from 'rxjs';
import { BarController, BarElement, CategoryScale, Chart, ChartConfiguration, Legend, LinearScale, Title, Tooltip } from 'chart.js';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { IReport } from '../station-dashboard.service';
import { IStation, JurisdictionService } from '../jurisdiction.service';
import { IPerson, IRank, PoliceAccountsService } from '../police-accounts.service';
import { PersonService } from '../person.service';
import { Router } from '@angular/router';
import { CaseService } from '../case.service';
import { AuthService } from '../auth.service';
import { CaseQueueService } from '../case-queue.service';
import { format } from 'date-fns';


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
  reports: any;
  stations: IStation[] = [];
  persons: IPerson[] = [];

  ranks: IRank[] = [];
  personId: any;
  stationID: string | null = null;
  dailyReports = 0;
  weeklyReports = 0;
  monthlyReports = 0;
  annualReports = 0;
  chart: any;
  reportSubscription: Subscription | undefined;
  policePersonData: any
  policeDetails: any;
  stationDetails: any;
  weeklyAvg: any;
  monthlyAvg: any;
  annualAvg: any
  stationId: any
  timePeriodControl: FormControl;

  constructor(
    @Inject(StationDashboardService) private stationDashboardService: StationDashboardService,
    private fb: FormBuilder,
    private jurisdictionService: JurisdictionService,
    private policeAccountsService: PoliceAccountsService,
    private personService: PersonService,
    private caseService: CaseService,
    private router: Router,
    private authService: AuthService,
    private caseQueueService: CaseQueueService
  ) {

    Chart.register(
      CategoryScale, 
      LinearScale, 
      BarElement, 
      Title, 
      Tooltip, 
      Legend,
      BarController
    );
    this.timePeriodControl = new FormControl('weekly');
  }

  ngOnInit(): void {
    // this.initializeForm();
    // this.getOfficerStationId();
    // this.fetchRanks();
    // this.fetchStations();
    // this.fetchPersons();
    // this.fetchNationwideReports();
    this.loadUserProfile();
    this.fetchReportStation(this.stationId);
    this.calculateReportsAverage();
    this.calculateReportsCount();
    this.onSelect();

    this.timePeriodControl.valueChanges.subscribe(() => {
      this.onSelect();
    });
  }

  // initializeForm(): void {
  //   this.dashboardForm = this.fb.group({
  //     reportID: ['', Validators.required],
  //     type: ['', Validators.required],
  //     complainant: ['', Validators.required],
  //     dateReceived: ['', Validators.required],
  //     reportBody: ['', Validators.required],
  //     citizen_id: ['', Validators.required],
  //     reportSubCategoryID: ['', Validators.required],
  //     locationID: [''],
  //     stationID: ['', Validators.required],
  //     crimeID: [''],
  //     reported_date: ['', Validators.required],
  //     incidentDate: [''],
  //     blotterNum: ['', Validators.required],
  //     hasAccount: [true],
  //     eSignature: ['', Validators.required],
  //     rankID: ['', Validators.required],
  //     personID: ['', Validators.required],
  //     reportSubCategory: ['', Validators.required],
  //     subcategory_name: ['', Validators.required],
  //     status: ['', Validators.required],
  //   });
  // }

  // getOfficerStationId(): void {
  //   const officerDetails = JSON.parse(localStorage.getItem('officer_details') || '{}');
  //   this.stationID = officerDetails.stationId || null;

  //   if (this.stationID) {
  //     this.fetchReports(this.stationID);
  //   } else {
  //     this.errorMessage = 'Station ID not found.';
  //   }
  // }

  // fetchReports(stationId: string): void {
  //   this.isLoading = true;
  //   this.stationDashboardService.getReports(Number(stationId)).subscribe(
  //     (response) => {
  //       this.reports = response || [];
  //       this.calculateReportStats();
  //       this.isLoading = false;
  //     },
  //     (error) => {
  //       this.errorMessage = error.message || 'Failed to load reports. Please try again.';
  //       this.isLoading = false;
  //     }
  //   );
  // }

  // fetchNationwideReports(): void {
  //   this.isLoading = true;
  //   this.stationDashboardService.getNationwideReports().subscribe(
  //     (response) => {
  //       this.reports = response || [];
  //       this.calculateReportStats();
  //       this.isLoading = false;
  //     },
  //     (error) => {
  //       this.errorMessage = error.message || 'Failed to load nationwide reports. Please try again.';
  //       this.isLoading = false;
  //     }
  //   );
  // }

  // private calculateReportStats(): void {
  //   this.weeklyReports = this.reports.filter(
  //     (report) => report.status.trim().toLowerCase() === 'weekly'
  //   ).length;
  //   this.monthlyReports = this.reports.filter(
  //     (report) => report.status.trim().toLowerCase() === 'monthly'
  //   ).length;
  //   this.annualReports = this.reports.filter(
  //     (report) => report.status.trim().toLowerCase() === 'annual'
  //   ).length;

  //   this.createChart({
  //     labels: ['Weekly Reports', 'Monthly Reports', 'Annual Reports'],
  //     data: [
  //       this.weeklyReports,
  //       this.monthlyReports,
  //       this.annualReports,
  //     ],
  //   });
  // }

  // fetchStations(): void {
  //   this.jurisdictionService.getAll().subscribe(
  //     (response: IStation[]) => {
  //       this.stations = response;
  //     },
  //     (error) => {
  //       this.errorMessage = error.message || 'Failed to load stations. Please try again.';
  //     }
  //   );
  // }

  // fetchRanks(): void {
  //   this.policeAccountsService.getRanks().subscribe(
  //     (response: IRank[]) => {
  //       this.ranks = response;
  //     },
  //     (error) => {
  //       this.errorMessage = error.message || 'Failed to load ranks. Please try again.';
  //     }
  //   );
  // }

  // fetchPersons(): void {
  //   this.personService.getAll().subscribe(
  //     (response: IPerson[]) => {
  //       this.persons = response;
  //     },
  //     (error) => {
  //       this.errorMessage = error.message || 'Failed to load persons. Please try again.';
  //     }
  //   );
  // }

  // fetchReportData(): void {
  //   const stationId = this.stationID ? Number(this.stationID) : 0;
  //   this.reportSubscription = this.stationDashboardService
  //     .getReportData(stationId)
  //     .subscribe(
  //       (data: {
  //         dailyReports: number;
  //         weeklyReports: number;
  //         monthlyReports: number;
  //         annualReports: number;
  //         chartData: any;
  //       }) => {
  //         this.dailyReports = data.dailyReports;
  //         this.weeklyReports = data.weeklyReports;
  //         this.monthlyReports = data.monthlyReports;
  //         this.annualReports = data.annualReports;
  //         this.createChart(data.chartData);
  //       },
  //       (error: any) => {
  //         console.error('Error fetching report data:', error);
  //       }
  //     );
  // }

  // onSubmit(): void {
  //   if (this.dashboardForm.invalid) {
  //     this.errorMessage = 'Please fill out all required fields correctly.';
  //     return;
  //   }

  //   this.stationDashboardService.submitReport(this.dashboardForm.value).subscribe(
  //     () => {
  //       this.successMessage = 'Report successfully submitted!';
  //       this.dashboardForm.reset();
  //     },
  //     (error) => {
  //       this.errorMessage = error.message || 'Failed to submit the report. Please try again.';
  //     }
  //   );
  // }

  // onRefresh(): void {
  //   this.fetchReportData();
  // }

  // createChart(chartData: any): void {
  //   if (!chartData || !chartData.labels || !chartData.data) {
  //     return;
  //   }

  //   if (this.chart) {
  //     this.chart.destroy();
  //   }

  //   const ctx = document.getElementById('myChart') as HTMLCanvasElement;
  //   this.chart = new Chart(ctx, {
  //     type: 'bar',
  //     data: {
  //       labels: chartData.labels,
  //       datasets: [
  //         {
  //           label: 'Reports',
  //           data: chartData.data,
  //           backgroundColor: 'rgba(75, 192, 192, 0.2)',
  //           borderColor: 'rgba(75, 192, 192, 1)',
  //           borderWidth: 1,
  //         },
  //       ],
  //     },
  //     options: {
  //       responsive: true,
  //       scales: {
  //         y: {
  //           beginAtZero: true,
  //         },
  //       },
  //     },
  //   });
  // }

  onSelect() {
    const timePeriod = this.timePeriodControl.value;
  
    if (this.chart) {
      this.chart.destroy(); // Destroy previous chart instance
    }
  
    if (timePeriod === 'weekly') {
      this.createWeeklyChart();
    } else if (timePeriod === 'monthly') {
      this.createMonthlyChart();
    } else {
      console.warn('Unknown time period selected.');
    }
  }
  

  loadUserProfile(){
    const userData = localStorage.getItem('userData');
    console.log('USER DATA SESSION', userData);
    if(userData){
      try{
        const parsedData = JSON.parse(userData);
        this.personId = parsedData.personId;
        this.policeAccountsService.getPoliceByPersonId(this.personId).subscribe(
          (response) => {
            this.policePersonData = response;
            console.log("Fetched Police Person Data", this.policePersonData);
            this.fetchPoliceData(this.policePersonData.police_id);
            console.log("Police ID:", this.policePersonData.police_id)
          },
          (error) => {
            console.error("Errod Police Person Data", error)
          }
        )
        
        console.log("Person ID", this.personId)
      } catch {
        console.error("Error fetching localStorage")
      }
    }
  }


  fetchPoliceData(policeId: number) {
    this.policeAccountsService.getAllPoliceData().subscribe(
      (allPoliceData) => {
        // Find the matching police data by policeId
        const policeData = allPoliceData.find(p => p.police_id === policeId);
        this.policeDetails = policeData
  
        if (policeData) {
          const badgeNumber = this.policeDetails.badge_number;
          console.log('Found police data:', policeData);
          console.log('Badge Number:', badgeNumber);
          this.fetchStation(this.policeDetails.station_id);
  
        } else {
          console.error('Police ID not found in all police data');
        }
      },
      (error) => {
        console.error('Error Fetching All Police Data:', error);
      }
    );
  }
  

  fetchStation(stationId: number) {
    this.jurisdictionService.getStation(stationId).subscribe(
      (response) => {
        this.stationDetails = response;
        console.log("Station Data", this.stationDetails);
        this.fetchReportStation(this.stationDetails.station_id)
      },
      (error) => {
        console.error('Error Fetching Station Data', error)
      }
    )
  }

  fetchReportStation(stationId: number) {
    this.caseQueueService.getReports(stationId).subscribe(
      (response) => {
        this.reports = response;
        console.log("Fetched Reports", this.reports)
        if (this.reports && this.reports.length) {
          this.calculateReportsAverage();
          this.calculateReportsCount();
          // this.createChart();
       
      } else {
          console.warn("No reports available.");
      }
      },
      (error) => {
        console.error('Error Fetching Reports in Station ', error)
      }
    )
  }

  calculateReportsCount() {
    if (!this.reports || !this.reports.length) {
        console.warn('No reports to calculate counts.');
        return { weeklyCounts: {}, monthlyCounts: {} };  // Explicit return of empty objects
    }

    const weeklyCounts: { [week: string]: number } = {};
    const monthlyCounts: { [month: string]: number } = {};

    this.reports.forEach((report) => {
        const incidentDate = new Date(report.incident_date);
        const weekKey = `Week${Math.ceil(incidentDate.getDate() / 7)}-${incidentDate.getMonth() + 1}-${incidentDate.getFullYear()}`;
        const monthKey = `${incidentDate.toLocaleString('default', { month: 'short' })}-${incidentDate.getFullYear()}`;

        weeklyCounts[weekKey] = (weeklyCounts[weekKey] || 0) + 1;
        monthlyCounts[monthKey] = (monthlyCounts[monthKey] || 0) + 1;
    });

    console.log('Weekly Report Counts:', weeklyCounts);
    console.log('Monthly Report Counts:', monthlyCounts);

    return { weeklyCounts, monthlyCounts };
}

calculateReportsAverage() {
  // if (!this.reports || !this.reports.length) {
  //     console.warn('No reports to calculate averages.');
  //     return;
  // }

  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();

  // Group reports by week, month, and year
  const weeklyReports: { [week: string]: number } = {};
  const monthlyReports: { [month: string]: number } = {};
  const annualReports: { [year: string]: number } = {};

  this.reports.forEach((report) => {
      const reportedDate = new Date(report.reported_date);
      const weekKey = `Week${Math.ceil(reportedDate.getDate() / 7)}-${reportedDate.getMonth() + 1}-${reportedDate.getFullYear()}`;
      const monthKey = `${reportedDate.toLocaleString('default', { month: 'short' })}-${reportedDate.getFullYear()}`;
      const yearKey = `${reportedDate.getFullYear()}`;

      weeklyReports[weekKey] = (weeklyReports[weekKey] || 0) + 1;
      monthlyReports[monthKey] = (monthlyReports[monthKey] || 0) + 1;
      annualReports[yearKey] = (annualReports[yearKey] || 0) + 1;
  });

  // Calculate weekly and monthly averages
  const totalWeeks = Object.keys(weeklyReports).length;
  const totalMonths = Object.keys(monthlyReports).length;
  const totalAnnualReports = Object.keys(annualReports).length;

  const weeklyAverage = totalWeeks ? Math.round(this.reports.length / totalWeeks) : 0;
  const monthlyAverage = totalMonths ? Math.round(this.reports.length / totalMonths) : 0;
  const annualAverage = totalAnnualReports ? Math.round(Object.values(annualReports).reduce((a, b) => a + b, 0) / totalAnnualReports) : 0;

  this.weeklyAvg = weeklyAverage;
  this.monthlyAvg = monthlyAverage;
  this.annualAvg = annualAverage;

  console.log('Weekly Average:', this.weeklyAvg);
  console.log('Monthly Average:', this.monthlyAvg);
  console.log('Annual Average:', this.annualAvg);
}


createWeeklyChart() {
  const counts = this.calculateReportsCount();
  if (!counts || !counts.weeklyCounts) return;

  const weeklyData = Object.values(counts.weeklyCounts) as number[];
  const weeklyLabels = Object.keys(counts.weeklyCounts);

  const chartConfig: ChartConfiguration<'bar', number[], string> = {
    type: 'bar',
    data: {
      labels: weeklyLabels,
      datasets: [
        {
          label: 'Weekly Reports',
          data: weeklyData,
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        x: {
          beginAtZero: true,
        },
        y: {
          beginAtZero: true,
        },
      },
    },
  };

  this.renderChart(chartConfig);
  console.log("Weekly Chart Generated")
}

createMonthlyChart() {
  const counts = this.calculateReportsCount();
  if (!counts || !counts.monthlyCounts) return;

  const monthlyData = Object.values(counts.monthlyCounts) as number[];
  const monthlyLabels = Object.keys(counts.monthlyCounts);

  const chartConfig: ChartConfiguration<'bar', number[], string> = {
    type: 'bar',
    data: {
      labels: monthlyLabels,
      datasets: [
        {
          label: 'Monthly Reports',
          data: monthlyData,
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        x: {
          beginAtZero: true,
        },
        y: {
          beginAtZero: true,
        },
      },
    },
  };

  this.renderChart(chartConfig);
  console.log("Monthly Chart Generated")
}

renderChart(chartConfig: ChartConfiguration) {
  const ctx = (document.getElementById('casesGraph') as HTMLCanvasElement).getContext('2d');
  if (ctx) {
    this.chart = new Chart(ctx, chartConfig);
  } else {
    console.error('Canvas element not found or context is not accessible.');
  }
}

// createChart() {
//   const counts = this.calculateReportsCount();

//   if (!counts) {
//     console.warn('No data available for chart creation.');
//     return;
//   }

//   // Generate custom date range labels for weekly and monthly data
//   const weeklyLabels = this.generateDateRangeLabels(counts.weeklyCounts);
//   const monthlyLabels = this.generateDateRangeLabels(counts.monthlyCounts);

//   const weeklyData = Object.values(counts.weeklyCounts) as number[];
//   const monthlyData = Object.values(counts.monthlyCounts) as number[];

//   // Create Weekly Chart
//   this.createBarChart('weeklyChart', 'Weekly Reports', weeklyLabels, weeklyData);

//   // Create Monthly Chart
//   this.createBarChart('monthlyChart', 'Monthly Reports', monthlyLabels, monthlyData);
// }


// generateDateRangeLabels(data: any): string[] {
//   const labels: string[] = [];

//   const keys = Object.keys(data); // The keys could be week ranges or months

//   keys.forEach((key) => {
//     console.log(`Processing key: ${key}`);

//     // Extract week number, month, and year from the format 'Week1-10-2024'
//     const match = key.match(/Week(\d+)-(\d+)-(\d{4})/);
//     if (!match) {
//       console.error(`Invalid week format: ${key}`);
//       return;
//     }

//     const weekNumber = parseInt(match[1], 10); // Extract week number
//     const month = parseInt(match[2], 10); // Extract month
//     const year = parseInt(match[3], 10); // Extract year

//     // Calculate the start date of the week (using the first day of the month)
//     const startDate = new Date(year, month - 1, 1); // Month is zero-indexed
//     const daysOffset = (weekNumber - 1) * 7; // Calculate the days offset from the first day of the month
//     startDate.setDate(startDate.getDate() + daysOffset);

//     // Ensure we have a valid date
//     if (isNaN(startDate.getTime())) {
//       console.error(`Invalid date for week: ${key}`);
//       return;
//     }

//     // Add 6 days to get the end date of the week
//     const endDate = new Date(startDate);
//     endDate.setDate(startDate.getDate() + 6);

//     // Format the label as "Oct 1-7" or similar
//     const label = `${format(startDate, 'MMM d')} - ${format(endDate, 'd')}`;
//     labels.push(label);
//   });

//   return labels;
// }


// // Function to create a bar chart
// createBarChart(chartId: string, label: string, labels: string[], data: number[]) {
//   const chartConfig: ChartConfiguration<'bar', number[], string> = {
//     type: 'bar',
//     data: {
//       labels: labels,
//       datasets: [
//         {
//           label: label,
//           data: data,
//           backgroundColor: 'rgba(75, 192, 192, 0.2)',
//           borderColor: 'rgba(75, 192, 192, 1)',
//           borderWidth: 1,
//         },
//       ],
//     },
//     options: {
//       responsive: true,
//       scales: {
//         x: {
//           type: 'category',
//         },
//         y: {
//           type: 'linear',
//           min: 0,
//         },
//       },
//     },
//   };

//   const ctx = (document.getElementById(chartId) as HTMLCanvasElement).getContext('2d');
//   if (ctx) {
//     new Chart(ctx, chartConfig);
//   } else {
//     console.error('Canvas element not found or context is not accessible.');
//   }
// }

  

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

 
  ngOnDestroy(): void {
    if (this.reportSubscription) {
      this.reportSubscription.unsubscribe();
    }
  }
}
