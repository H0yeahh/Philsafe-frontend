import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
// import { IStation, ManageStationService } from '../manage-station.service';
import { Router } from '@angular/router';
import { JurisdictionService } from '../jurisdiction.service';
import { IPerson,IRank,PoliceAccountsService} from '../police-accounts.service';
import { PersonService } from '../person.service';
// import { ICitizen, ManageUsersService } from '../manage-users.service';
import { IPolice, StationListOfOfficersService } from '../station-list-of-officers.service';

@Component({
  selector: 'app-station-list-of-officers',
  templateUrl: './station-list-of-officers.component.html',
  styleUrl: './station-list-of-officers.component.css'
})
export class StationListOfOfficersComponent implements OnInit {
 officerForm!: FormGroup;
  isLoading = false;
  successMessage: string | null = null;
  errorMessage: string | null = null;
  police: IPolice[] = [];
  filteredPolice: IPolice[] = [];
  policeID: string | null = null;
  // filtered: IStation[] = [];
  persons: IPerson[] = [];
  ranks: IRank[] = [];
  stationID: string | null = null;

  constructor(
    private fb: FormBuilder,
    // private managestationService: ManageStationService,
    private jurisdictionService: JurisdictionService,
    private policeAccountsService: PoliceAccountsService,
    private personService: PersonService,
    private stationListOfOfficersService: StationListOfOfficersService,
    // private manageUserService: ManageUsersService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.getPoliceId();
    this.fetchRanks();
    // this.fetchStations();
    // this.fetchPolice();
    this.fetchPersons();
  }

  // Define the form controls
  initializeForm(): void {
    this.officerForm = this.fb.group({

      unit: ['', Validators.required],
      role: ['', Validators.required],
      badgeNumber: ['', Validators.required],
      debutDate: ['', Validators.required],
      stationID: ['', Validators.required],
      personID: ['', Validators.required],
      pfpId: ['', Validators.required],
      rankID: ['', Validators.required],
      createdBy: ['', Validators.required],
      datetimeCreated: ['', Validators.required],

    });
  }

  // Retrieve the officer's station ID from stored details
  getPoliceId(): void {
    const policeDetails = JSON.parse(
      localStorage.getItem('police_details') || '{}'
    );
    this.policeID = policeDetails.person_id || null;

    if (this.policeID) {
      this.fetchPolice(this.policeID);
    } else {
      this.errorMessage = 'Police ID not found.';
    }
  }

  // Fetch a specific station based on station ID
  fetchPolice(policeId: string): void {
    this.isLoading = true;
    this.stationListOfOfficersService.getPolice().subscribe(
      (response: IPolice[]) => {
        this.police = response;
        this.filteredPolice = response; // Initialize filtered list as well
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
      unit: formData.unit,
      role: formData.role,
      badgeNumber: formData.badgeNumber,
      debutDate: formData.debutDate,
      stationID: formData.stationID,
      personID: formData.personID,
      pfpId: formData.pfpId,
      rankID: formData.rankID,
      createdBy: formData.createdBy,
      datetimeCreated: formData.datetimeCreated,
    };

    console.log('Submitting police with data:', police);
    this.submitlistofOfficersForm(police);
  }

  // Call service to submit the station data
  submitlistofOfficersForm(police: IPolice): void {
    this.stationListOfOfficersService.submitPolice(police).subscribe(
      (response: IPolice) => {
        this.isLoading = false;
        this.successMessage = 'Police submitted successfully!';
        this.errorMessage = null;
        this.officerForm.reset();
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
    this.filteredPolice = this.police.filter(
      (police) =>
        police.unit.toLowerCase().includes(searchValue) ||
        police.datetimeCreated.toLowerCase().includes(searchValue) ||
        police.badgeNumber.toString().includes(searchValue)
    );
  }

  // Edit station information
  editPolice(police: IPolice): void {
    this.officerForm.patchValue({

      unit: police.unit,
      role: police.role,
      badgeNumber: police.badgeNumber,
      debutDate: police.debutDate,
      stationID: police.stationID,
      personID: police.personID,
      pfpId: police.pfpId,
      rankID: police.rankID,
      createdBy: police.createdBy,
      datetimeCreated: police.datetimeCreated,
    });
    window.scrollTo(0, 0); // Scroll to the top for form view
  }

  // Delete station
  deletePolice(police_id: number): void {
    if (confirm('Are you sure you want to delete this police?')) {
      this.stationListOfOfficersService.deletePolice(police_id).subscribe(
        () => {
          this.successMessage = 'Police deleted successfully.';
          this.police = this.police.filter(
            (p) => p.personID !== police_id
          );
          this.filteredPolice = this.filteredPolice.filter(
            (police) => police.personID !== police_id
          );
        },
        (error) => {
          console.error('Error deleting police:', error);
          this.errorMessage = 'Failed to delete police. Please try again.';
        }
      );
    }
  }
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
  goBack(): void {
    this.router.navigate(['/manage-police']);
  }
}
