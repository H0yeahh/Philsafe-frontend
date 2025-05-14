import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IStation, ManageStationService } from '../manage-station.service';
import { Router } from '@angular/router';
import { JurisdictionService } from '../jurisdiction.service';
import {
  IPerson,
  IRank,
  LocationUpgrade,
  PoliceAccountsService,
  UpgradeAccount,
} from '../police-accounts.service';
import { PersonService } from '../person.service';
import {
  IPolice,
  StationListOfOfficersService,
} from '../station-list-of-officers.service';
import { PoliceOfficerService } from '../police-officer.service';
import { AuthService } from '../auth.service';
import { environment } from '../environment';
import { AccountService } from '../account.service';


import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DialogService } from '../dialog/dialog.service';
@Component({
  selector: 'app-station-admin-police-management',
  templateUrl: './station-admin-police-management.component.html',
  styleUrl: './station-admin-police-management.component.css'
})
export class StationAdminPoliceManagementComponent {

   upgraded: UpgradeAccount = {
          firstname: '',
          middlename: '',
          lastname: '',
          sex: '',
          birthdate: '',
          civilStatus: '',
          bioStatus: true,
          email: '',
          password: '',
          telNum: '',
          contactNum: '',
          homeAddressId: 0,
          workAddressId: 0,
          role: 'Police',
          unit: '',
          badgeNum: '',
          debutDate: '',
          stationId: 0,
          rankId: '',
          createdBy: 'Station Admin',
          dateTimeCreated: '',
          personId: 0,
          profile_pic: null,
          profile_ext: '',
      
          homeAddress: {
            locationId: 0, province: '', municipality: '', street: '', region: '', barangay: '', block:'', zipCode: 0
          },
      
          workAddress: {
            locationId: 0, province: '', municipality: '', street: '', region: '', barangay: '', block:'', zipCode: 0
          }
      
        };

        userHomeAddress: LocationUpgrade = {
                locationId: 0,
                province: '',
                municipality: '',
                street: '',
                region: '',
                barangay: '',
                block: '',
                zipCode: 0,
              };
              userWorkAddress: LocationUpgrade = {
                locationId: 0,
                province: '',
                municipality: '',
                street: '',
                region: '',
                barangay: '',
                block: '',
                zipCode: 0,
              };

              editPoliceForm: any = {
                police_id: null,
                person_id: null,
                rank_id: null,
                badge_number: '',
                firstname: '',
                middlename: '',
                lastname: '',
                role: '',
                unit: '',
                password: '',
                station_id: null
              };

        home_zip_code: string = '';
        work_zip_code: string = '';
    isLoading = false;
        successMessage: string | null = null;
        errorMessage: string | null = null;
        //reports: IReport[] = [];  // Array to hold fetched reports`3
        reports: any;
      
        stations: IStation[] = [];
        persons: IPerson[] = [];
        ranks: IRank[] = [];
        accounts: any = [];      
        stationId: number = 0;
        citizenId: number = 0;
        fetch_Report: any;
        citizens: any;
        policeDetails: any;
        stationDetails: any;
        personData: any = {};
        accountData: any = {};
       
        currentPage: number = 1; 
        pageSize: number = 10; 
        totalPolice: number = 0;
        isSameAddress: boolean = false;
        filteredPolice: any[] = [];
        searchQuery = '';
        selectedStatus: string | null = null;
        avatarUrl: string = 'assets/1.png';
        personId: any;
        passwordInput: string = ''; 
        showPasswordModal = false;
        selectedAccountId: number | null = null;
        toggleState: boolean = false;
        isAddPoliceOpen: boolean = false;
        policePersonData: any;
        selectedToggleState: boolean = false; 
        selectedEventInput: HTMLInputElement | null = null;
        showEditModal = false;
        isInCharge: any;
        
        currentDate: string = '';
        currentTime: string = '';
        intervalId: any;
        policeByStation: any = [];
        private token = localStorage.getItem('token') ?? '';
  
        private auth_token = new HttpHeaders({
            'Authorization': this.token
          });
   
  
    constructor(
      private fb: FormBuilder,
      private managestationService: ManageStationService,
      private jurisdictionService: JurisdictionService,
      private policeAccountsService: PoliceAccountsService,
      private personService: PersonService,
      private stationlistofOfficersService: StationListOfOfficersService,
      private policeofficerService: PoliceOfficerService,
      private router: Router,
      private authService: AuthService,
      private http: HttpClient,
      private accountService: AccountService,
      private dialogService: DialogService
      
    ) {}
  
