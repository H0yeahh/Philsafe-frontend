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
