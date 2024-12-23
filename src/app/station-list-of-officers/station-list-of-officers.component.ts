// import { Component, OnInit } from '@angular/core';
// import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
// import { IStation, ManageStationService } from '../manage-station.service';
// import { Router } from '@angular/router';
// import { IStation, JurisdictionService } from '../jurisdiction.service';
// import { IPerson,IRank,PoliceAccountsService} from '../police-accounts.service';
// import { PersonService } from '../person.service';
// import { ICitizen, ManageUsersService } from '../manage-users.service';
// import { IPolice, StationListOfOfficersService } from '../station-list-of-officers.service';

// @Component({
//   selector: 'app-station-list-of-officers',
//   templateUrl: './station-list-of-officers.component.html',
//   styleUrl: './station-list-of-officers.component.css'
// })
// export class StationListOfOfficersComponent implements OnInit {
//  officerForm!: FormGroup;
//   isLoading = false;
//   successMessage: string | null = null;
//   errorMessage: string | null = null;
//   police: IPolice[] = [];
//   filteredPolice: IPolice[] = [];
//   policeID: string | null = null;
//   // filtered: IStation[] = [];
//   persons: IPerson[] = [];
//   ranks: IRank[] = [];
//   stationID: string | null = null;
//   filteredStations: IStation[] = [];

// constructor(
//   private fb: FormBuilder,
// private managestationService: ManageStationService,
// private jurisdictionService: JurisdictionService,
// private policeAccountsService: PoliceAccountsService,
// private personService: PersonService,
// private stationListOfOfficersService: StationListOfOfficersService,
// private manageUserService: ManageUsersService,
//   private router: Router
// ) {}

// ngOnInit(): void {
//   this.initializeForm();
//   this.getPoliceId();
//   this.fetchRanks();
// this.fetchStations();
// this.fetchPolice();
//   this.fetchPersons();
// }

// Define the form controls
// initializeForm(): void {
//   this.officerForm = this.fb.group({

// unit: ['', Validators.required],
// role: ['', Validators.required],
// badgeNumber: ['', Validators.required],
// debutDate: ['', Validators.required],
// stationID: ['', Validators.required],
// personID: ['', Validators.required],
// pfpId: ['', Validators.required],
// rankID: ['', Validators.required],
// createdBy: ['', Validators.required],
// datetimeCreated: ['', Validators.required],

//     entries: ['10'],
//     search: [''],

//     police_id: ['', Validators.required],
//     unit: ['', Validators.required],
//     role: ['', Validators.required],
//     badge_number: ['', Validators.required],
//     debut_date: ['', Validators.required],
//     station_id: ['', Validators.required],
//     person_id: ['', Validators.required],
//     rank_id: ['', Validators.required],
//     rank_full: ['', Validators.required],
//     rank_abbr: ['', Validators.required],
//     firstname: ['', Validators.required],
//     middlename: ['', Validators.required],
//     lastname: ['', Validators.required],
//     created_by: ['', Validators.required],
//     datetime_created: ['', Validators.required],

//   });
// }

// Retrieve the officer's station ID from stored details
// getPoliceId(): void {
//   const policeDetails = JSON.parse(
//     localStorage.getItem('police_details') || '{}'
//   );
//   this.policeID = policeDetails.person_id || null;

//   if (this.policeID) {
//     this.fetchPolice(this.policeID);
//   } else {
//     this.errorMessage = 'Police ID not found.';
//   }
// }

// Fetch a specific station based on station ID
// fetchPolice(policeId: string): void {
//   this.isLoading = true;
//   this.stationListOfOfficersService.getPolice().subscribe(
//     (response: IPolice[]) => {
//       this.police = response;
//       this.filteredPolice = response; // Initialize filtered list as well
//       console.log('Fetched police:', this.police);
//       this.isLoading = false;
//     },
//     (error) => {
//       console.error('Error fetching police:', error);
//       this.errorMessage = 'Failed to load police. Please try again.';
//       this.isLoading = false;
//     }
//   );
// }

