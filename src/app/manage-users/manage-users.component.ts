import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { IStation, ManageStationService } from '../manage-station.service';
import { Router } from '@angular/router';
import { IStation, JurisdictionService } from '../jurisdiction.service';
import { IPerson,IRank,PoliceAccountsService} from '../police-accounts.service';
import { PersonService } from '../person.service';
import { ICitizen, ManageUsersService } from '../manage-users.service';

@Component({
  selector: 'app-manage-users',
  templateUrl: './manage-users.component.html',
  styleUrl: './manage-users.component.css',
})
export class ManageUsersComponent implements OnInit {
  userForm!: FormGroup;
  isLoading = false;
  successMessage: string | null = null;
  errorMessage: string | null = null;
  citizen: ICitizen[] = [];
  filteredCitizens: ICitizen[] = [];
  citizenID: string | null = null;
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
    private manageUserService: ManageUsersService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.getCitizenId();
    this.fetchRanks();
    // this.fetchStations();
    this.fetchPersons();
  }

  // Define the form controls
  initializeForm(): void {
    this.userForm = this.fb.group({
      citizen_id: ['', Validators.required],
      person_id: ['', Validators.required],
      firstname: ['', Validators.required],
      middlename: ['', Validators.required],
      sex: ['', Validators.required],
      lastname: ['', Validators.required],
      bio_status: [true],
      birthdate: ['', Validators.required],
      civil_status: ['', Validators.required],
      location_id: ['', Validators.required],

    });
  }

  // Retrieve the officer's station ID from stored details
  getCitizenId(): void {
    const citizenDetails = JSON.parse(
      localStorage.getItem('citizen_details') || '{}'
    );
    this.citizenID = citizenDetails.citizen_id || null;

    if (this.citizenID) {
      this.fetchCitizen(this.citizenID);
    } else {
      this.errorMessage = 'Station ID not found.';
    }
  }

  // Fetch a specific station based on station ID
  fetchCitizen(citizenId: string): void {
    this.isLoading = true;
    this.manageUserService.getCitizens().subscribe(
      (response: ICitizen[]) => {
        this.citizen = response;
        this.filteredCitizens = response; // Initialize filtered list as well
        console.log('Fetched citizen:', this.citizen);
        this.isLoading = false;
      },
      (error) => {
        console.error('Error fetching citizen:', error);
        this.errorMessage = 'Failed to load citizen. Please try again.';
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
    if (this.userForm.invalid) {
      alert('Please fill all required fields correctly.');
      return;
    }

    this.isLoading = true;
    const formData = this.userForm.value;

    const citizen: ICitizen = {
      citizen_id: formData.citizen_id,
      person_id: formData.person_id,
      location_id: formData.location_id || null,
      is_certified: formData.is_certified,
      firstname: formData.firstname,
      middlename: formData.middlename,
      lastname: formData.lastname,
      sex: formData.sex,
      birthdate: formData.birthdate,
      bio_status: formData.bio_status,
      civil_status: formData.civil_status,
    };

    console.log('Submitting citizen with data:', citizen);
    this.submitManageUsersForm(citizen);
  }

  // Call service to submit the station data
  submitManageUsersForm(citizen: ICitizen): void {
    this.manageUserService.submitCitizen(citizen).subscribe(
      (response: ICitizen) => {
        this.isLoading = false;
        this.successMessage = 'Station submitted successfully!';
        this.errorMessage = null;
        this.userForm.reset();
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
    this.filteredCitizens = this.citizen.filter(
      (citizen) =>
        citizen.firstname.toLowerCase().includes(searchValue) ||
        citizen.lastname.toLowerCase().includes(searchValue) ||
        citizen.citizen_id.toString().includes(searchValue)
    );
  }

  // Edit station information
  editCitizen(citizen: ICitizen): void {
    this.userForm.patchValue({
      citizen_id: citizen.citizen_id,
      person_id: citizen.person_id,
      location_id: citizen.location_id,
      is_certified: citizen.is_certified,
      firstname: citizen.firstname,
      middlename: citizen.middlename,
      lastname: citizen.lastname,
      sex: citizen.sex,
      birthdate: citizen.birthdate,
      bio_status: citizen.bio_status,
      civil_status:citizen.civil_status,
    });
    window.scrollTo(0, 0); // Scroll to the top for form view
  }

  // Delete station
  deleteCitizen(citizen_id: number): void {
    if (confirm('Are you sure you want to delete this citizen?')) {
      this.manageUserService.deleteCitizen(citizen_id).subscribe(
        () => {
          this.successMessage = 'Citizen deleted successfully.';
          this.citizen = this.citizen.filter(
            (c) => c.citizen_id !== this.citizenID
          );
          this.filteredCitizens = this.filteredCitizens.filter(
            (citizen) => citizen.citizen_id !== this.citizenID
          );
        },
        (error) => {
          console.error('Error deleting citizen:', error);
          this.errorMessage = 'Failed to delete citizen. Please try again.';
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