import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { StationRegistrationService } from '../station-registration.service';
import { StationAddLocationService, ILocation } from '../station-add-location.service';
import { PoliceRegisterService, IRank } from '../police-register.service';
import { ICreateParam, JurisdictionService } from '../jurisdiction.service';
import { AccountService, IAccount, IPerson } from '../account.service';

@Component({
  selector: 'app-station-registration',
  templateUrl: './station-registration.component.html',
  styleUrls: ['./station-registration.component.css'],
})
export class StationRegistrationComponent implements OnInit {
  stationForm!: FormGroup;
  isLoading = false;
  successMessage: string | null = null;
  errorMessage: string | null = null;
  locations: ILocation[] = [];
  ranks: IRank[] = [];

  stationID: string | null = null;
  policeID: string | null = null;
  accountID: string | null = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private registrationService: StationRegistrationService,
    private AccountService: AccountService,
    private locationService: StationAddLocationService,
    private police: PoliceRegisterService,
    private jurisdiction: JurisdictionService
  ) { }

  ngOnInit(): void {
    this.getAllLocations();
    this.fetchRanks();
    this.stationForm = this.fb.group({
      hq: ['', Validators.required],
      officerInChargeId: ['20248332037', Validators.required],
      rank_id: [null, Validators.required],
      location_id: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      is_approved: [true],
    });
  }

  fetchRanks(): void {
    this.police.getRanks().subscribe(
      (response: any) => {
        console.log('Raw response:', response);
        if (Array.isArray(response)) {
          this.ranks = response;
          console.log('Fetched ranks:', this.ranks);
        } else {
          console.error('Unexpected response format:', response);
          alert('Failed to load ranks. Please try again.');
        }
      },
      (error) => {
        console.error('Error fetching ranks:', error);
        alert('Failed to load ranks. Please try again.');
      }
    );
  }

  // createJurisdiction(data: ICreateParam) {
  //   console.log('Creating jurisdiction with data:', data); // Log the data being sent
  //   this.jurisdiction.create(data).subscribe(
  //     (response) => {
  //       this.isLoading = false;
  //       console.log('Jurisdiction created successfully:', response);
  //       this.successMessage = 'Station registered successfully!';
  //       this.router.navigate(['/manage-station']); // Redirect after successful registration
  //     },
  //     (error) => {
  //       this.isLoading = false;
  //       console.error('Error during jurisdiction creation:', error);
  //       this.errorMessage = 'Registration failed. Please try again.';
  //       alert(this.errorMessage);
  //     }
  //   );
  // }

  createJurisdiction(data: ICreateParam) {
    console.log('Creating jurisdiction with data:', data); // Log the data being sent
    console.log('Rank being sent to the server:', data.rank); // Log the rank being sent to the server
    this.jurisdiction.create(data).subscribe(
      (response) => {
        this.isLoading = false;
        console.log('Jurisdiction created successfully:', response);
        this.successMessage = 'Station registered successfully!';
        this.router.navigate(['/manage-station']); // Redirect after successful registration
      },
      (error) => {
        this.isLoading = false;
        console.error('Error during jurisdiction creation:', error);
        this.errorMessage = 'Registration failed. Please try again.';
        alert(this.errorMessage);
      }
    );
  }

  getAllLocations() {
    this.locationService.getLocations().subscribe(
      (response) => {
        this.isLoading = false;
        console.log('Locations fetched successfully:', response);
        this.locations = response;
      },
      (error) => {
        this.isLoading = false;
        console.error('Error fetching locations:', error);
        alert('Failed to load locations. Please try again.');
      }
    );
  }

  onSubmit() {
    if (!this.stationForm.valid) {
      // Log individual control errors
      console.log('Form control errors:', {
        hq: this.stationForm.get('hq')?.errors,
        officerInChargeId: this.stationForm.get('officerInChargeId')?.errors,
        rank_id: this.stationForm.get('rank_id')?.errors,
        location_id: this.stationForm.get('location_id')?.errors,
        email: this.stationForm.get('email')?.errors,
        password: this.stationForm.get('password')?.errors,
        is_approved: this.stationForm.get('is_approved')?.errors,

      });
      alert('Please fill all required fields correctly.');
      return;
    }

    this.isLoading = true;
    const { rank_id, hq, location_id, officerInChargeId } = this.stationForm.value;
    const rank = this.ranks.find((x) => x.rank_id === Number(rank_id));

    if (!rank) {
      this.isLoading = false;
      console.error('Invalid rank selected');
      alert('Invalid rank selected. Please try again.');
      return;
    }

    const param: ICreateParam = {
      hq: hq,
      locationId: location_id,
      isApproved: true,
      abbr: rank.rank_abbr || '',
      rank: rank.rank_full || '',
      officerInChargeId: officerInChargeId,
    };

    console.log('Submitting station registration with param:', param); // Log the param being sent
    this.createJurisdiction(param);
  }

  goBack() {
    this.router.navigate(['/manage-station']);
  }
}