// Fetch list of all stations
// fetchStations(): void {
//   this.jurisdictionService.getAll().subscribe(
//     (response: IStation[]) => {
//       this.stations = response;
//       this.filteredStations = response; // Initialize filtered list as well
//     },
//     (error) => {
//       console.error('Error fetching stations:', error);
//       this.errorMessage = 'Failed to load stations. Please try again.';
//     }
//   );
// }

// Fetch ranks
// fetchRanks(): void {
//   this.policeAccountsService.getRanks().subscribe(
//     (response: IRank[]) => {
//       this.ranks = response;
//     },
//     (error) => {
//       console.error('Error fetching ranks:', error);
//       this.errorMessage = 'Failed to load ranks. Please try again.';
//     }
//   );
// }

// // Fetch persons
// fetchPersons(): void {
//   this.personService.getAll().subscribe(
//     (response: IPerson[]) => {
//       this.persons = response;
//     },
//     (error) => {
//       console.error('Error fetching persons:', error);
//       this.errorMessage = 'Failed to load persons. Please try again.';
//     }
//   );
// }

// Submit the form data
// onSubmit(): void {
//   if (this.officerForm.invalid) {
//     alert('Please fill all required fields correctly.');
//     return;
//   }

//   this.isLoading = true;
//   const formData = this.officerForm.value;

//   const police: IPolice = {
// unit: formData.unit,
// role: formData.role,
// badgeNumber: formData.badgeNumber,
// debutDate: formData.debutDate,
// stationID: formData.stationID,
// personID: formData.personID,
// pfpId: formData.pfpId,
// rankID: formData.rankID,
// createdBy: formData.createdBy,
// datetimeCreated: formData.datetimeCreated,

//     police_id: formData.police_id,
//     unit: formData.unit,
//     role: formData.role,
//     badge_number: formData.badge_number,
//     debut_date: formData.debut_date,
//     station_id: formData.station_id,
//     person_id: formData.person_id,
//     rank_id: formData.rank_id,
//     rank_full: formData.rank_full,
//     rank_abbr: formData.rank_abbr,
//     firstname: formData.firstname,
//     middlename: formData.middlename,
//     lastname: formData.lastname,
//     created_by: formData.created_by,
//     datetime_created: formData.datetime_created,
//   };

//   console.log('Submitting police with data:', police);
//   this.submitlistofOfficersForm(police);
// }

// Call service to submit the station data
// submitlistofOfficersForm(police: IPolice): void {
//   this.stationListOfOfficersService.submitPolice(police).subscribe(
//     (response: IPolice) => {
//       this.isLoading = false;
//       this.successMessage = 'Police submitted successfully!';
//       this.errorMessage = null;
//       this.officerForm.reset();
//       setTimeout(() => this.router.navigate(['/manage-station']), 2000);
//     },
//     (error) => {
//       this.isLoading = false;
//       console.error('Error during station submission:', error);
//       this.errorMessage = 'Submission failed. Please try again.';
//     }
//   );
// }

// Search stations based on input
// onSearch(event: Event): void {
//   const searchValue = (event.target as HTMLInputElement).value.toLowerCase();
//   this.filteredPolice = this.police.filter(
//     (police) =>
//       police.unit.toLowerCase().includes(searchValue) ||
//       police.datetime_created.toLowerCase().includes(searchValue) ||
//       police.badge_number.toString().includes(searchValue)
//   );
// }

// Edit station information
// editPolice(police: IPolice): void {
//   this.officerForm.patchValue({

// unit: police.unit,
// role: police.role,
// badgeNumber: police.badgeNumber,
// debutDate: police.debutDate,
// stationID: police.stationID,
// personID: police.personID,
// pfpId: police.pfpId,
// rankID: police.rankID,
// createdBy: police.createdBy,
// datetimeCreated: police.datetimeCreated,

