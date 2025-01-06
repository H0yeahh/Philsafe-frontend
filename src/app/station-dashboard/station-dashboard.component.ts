import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { StationDashboardService } from '../station-dashboard.service';
import { Subscription } from 'rxjs';
import {
  BarController,
  BarElement,
  CategoryScale,
  Chart,
  ChartConfiguration,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from 'chart.js';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from '@angular/forms';
import { IReport } from '../station-dashboard.service';
import { IStation, JurisdictionService } from '../jurisdiction.service';
import {
  IPerson,
  IRank,
  PoliceAccountsService,
} from '../police-accounts.service';
import { PersonService } from '../person.service';
import { Router } from '@angular/router';
import { CaseService } from '../case.service';
import { AuthService } from '../auth.service';
import { CaseQueueService } from '../case-queue.service';
import { endOfWeek, format, startOfWeek } from 'date-fns';

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
  reports: any = [];
  stations: IStation[] = [];
  persons: IPerson[] = [];
  cases: any = []

  ranks: IRank[] = [];
  personId: any;
  stationID: string | null = null;
  dailyReports = 0;
  weeklyReports = 0;
  monthlyReports = 0;
  annualReports = 0;
  chart: any;
  reportSubscription: Subscription | undefined;
  policePersonData: any;
  policeDetails: any;
  stationDetails: any;
  weeklyAvg: any;
  monthlyAvg: any;
  annualAvg: any;
  stationId: any;
  timePeriodControl: FormControl;

  constructor(
    @Inject(StationDashboardService)
    private stationDashboardService: StationDashboardService,
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
    this.dashboardForm = this.fb.group({
      timePeriod: this.timePeriodControl,
    });
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

    this.timePeriodControl = new FormControl('weekly');

    this.timePeriodControl.valueChanges.subscribe((value) => {
      console.log('Time period changed:', value);
      this.onSelect();
    });

    this.onSelect();
    console.log('Initial form value:', this.timePeriodControl.value);
    console.log('Form valid:', this.dashboardForm.valid);
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
  //     reportedDate: [''],
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
    console.log(
      'onSelect called, current value:',
      this.timePeriodControl.value
    );

    // Destroy existing chart if it exists
    if (this.chart) {
      this.chart.destroy();
      this.chart = null;
    }

    const timePeriod = this.timePeriodControl.value;
    console.log('Selected time period:', timePeriod);

    if (timePeriod === 'weekly') {
      this.createWeeklyChart();
    } else if (timePeriod === 'monthly') {
      this.createMonthlyChart();
    }
  }

  fetchCases(stationId){
    this.caseQueueService.fetchCases(stationId).subscribe(
      (response) => {
        if (Array.isArray(response)) {
          this.cases = response;
        } else {
          this.cases = response.data || [];
          
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
            this.fetchPoliceData(this.policePersonData.police_id);
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

  fetchPoliceData(policeId: number) {
    this.policeAccountsService.getAllPoliceData().subscribe(
      (allPoliceData) => {
        // Find the matching police data by policeId
        const policeData = allPoliceData.find((p) => p.police_id === policeId);
        this.policeDetails = policeData;
        localStorage.setItem('policeDetails', JSON.stringify(policeData));
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
        localStorage.setItem('stationDetails', JSON.stringify(this.stationDetails));
        console.log('Station Data', this.stationDetails);
        this.fetchReportStation(this.stationDetails.station_id);
        this.fetchCases(this.stationDetails.station_id)
      },
      (error) => {
        console.error('Error Fetching Station Data', error);
      }
    );
  }


  
  fetchReportStation(stationId: number) {
    this.caseQueueService.getReports(stationId).subscribe(
      (response) => {
        this.reports = response;
        localStorage.setItem('reports', JSON.stringify(this.reports));
        console.log('Fetched Reports', this.reports);
        if (this.reports && this.reports.length) {
          this.calculateReportsAverage();
          this.calculateReportsCount();
          this.onSelect();
          // this.createChart();
        } else {
          console.warn('No reports available.');
        }
      },
      (error) => {
        console.error('Error Fetching Reports in Station ', error);
      }
    );
  }

  calculateReportsCount() {
    if (!this.reports || !this.reports.length) {
      console.warn('No reports to calculate counts.');
      return { weeklyCounts: {}, monthlyCounts: {} };
    }

    // Create an array to store week data for sorting
    const weekData: {
      startDate: Date;
      label: string;
      count: number;
    }[] = [];

    const monthlyCounts: { [month: string]: number } = {};

    this.reports.forEach((report) => {
      const reportedDate = new Date(report.reported_date);

      // Calculate the start and end of the week
      const start = startOfWeek(reportedDate, { weekStartsOn: 0 });
      const end = endOfWeek(reportedDate, { weekStartsOn: 0 });
      const weekLabel = `${format(start, 'MMM d')}-${format(end, 'd, yyyy')}`;

      // Find existing week entry or create new one
      let weekEntry = weekData.find((w) => w.label === weekLabel);
      if (!weekEntry) {
        weekEntry = {
          startDate: start,
          label: weekLabel,
          count: 0,
        };
        weekData.push(weekEntry);
      }
      weekEntry.count++;

      // Handle monthly counts as before
      const monthKey = `${reportedDate.toLocaleString('default', {
        month: 'short',
      })}-${reportedDate.getFullYear()}`;
      monthlyCounts[monthKey] = (monthlyCounts[monthKey] || 0) + 1;
    });

    // Sort weeks by start date
    weekData.sort((a, b) => a.startDate.getTime() - b.startDate.getTime());

    // Convert sorted array back to object
    const weeklyCounts = weekData.reduce((acc, week) => {
      acc[week.label] = week.count;
      return acc;
    }, {} as { [week: string]: number });

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
      const weekKey = `Week${Math.ceil(reportedDate.getDate() / 7)}-${
        reportedDate.getMonth() + 1
      }-${reportedDate.getFullYear()}`;
      const monthKey = `${reportedDate.toLocaleString('default', {
        month: 'short',
      })}-${reportedDate.getFullYear()}`;
      const yearKey = `${reportedDate.getFullYear()}`;

      weeklyReports[weekKey] = (weeklyReports[weekKey] || 0) + 1;
      monthlyReports[monthKey] = (monthlyReports[monthKey] || 0) + 1;
      annualReports[yearKey] = (annualReports[yearKey] || 0) + 1;
    });

    // Calculate weekly and monthly averages
    const totalWeeks = Object.keys(weeklyReports).length;
    const totalMonths = Object.keys(monthlyReports).length;
    const totalAnnualReports = Object.keys(annualReports).length;

    const weeklyAverage = totalWeeks
      ? Math.round(this.reports.length / totalWeeks)
      : 0;
    const monthlyAverage = totalMonths
      ? Math.round(this.reports.length / totalMonths)
      : 0;
    const annualAverage = totalAnnualReports
      ? Math.round(
          Object.values(annualReports).reduce((a, b) => a + b, 0) /
            totalAnnualReports
        )
      : 0;

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
        maintainAspectRatio: false,
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
    console.log('Weekly Chart Generated');
  }

  createMonthlyChart() {
    const counts = this.calculateReportsCount();
    if (!counts || !counts.monthlyCounts) {
      console.warn('No monthly data available');
      return;
    }

    console.log('Monthly data:', counts.monthlyCounts);

    const monthlyData = Object.values(counts.monthlyCounts);
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
        maintainAspectRatio: false,
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
  }

  renderChart(chartConfig: ChartConfiguration) {
    const canvas = document.getElementById('casesGraph') as HTMLCanvasElement;
    if (!canvas) {
      console.error('Canvas element not found');
      return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      console.error('Canvas context not available');
      return;
    }

    console.log('Rendering chart with config:', chartConfig);
    this.chart = new Chart(ctx, chartConfig);
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

  ngOnDestroy(): void {
    if (this.reportSubscription) {
      this.reportSubscription.unsubscribe();
    }
  }
}
