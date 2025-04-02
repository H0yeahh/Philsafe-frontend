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
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { ThisReceiver } from '@angular/compiler';

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
  accounts: any = [];
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
  token: string;

  showModal = false;
  showSubModal = false;
  modalType: 'weekly' | 'monthly' | 'annual' | null = null;
  selectedReports: any[] = [];
  isModalOpen: boolean;
  filteredWeekly: any[]  = [];
  filteredMonthly: any[]  = [];
  filteredAnnually: any[]  = [];
  citizens: any = [];


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
    this.fetchCases();
    this.fetchAccounts();
  //  this.fetchCitizens();
    // this.calculateReportsAverage();
    this.calculateReports()
    this.calculateReportsCount();
    this.updateDateTime();
  setInterval(() => this.updateDateTime(), 60000);
  this.intervalId = setInterval(() => this.updateDateTime(), 1000);
  const tokenData = localStorage.getItem('AuthCookie')
  // localStorage.setItem('AuthCookie', this.token);

    this.timePeriodControl = new FormControl('weekly');

    this.timePeriodControl.valueChanges.subscribe((value) => {
      console.log('Time period changed:', value);
      this.onSelect();
    });

    this.onSelect();
    console.log('Initial form value:', this.timePeriodControl.value);
    console.log('Form valid:', this.dashboardForm.valid);


    const authState = localStorage.getItem('auth_state');
    console.log('Auth Cookie', authState)
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

  // fetchCitizens(): void {
  //   this.caseQueueService.getCitizens().subscribe(
  //     (response) => {
  //       this.citizens = response;
  //       localStorage.setItem('citizens', JSON.stringify(response));
  //       console.log('citizens length', JSON.stringify(localStorage.getItem('citizens')).length)

      
  //       // console.log('Fetched citizens:', this.citizens);
   
  //     },
  //     (error) => {
  //       console.error('Error fetching citizens:', error);
  //       this.errorMessage = 'Failed to load citizens. Please try again.';
  //     }
  //   );
  // }


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

  

  fetchCases(){

    this.caseService.getAllCases().subscribe(
      (response) => {
        this.cases = response;
        // console.log('Fetched Cases:', this.cases);
        // localStorage.setItem('cases', JSON.stringify(this.cases));
      },
      (error) => {
        console.error('Error Fetching Cases:', error);
      });

  }


  
  fetchReportStation(stationId: number) {
    this.caseQueueService.getReports(stationId).subscribe(
      (response) => {
        this.reports = response;
        localStorage.setItem('reports', JSON.stringify(this.reports));
        // console.log('Fetched Reports', this.reports);
        if (this.reports && this.reports.length) {
          // this.calculateReportsAverage();
          this.calculateReports()
          this.calculateReportsCount();
          this.onSelect();
          // this.createChart();
        } else {
          console.warn('No reports available.');
        }
      },
      (error) => {
        // console.error('Error Fetching Reports in Station ', error);
      }
    );
  }


  fetchAccounts(): void {
    this.accountService.getAccount().subscribe(
      (response) => {
        this.accounts = response;
        // localStorage.setItem('accounts', JSON.stringify(response));
        // console.log('Fetched Accounts', this.accounts);
       
      },
      (error) => {
        console.error('Error fetching Accounts:', error);
        this.errorMessage = 'Failed to load persons. Please try again.';
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

  // calculateReportsAverage() {
 
  //   const currentDate = new Date();
  //   const currentYear = currentDate.getFullYear();

  //   // Group reports by week, month, and year
  //   const weeklyReports: { [week: string]: number } = {};
  //   const monthlyReports: { [month: string]: number } = {};
  //   const annualReports: { [year: string]: number } = {};

  //   this.reports.forEach((report) => {
  //     const reportedDate = new Date(report.reported_date);
  //     const weekKey = `Week${Math.ceil(reportedDate.getDate() / 7)}-${
  //       reportedDate.getMonth() + 1
  //     }-${reportedDate.getFullYear()}`;
  //     const monthKey = `${reportedDate.toLocaleString('default', {
  //       month: 'short',
  //     })}-${reportedDate.getFullYear()}`;
  //     const yearKey = `${reportedDate.getFullYear()}`;

  //     weeklyReports[weekKey] = (weeklyReports[weekKey] || 0) + 1;
  //     monthlyReports[monthKey] = (monthlyReports[monthKey] || 0) + 1;
  //     annualReports[yearKey] = (annualReports[yearKey] || 0) + 1;
  //   });

  //   // Calculate weekly and monthly averages
  //   const totalWeeks = Object.keys(weeklyReports).length;
  //   const totalMonths = Object.keys(monthlyReports).length;
  //   const totalAnnualReports = Object.keys(annualReports).length;

  //   const weeklyAverage = totalWeeks
  //     ? Math.round(this.reports.length / totalWeeks)
  //     : 0;
  //   const monthlyAverage = totalMonths
  //     ? Math.round(this.reports.length / totalMonths)
  //     : 0;
  //   const annualAverage = totalAnnualReports
  //     ? Math.round(
  //         Object.values(annualReports).reduce((a, b) => a + b, 0) /
  //           totalAnnualReports
  //       )
  //     : 0;

  //   this.weeklyAvg = weeklyAverage;
  //   this.monthlyAvg = monthlyAverage;
  //   this.annualAvg = annualAverage;

  //   console.log('Weekly Average:', this.weeklyAvg);
  //   console.log('Monthly Average:', this.monthlyAvg);
  //   console.log('Annual Average:', this.annualAvg);
  // }


  calculateReports() {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth(); // 0-indexed (0 = Jan, 11 = Dec)
    const currentWeekStart = new Date(currentDate);
    currentWeekStart.setDate(currentDate.getDate() - currentDate.getDay()); // Start of the current week (Sunday)
  
    let weeklyCount = 0;
    let monthlyCount = 0;
    let annualCount = 0;
  
    this.reports.forEach((report) => {
      const reportedDate = new Date(report.reported_date);
   
      if (reportedDate.getFullYear() === currentYear) {
        annualCount++
        this.filteredAnnually.push(report);
  
        if (reportedDate.getMonth() === currentMonth) {
          monthlyCount++
          this.filteredMonthly.push(report);
  
          if (reportedDate >= currentWeekStart) {
            weeklyCount++
            this.filteredWeekly.push(report);
          }
        }
      }
    });
  
    this.weeklyReports = weeklyCount;
    this.monthlyReports = monthlyCount;
    this.annualReports = annualCount;
  
    console.log("Weekly Reports:", this.weeklyReports);
    console.log("Monthly Reports:", this.monthlyReports);
    console.log("Annual Reports:", this.annualReports);
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



  exportReports(type: 'xlsx' | 'csv', reportType: 'all' | 'filtered') {
    let dataToExport = [];
  
    if (reportType === 'all') {
      dataToExport = this.reports; // All reports
    } else if (reportType === 'filtered') {
      if (this.modalType === 'weekly') {
        dataToExport = this.filteredWeekly;
      } else if (this.modalType === 'monthly') {
        dataToExport = this.filteredMonthly;
      } else if (this.modalType === 'annual') {
        dataToExport = this.filteredAnnually;
      }
    }
  
    if (!dataToExport.length) {
      console.warn('No data available for export.');
      return;
    }
  
    if (type === 'xlsx') {
      this.exportToExcel(dataToExport, reportType);
    } else {
      this.exportToCSV(dataToExport, reportType);
    }
  }

  onExportChange(event: Event) {
    const selectedValue = (event.target as HTMLSelectElement).value;
    if (!selectedValue) return;
  
    const [format, type] = selectedValue.split('-');
    this.exportReports(format as 'xlsx' | 'csv', type as 'all' | 'filtered');
  }
  

  exportToExcel(data: any[], type: 'all' | 'filtered') {
    const worksheetName = type === 'all' ? 'All Reports' : this.getWorksheetName(this.modalType);
    
  
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, worksheetName);
  
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const dataBlob = new Blob([excelBuffer], { type: 'application/octet-stream' });
  
      if(type === 'all') {
      saveAs(dataBlob, `all_reports_${new Date().toISOString()}.xlsx`);
    }
    else if(type === 'filtered'){
    saveAs(dataBlob, `${this.modalType}_reports_${new Date().toISOString()}.xlsx`);
   }
  }
  
  getWorksheetName(reportType?: 'weekly' | 'monthly' | 'annual'): string {
    switch (reportType) {
      case 'weekly': return 'Weekly Report';
      case 'monthly': return 'Monthly Report';
      case 'annual': return 'Annual Report';
      default: return 'Filtered_Reports';
    }
  }
  
  exportToCSV(data: any[], type: 'all' | 'filtered') {
    if (!data || data.length === 0) {
      console.warn('No data available for export.');
      return;
    }
  
    // Convert data to CSV format
    const csvContent = [
      Object.keys(data[0]).join(','), 
      ...data.map((row) => Object.values(row).map(value => `"${value}"`).join(',')) // Rows
    ].join('\n');
  
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  
    const fileName = type === 'all' 
      ? `all_reports_${new Date().toISOString()}.csv` 
      : `${this.modalType}_${new Date().toISOString()}.csv`;
  
    saveAs(blob, fileName);
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


  openModal(type: 'weekly' | 'monthly' | 'annual') {
    this.modalType = type
    this.isModalOpen = true

    if(type === 'weekly') {      
      this.filteredWeekly;
      console.log('Filtered Weekly', this.filteredWeekly);
    } else if (type== 'monthly') {        
      this.filteredMonthly;
      console.log('Filtered Monthly', this.filteredMonthly);
    } else if (type== 'annual') {
      this.filteredAnnually;
      console.log('Filtered Annually', this.filteredAnnually);

    }
  }

  closeModal() {
    this.isModalOpen = false
    this.modalType = null;
    // this.reports = [];
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

}