//   police_id: police.police_id,
//   unit: police.unit,
//   role: police.role,
//   badge_number: police.badge_number,
//   debut_date: police.debut_date,
//   station_id: police.station_id,
//   person_id: police.person_id,
//   rank_id: police.rank_id,
//   rank_full: police.rank_full,
//   rank_abbr: police.rank_abbr,
//   firstname: police.firstname,
//   middlename: police.middlename,
//   lastname: police.lastname,
//   created_by: police.created_by,
//   datetime_created: police.datetime_created,

// });
// window.scrollTo(0, 0); // Scroll to the top for form view
// }

// Delete station
// deletePolice(police_id: number): void {
//   if (confirm('Are you sure you want to delete this police?')) {
//     this.stationListOfOfficersService.deletePolice(police_id).subscribe(
//       () => {
//         this.successMessage = 'Police deleted successfully.';
//         this.police = this.police.filter(
//           (p) => p.person_id !== police_id
//         );
//         this.filteredPolice = this.filteredPolice.filter(
//           (police) => police.person_id !== police_id
//         );
//       },
//       (error) => {
//         console.error('Error deleting police:', error);
//         this.errorMessage = 'Failed to delete police. Please try again.';
//       }
//     );
//   }
// }
// deleteCitizen(citizenId: number): void {
//   if (confirm('Are you sure you want to delete this citizen?')) {
//     this.manageUserService.deleteCitizen(citizenId).subscribe(
//       () => {
//         this.successMessage = 'Citizen deleted successfully.';
//         this.citizen = this.citizen.filter(citizen => citizen.citizen_id !== citizenId);
//         this.filteredCitizens = this.filteredCitizens.filter(citizen => citizen.citizen_id !== citizenId);
//       },
//       (error) => {
//         console.error('Error deleting station:', error);
//         this.errorMessage = 'Failed to delete station. Please try again.';
//       }
//     );
//   }
// }

// Navigate back to the previous screen
//   goBack(): void {
//     this.router.navigate(['/manage-police']);
//   }
// }

// import { Component, OnInit } from '@angular/core';
// import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { CaseQueueService } from '../case-queue.service';
// import { Router } from '@angular/router';
// import { IReport } from '../case.service';
// import { IStation, JurisdictionService } from '../jurisdiction.service';
// import { IPerson, IRank, PoliceAccountsService } from '../police-accounts.service';
// import { PersonService } from '../person.service';
// // import { ICitizen, ManageUsersService } from '../manage-users.service';
// import { IPolice, StationListOfOfficersService } from '../station-list-of-officers.service';

// @Component({
//   selector: 'app-station-list-of-officers',
//   templateUrl: './station-list-of-officers.component.html',
//   styleUrl: './station-list-of-officers.component.css'
// })
// export class StationListOfOfficersComponent implements OnInit {
//   officerForm!: FormGroup;  // Form group for report submission
//   isLoading = false;
//   successMessage: string | null = null;
//   errorMessage: string | null = null;
//   reports: IReport[] = [];  // Array to hold fetched reports`3

//   stations: IStation[] = [];
//   persons: IPerson[] = [];
//   ranks: IRank[] = [];
//   police: IPolice[] = [];
//   filteredPolice: IPolice[] = [];
//   policeID: string | null = null;
//   // filtered: IStation[] = [];
//   stationID: string | null = null;
//   filteredStations: IStation[] = [];

//   // stationID: string | null = null;

//   constructor(
//     private fb: FormBuilder,
//     private caseQueueService: CaseQueueService,
//     private jurisdictionService: JurisdictionService,
//     private policeAccountsService: PoliceAccountsService,
//     private personService: PersonService,
//     private stationlistofOfficersService: StationListOfOfficersService,
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
//     this.fetchpoliceCollectAll();
//     this.fetchPolice();
//   }

//   // Define the form controls
//   initializeForm(): void {
//     this.officerForm = this.fb.group({

