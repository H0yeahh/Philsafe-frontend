import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { IStation, ManageStationService } from '../manage-station.service';
import { Router } from '@angular/router';
import { IStation, JurisdictionService } from '../jurisdiction.service';
import { IPerson,IRank,PoliceAccountsService} from '../police-accounts.service';
import { PersonService } from '../person.service';
import { ICitizen, ManageUsersService } from '../manage-users.service';
import { AuthService } from '../auth.service';
import { PoliceDashbordService } from '../police-dashbord.service';
import { HttpClient } from '@angular/common/http';
import { CaseQueueService } from '../case-queue.service';
import { Subscription } from 'rxjs';
import { CaseService } from '../case.service';
import { environment } from '../environment';
import { AccountService } from '../account.service';
import { DialogService } from '../dialog/dialog.service';


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
  citizen: any = [];
  filteredCitizens: any = [];
  citizenID: string | null = null;
  // filtered: IStation[] = [];
  persons: IPerson[] = [];
  ranks: IRank[] = [];
  stationID: string | null = null;
  adminData: any;
  adminDetails: any;
  personId: any;
  policePersonData: any;
  reportSubscription: Subscription | undefined;
  searchQuery = '';
  filteredUsers: any[] = [];
  Users: any;
  totalUsers: number = 0;
  currentPage: number = 1;
  pageSize: number = 10;
  avatarUrl: string = 'assets/user-default.jpg';
  filter: string = 'Certified';
  certified: any = [];
  pending: any = [];
  uncertified = [];
  isUserDataOpen: boolean = false;
  userData: any = []
  userPic: string = 'assets/user-default.jpg';
  userProof: string = ''

 

  constructor(
    private fb: FormBuilder,
    // private managestationService: ManageStationService,
    private jurisdictionService: JurisdictionService,
    private policeAccountsService: PoliceAccountsService,
    private personService: PersonService,
    private manageUserService: ManageUsersService,
    private router: Router,
    private caseQueueService: CaseQueueService,
    private http: HttpClient,
    private authService: AuthService,
    private policeDashbordService: PoliceDashbordService,
    private caseService: CaseService,
    private accountService: AccountService,
    private dialogService: DialogService
  ) {}

  ngOnInit(): void {
    
    this.getCitizenId();
    this.fetchPersons();
    this.fetchCitizen();
    this.loadUserProfile();

    const userData = localStorage.getItem('userData');
    this.adminDetails = JSON.parse(userData);
    this.fetchAdminData(this.adminDetails.acc_id)
    console.log('Fetched Admin', this.adminDetails)
  }

 

  getCitizenId(): void {
    const citizenDetails = JSON.parse(
      localStorage.getItem('citizen_details') || '{}'
    );
    this.citizenID = citizenDetails.citizen_id || null;

    if (this.citizenID) {
      // this.fetchCitizen(this.citizenID);
    } else {
      this.errorMessage = 'Station ID not found.';
    }
  }

  
  loadUserProfile() {
    const userData = localStorage.getItem('userData');
    const parsedData = JSON.parse(userData);
    console.log('USER DATA SESSION', userData);
    if (userData) {
      try {
        
        this.personId = parsedData.personId;
   
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
  fetchCitizen(): void {
    this.isLoading = true;
    const allCitizens: any[] = [];
    let page = 1;
  
    const fetchNextPage = () => {
      this.caseQueueService.getCitizensPage(this.pageSize, page).subscribe(
        (response) => {
          const citizens = Array.isArray(response) ? response : response.data || [];
          if (citizens.length === 0) {
            // No more data, stop
            this.citizen = allCitizens;
            this.filteredCitizens = allCitizens;
            this.isLoading = false;
            console.log('Fetched all citizens:', allCitizens);
            return;
          }
  
          allCitizens.push(...citizens);
          page++; // Go to next page
          fetchNextPage(); // Recursive call
        },
        (error) => {
          console.error('Error fetching citizens:', error);
          this.errorMessage = 'Failed to load citizens. Please try again.';
          this.isLoading = false;
        }
      );
    };
  
    fetchNextPage(); // Start fetching
  }
  


  setFilter(filterValue: string) {
    this.filter = filterValue;
    this.currentPage = 1;
  }
  
  
  filterCitizens() {
    if (this.filter) {
      return this.citizen.filter((user: any) => user.role === this.filter);
    }
    return this.citizen;
  }



  filterUsers() {
    if (!this.searchQuery) {
      this.filteredUsers = this.Users;
      return;
    }
  
    const query = this.searchQuery.toLowerCase();
  
    this.filteredUsers = this.Users.filter((crime) => {
      const crimeIdMatch = crime.crime_id?.toString().toLowerCase().includes(query);
      const citeNumMatch = crime.cite_number?.toString().toLowerCase().includes(query);
      const incidentNameMatch = crime.incident_type 
        ? crime.incident_type.toString().toLowerCase().includes(query) 
        : false;
      const statusMatch = crime.status?.toLowerCase().includes(query);
  
      return crimeIdMatch || citeNumMatch || incidentNameMatch || statusMatch;
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
    this.personService.getPersons().subscribe(
      (response: IPerson[]) => {
        this.persons = response;
      },
      (error) => {
        console.error('Error fetching persons:', error);
        this.errorMessage = 'Failed to load persons. Please try again.';
      }
    );
  }

  fetchCitizens(): void {
    this.manageUserService.getCitizens().subscribe(
      (response) => {
        if(!response.is_spammer){
          this.citizen = response;
          console.log('Spammers:', response.is_spammer)
        }
        
      },
      (error) => {
        console.error('Error fetching citizen:', error);
        this.errorMessage = 'Failed to load citizens. Please try again.';
      }
    );
  }

  certifyCitizen(citizenId: number) {
    
    this.dialogService.openLoadingDialog()
    console.log('Certifying citizen with ID:', citizenId);
    this.caseService.certifyUser(citizenId).subscribe(
      (res) => {
        this.dialogService.closeLoadingDialog()
        setTimeout(() => {
          this.dialogService.openUpdateStatusDialog('Success', `Citizen ${citizenId} verified successfully`);

          setTimeout(() => {
            window.location.reload();
          }, 100)
          
        },1000)
      },
      (err) => {
        this.dialogService.closeLoadingDialog()
        setTimeout(() => {
          this.dialogService.openUpdateStatusDialog('Error', `Citizen ${citizenId} failed to verify`);
          setTimeout(() => {
            window.location.reload();
          }, 100)
        },1000)
      }
    )
    
  }
  

  openUserDetails(citizen: any){
    this.isUserDataOpen = true;
    this.userData = citizen;

    this.userPic = 'assets/user-default.jpg';
    this.userProof = '';

    
    this.getUserProfPic(citizen.account_id);
    this.getUserProof(citizen.citizen_id);
  }

  closeModal() {
    this.isUserDataOpen = false;
    this.userPic = 'assets/user-default.jpg'; 
    this.userProof = '';
  }

  getUserProof(citizenId: any){
    this.caseService.getCitizenProof(citizenId).subscribe(
      (proof: Blob) => {
        if(proof){
          this.userProof = URL.createObjectURL(proof);
          console.log('Citizen Proof', this.userProof)
        } else {
          this.userProof = '';
          console.log('No proof submitted.');
          }
      },
      (error) => {
        console.error('Error fetching citizen proof:', error);
        this.userProof = ''; 
      }
    )
  }

  getUserProfPic(accountId: any){
    this.accountService.getProfPic(accountId).subscribe(
      (profilePicBlob: Blob) => {
        if (profilePicBlob) {
            this.userPic = URL.createObjectURL(profilePicBlob);
            console.log('PROFILE PIC URL', this.userPic);

        } else {
            console.log('ERROR, DEFAULT PROF PIC STREAMED', this.userPic);
            this.userPic = 'assets/user-default.jpg';
        }
        }
      )
  }

  

  clearSession() {
    sessionStorage.removeItem('userData');
    sessionStorage.removeItem('citizenId');
    localStorage.removeItem('sessionData');
    localStorage.clear();
    sessionStorage.clear();
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

  ngOnDestroy(): void {
    if (this.reportSubscription) {
      this.reportSubscription.unsubscribe();
    }
  }
}
