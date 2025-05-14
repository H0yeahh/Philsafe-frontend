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
import { PoliceDashbordService } from '../police-dashbord.service';
import { AccountService } from '../account.service';

@Component({
  selector: 'app-police-dashboard',
  templateUrl: './police-dashboard.component.html',
  styleUrl: './police-dashboard.component.css',
  providers: [PoliceDashbordService],
})
export class PoliceDashboardComponent implements OnInit, OnDestroy {
  policedashboardForm!: FormGroup;
  isLoading = false;
  successMessage: string | null = null;
  errorMessage: string | null = null;
  reports: any = [];
  // stations: IStation[] = [];
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
  adminDetails: any;
  weeklyAvg: any;
  monthlyAvg: any;
  annualAvg: any;
  stationId: any;
  timePeriodControl: FormControl;
  adminData: any
  currentPage: number = 1;
  pageSize: number = 10;
  avatarUrl: string = 'assets/user-default.jpg';
  token: string;
  showModal = false;
  showSubModal = false;
  modalType: 'citizens' | 'polices' | 'stations' | null = null;
  selectedReports: any[] = [];
  isModalOpen: boolean = false;
  filteredWeekly: any[] = [];
  filteredMonthly: any[] = [];
  filteredAnnually: any[] = [];
  citizensCount: number = 0;
  policesCount: number = 0;
  stationsCount: number = 0;