//       entries: ['10'],
//       search: [''],
//       police_id: ['', Validators.required],
//       unit: ['', Validators.required],
//       role: ['', Validators.required],
//       badge_number: ['', Validators.required],
//       debut_date: ['', Validators.required],
//       station_id: ['', Validators.required],
//       person_id: ['', Validators.required],
//       rank_id: ['', Validators.required],
//       rank_full: ['', Validators.required],
//       rank_abbr: ['', Validators.required],
//       firstname: ['', Validators.required],
//       middlename: ['', Validators.required],
//       lastname: ['', Validators.required],
//       created_by: ['', Validators.required],
//       datetime_created: ['', Validators.required],
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

//   getPoliceId(): void {
//     // Assuming the officer's details are stored in localStorage after login
//     const policeDetails = JSON.parse(localStorage.getItem('police_details') || '{}');
//     this.policeID = policeDetails.police_id || null;

//     if (this.policeID) {
//       this.fetchPolice(); // Call without arguments
//     } else {
//       this.errorMessage = 'Police ID not found.';
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

//   fetchpoliceCollectAll(): void {
//     this.isLoading = true;  // Set loading state to true
//     this.stationlistofOfficersService.getpoliceCollectAll().subscribe(
//       (response) => {
//         if (Array.isArray(response)) {
//           this.police = response as IPolice[];
//           console.log('Fetched police:', this.police);
//         } else {
//           this.errorMessage = 'Unexpected response from server.';
//         }
//         this.isLoading = false;
//       },
//       (error) => {
//         console.error('Error fetching police:', error);
//         this.errorMessage = 'Failed to load police. Please try again.';
//         this.isLoading = false;
//       }
//     );
//   }

//   fetchPolice(): void {
//     this.stationlistofOfficersService.getAll().subscribe(
//       (response: IPolice[]) => {
//         this.police = response;
//       },
//       (error) => {
//         console.error('Error fetching police:', error);
//         this.errorMessage = 'Failed to load police. Please try again.';
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
//     if (this.officerForm.invalid) {
//       alert('Please fill all required fields correctly.');
//       return;
//     }

//     this.isLoading = true;
//     const formData = this.officerForm.value;

//     const police: IPolice = {
//       police_id: formData.police_id,
//       unit: formData.unit,
//       role: formData.role,
//       badge_number: formData.badge_number,
//       debut_date: formData.debut_date,
//       station_id: formData.station_id,
//       person_id: formData.person_id,
//       rank_id: formData.rank_id,
//       rank_full: formData.rank_full,
//       rank_abbr: formData.rank_abbr,
//       firstname: formData.firstname,
//       middlename: formData.middlename,
//       lastname: formData.lastname,
//       created_by: formData.created_by,
//       datetime_created: formData.datetime_created,
//     };

//     console.log('Submitting policet with data:', police);

//     this.submitPoliceForm(police);
//   }

//   // Submit the form data to the service
//   submitPoliceForm(police: IPolice): void {
//     this.stationlistofOfficersService.submitPolice(police).subscribe(
//       (response: any) => {
//         this.isLoading = false;
//         this.successMessage = 'Police submitted successfully!';
//         this.errorMessage = null;
//         this.officerForm.reset();  // Clear the form after successful submission
//         this.router.navigate(['/station-list-of-officers']);  // Redirect
//       },
//       (error) => {
//         this.isLoading = false;
//         console.error('Error during police submission:', error);
//         this.errorMessage = 'Submission failed. Please try again.';
//       }
//     );
//   }

//   onSearch(event: Event): void {
//     const searchValue = (event.target as HTMLInputElement).value.toLowerCase();
//     this.filteredPolice = this.police.filter(
//       (police) =>
//         police.unit.toLowerCase().includes(searchValue) ||
//         police.datetime_created.toLowerCase().includes(searchValue) ||
//         police.badge_number.toString().includes(searchValue)
//     );
//   }

//   editPolice(police: IPolice): void {
//     this.officerForm.patchValue({

//       police_id: police.police_id,
//       unit: police.unit,
//       role: police.role,
//       badge_number: police.badge_number,
//       debut_date: police.debut_date,
//       station_id: police.station_id,
//       person_id: police.person_id,
//       rank_id: police.rank_id,
//       rank_full: police.rank_full,
//       rank_abbr: police.rank_abbr,
//       firstname: police.firstname,
//       middlename: police.middlename,
//       lastname: police.lastname,
//       created_by: police.created_by,
//       datetime_created: police.datetime_created,

