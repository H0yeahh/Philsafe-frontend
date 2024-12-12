import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IRank, PoliceRegisterService } from '../police-register.service';
import { Router } from '@angular/router';
import { JurisdictionService, IStation } from '../jurisdiction.service';
import { AccountService, IPerson } from '../account.service';
import { PersonService, IPolice } from '../person.service';
import { StationAddLocationService } from '../station-add-location.service';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Component({
  selector: 'app-police-register',
  templateUrl: './police-register.component.html',
  styleUrls: ['./police-register.component.css'],
})

export class PoliceRegisterComponent implements OnInit {
  policeForm!: FormGroup;
  isLoading = false;
  successMessage: string | null = null;
  errorMessage: string | null = null;
  ranks: IRank[] = [];
  stations: IStation[] = [];
  persons: IPerson[] = [];
  profilePicture: File | null = null;
  previewUrl: string | ArrayBuffer | null = null;

  stationID: string | null = null;
  rank_id: string | null = null;
  personID: string | null = null;

  constructor(
    private fb: FormBuilder,
    private registerService: PoliceRegisterService,
    private locationService: StationAddLocationService,
    private accountService: AccountService,
    private router: Router,
    private jurisdiction: JurisdictionService,
    private person: PersonService
  ) {}

  ngOnInit(): void {
    this.fetchRanks();
    this.fetchStations();
    this.fetchPersons();
    this.initializeForm();
  }

  initializeForm(): void {
    this.policeForm = this.fb.group({
      unit: ['', Validators.required],
      role: ['', Validators.required],
      // officer: ['', Validators.required], // Ensure this matches formControlName in the HTML
      badgeNumber: ['', Validators.required],
      debutDate: ['', Validators.required],
      createdBy: ['Admin', Validators.required], // Default value
      stationId: ['', Validators.required],
      rank_id: ['', Validators.required],
      personID: ['', Validators.required],
    });
  }

  fetchPersons(): void {
    this.person.getAll().subscribe(
      (response: IPerson[]) => {
        this.persons = response;
      },
      (error) => {
        console.error('Error fetching persons:', error);
        alert('Failed to load persons. Please try again.');
      }
    );
  }

  fetchStations(): void {
    this.jurisdiction.getAll().subscribe(
      (response: IStation[]) => {
        this.stations = response;
      },
      (error) => {
        console.error('Error fetching stations:', error);
        alert('Failed to load stations. Please try again.');
      }
    );
  }

  fetchRanks(): void {
    this.registerService.getRanks().subscribe(
      (response: IRank[]) => {
        this.ranks = response;
      },
      (error) => {
        console.error('Error fetching ranks:', error);
        alert('Failed to load ranks. Please try again.');
      }
    );
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file && file.size < 5000000 && file.type.startsWith('image/')) { // Check for image files less than 5MB
      this.profilePicture = file;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.previewUrl = e.target.result;
      };
      reader.readAsDataURL(file);
    } else {
      alert('File must be an image and less than 5MB.');
    }
  }

  uploadProfilePicture(): Observable<string> {
    if (!this.profilePicture) {
      return of(''); // Return empty if no profile picture is selected
    }

    const formData = new FormData();
    formData.append('file', this.profilePicture);

    return this.registerService.uploadPicture(formData).pipe(
      map((response) => response.pfpId), // Assuming response contains pfpId
      catchError((error) => {
        console.error('Error uploading profile picture:', error);
        return throwError(error);
      })
    );
  }

  createPolice(data: IPolice) {
    console.log('Creating police with data:', data); // Log the data being sent
    console.log('Role being sent to the server:', data.role); // Log the rank being sent to the server
    this.person.create(data).subscribe(
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

  onSubmit(): void {
    if (this.policeForm.invalid) {
      // Log each form control's errors
      Object.keys(this.policeForm.controls).forEach((field) => {
        const control = this.policeForm.get(field);
        if (control?.invalid) {
          console.log(`${field} has error:`, control.errors);
        }
      });
      alert('Please fill all required fields correctly.');
      return;
    }

    this.isLoading = true;

    // First, upload the profile picture if one is selected
    this.uploadProfilePicture().subscribe(
      (pfpId: string) => {
        const formData = this.policeForm.value;

        const param: IPolice = {
          unit: formData.unit,
          role: formData.role,
          badgeNumber: formData.badgeNumber,
          debutDate: formData.debutDate,
          stationID: formData.stationId,
          personID: formData.personID, // Handle optional fields
          // pfpId: pfpId || null, // Assign pfpId from upload response
          pfpId: formData.pfpId,
          rankID: formData.rank_id,
          createdBy: formData.createdBy,
          datetimeCreated: new Date().toISOString(),
        };

        console.log('Submitting police registration with param:', param);
        this.submitPoliceForm(param);
      },
      (error: any) => {
        this.isLoading = false;
        this.errorMessage = 'Profile picture upload failed. Please try again.';
        alert(this.errorMessage);
      }
    );
  }

  submitPoliceForm(param: IPolice): void {
    this.registerService.savePoliceData(param).subscribe(
      (response: any) => {
        this.isLoading = false;
        this.successMessage = 'Registration successful!';
        this.errorMessage = null;
        this.policeForm.reset(); // Clear the form after successful submission
        this.router.navigate(['/manage-station']); // Redirect after successful registration
      },
      (error) => {
        this.isLoading = false;
        console.error('Error during police registration:', error);
        this.errorMessage = 'Registration failed. Please try again.';
      }
    );
  }

  goBack(): void {
    this.router.navigate(['/manage-police']);
  }
}
