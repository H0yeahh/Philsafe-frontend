// import { Component, OnInit } from '@angular/core';
// import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { CaseQueueService } from '../case-queue.service';
// import { Router } from '@angular/router';
// import { IReport } from '../case.service';
// import { IStation, JurisdictionService } from '../jurisdiction.service';
// import { IPerson, IRank, PoliceAccountsService } from '../police-accounts.service';
// import { PersonService } from '../person.service';

// @Component({
//   selector: 'app-manage-station',
//   templateUrl: './manage-station.component.html',
//   styleUrl: './manage-station.component.css'
// })
// export class ManageStationComponent implements OnInit{
//  managestationForm!: FormGroup;  // Form group for report submission
//   isLoading = false;
//   successMessage: string | null = null;
//   errorMessage: string | null = null;
//   reports: IReport[] = [];  // Array to hold fetched reports
//   stations: IStation[] = [];
//   persons: IPerson[] = [];
//   ranks: IRank[] = [];
  
//   stationID: string | null = null;

//   constructor(
//     private fb: FormBuilder,
//     private caseQueueService: CaseQueueService,
//     private jurisdictionService: JurisdictionService,
//     private policeAccountsService: PoliceAccountsService,
//     private personService: PersonService,
//     private router: Router
//   ) {}

//   // Initialize the form and fetch reports, stations, and ranks
//   ngOnInit(): void {
//     this.initializeForm();
//     this.getOfficerStationId(); // Fetch officer's station ID on init
//     this.fetchRanks();
//     this.fetchStations();
//     this.fetchPersons();
//     this.fetchnationwideReports();
//   }

//   // Define the form controls
//   initializeForm(): void {
//     this.managestationForm = this.fb.group({
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
//       status: ['', Validators.required], 
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

//   // Submit the form
//   onSubmit(): void {
//     if (this.managestationForm.invalid) {
//       alert('Please fill all required fields correctly.');
//       return;
//     }

//     this.isLoading = true;
//     const formData = this.managestationForm.value;

//     const report: IReport = {
//       reportBody: formData.reportBody,
//       citizen_id: formData.citizenID,
//       reportSubCategoryID: formData.reportSubCategoryID,
//       locationID: formData.locationID || null, // Handle optional fields
//       stationID: formData.stationID,
//       crimeID: formData.crimeID || null, // Handle optional fields
//       reportedDate: formData.reportedDate,
//       incidentDate: formData.incidentDate || null, // Handle optional fields
//       blotterNum: formData.blotterNum,
//       hasAccount: formData.hasAccount,
//       eSignature: formData.eSignature,
//       report_id: 0,  // This will be set by the server
//       type: formData.type,
//       complainant: formData.complainant,
//       reported_date: formData.reported_date,
//       ReportBody: formData.reportBody, // Use reportBody from form
//       subcategory_name:formData.subcategory_name,
//       reportSubCategory: formData.reportSubCategory,
//       ReportSubCategoryId: formData.reportSubCategoryID.toString(),
//       DateTimeReportedDate: new Date().toISOString(),
//       HasAccount: formData.hasAccount.toString(),
//       status: formData.staus
//     };

//     console.log('Submitting report with data:', report);

//     this.submitReportForm(report);
//   }

//   // Submit the form data to the service
//   submitReportForm(report: IReport): void {
//     this.caseQueueService.submitReport(report).subscribe(
//       (response: any) => {
//         this.isLoading = false;
//         this.successMessage = 'Report submitted successfully!';
//         this.errorMessage = null;
//         this.managestationForm.reset();  // Clear the form after successful submission
//         this.router.navigate(['/station-case-queue']);  // Redirect
//       },
//       (error) => {
//         this.isLoading = false;
//         console.error('Error during report submission:', error);
//         this.errorMessage = 'Submission failed. Please try again.';
//       }
//     );
//   }

