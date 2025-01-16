import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IStation, ManageStationService } from '../manage-station.service';
import { Router } from '@angular/router';
import { JurisdictionService } from '../jurisdiction.service';
import { IPerson, IRank, PoliceAccountsService } from '../police-accounts.service';
import { PersonService } from '../person.service';
import { CreateCasesService } from '../create-cases.service';
import { CaseQueueService } from '../case-queue.service';
import { PoliceDashbordService } from '../police-dashbord.service';
import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';

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
  adminData: any;
  adminDetails: any;
  personId: any;
  policePersonData: any;
  reportSubscription: Subscription | undefined;
  // filterStation: any[] = [];
  searchQuery = '';
  currentPage: number = 1; 
  pageSize: number = 10; 
  totalStations: number = 0; 


  constructor(
    private fb: FormBuilder,
    private managestationService: ManageStationService,
    private jurisdictionService: JurisdictionService,
    private policeAccountsService: PoliceAccountsService,
    private personService: PersonService,
    private router: Router,
    private caseQueueService: CaseQueueService,
    // private createCaseService: CreateCaseService,
    private createCasesService: CreateCasesService,
    private policeDashbordService: PoliceDashbordService,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.getOfficerStationId();
    this.fetchRanks();
    this.fetchStations();
    this.fetchPersons();

    const userData = localStorage.getItem('userData');
    this.adminDetails = JSON.parse(userData);
    this.fetchAdminData(this.adminDetails.acc_id)
    console.log('Fetched Admin', this.adminDetails)
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
            // this.fetchPoliceData(this.policePersonData.police_id);
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

  filterStation() {
    if (!this.searchQuery) {
      this.filteredStations = this.stations;
      return;
    }
  
    const query = this.searchQuery.toLowerCase();
  
    this.filteredStations = this.stations.filter((station) => {
      const stationIdMatch = station.station_id?.toString().toLowerCase().includes(query);
      const stationhqMatch = station.hq.toString().toLowerCase().includes(query);
      const locationIdMatch = station.location_id 
        ? station.location_id.toString().toLowerCase().includes(query) 
        : false;
      // const officerinchargeIdMatch = station.officer_in_charge_id?.toLowerCase().includes(query);
  
      // return stationIdMatch || stationhqMatch || locationIdMatch || statusMatch;
      return stationIdMatch || stationhqMatch || locationIdMatch;

    });
  }
  

  isFieldMatched(fieldValue: any, query: string): boolean {
    if (!query) return false;
    const fieldStr = fieldValue ? fieldValue.toString().toLowerCase() : '';
    return fieldStr.includes(query.toLowerCase());
  }
  
  highlight(fieldValue: any): string {
    if (!this.searchQuery) return fieldValue || '';
    const fieldStr = fieldValue ? fieldValue.toString() : '';
    const regex = new RegExp(`(${this.searchQuery})`, 'gi');
    return fieldStr.replace(regex, '<mark>$1</mark>');
  }
  

  isRowMatched(report: any): boolean {
    if (!this.searchQuery) return false;
    const query = this.searchQuery.toLowerCase().trim();
    return Object.values(report).some((value) => 
      value?.toString().toLowerCase().includes(query)
    );
  }

  // fetchStation(stationId){
  //   this.caseQueueService.fetchCases(stationId).subscribe(
  //     (response) => {
  //       if (Array.isArray(response)) {
  //         this.stations = response;
  //       } else {
  //         this.stations = response.data || [];
  //         this.totalStations = this.stations.length;
  //       }
  //       console.log("Station ID", stationId);
  //       console.log(`List of Stations in Station ${stationId}`, this.stations);
  //       localStorage.setItem('stations', JSON.stringify(this.stations))
  //     },
  //     (error) => {
  //       console.error('Error fetching stations:', error);
  //       this.errorMessage = 'Failed to load stations. Please try again.';
  //     }
  //   );
  // }

  pagedStations(): any[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return this.stations.slice(startIndex, startIndex + this.pageSize);
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


deleteStation(stationId: number): void {
  if (!stationId || isNaN(stationId)) {
    this.errorMessage = 'Invalid Station ID. Unable to proceed with deletion.';
    return;
  }

  if (confirm('Are you sure you want to delete this station?')) {
    this.managestationService.deleteStation(stationId).subscribe(
      () => {
        this.successMessage = 'Station deleted successfully.';
        this.stations = this.stations.filter(station => station.station_id !== stationId);
        this.filteredStations = this.filteredStations.filter(station => station.station_id !== stationId);
      },
      (error) => {
        console.error('Error deleting station:', error);
        this.errorMessage = error?.message || 'Failed to delete station. Please try again.';
      }
    );
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