    ngOnInit(): void {
  
      const policeData = localStorage.getItem('policeDetails');
      const stationData = localStorage.getItem('stationDetails');
      const policeByStation = localStorage.getItem('policeByStation');
      this.loadUserProfile();
      this.fetchAccounts();
      this.fetchRanks();
     
      if (policeData) {
        this.policeDetails = JSON.parse(policeData);
      }
  
      if (stationData) {
        this.stationDetails = JSON.parse(stationData);
        this.fetchAllPolice(this.stationDetails.station_id);
        this.stationId = this.stationDetails.station_id
      }
  
      // if (policeByStation) {
      //   this.policeByStation = JSON.parse(policeByStation);
      //   console.log('List of all police', this.policeByStation)
      // }
  
      this.updateDateTime();
        setInterval(() => this.updateDateTime(), 60000);
        this.intervalId = setInterval(() => this.updateDateTime(), 1000);
     
    }
  
  
    updateDateTime(): void {
      const now = new Date();
      this.currentDate = now.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      this.currentTime = now.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        hour12: true // Use 12-hour format
      });
    }
  
    ngOnDestroy(): void {
      if (this.intervalId) {
        clearInterval(this.intervalId); // Clear the interval when the component is destroyed
      }
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
              this.policePersonData = response;
              console.log('Fetched Police Person Data', this.policePersonData);
              // this.fetchReportStation(this.policePersonData.station_id);
              // this.fetchStation(this.policePersonData.station_id);
              // // this.fetchPoliceData(this.policePersonData.police_id);
              // console.log('Police ID:', this.policePersonData.police_id);
              this.upgraded.stationId = this.policePersonData.station_id;
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
                this.avatarUrl = 'assets/1.png';
            }
          }
        )
      }
    }


    fetchRanks(): void {
      this.policeAccountsService.getRanks().subscribe(
        (response: IRank[]) => {
          this.ranks = response;
        },
        (error) => {
          console.error('Error fetching ranks:', error);
          alert('Failed to load ranks. Please try again.');
        }
      );
    }
  
  
    fetchAllPolice(stationId: number): void {
      const pageSize = 10; 
      let currentPage = 1;
      let allPolice: any[] = [];
      
    
      const fetchPage = (pageNumber: number = 1) => {
        const url = `${environment.ipAddUrl}api/police/collect/some/${stationId}/${pageSize}/${currentPage}`;
        this.http.get<any[]>(url, {headers: this.auth_token}).subscribe(
          (response) => {
            const police = Array.isArray(response) ? response : response|| [];
            allPolice = [...allPolice, ...police]; 
            if (police.length < pageSize) {
              this.policeByStation = allPolice; 
              console.log(`Fetched all police for Station ${stationId}:`, this.policeByStation);
              localStorage.setItem('policeSTATION', this.policeByStation)
            } else {
              
              fetchPage(pageNumber + 1);
            }
          },
          (error) => {
            console.error('Error fetching police:', error);
            this.errorMessage = 'Failed to load all police. Please try again.';
          }
        );
      };
    
    
      fetchPage(currentPage);
    }

    

    
  
    filterPolice(){
      if(!this.searchQuery){
        this.filteredPolice = this.policeByStation
      return;
      }
  
      const query = this.searchQuery.toLowerCase();
      this.filteredPolice = this.policeByStation.filter((police) =>{
  
        const policeIdMatch = police.police_id?.toString().includes(query);
        const rankMatch = police.rank_full ? police.rank_full.toString().toLowerCase().includes(query) : false;
  
        const unitMatch = police.unit ? police.unit.toString().toLowerCase().includes(query) : false;
  
        const firstNameMatch = police.firstname.toLowerCase().includes(query);
        const middleNameMatch = police.middlename.toLowerCase().includes(query);
        const lastNameMatch = police.lastname.toLowerCase().includes(query);
  
        return policeIdMatch || rankMatch || unitMatch || firstNameMatch || middleNameMatch || lastNameMatch;
      })
    }




    fetchAccounts(): void {
      this.accountService.getAccount().subscribe(
        (response) => {
          this.accounts = response;
          localStorage.setItem('accounts', JSON.stringify(response));
          console.log('Fetched Accounts', this.accounts);
         
        },
        (error) => {
          console.error('Error fetching persons:', error);
          this.errorMessage = 'Failed to load persons. Please try again.';
        }
      );
    }


    

    isOfficerOfTheDay(personId: number): boolean {
       
        const account = this.accounts.find(acc => acc.personId === personId);
        // console.log('Officer of the Day', account);
        return account?.is_officer_of_the_day || false;
      
}
  



  
  
    isFieldMatched(fieldValue: any, query: string): boolean {
      if (!query) return false;
      const fieldStr = fieldValue ? fieldValue.toString().toLowerCase() : '';
      return fieldStr.includes(query.toLowerCase());
    }
  
    highlight(fieldValue: any): string {
      if (!this.searchQuery) return fieldValue;
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
  
    editPolice() {
  
    }
  
    deletePolice(policeId: number, policeLastName: string) {
      // const userConfirmed = window.confirm(`Are you sure you want to delete Officer ${policeLastName}?`);


      this.dialogService.openConfirmationDialog(`Are you sure you want to delete Officer ${policeLastName}?`).then(
        (confirmed) => {
          if(confirmed) {
            this.policeAccountsService.resignedPolice(policeId).subscribe(
              () => { 
                this.dialogService.openLoadingDialog();
                setTimeout(()=>{
                  this.dialogService.openUpdateStatusDialog('Success', 'New suspect removed successfully.');
                  this.dialogService.closeAllDialogs();
                  window.location.reload();
                }, 2000)
              },
              (err) => {
                console.error('Error deleting officer', err);
                alert('An error occurred while deleting the officer. Please try again.');
              }
            );
          } else {
            console.log('Officer deletion was canceled');
          }
          }
        );
    
      
    }



removeInCharge(personId: number, stationId: number){

  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const today = new Date().getDay();
  const todayName = dayNames[today];
  const officerOftheDay = `Police_${todayName}`;

  const account = this.accounts.find((account: any) => account.personId === personId);
  const accountId = account ? account.acc_id : null;
  console.log('Account ID', accountId);



  this.dialogService.openLoadingDialog(); 
  this.policeAccountsService.removeInCharge(accountId, stationId).subscribe({
    next: (res) => {
      console.log(`Police ${account.last_name} removed as Officer of the Day`, res);
      

      setTimeout(() => {
        this.dialogService.closeLoadingDialog();
        this.dialogService.openUpdateStatusDialog('Success', `Officer ${account.last_name} is removed as Officer of the Day`);
        // window.location.reload()
      }, 2000)
      this.fetchAccounts();
    },  
    error: (err) => {
      console.error('Error updating officer status:', err);
      
      setTimeout(() => {
        this.dialogService.closeLoadingDialog();
        this.dialogService.openUpdateStatusDialog('Failed', `Error removing in-charged ${account.last_name}`);
      }, 2000)
      this.resetModal();
    }
  });

    } 

makeInCharge(personId: number, stationId: number){
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const today = new Date().getDay();
  const todayName = dayNames[today];
  const officerOftheDay = `Police_${todayName}`;

const officerAccounts = this.accounts.filter((acc: any) => acc.is_officer_of_the_day === true);

   const existingOfficer = officerAccounts.find((officer: any) =>
  this.policeByStation.some((police: any) => police.personId === officer.personId)
);

  if (existingOfficer) {
    const name = `${existingOfficer.first_name} ${existingOfficer.last_name}`;
    this.dialogService.openUpdateStatusDialog('Error', `Only one officer is in charge: ${name}`);
    return; // Stop the function here
  }

  const account = this.accounts.find((account: any) => account.personId === personId);
  const accountId = account ? account.acc_id : null;
  console.log('Account ID', accountId);



  this.dialogService.openLoadingDialog(); 
  this.policeAccountsService.todaysInCharge(accountId, stationId).subscribe({
    next: (res) => {
      console.log(`Police ${account.last_name} marked as Officer of the Day`, res);
      

      setTimeout(() => {
        this.dialogService.closeLoadingDialog();
        this.dialogService.openUpdateStatusDialog('Success', `Officer ${account.last_name} is now marked as Officer of the Day`);
        // window.location.reload()
      }, 2000)
      this.fetchAccounts();
    },
    error: (err) => {
      console.error('Error updating officer status:', err);
      
      setTimeout(() => {
        this.dialogService.closeLoadingDialog();
        this.dialogService.openUpdateStatusDialog('Failed', `Error assigning ${account.last_name} to be in-charged`);
      }, 2000)
      this.resetModal();
    }
  });

}

  
// makeInCharge(policeId: number, event: any) {
//   const eventInput = event.target as HTMLInputElement;
//   const isChecked = eventInput.checked;

//   const police = this.policeByStation.find(p => p.police_id === policeId);
//   if (!police) {
//     console.error('Police not found.');
//     return;
//   }


//   this.selectedAccountId = policeId;
//   this.selectedToggleState = isChecked;
//   this.selectedEventInput = eventInput;


//   this.getPassword();
// }


getPassword() {
  this.showPasswordModal = true;
}

// 3. Called when user cancels modal
cancelPassword() {
  if (this.selectedEventInput) {
    // Revert the checkbox visually
    this.selectedEventInput.checked = !this.selectedToggleState;
  }
  this.resetModal();
}

// 4. Clears modal state
resetModal() {
  this.showPasswordModal = false;
  this.passwordInput = '';
  this.selectedAccountId = null;
  this.selectedToggleState = false;
  this.selectedEventInput = null;
}

onAddPolice(){
  this.isAddPoliceOpen = true;
}



 onAddressCheckboxChange(event: any) {
        this.isSameAddress = event.target.checked;
    
        if (this.isSameAddress) {
          this.copyAddress(this.userHomeAddress, this.userWorkAddress);
          console.log('User work address:', this.userWorkAddress)
      } else  {
          this.resetAddress(this.userWorkAddress);
          console.log("Work Address Resetted",this.userWorkAddress)
      }
      
    }
    
    copyAddress(source: LocationUpgrade, target: LocationUpgrade) {
      target.region = source.region;
      target.province = source.province;
      target.municipality = source.municipality;
      target.barangay = source.barangay;
      target.street = source.street; 
      target.block = source.block;   
      target.zipCode = source.zipCode;  
    
      

    
      console.log(`Address copied:`);
      console.log(`Region: ${target.region}`);
      console.log(`Province: ${target.province}`);
      console.log(`Municipality: ${target.municipality}`);
      console.log(`Barangay: ${target.barangay}`);
    }
    
    resetAddress(address: LocationUpgrade) {
      address.region = '';
      address.province = '';
      address.municipality = '';
      address.barangay = '';
      address.street = '';
      address.block = '';
      address.zipCode = 0;
    }

    onPoliceRoleChange(event: any) {
      const selectedRole = event.target.value;
      console.log('Selected Role:', selectedRole);
      this.upgraded.policeRole = selectedRole;
  }


  openEditModal(police: any) {
    this.editPoliceForm = {
      police_id: police.police_id,
      person_id: police.person_id,
      rank_id: police.rank_id,
      badge_number: police.badge_number,
      firstname: police.firstname,
      middlename: police.middlename,
      lastname: police.lastname,
      role: police.role,
      unit: police.unit,
      password: '',
      station_id: police.station_id
    };
    this.showEditModal = true;
  }
  
  closeEditModal() {
    this.showEditModal = false;
    this.editPoliceForm = {
      police_id: null,
      person_id: null,
      rank_id: null,
      badge_number: '',
      firstname: '',
      middlename: '',
      lastname: '',
      role: '',
      unit: '',
      password: '',
      station_id: null
    };
  }
  
  savePoliceChanges() {
    if (!this.editPoliceForm.password) {
      // Show error message
      this.errorMessage = 'Password is required for verification';
      return;
    }
  
    const updateRequest = {
      // Person details
      PersonId: this.editPoliceForm.person_id,
      Firstname: this.editPoliceForm.firstname,
      Middlename: this.editPoliceForm.middlename,
      Lastname: this.editPoliceForm.lastname,
      // Account verification
      Password: this.editPoliceForm.password,
      // Police-specific data would be handled in a separate API call
    };
  
    // First update the person details
    const personUrl = `${environment.ipAddUrl}api/account/update/upgrade`;
    this.http.put(personUrl, this.prepareFormData(updateRequest), {headers: this.auth_token}).subscribe(
      (response: any) => {
        // Then update police-specific details
        this.updatePoliceDetails();
      },
      (error) => {
        console.error('Error updating person details:', error);
        this.errorMessage = 'Failed to update officer details. Please check your password and try again.';
      }
    );
  }
  
  updatePoliceDetails() {

    this.dialogService.openLoadingDialog();

    const updateFormData = new FormData();
    updateFormData.append('PersonId', this.editPoliceForm.person_id);
    updateFormData.append('Password', this.editPoliceForm.password);
    

    updateFormData.append('Firstname', this.editPoliceForm.firstname);
    updateFormData.append('Middlename', this.editPoliceForm.middlename);
    updateFormData.append('Lastname', this.editPoliceForm.lastname);

    updateFormData.append('police_id', this.editPoliceForm.police_id);
    updateFormData.append('rank_id', this.editPoliceForm.rank_id);
    updateFormData.append('badge_number', this.editPoliceForm.badge_number);
    updateFormData.append('Role', this.editPoliceForm.role);
    updateFormData.append('unit', this.editPoliceForm.unit);
    updateFormData.append('station_id', this.editPoliceForm.station_id);

    updateFormData.append('First Name', this.editPoliceForm.firstname)

  
    const policeUrl = `${environment.ipAddUrl}api/account/update/upgrade`;
    this.http.put(policeUrl, updateFormData, {headers: this.auth_token}).subscribe(
      (response: any) => {
        this.dialogService.closeLoadingDialog();
        console.log('Police details updated successfully:', response);

        this.successMessage = 'Officer details updated successfully';
        

        setTimeout(() => {
          this.dialogService.openUpdateStatusDialog('Success', `Police ${this.editPoliceForm.lastname} successfully updated`)
        }, 200)
        this.fetchAllPolice(this.stationId);
        this.closeEditModal();
      },
      (error) => {

        this.dialogService.closeLoadingDialog();

        setTimeout(() => {
          this.dialogService.openUpdateStatusDialog('Unknown Error Occured', `Error updating Police ${this.editPoliceForm.lastname}`)
        },200)
        console.error('Error updating police details:', error);
        this.errorMessage = 'Failed to update officer details. Please try again.';
      }
    );
  }
  
  prepareFormData(updateRequest: any): FormData {
    const formData = new FormData();
    
    // Add all properties to the FormData
    Object.keys(updateRequest).forEach(key => {
      if (updateRequest[key] !== null && updateRequest[key] !== undefined) {
        formData.append(key, updateRequest[key]);
      }
    });
    
    return formData;
  }



async submitPolice(){

  console.log('UPGRADED DATA TO BE SENT', this.upgraded)

  this.dialogService.openLoadingDialog()
  

  if (!this.upgraded.firstname ||
    !this.upgraded.middlename ||
    !this.upgraded.lastname || 
    !this.upgraded.birthdate ||
    !this.upgraded.sex ||
    !this.upgraded.civilStatus ||    
    !this.upgraded.email || 
    !this.upgraded.password || 
    // !this.confirmPassword || 
    !this.upgraded.contactNum ||
    !this.upgraded.telNum ||
    !this.upgraded.badgeNum ||
    !this.upgraded.debutDate ||
    !this.upgraded.policeRole ||
    !this.userHomeAddress.region ||
    !this.userHomeAddress.province ||
    !this.userHomeAddress.municipality ||
    !this.userHomeAddress.barangay ||
    !this.userHomeAddress.street ||
    !this.userHomeAddress.block ||
    !this.userHomeAddress.zipCode ||
    !this.userWorkAddress.region ||
    !this.userWorkAddress.province ||
    !this.userWorkAddress.municipality ||
    !this.userWorkAddress.street ||
    !this.userWorkAddress.block ||
    !this.userWorkAddress.zipCode ||
    !this.upgraded.unit ||
    !this.upgraded.rankId
  ) {
    this.dialogService.closeLoadingDialog();
    this.dialogService.openUpdateStatusDialog('Error', 'Missing required fields');
    return;
}

// if (!this.isValidEmail(this.upgraded.email)) {
//     console.error('Invalid email address');
//     return;
// }

// if (this.confirmPassword !== this.upgraded.password) {
//     console.error('Passwords do not match');
//     return;
// }

if (this.upgraded.password.length < 8) {
  
    console.error('Password must be at least 8 characters');
    return;
}


if (!this.upgraded.contactNum.startsWith('09')) {
    console.error('Contact number must start with 09');
    return;
}

// Prepare address data
this.userHomeAddress.zipCode = Number(this.home_zip_code);
this.userWorkAddress.zipCode = Number(this.work_zip_code);


// let profilePicFile: File | null = null;
// let profilePicExt: string = '';

// if (this.upgraded.profile_pic) {
//   const processedProfilePic = this.processProfilePic();
//   if (processedProfilePic) {
//     profilePicFile = processedProfilePic;
//     profilePicExt = this.upgraded.profile_ext || 'jpg';
//   } else {
//     console.error('Failed to process profile picture');
//     return;
//   }
// } else {
//   console.error('Profile picture is required');
//   return;
// }



try {
    const homeAddressPromise = this.policeAccountsService.postLocation( this.userHomeAddress.zipCode, this.userHomeAddress,)
        .toPromise()
        .then((homeResponse) => {
            if (homeResponse.locationFound) {
                this.upgraded.homeAddressId = homeResponse.id;
                console.log('Home address exists with ID:', homeResponse.id);
                
            } else {
                this.upgraded.homeAddressId = homeResponse.id;
                console.log('New home address created with ID:', homeResponse.id);
            }
        });

    const workAddressPromise = 
    this.policeAccountsService.postLocation( this.userHomeAddress.zipCode, this.userHomeAddress,)
            .toPromise()
            .then((workResponse) => {
                if (workResponse.locationFound) {
                    this.upgraded.workAddressId = workResponse.id;
                    console.log('Work address exists with ID:', workResponse.id);
                    
                } else {
                    this.upgraded.workAddressId = workResponse.id;
                    console.log('New work address created with ID:', workResponse.id);
                }
            })
        // : Promise.resolve();




    await Promise.all([homeAddressPromise, workAddressPromise]);

    const formDataUpgraded = new FormData();
    formDataUpgraded.append('Firstname', this.upgraded.firstname);
    formDataUpgraded.append('Middlename', this.upgraded.middlename);
    formDataUpgraded.append('Lastname', this.upgraded.lastname);
    formDataUpgraded.append('Password', this.upgraded.password);
    formDataUpgraded.append('Sex', this.upgraded.sex);
    formDataUpgraded.append('Birthdate', this.upgraded.birthdate);
    formDataUpgraded.append('CivilStatus', this.upgraded.civilStatus || '');
    formDataUpgraded.append('BioStatus', this.upgraded.bioStatus.toString());
    formDataUpgraded.append('Email', this.upgraded.email);
    formDataUpgraded.append('TelNum', this.upgraded.telNum?.toString() || '');
    formDataUpgraded.append('ContactNum', this.upgraded.contactNum);
    formDataUpgraded.append('HomeAddressId', this.upgraded.homeAddressId ? this.upgraded.homeAddressId.toString() : '');
    formDataUpgraded.append('WorkAddressId', this.upgraded.workAddressId ? this.upgraded.workAddressId.toString() : '');
    formDataUpgraded.append('Role', this.upgraded.role); 
    formDataUpgraded.append('PoliceRole', this.upgraded.policeRole); 
    formDataUpgraded.append('Unit', this.upgraded.unit);
    formDataUpgraded.append('BadgeNumber', this.upgraded.badgeNum); 
    formDataUpgraded.append('DebutDate', this.upgraded.debutDate); 
    formDataUpgraded.append('StationId', this.upgraded.stationId.toString()); 
    formDataUpgraded.append('RankId', this.upgraded.rankId); 
    formDataUpgraded.append('CreatedBy', this.upgraded.createdBy); 
    formDataUpgraded.append('DateTimeCreated', this.upgraded.dateTimeCreated); 
    // if (this.upgraded.profile_pic) {
    //   formDataUpgraded.append('ProfilePic', profilePicFile);
    //   formDataUpgraded.append('ProfileExt', profilePicExt);
    // } else {
      
    //   console.log("No profile picture to upload.");
    // }

    console.log('Final Home Address ID:', this.upgraded.homeAddressId);
    console.log('Final Work Address ID:', this.upgraded.workAddressId);

    const response = await this.policeAccountsService.postAccountUpgrade(formDataUpgraded).subscribe(
      () => {
        this.dialogService.closeLoadingDialog();
        this.dialogService.openUpdateStatusDialog('Success', 'New police officer added successfully.');
        // alert('Registration successful');
        setTimeout(() => {
          this.dialogService.closeLoadingDialog();
          window.location.reload();
        }, 3000)
        
       
      });

} catch (error: any) {
    if (error.status === 0) {
        alert('Network error: Unable to reach the server. Please check your connection.');
        console.log('Error Status:', error.status);
    } else {
      this.dialogService.closeLoadingDialog();
        this.dialogService.openUpdateStatusDialog('Error', 'Error Adding New Police Officer');
        // alert(`Error Code: ${error.status}\nMessage: ${error.message}`);
        console.log('Error Message:', error);
    }
  
} finally {
  console.log('Hiding loading indicator');
    // this.loading = false; 
}


}

cancelAddPolice(){
  this.isAddPoliceOpen = false;
}



}