//   goBack(): void {
//     this.router.navigate(['/manage-police']);
//   }
// }




// import { Component, OnInit } from '@angular/core';
// import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { IStation, ManageStationService } from '../manage-station.service';
// import { Router } from '@angular/router';
// import { IReport } from '../case.service';
// import { JurisdictionService } from '../jurisdiction.service';
// import { IPerson, IRank, PoliceAccountsService } from '../police-accounts.service';
// import { PersonService } from '../person.service';

// @Component({
//   selector: 'app-manage-station',
//   templateUrl: './manage-station.component.html',
//   styleUrls: ['./manage-station.component.css' ]
// })
// export class ManageStationComponent implements OnInit {
//   managestationForm!: FormGroup;  // Form group for report submission
//   isLoading = false;
//   successMessage: string | null = null;
//   errorMessage: string | null = null;
//   reports: IReport[] = [];  // Array to hold fetched reports
//   stations: IStation[] = [];  // Array to hold fetched stations
//   persons: IPerson[] = [];  // Array to hold fetched persons
//   ranks: IRank[] = [];  // Array to hold fetched ranks
//   stationID: string | null = null;

//   constructor(
//     private fb: FormBuilder,
//     private managestationService: ManageStationService,
//     private jurisdictionService: JurisdictionService,
//     private policeAccountsService: PoliceAccountsService,
//     private personService: PersonService,
//     private router: Router
//   ) {}

//   // Initialize the form and fetch reports, stations, and ranks
//   ngOnInit(): void {
//     this.initializeForm();
//     this.getOfficerStationId(); // Fetch officer's station ID on init
//     this.fetchRanks();
//     this.fetchStations();
//     this.fetchPersons();
//     this.fetchStation();
//   }

//   // Define the form controls
//   initializeForm(): void {
//     this.managestationForm = this.fb.group({
//       station_id: ['', Validators.required],
//       hq: ['', Validators.required],
//       location_id: [''],  // Optional field
//       // stationID: ['', Validators.required],
//       abbr: ['', Validators.required],
//       rank: ['', Validators.required],
//       is_approved: [true],
//       officer_in_charge_id: ['', Validators.required],  // Assuming eSignature is a string or file
//       province: ['', Validators.required],  // Rank field added
//       municipality: ['', Validators.required],  // Person field added
//       street: ['', Validators.required],
//       region: ['', Validators.required],
//       barangay: ['', Validators.required],
//     });
//   }

//   // Get the officer's station ID from the logged-in account
//   getOfficerStationId(): void {
//     const officerDetails = JSON.parse(localStorage.getItem('officer_details') || '{}');
//     this.stationID = officerDetails.stationId || null;

//     if (this.stationID) {
//       this.fetchStations(this.stationID); // Fetch reports using the station ID
//     } else {
//       this.errorMessage = 'Station ID not found.';
//     }
//   }

//   // // Fetch reports from the backend service
//   fetchlocalStation(stationId: string): void {
//     this.isLoading = true;  // Set loading state to true
//     this.managestationService.getStation(Number(stationId)).subscribe(
//       (response) => {
//         if (Array.isArray(response)) {
//           this.stations = response as IStation[];
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
//   fetchStations(stationID: string): void {
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
//     if (this.managestationForm.invalid) {
//       alert('Please fill all required fields correctly.');
//       return;
//     }

//     this.isLoading = true;
//     const formData = this.managestationForm.value;

//     const station: IStation = {
//       station_id: formData.station_id,
//       hq: formData.hq,
//       location_id: formData.location_id,
//       abbr: formData.abbr,
//       rank: formData.rank,
//       province: formData.province,
//       municipality: formData.municipality,
//       street: formData.street,
//       region: formData.region,
//       barangay: formData.barangay,
//       officer_in_charge_id: formData.officer_in_charge_id,
//       is_approved: formData.is_approved.toString(),
//     };