//     });
//     window.scrollTo(0, 0); // Scroll to the top for form view
//   }

//   deletePolice(police_id: number): void {
//     if (confirm('Are you sure you want to delete this police?')) {
//       this.stationlistofOfficersService.deletePolice(police_id).subscribe(
//         () => {
//           this.successMessage = 'Police deleted successfully.';
//           this.police = this.police.filter(
//             (p) => p.person_id !== police_id
//           );
//           this.filteredPolice = this.filteredPolice.filter(
//             (police) => police.person_id !== police_id
//           );
//         },
//         (error) => {
//           console.error('Error deleting police:', error);
//           this.errorMessage = 'Failed to delete police. Please try again.';
//         }
//       );
//     }
//   }

//   goBack(): void {
//     this.router.navigate(['/station-dashboard']);
//   }
// }

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IStation, ManageStationService } from '../manage-station.service';
import { Router } from '@angular/router';
import { JurisdictionService } from '../jurisdiction.service';
import {
  IPerson,
  IRank,
  PoliceAccountsService,
} from '../police-accounts.service';
import { PersonService } from '../person.service';
import {
  IPolice,
  StationListOfOfficersService,
} from '../station-list-of-officers.service';
import { PoliceOfficerService } from '../police-officer.service';

@Component({
  selector: 'app-station-list-of-officers',
  templateUrl: './station-list-of-officers.component.html',
  styleUrl: './station-list-of-officers.component.css',
})
export class StationListOfOfficersComponent implements OnInit {
  officerForm!: FormGroup;
  isLoading = false;
  successMessage: string | null = null;
  errorMessage: string | null = null;
  stations: IStation[] = [];
  filteredStations: IStation[] = [];
  filteredPolice: IPolice[] = [];
  persons: IPerson[] = [];
  ranks: IRank[] = [];
  stationID: string | null = null;
  policeID: string | null = null;
  police: IPolice[] = [];

  constructor(
    private fb: FormBuilder,
    private managestationService: ManageStationService,
    private jurisdictionService: JurisdictionService,
    private policeAccountsService: PoliceAccountsService,
    private personService: PersonService,
    private stationlistofOfficersService: StationListOfOfficersService,
    private policeofficerService: PoliceOfficerService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.getOfficerPoliceId();
    this.fetchRanks();
    this.fetchPolice();
    this.fetchPersons();
    // this.fetchLocalPolice();
  }

  // Define the form controls
  initializeForm(): void {
    this.officerForm = this.fb.group({
      entries: ['10'],
      search: [''],
      police_id: ['', Validators.required],
      unit: ['', Validators.required],
      role: ['', Validators.required],
      badge_number: ['', Validators.required],
      debut_date: ['', Validators.required],
      station_id: ['', Validators.required],
      person_id: ['', Validators.required],
      rank_id: ['', Validators.required],
      rank_full: ['', Validators.required],
      rank_abbr: ['', Validators.required],
      firstname: ['', Validators.required],
      middlename: ['', Validators.required],
      lastname: ['', Validators.required],
      created_by: ['', Validators.required],
      datetime_created: ['', Validators.required],
    });
  }

  // Retrieve the officer's station ID from stored details
  getOfficerPoliceId(): void {
    const policeDetails = JSON.parse(
      localStorage.getItem('police_details') || '{}'
    );
    this.policeID = policeDetails.policeId || null;

    if (this.policeID) {
      this.fetchLocalPolice(this.policeID);
    } else {
      this.errorMessage = 'Police ID not found.';
    }
  }

  // Fetch a specific station based on station ID
  fetchLocalPolice(policeId: string): void {
    this.isLoading = true;
    this.stationlistofOfficersService.getLocalPolice(Number(policeId)).subscribe(
      (response: IPolice[]) => {
        this.police = response;
        this.filteredPolice = response;  // Initialize filtered list as well
        console.log('Fetched police:', this.police);
        this.isLoading = false;
      },
      (error) => {
        console.error('Error fetching police:', error);
        this.errorMessage = 'Failed to load police. Please try again.';
        this.isLoading = false;
      }
    );
  }

