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
  selector: 'app-police-archives',
  templateUrl: './police-archives.component.html',
  styleUrl: './police-archives.component.css'
})
export class PoliceArchivesComponent {

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


    fetchAllPolice(){
  
      this.policeAccountsService.getAllPoliceArchives().subscribe(
        (res) => {
          this.police = res;
          console.log('Fetched all retired police ', this.police);
          
        },
        (err) => {
          console.error('Error fetching all retired police :', err);
        }
      )
    }
  


  
    filterPolice() {
      const query = this.searchQuery.toLowerCase();
      
      this.filteredPolice = this.police.filter((police: any) => {
        // Ensure values exist before calling toString or toLowerCase
        const stationName = this.fetchStationName(police.station_id)?.toLowerCase() || '';
        const isStationMatched = stationName.includes(query);
    
        const isPoliceIdMatched = police.police_id?.toString().includes(query) || false;
        const isRankMatched = police.rank_full?.toString().toLowerCase().includes(query) || false;
        const isUnitMatched = police.unit?.toString().toLowerCase().includes(query) || false;
        const isFirstNameMatched = police.firstname?.toLowerCase().includes(query) || false;
        const isMiddleNameMatched = police.middlename?.toLowerCase().includes(query) || false;
        const isLastNameMatched = police.lastname?.toLowerCase().includes(query) || false;
        const isBadgeIdMatched = police.badge_number?.toString().includes(query) || false;
        const isRoleMatched = police.role?.toString().toLowerCase().includes(query) || false;
    
        // Return true if any of the conditions match
        return isStationMatched || isPoliceIdMatched || isRankMatched || isUnitMatched || 
               isFirstNameMatched || isMiddleNameMatched || isLastNameMatched || 
               isBadgeIdMatched || isRoleMatched;
      });
    
      console.log('filtered police', this.filteredPolice);
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


        reinstatePolice(policeId: number) {

          this.dialogService.openConfirmationDialog(`Are you sure you want to reinstate Police ${policeId}?`).then(
            (confirmed) => {
              this.dialogService.openLoadingDialog();
              if(confirmed) {
                this.policeAccountsService.reinstatePolice(policeId).subscribe(
                  (res) => {
                    console.log(`Police ${policeId} reinstated`, res);
                    this.dialogService.closeLoadingDialog();
                      this.dialogService.openUpdateStatusDialog('Success', 'Police successfully reinstated.');
                      setTimeout(()=>{
                        this.dialogService.closeAllDialogs();
                        window.location.reload();
                      }, 2000)
                    
                  },
                  (err) => {
                    console.error('Error marking police as spammer', err)
                  }
                )
              } else {
                this.dialogService.closeLoadingDialog();
                this.dialogService.openUpdateStatusDialog('Canceled', 'Operation canceled.');
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