//     console.log('Submitting station with data:', station);
//     this.submitmanagestationForm(station);
//   }

//   // Submit the form data to the service
//   submitmanagestationForm(station: IStation): void {
//     this.managestationService.submitStation(station).subscribe(
//       (response: any) => {
//         this.isLoading = false;
//         this.successMessage = 'Report submitted successfully!';
//         this.errorMessage = null;
//         this.managestationForm.reset();  // Clear the form after successful submission
//         this.router.navigate(['/manage-station']);  // Redirect
//       },
//       (error) => {
//         this.isLoading = false;
//         console.error('Error during report submission:', error);
//         this.errorMessage = 'Submission failed. Please try again.';
//       }
//     );
//   }

//   // Navigate back
//   goBack(): void {
//     this.router.navigate(['/manage-police']);
//   }
// }


// import { Component, OnInit } from '@angular/core';
// import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { IStation, ManageStationService } from '../manage-station.service';
// import { Router } from '@angular/router';
// import { JurisdictionService } from '../jurisdiction.service';
// import { IPerson, IRank, PoliceAccountsService } from '../police-accounts.service';
// import { PersonService } from '../person.service';

// @Component({
//   selector: 'app-manage-station',
//   templateUrl: './manage-station.component.html',
//   styleUrls: ['./manage-station.component.css']
// })
// export class ManageStationComponent implements OnInit {
//   managestationForm!: FormGroup;
//   isLoading = false;
//   successMessage: string | null = null;
//   errorMessage: string | null = null;
//   stations: IStation[] = [];
//   persons: IPerson[] = [];
//   ranks: IRank[] = [];
//   stationID: string | null = null;

//   constructor(
//     private fb: FormBuilder,
//     private managestationService: ManageStationService,
//     private jurisdictionService: JurisdictionService,
//     private policeAccountsService: PoliceAccountsService,
//     private personService: PersonService,
//     private router: Router
//   ) {}

//   ngOnInit(): void {
//     this.initializeForm();
//     this.getOfficerStationId();
//     this.fetchRanks();
//     this.fetchStations();
//     this.fetchPersons();
//   }

//   // Define the form controls
//   initializeForm(): void {
//     this.managestationForm = this.fb.group({
//       station_id: ['', Validators.required],
//       hq: ['', Validators.required],
//       location_id: [''],
//       abbr: ['', Validators.required],
//       rank: ['', Validators.required],
//       is_approved: [true],
//       officer_in_charge_id: ['', Validators.required],
//       province: ['', Validators.required],
//       municipality: ['', Validators.required],
//       street: ['', Validators.required],
//       region: ['', Validators.required],
//       barangay: ['', Validators.required],
//     });
//   }

//   // Retrieve the officer's station ID from stored details
//   getOfficerStationId(): void {
//     const officerDetails = JSON.parse(localStorage.getItem('officer_details') || '{}');
//     this.stationID = officerDetails.stationId || null;

//     if (this.stationID) {
//       this.fetchLocalStation(this.stationID);
//     } else {
//       this.errorMessage = 'Station ID not found.';
//     }
//   }

//   // Fetch a specific station based on station ID
//   fetchLocalStation(stationId: string): void {
//     this.isLoading = true;
//     this.managestationService.getLocalStation(Number(stationId)).subscribe(
//       (response: IStation[]) => {
//         this.stations = response;  // Adjusted to handle the response as an array
//         console.log('Fetched station:', this.stations);
//         this.isLoading = false;
//       },
//       (error) => {
//         console.error('Error fetching station:', error);
//         this.errorMessage = 'Failed to load station. Please try again.';
//         this.isLoading = false;
//       }
//     );
//   }

//   // Fetch list of all stations
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

//   // Submit the form data
//   onSubmit(): void {
//     if (this.managestationForm.invalid) {
//       alert('Please fill all required fields correctly.');
//       return;
//     }