  // Fetch list of all stations
  fetchPolice(): void {
    this.policeofficerService.getAll().subscribe(
      (response: IPolice[]) => {
        this.police = response;
        this.filteredPolice = response; // Initialize filtered list as well
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
    if (this.officerForm.invalid) {
      alert('Please fill all required fields correctly.');
      return;
    }

    this.isLoading = true;
    const formData = this.officerForm.value;

    const police: IPolice = {
      police_id: formData.police_id,
      unit: formData.unit,
      role: formData.role,
      badge_number: formData.badge_number,
      debut_date: formData.debut_date,
      station_id: formData.station_id,
      person_id: formData.person_id,
      rank_id: formData.rank_id,
      rank_full: formData.rank_full,
      rank_abbr: formData.rank_abbr,
      firstname: formData.firstname,
      middlename: formData.middlename,
      lastname: formData.lastname,
      created_by: formData.created_by,
      datetime_created: formData.datetime_created,
    };

    console.log('Submitting police with data:', police);
    this.submitManagePoliceForm(police);
  }

  // Call service to submit the station data
  submitManagePoliceForm(police: IPolice): void {
    this.stationlistofOfficersService.submitPolice(police).subscribe(
      (response: IPolice) => {
        this.isLoading = false;
        this.successMessage = 'Station submitted successfully!';
        this.errorMessage = null;
        this.officerForm.reset();
        setTimeout(
          () => this.router.navigate(['/station-list-of-officers']),
          2000
        );
      },
      (error) => {
        this.isLoading = false;
        console.error('Error during station submission:', error);
        this.errorMessage = 'Submission failed. Please try again.';
      }
    );
  }

  // Search stations based on input
  // onSearch(event: Event): void {
  //   const searchValue = (event.target as HTMLInputElement).value.toLowerCase();
  //   this.filteredPolice = this.stations.filter(police =>
  //     police.abbr.toLowerCase().includes(searchValue) ||
  //     police.hq.toLowerCase().includes(searchValue) ||
  //     police.station_id.toString().includes(searchValue)
  //   );
  // }

  // Edit station information
  editPolice(police: IPolice): void {
    this.officerForm.patchValue({
      police_id: police.police_id,
      unit: police.unit,
      role: police.role,
      badge_number: police.badge_number,
      debut_date: police.debut_date,
      station_id: police.station_id,
      person_id: police.person_id,
      rank_id: police.rank_id,
      rank_full: police.rank_full,
      rank_abbr: police.rank_abbr,
      firstname: police.firstname,
      middlename: police.middlename,
      lastname: police.lastname,
      created_by: police.created_by,
      datetime_created: police.datetime_created,
    });
    window.scrollTo(0, 0); // Scroll to the top for form view
  }

  // Delete station
  // deleteStation(stationId: number): void {
  //   if (confirm('Are you sure you want to delete this station?')) {
  //     this.jurisdictionService.delete(stationId).subscribe(
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

  deletePolice(policeId: number): void {
    if (!policeId || isNaN(policeId)) {
      this.errorMessage = 'Invalid Police ID. Unable to proceed with deletion.';
      return;
    }

    if (confirm('Are you sure you want to delete this police?')) {
      this.stationlistofOfficersService.deletePolice(policeId).subscribe(
        () => {
          this.successMessage = 'Police deleted successfully.';
          this.police = this.police.filter(
            (police) => police.police_id !== policeId
          );
          this.filteredPolice = this.filteredPolice.filter(
            (police) => police.police_id !== policeId
          );
        },
        (error) => {
          console.error('Error deleting station:', error);
          this.errorMessage =
            error?.message || 'Failed to delete station. Please try again.';
        }
      );
    }
  }

  // Navigate back to the previous screen
  goBack(): void {
    this.router.navigate(['/manage-police']);
  }
}
