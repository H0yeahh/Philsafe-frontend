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
import { catchError, map, Observable, of, Subscription } from 'rxjs';
import { CaseService } from '../case.service';
import { environment } from '../environment';
import { AccountService } from '../account.service';
import { DialogService } from '../dialog/dialog.service';


@Component({
  selector: 'app-police-rooster',
  templateUrl: './police-rooster.component.html',
  styleUrl: './police-rooster.component.css'
})
export class PoliceRoosterComponent {

  
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
  police: any = [];
  stations: any = [];
  filteredPolice: any[] = [];
      

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
    
    
    this.loadUserProfile();
    this.fetchAllPolice();
    this.fetchStation();


    const userData = localStorage.getItem('userData');
    this.adminDetails = JSON.parse(userData);
    this.fetchAdminData(this.adminDetails.acc_id)
    console.log('Fetched Admin', this.adminDetails)
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

  filterPolice(){

    const query = this.searchQuery.toLowerCase();
    this.filteredPolice = this.police.filter((police: any) => {

      const stationName = this.fetchStationName(police.station_id).toLowerCase();
      const isStationMatched = stationName.includes(query);
      const isPoliceIdMatched = police.police_id?.toString().includes(query);
      const isRankMatched = police.rank_full.toString().toLowerCase().includes(query)
      const isUnitMatched = police.unit.toString().toLowerCase().includes(query)
      const isFirstNameMatched = police.firstname.toLowerCase().includes(query);
      const isMiddleNameMatched = police.middlename.toLowerCase().includes(query);
      const isLastNameMatched = police.lastname.toLowerCase().includes(query);
      const isBadgeIdMatched = police.badge_number?.toString().includes(query);
      const isRoleMatched = police.role.toString().toLowerCase().includes(query);

      return isStationMatched || isPoliceIdMatched || isRankMatched || isUnitMatched || isFirstNameMatched || isMiddleNameMatched || isLastNameMatched || isBadgeIdMatched || isRoleMatched;
    })
  }


  // fetchAllPolice(): void {
  //   const allPolices: any[] = [];
  //   let page = 1;
  
  //   const fetchNextPage = () => {
  //     this.policeAccountsService.getAllPolice(this.currentPage, this.pageSize).subscribe(
  //       (res) => {
  //         const polices = Array.isArray(res) ? res : res.data || [];
  
  //         if (polices.length > 0) {
  //           // Append the new police data to the existing array
  //           this.police.push(...polices);
  //           this.filteredPolice.push(...polices);
  //           console.log('Fetched all police', this.police);
  //           return;
  //         }
  
  //         allPolices.push(...polices);  // Store it for future pagination (if needed)
  //         page++;
  //         fetchNextPage();
  //       },
  //       (err) => {
  //         console.error('Error fetching all police:', err);
  //       }
  //     );
  //   };
  
  //   fetchNextPage();
  // }

  // fetchAllPolice(): void {
  //   this.police = [];
  //   this.filteredPolice = [];
  //   let page = 1;
  
  //   const fetchNextPage = () => {
  //     this.policeAccountsService.getAllPolice(page, this.pageSize).subscribe(
  //       (res) => {
  //         const polices = Array.isArray(res) ? res : res.data || [];
  
  //         if (polices.length > 0) {
            
  //           this.police.push(...polices);
  //           this.filteredPolice.push(...polices);
  //           console.log(`Fetched page ${page}`, polices);
  
  //           // Continue fetching if this page was full (might be more)
  //           if (polices.length === this.pageSize) {
  //             page++;
  //             fetchNextPage();
  //           } else {
  //             console.log('Finished fetching all police');
  //           }
  //         }
  //       },
  //       (err) => {
  //         console.error('Error fetching police:', err);
  //       }
  //     );
  //   };
  
  //   fetchNextPage();
  // }
  
  fetchAllPolice(): void {
  this.police = [];
  this.filteredPolice = [];
  let page = 1;

  const fetchNextPage = () => {
    this.policeAccountsService.getAllPolice(page, this.pageSize).subscribe(
      (res) => {
        const polices = Array.isArray(res) ? res : res.data || [];

        if (polices.length > 0) {
          this.police.push(...polices);
          console.log(`Fetched page ${page}`, polices);

          // Continue fetching if this page was full (might be more)
          if (polices.length === this.pageSize) {
            page++;
            fetchNextPage();
          } else {
            console.log('Finished fetching all police');
            // Sort the complete dataset after all pages are fetched
            this.police.sort((a, b) => a.station_id - b.station_id);
            this.filteredPolice = [...this.police];
          }
        }
      },
      (err) => {
        console.error('Error fetching police:', err);
      }
    );
  };

  fetchNextPage();
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


  fetchStation() {
      this.jurisdictionService.getAll().subscribe(
        (res) => {
          this.stations = res;
          console.log('Fetched all stations', this.stations);
        },
        (err) => {
          console.error(err)
        }
      
      )
  }


    fetchStationName(stationId: number): string {
        const station = this.stations.find((station:any) => station.station_id === stationId);
        return station ? station.hq : 'Unknown Station';
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