//     this.isLoading = true;
//     const formData = this.managestationForm.value;

//     const station: IStation = {
//       station_id: formData.station_id,
//       hq: formData.hq,
//       location_id: formData.location_id || null,
//       abbr: formData.abbr,
//       rank: formData.rank,
//       province: formData.province,
//       municipality: formData.municipality,
//       street: formData.street,
//       region: formData.region,
//       barangay: formData.barangay,
//       officer_in_charge_id: formData.officer_in_charge_id,
//       is_approved: formData.is_approved
//     };

//     console.log('Submitting station with data:', station);
//     this.submitManageStationForm(station);
//   }

//   // Call service to submit the station data
//   submitManageStationForm(station: IStation): void {
//     this.managestationService.submitStation(station).subscribe(
//       (response: IStation) => {
//         this.isLoading = false;
//         this.successMessage = 'Station submitted successfully!';
//         this.errorMessage = null;
//         this.managestationForm.reset();

//         // Display success message briefly before navigating
//         setTimeout(() => this.router.navigate(['/manage-station']), 2000);
//       },
//       (error) => {
//         this.isLoading = false;
//         console.error('Error during station submission:', error);
//         this.errorMessage = 'Submission failed. Please try again.';
//       }
//     );
//   }

//   // Navigate back to the previous screen
//   goBack(): void {
//     this.router.navigate(['/manage-police']);
//   }
// }



import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IStation, ManageStationService } from '../manage-station.service';
import { Router } from '@angular/router';
import { JurisdictionService } from '../jurisdiction.service';
import { IPerson, IRank, PoliceAccountsService } from '../police-accounts.service';
import { PersonService } from '../person.service';

@Component({
  selector: 'app-manage-station',
  templateUrl: './manage-station.component.html',
  styleUrls: ['./manage-station.component.css']
})
export class ManageStationComponent implements OnInit {
  managestationForm!: FormGroup;
  isLoading = false;
  successMessage: string | null = null;
  errorMessage: string | null = null;
  stations: IStation[] = [];
  filteredStations: IStation[] = [];
  persons: IPerson[] = [];
  ranks: IRank[] = [];
  stationID: string | null = null;

  constructor(
    private fb: FormBuilder,
    private managestationService: ManageStationService,
    private jurisdictionService: JurisdictionService,
    private policeAccountsService: PoliceAccountsService,
    private personService: PersonService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.getOfficerStationId();
    this.fetchRanks();
    this.fetchStations();
    this.fetchPersons();
  }

  // Define the form controls
  initializeForm(): void {
    this.managestationForm = this.fb.group({
      station_id: ['', Validators.required],
      hq: ['', Validators.required],
      location_id: [''],
      abbr: ['', Validators.required],
      rank: ['', Validators.required],
      is_approved: [true],
      officer_in_charge_id: ['', Validators.required],
      province: ['', Validators.required],
      municipality: ['', Validators.required],
      street: ['', Validators.required],
      region: ['', Validators.required],
      barangay: ['', Validators.required],
    });
  }

  // Retrieve the officer's station ID from stored details
  getOfficerStationId(): void {
    const officerDetails = JSON.parse(localStorage.getItem('officer_details') || '{}');
    this.stationID = officerDetails.stationId || null;

    if (this.stationID) {
      this.fetchLocalStation(this.stationID);
    } else {
      this.errorMessage = 'Station ID not found.';
    }
  }

  // Fetch a specific station based on station ID
  fetchLocalStation(stationId: string): void {
    this.isLoading = true;
    this.managestationService.getLocalStation(Number(stationId)).subscribe(
      (response: IStation[]) => {
        this.stations = response;
        this.filteredStations = response;  // Initialize filtered list as well
        console.log('Fetched station:', this.stations);
        this.isLoading = false;
      },
      (error) => {
        console.error('Error fetching station:', error);
        this.errorMessage = 'Failed to load station. Please try again.';
        this.isLoading = false;
      }
    );
  }

