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
import { AccountService } from '../account.service';

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
  cases: any = [];
  currentPage: number = 1; 
  pageSize: number = 10; 

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
  currentDate: string = '';
  currentTime: string = '';
  intervalId: any;
  avatarUrl: string = 'assets/ccpo_logo.jpg';

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
    private caseQueueService: CaseQueueService,
    private accountService: AccountService
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
 
    this.loadUserProfile();
    this.fetchReportStation(this.stationId);
    this.calculateReportsAverage();
    this.calculateReportsCount();
    this.updateDateTime();
  setInterval(() => this.updateDateTime(), 60000);
  this.intervalId = setInterval(() => this.updateDateTime(), 1000);

    this.timePeriodControl = new FormControl('weekly');

    this.timePeriodControl.valueChanges.subscribe((value) => {
      console.log('Time period changed:', value);
      this.onSelect();
    });

    this.onSelect();
    console.log('Initial form value:', this.timePeriodControl.value);
    console.log('Form valid:', this.dashboardForm.valid);
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
    } else if (timePeriod === 'annual') {
      this.createAnnualChart();
    }
  }

  
  


  loadUserProfile() {
    const userData = localStorage.getItem('userData');
    const parsedData = JSON.parse(userData);
    console.log('USER DATA SESSION', userData);
    if (userData) {
      try {
        
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

      this.accountService.getProfPic(parsedData.acc_id).subscribe(
        (profilePicBlob: Blob) => {
          if (profilePicBlob) {
              // Create a URL for the Blob
              this.avatarUrl = URL.createObjectURL(profilePicBlob);
              console.log('PROFILE PIC URL', this.avatarUrl);

          } else {
              console.log('ERROR, DEFAULT PROF PIC STREAMED', this.avatarUrl);
              this.avatarUrl = 'assets/user-default.jpg';
          }
        }
      )
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
        // this.fetchCases(this.stationDetails.station_id)
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
    const annualCounts: { [year: string]: number } = {};

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

      const yearKey = reportedDate.getFullYear().toString();
      annualCounts[yearKey] = (annualCounts[yearKey] || 0) + 1;
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
    console.log('Annual Report Counts:', annualCounts);

    return { weeklyCounts, monthlyCounts, annualCounts };
  }

  calculateReportsAverage() {
 
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


  createAnnualChart() {
    const counts = this.calculateReportsCount();
    if (!counts || !counts.annualCounts) {
      console.warn('No annual data available');
      return;
    }
  
    const annualData = Object.values(counts.annualCounts);
    const annualLabels = Object.keys(counts.annualCounts);
  
    const chartConfig: ChartConfiguration<'bar', number[], string> = {
      type: 'bar',
      data: {
        labels: annualLabels,
        datasets: [
          {
            label: 'Annual Reports',
            data: annualData,
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderColor: 'rgba(54, 162, 235, 1)',
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
    console.log('Annual Chart Generated');
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

    if (this.intervalId) {
      clearInterval(this.intervalId); // Clear the interval when the component is destroyed
    }
  }
}