  citizens: any = [];
  polices: any = [];
  stations: any = [];

  

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
    private policeDashbordService: PoliceDashbordService,
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
    this.policedashboardForm = this.fb.group({
      timePeriod: this.timePeriodControl,
    });
    this.timePeriodControl = new FormControl('weekly');
  }

  ngOnInit(): void {
    // this.initializeForm();
    // this.getOfficerStationId();
    // this.fetchRanks();
    this.fetchCitizens();
    this.fetchPolices();
    this.fetchStations();
    // this.fetchPersons();
    // this.fetchNationwideReports();
    this.loadUserProfile();
    // this.fetchReportStation(this.stationId);
    // this.calculateReportsAverage();
    this.calculateReportsCount();
    this.fetchReport();
    // this.calculateReports()
    this.timePeriodControl = new FormControl('polices');

    this.timePeriodControl.valueChanges.subscribe((value) => {
      console.log('Time period changed:', value);
      this.onSelect();
    });

    const userData = localStorage.getItem('userData');
    this.adminDetails = JSON.parse(userData);
    this.fetchAdminData(this.adminDetails.acc_id)
    console.log('Fetched Admin', this.adminDetails)

    this.onSelect();
    console.log('Initial form value:', this.timePeriodControl.value);
    console.log('Form valid:', this.policedashboardForm.valid);
  }

  onSelect() {
    console.log('onSelect called, current value:', this.timePeriodControl.value);
  
    if (this.chart) {
      this.chart.destroy();
      this.chart = null;
    }
  
    const selectedData = this.timePeriodControl.value;
    console.log('Selected data:', selectedData);
  
    if (selectedData === 'polices') {
      this.createPolicesChart();
    } else if (selectedData === 'citizens') {
      this.createCitizensChart();
    } else if (selectedData === 'stations') {
      this.createStationsChart();
    }
  }
  

  // fetchCases(stationId){
  //   this.caseQueueService.fetchCases(stationId, this.currentPage, this.pageSize).subscribe(
  //     (response) => {
  //       if (Array.isArray(response)) {
  //         this.cases = response;
  //       } else {
  //         this.cases = response.data || [];
          
  //       }
  //       console.log("Station ID", stationId);
  //       console.log(`List of Cases in Station ${stationId}`, this.cases);
  //       localStorage.setItem('cases', JSON.stringify(this.cases))
  //     },
  //     (error) => {
  //       console.error('Error fetching cases:', error);
  //       this.errorMessage = 'Failed to load cases. Please try again.';
  //     }
  //   );
  // }


  loadUserProfile() {


    const shouldReload = localStorage.getItem('reloadAfterLogin');
  
    if (shouldReload === 'true') {
      localStorage.removeItem('reloadAfterLogin');
      window.location.reload();
      return;
    }

    const userData = localStorage.getItem('userData');
    const parsedData = JSON.parse(userData);
    console.log('USER DATA SESSION', userData);
    if (userData) {
      try {
        
        this.personId = parsedData.personId;
        // this.policeAccountsService.getPoliceById().subscribe(
        //   (response) => {
        //     this.policePersonData = response;
        //     console.log('Fetched Police Person Data', this.policePersonData);
            
        //     console.log('Police ID:', this.policePersonData.police_id);
        //   },
        //   (error) => {
        //     console.error('Errod Police Person Data', error);
        //   }
        // );

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
  // fetchPoliceData(policeId: number) {
  //   this.policeAccountsService.getAllPoliceData().subscribe(
  //     (allPoliceData) => {
  //       // Find the matching police data by policeId
  //       const policeData = allPoliceData.find((p) => p.police_id === policeId);
  //       this.policeDetails = policeData;
  //       localStorage.setItem('policeDetails', JSON.stringify(policeData));
  //       if (policeData) {
  //         const badgeNumber = this.policeDetails.badge_number;
  //         console.log('Found police data:', policeData);
  //         console.log('Badge Number:', badgeNumber);
  //         this.fetchStation(this.policeDetails.station_id);
  //       } else {
  //         console.error('Police ID not found in all police data');
  //       }
  //     },
  //     (error) => {
  //       // console.error('Error Fetching All Police Data:', error);
  //     }
  //   );
  // }

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

  fetchStation(stationId: number) {
    this.jurisdictionService.getStation(stationId).subscribe(
      (response) => {
        this.stationDetails = response;
        localStorage.setItem('stationDetails', JSON.stringify(this.stationDetails));
        console.log('Station Data', this.stationDetails);
        // this.fetchReportStation(this.stationDetails.station_id);
        // this.fetchCases(this.stationDetails.station_id)
      },
      (error) => {
        console.error('Error Fetching Station Data', error);
      }
    );
  }


  
  // fetchReportStation(stationId: number) {
  //   this.caseQueueService.getReports(stationId).subscribe(
  //     (response) => {
  //       this.reports = response;
  //       localStorage.setItem('reports', JSON.stringify(this.reports));
  //       console.log('Fetched Reports', this.reports);
  //       if (this.reports && this.reports.length) {
  //         this.calculateReportsAverage();
  //         this.calculateReportsCount();
  //         this.onSelect();
  //         // this.createChart();
  //       } else {
  //         console.warn('No reports available.');
  //       }
  //     },
  //     (error) => {
  //       console.error('Error Fetching Reports in Station ', error);
  //     }
  //   );
  // }


  fetchCitizens(){
    this.caseQueueService.getCitizens().subscribe(
      (res) => {
        console.log('Fetched Citizens', res)
        this.citizens = res;
        this.citizensCount = this.citizens.length;
      },
      (err) => {
        console.error('Error fetching citizens', err)
      }
    )
  }


  fetchPolices(){
    this.policeAccountsService.getAllPoliceData().subscribe(
      (res) => {
        console.log('Fetched Polices', res)
        this.polices = res;
        this.policesCount = this.polices.length;
      },
      (err) => {
        console.error('Error fetching polices', err)
      }
    )
  }


  
  fetchStations(){
    this.jurisdictionService.getAll().subscribe(
      (res) => {
        console.log('Fetched Stations', res)
        this.stations = res;
        this.stationsCount = this.stations.length;
      },
      (err) => {
        console.error('Error fetching stations', err)
      }
    )
  }

  fetchReport() {
    this.caseQueueService.getNationwideReports().subscribe(
      (response) => {
        this.reports = response;
        localStorage.setItem('reports', JSON.stringify(this.reports));
        console.log('Fetched Reports', this.reports);
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
  createCitizensChart() {
    const monthlyCounts: { [month: string]: number } = {};
  
    this.citizens.forEach(citizen => {
      const date = new Date(citizen.datetime_created);
  
      // Check if the date is valid
      if (isNaN(date.getTime())) {
        // console.warn('Invalid citizen date:', citizen);
        return; // Skip this citizen
      }
  
      const monthYear = `${date.getFullYear()}-${('0' + (date.getMonth() + 1)).slice(-2)}`;
  
      if (monthlyCounts[monthYear]) {
        monthlyCounts[monthYear]++;
      } else {
        monthlyCounts[monthYear] = 1;
      }
    });
  
    const labels = Object.keys(monthlyCounts).sort();
    const data = labels.map(label => monthlyCounts[label]);
  
    const chartConfig: ChartConfiguration<'bar', number[], string> = {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: 'Registered Citizens Per Month',
            data,
            backgroundColor: 'rgba(113, 235, 168, 0.56)',
            borderColor: 'rgb(127, 240, 212)',
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: { beginAtZero: true },
          y: { beginAtZero: true },
        },
      },
    };
  
    this.renderChart(chartConfig);
    console.log('Citizens Chart Generated (Monthly)');
  }
  
  
  createPolicesChart() {
    const monthlyCounts: { [month: string]: number } = {};
  
    this.polices.forEach(police => {
      if (police.datetime_created) { 
        const date = new Date(police.datetime_created);
  
        if (!isNaN(date.getTime())) {
          const monthYear = `${date.getFullYear()}-${('0' + (date.getMonth() + 1)).slice(-2)}`; // format: YYYY-MM
  
          if (monthlyCounts[monthYear]) {
            monthlyCounts[monthYear]++;
          } else {
            monthlyCounts[monthYear] = 1;
          }
        } else {
          // console.warn('Invalid date found for police:', police);
        }
      } else {
        console.warn('Missing datetime_created for police:', police);
      }
    });
  
    const labels = Object.keys(monthlyCounts).sort();
    const data = labels.map(label => monthlyCounts[label]);
  
    const chartConfig: ChartConfiguration<'bar', number[], string> = {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: 'Registered Polices Per Month',
            data,
            backgroundColor: 'rgba(99, 245, 255, 0.5)',
            borderColor: 'rgb(10, 177, 199)',
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: { beginAtZero: true },
          y: { beginAtZero: true },
        },
      },
    };
  
    this.renderChart(chartConfig);
    console.log('Polices Chart Generated (Monthly)');
  }
  
  
  createStationsChart() {
    const monthlyCounts: { [month: string]: number } = {};
  
    this.stations.forEach(station => {
      const date = new Date(station.datetime_created);
  
      if (isNaN(date.getTime())) {
        // console.warn('Invalid station date:', station);
        return;
      }
  
      const monthYear = `${date.getFullYear()}-${('0' + (date.getMonth() + 1)).slice(-2)}`;
  
      if (monthlyCounts[monthYear]) {
        monthlyCounts[monthYear]++;
      } else {
        monthlyCounts[monthYear] = 1;
      }
    });
  
    const labels = Object.keys(monthlyCounts).sort();
    const data = labels.map(label => monthlyCounts[label]);
  
    const chartConfig: ChartConfiguration<'bar', number[], string> = {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: 'Registered Stations Per Month',
            data,
            backgroundColor: 'rgba(231, 205, 118, 0.56)',
            borderColor: 'rgb(248, 196, 24)',
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: { beginAtZero: true },
          y: { beginAtZero: true },
        },
      },
    };
  
    this.renderChart(chartConfig);
    console.log('Stations Chart Generated (Monthly)');
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



  calculateReports() {
    if (!this.reports || !this.reports.length) {
      console.warn('No reports to calculate counts.');
      return;
    }
    
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth(); // 0-indexed (0 = Jan, 11 = Dec)
    
    // Get start of current week (Sunday)
    const currentWeekStart = new Date(currentDate);
    currentWeekStart.setDate(currentDate.getDate() - currentDate.getDay());
    
    // Clear previous filtered arrays
    this.filteredWeekly = [];
    this.filteredMonthly = [];
    this.filteredAnnually = [];
    
    let weeklyCount = 0;
    let monthlyCount = 0;
    let annualCount = 0;
    
    this.reports.forEach((report) => {
      const reportedDate = new Date(report.reported_date);
      
      // Check for annual reports (same year)
      if (reportedDate.getFullYear() === currentYear) {
        annualCount++;
        this.filteredAnnually.push(report);
        
        // Check for monthly reports (same month and year)
        if (reportedDate.getMonth() === currentMonth) {
          monthlyCount++;
          this.filteredMonthly.push(report);
          
          // Check for weekly reports (in current week)
          if (reportedDate >= currentWeekStart) {
            weeklyCount++;
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

  openModal(type: 'citizens' | 'polices' | 'stations') {
    this.modalType = type;
    this.isModalOpen = true;
  
    console.log(`Opened modal: ${type}`);
  }

 
  closeModal() {
    this.isModalOpen = false;
    this.modalType = null;
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