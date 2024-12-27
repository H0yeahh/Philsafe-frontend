import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CaseQueueService } from '../case-queue.service';
import { Router } from '@angular/router';
import { IReport } from '../case.service';
import { IStation, JurisdictionService } from '../jurisdiction.service';
import { IPerson, IRank, PoliceAccountsService } from '../police-accounts.service';
import { PersonService } from '../person.service';
// import { CreateCaseService, ICase } from '../create-case.service';
import { CreateCasesService, ICase } from '../create-cases.service';


@Component({
  selector: 'app-police-cases',
  templateUrl: './police-cases.component.html',
  styleUrl: './police-cases.component.css'
})
export class PoliceCasesComponent implements OnInit {
  policecaseForm!: FormGroup;  // Form group for report submission
  isLoading = false;
  successMessage: string | null = null;
  errorMessage: string | null = null;
  reports: any;  // Array to hold fetched reports
  stations: IStation[] = [];
  persons: IPerson[] = [];
  ranks: IRank[] = [];
  case: ICase[] = [];
  
  stationID: string | null = null;

  constructor(
    private fb: FormBuilder,
    private caseQueueService: CaseQueueService,
    private jurisdictionService: JurisdictionService,
    private policeAccountsService: PoliceAccountsService,
    private personService: PersonService,
    // private createCaseService: CreateCaseService,
    private createCasesService: CreateCasesService,
    private router: Router
  ) {}

  // Initialize the form and fetch reports, stations, and ranks
  ngOnInit(): void {
    this.initializeForm();
    this.getOfficerStationId(); // Fetch officer's station ID on init
    this.fetchRanks();
    this.fetchStations();
    this.fetchPersons();
    this.fetchnationwideReports();
    this.fetchnationwideCase();

  }

  // Define the form controls
  initializeForm(): void {
    this.policecaseForm = this.fb.group({
      title: ['', Validators.required], 
      offenseType: ['', Validators.required], 
      citeNumber: ['', Validators.required], 
      datetimeReported: ['', Validators.required], 
      datetimeCommitted: ['', Validators.required], 
      description: ['', Validators.required], 
      status: ['', Validators.required], 
      incidenttypeId: ['', Validators.required], 
      datetimeCreated: ['', Validators.required], 
      lastModified: ['', Validators.required], 
      createdBy: ['', Validators.required], 
      modifiedBy: ['', Validators.required], 
      locationId: ['', Validators.required], 
      stationId: ['', Validators.required], 
      victim_id_list: ['', Validators.required], 
      suspect_id_list: ['', Validators.required], 
      police_id_list: ['', Validators.required], 
    });
  }

  // Get the officer's station ID from the logged-in account
  getOfficerStationId(): void {
    // Assuming the officer's details are stored in localStorage after login
    const officerDetails = JSON.parse(localStorage.getItem('officer_details') || '{}');
    this.stationID = officerDetails.stationId || null;
    
    if (this.stationID) {
      this.fetchReports(this.stationID); // Fetch reports using the station ID
    } else {
      this.errorMessage = 'Station ID not found.';
    }
  }

  // Fetch reports from the backend service
  fetchReports(stationId: string): void {
    this.isLoading = true;  // Set loading state to true
    this.caseQueueService.getReports(Number(stationId)).subscribe(
      (response) => {
        if (Array.isArray(response)) {
          this.reports = response;
          console.log('Fetched reports:', this.reports);
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

  fetchnationwideReports(): void {
    this.isLoading = true;  // Set loading state to true
    this.caseQueueService.getNationwideReports().subscribe(
      (response) => {
        if (Array.isArray(response)) {
          this.reports = response;
          console.log('Fetched reports:', this.reports);
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

  fetchnationwideCase(): void {
    this.isLoading = true;  // Set loading state to true
    this.createCasesService.getNationwideCase().subscribe(
      (response) => {
        if (Array.isArray(response)) {
          this.case = response as ICase[];
          console.log('Fetched case:', this.case);
        } else {
          this.errorMessage = 'Unexpected response from server.';
        }
        this.isLoading = false;
      },
      (error) => {
        console.error('Error fetching case:', error);
        this.errorMessage = 'Failed to load case. Please try again.';
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
    if (this.policecaseForm.invalid) {
      alert('Please fill all required fields correctly.');
      return;
    }

    this.isLoading = true;
    const formData = this.policecaseForm.value;

    const cases: ICase = {
      title: formData.title,
      offenseType: formData.offenseType,
      citeNumber: formData.citeNumber,
      datetimeReported: new Date().toISOString(),
      datetimeCommitted: new Date().toISOString(),
      description: formData.description,
      status: formData.status,
      incidenttypeId: formData.incidenttypeId.toSting(),
      datetimeCreated: new Date().toISOString(),
      lastModified: formData.lastModified,
      createdBy: formData.createdBy,
      modifiedBy: formData.modifiedBy,
      locationId: formData.locationId || null,
      stationId: formData.stationId,
      victim_id_list: formData.victim_id_list,
      suspect_id_list: formData.suspect_id_list,
      police_id_list: formData.police_id_list,
    };

    console.log('Submitting case with data:', cases);

    // this.submitReportForm(report);
  }

  // Submit the form data to the service
  // submitReportForm(report: IReport): void {
  //   this.caseQueueService.submitReport(report).subscribe(
  //     (response: any) => {
  //       this.isLoading = false;
  //       this.successMessage = 'Report submitted successfully!';
  //       this.errorMessage = null;
  //       this.casesForm.reset();  // Clear the form after successful submission
  //       this.router.navigate(['/station-case-queue']);  // Redirect
  //     },
  //     (error) => {
  //       this.isLoading = false;
  //       console.error('Error during report submission:', error);
  //       this.errorMessage = 'Submission failed. Please try again.';
  //     }
  //   );
  // }

  goBack(): void {
    this.router.navigate(['/manage-police']);
  }
}
