
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../environment';
import { DialogService } from '../dialog/dialog.service';
import { PoliceAccountsService } from '../police-accounts.service';
import { AccountService } from '../account.service';



@Component({
  selector: 'app-station-editpolice',
  templateUrl: './station-editpolice.component.html',
  styleUrl: './station-editpolice.component.css'
})
export class StationEditpoliceComponent {

  // User profile data
  userProfile: any = {
    firstname: '',
    lastname: '',
    email: '',
    phone: '',
    badge_number: '',
    rank_full: '',
    profile_picture: ''
  };

  // Password change fields
  passwordData = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  };

  // File upload handling
  selectedFile: File | null = null;
  previewImageUrl: string | null = null;

  // Form state
  isLoaded = false;
  isSubmitting = false;

  // Password visibility toggle
  showPassword = {
    current: false,
    new: false,
    confirm: false
  };

  // Form validation errors
  firstNameError = false;
  lastNameError = false;
  emailError = false;
  phoneError = false;
  passwordError = false;
  currentPasswordError = false;
  newPasswordError = false;
  confirmPasswordError = false;
  policeDetails: any;
  personId: any;
  avatarUrl: string = 'assets/user-default.jpg';
  policePersonData: any;
  stationId: any;

  private token = localStorage.getItem('token') ?? '';
    private auth_token = new HttpHeaders({
        'Authorization': this.token
      });

  constructor(
    private http: HttpClient,
    private router: Router,
    private dialogService: DialogService,
    private policeAccountsService: PoliceAccountsService,
    private accountService: AccountService,
    
    
  ) { }

  ngOnInit(): void {
    this.loadUserProfile();
  }

  loadUserProfile() {
    const userData = localStorage.getItem('userData');
    const parsedData = JSON.parse(userData);
    console.log('USER DATA SESSION', userData);
    if (userData) {
      try {
        
        this.personId = parsedData.personId;
        this.policeAccountsService.getPoliceById().subscribe(
          (response) => {
            this.userProfile = response;
            this.isLoaded = true;
            console.log('Fetched Police Person Data', this.userProfile);
            // this.fetchReportStation(this.policePersonData.station_id);
            // this.fetchStation(this.policePersonData.station_id);
            // // this.fetchPoliceData(this.policePersonData.police_id);
            // console.log('Police ID:', this.policePersonData.police_id);
            this.stationId = this.userProfile.station_id;
          },
          (error) => {
            console.error('Errod Police Person Data', error);
          }
        );

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

  onFileSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      
      // Create preview URL
      const reader = new FileReader();
      reader.onload = () => {
        this.previewImageUrl = reader.result as string;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  removePhoto(): void {
    this.selectedFile = null;
    this.previewImageUrl = null;
    this.userProfile.profile_picture = ''; // Will remove existing photo
  }

  togglePasswordVisibility(field: 'current' | 'new' | 'confirm'): void {
    this.showPassword[field] = !this.showPassword[field];
  }

  validateForm(): boolean {
    let isValid = true;
    
    // Reset errors
    this.firstNameError = false;
    this.lastNameError = false;
    this.emailError = false;
    this.phoneError = false;
    this.currentPasswordError = false;
    this.newPasswordError = false;
    this.confirmPasswordError = false;
    this.passwordError = false;
    
    // Validate required fields
    if (!this.userProfile.firstname || this.userProfile.firstname.trim() === '') {
      this.firstNameError = true;
      isValid = false;
    }
    
    if (!this.userProfile.lastname || this.userProfile.lastname.trim() === '') {
      this.lastNameError = true;
      isValid = false;
    }
    
    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!this.userProfile.email || !emailRegex.test(this.userProfile.email)) {
      this.emailError = true;
      isValid = false;
    }
    
    // Phone validation (basic)
    if (!this.userProfile.phone) {
      this.phoneError = true;
      isValid = false;
    }

    if (!this.userProfile.password) {
      this.passwordError = true;
      isValid = false;
    }

    
    // Password validation (only if changing password)
    const isChangingPassword = this.passwordData.newPassword || this.passwordData.confirmPassword;
    
    if (isChangingPassword) {
      if (!this.passwordData.currentPassword) {
        this.currentPasswordError = true;
        isValid = false;
      }
      
      if (!this.passwordData.newPassword || this.passwordData.newPassword.length < 8) {
        this.newPasswordError = true;
        isValid = false;
      }
      
      if (this.passwordData.newPassword !== this.passwordData.confirmPassword) {
        this.confirmPasswordError = true;
        isValid = false;
      }
    }
    
    return isValid;
  }

  onSubmit(): void {

    console.log('SUBMITTED FOR UPDATED', this.userProfile)

    this.dialogService.openLoadingDialog();
    // if (!this.validateForm()) {
    //   return;
    // }
    
    this.isSubmitting = true;
    

    const formData = new FormData();

    formData.append('PersonId', this.userProfile.person_id);
    formData.append('Password', this.userProfile.password);
    

    formData.append('Firstname', this.userProfile.firstname);
    formData.append('Middlename', this.userProfile.middlename);
    formData.append('Lastname', this.userProfile.lastname);

    formData.append('police_id', this.userProfile.police_id);
    formData.append('rank_id', this.userProfile.rank_id);
    formData.append('badge_number', this.userProfile.badge_number);
    formData.append('Role', this.userProfile.role);
    formData.append('unit', this.userProfile.unit);

    // if (this.selectedFile) {
    //   formData.append('profile_picture', this.selectedFile);
    // } else if (this.previewImageUrl === null && this.userProfile.profile_picture) {
    
    //   formData.append('remove_profile_picture', 'true');
    // }
   
    // if (this.passwordData.newPassword && this.passwordData.currentPassword) {
    //   formData.append('current_password', this.passwordData.currentPassword);
    //   formData.append('new_password', this.passwordData.newPassword);
    // }

    const url = `${environment.ipAddUrl}api/account/update/upgrade`;
    
    this.http.put(url, formData, {headers: this.auth_token}).subscribe({
      next: (response: any) => {
        // Handle successful update
        this.isSubmitting = false;
        this.dialogService.closeLoadingDialog();
        
        setTimeout(() => {
          this.dialogService.openUpdateStatusDialog('Success', 'Profile successfully updated' );
          window.location.reload();
        }, 200)
      },
      error: (error) => {
        console.error('Error updating profile:', error);
        setTimeout(() => {
          this.dialogService.openUpdateStatusDialog('Error', 'Unknown error occured' );
        
        }, 200)
      
        this.dialogService.closeLoadingDialog();
        
        this.isSubmitting = false;
        
        // Handle specific errors
        if (error.status === 401 && error.error?.message?.includes('password')) {
          this.currentPasswordError = true;
          alert('Current password is incorrect');
        } else {
          alert('Failed to update profile. Please try again.');
        }
      }
    });

    this.dialogService.closeAllDialogs();
  }



  goBack(): void {
    this.router.navigate(['/station-dashboard']);
  }
}