  // Fetch list of all stations
  fetchStations(): void {
    this.jurisdictionService.getAll().subscribe(
      (response: IStation[]) => {
        this.stations = response;
        this.filteredStations = response; // Initialize filtered list as well
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

  // Submit the form data
  onSubmit(): void {
    if (this.managestationForm.invalid) {
      alert('Please fill all required fields correctly.');
      return;
    }

    this.isLoading = true;
    const formData = this.managestationForm.value;

    const station: IStation = {
      station_id: formData.station_id,
      hq: formData.hq,
      location_id: formData.location_id || null,
      abbr: formData.abbr,
      rank: formData.rank,
      province: formData.province,
      municipality: formData.municipality,
      street: formData.street,
      region: formData.region,
      barangay: formData.barangay,
      officer_in_charge_id: formData.officer_in_charge_id,
      is_approved: formData.is_approved,
      supervising_id: formData. supervising_id
    };

    console.log('Submitting station with data:', station);
    this.submitManageStationForm(station);
  }

  // Call service to submit the station data
  submitManageStationForm(station: IStation): void {
    this.managestationService.submitStation(station).subscribe(
      (response: IStation) => {
        this.isLoading = false;
        this.successMessage = 'Station submitted successfully!';
        this.errorMessage = null;
        this.managestationForm.reset();
        setTimeout(() => this.router.navigate(['/manage-station']), 2000);
      },
      (error) => {
        this.isLoading = false;
        console.error('Error during station submission:', error);
        this.errorMessage = 'Submission failed. Please try again.';
      }
    );
  }

  // Search stations based on input
  onSearch(event: Event): void {
    const searchValue = (event.target as HTMLInputElement).value.toLowerCase();
    this.filteredStations = this.stations.filter(station =>
      station.abbr.toLowerCase().includes(searchValue) ||
      station.hq.toLowerCase().includes(searchValue) ||
      station.station_id.toString().includes(searchValue)
    );
  }

  // Edit station information
  editStation(station: IStation): void {
    this.managestationForm.patchValue({
      station_id: station.station_id,
      hq: station.hq,
      location_id: station.location_id,
      abbr: station.abbr,
      rank: station.rank,
      is_approved: station.is_approved,
      officer_in_charge_id: station.officer_in_charge_id,
      province: station.province,
      municipality: station.municipality,
      street: station.street,
      region: station.region,
      barangay: station.barangay,
      supervising_id: station.supervising_id
    });
    window.scrollTo(0, 0); // Scroll to the top for form view
  }

  // // Delete station
  // deleteStation(stationId: number): void {
  //   if (confirm('Are you sure you want to delete this station?')) {
  //     this.managestationService.deleteStation(stationId).subscribe(
  //       () => {
  //         this.successMessage = 'Station deleted successfully.';
  //         this.stations = this.stations.filter(station => station.station_id !== stationId);
  //         this.filteredStations = this.filteredStations.filter(station => station.station_id !== stationId);
  //       },
  //       (error) => {
  //         console.error('Error deleting station:', error);
  //         this.errorMessage = 'Failed to delete station. Please try again.';
  //       }
  //     );
  //   }
  // }

  // Delete station
deleteStation(stationId: number): void {
  if (confirm('Are you sure you want to delete this station?')) {
    this.jurisdictionService.delete(stationId).subscribe(
      () => {
        this.successMessage = 'Station deleted successfully.';
        this.stations = this.stations.filter(station => station.station_id !== stationId);
        this.filteredStations = this.filteredStations.filter(station => station.station_id !== stationId);
      },
      (error) => {
        console.error('Error deleting station:', error);
        this.errorMessage = 'Failed to delete station. Please try again.';
      }
    );
  }
}

  
  // Navigate back to the previous screen
  goBack(): void {
    this.router.navigate(['/manage-police']);
  }
}
