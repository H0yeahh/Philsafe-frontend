import { Component, OnInit } from '@angular/core';
import { IStation, JurisdictionService } from '../jurisdiction.service';
import {
  IPerson,
  IRank,
  PoliceAccountsService,
} from '../police-accounts.service';
import { PersonService } from '../person.service';
import { Router } from '@angular/router';
import { CaseService } from '../case.service';
import { AuthService } from '../auth.service';
import { CaseQueueService } from '../case-queue.service';
import { endOfWeek, format, startOfWeek } from 'date-fns';
import { AccountService } from '../account.service';
import { DialogService } from '../dialog/dialog.service';

@Component({
  selector: 'app-station-citizens',
  templateUrl: './station-citizens.component.html',
  styleUrl: './station-citizens.component.css'
})
export class StationCitizensComponent implements OnInit {
  currentDate: string = '';
  currentTime: string = '';
  policePersonData: any;
  personId: any;
  stationDetails: any;
  avatarUrl: string = 'assets/ccpo_logo.jpg';

    isLoading = false;
    successMessage: string | null = null;
    errorMessage: string | null = null;
    //reports: IReport[] = [];  // Array to hold fetched reports`3
    reports: any;
    accounts: any;
    stations: IStation[] = [];
    persons: any = [];
    ranks: IRank[] = [];
  
    stationID: string | null = null;
    citizenId: number = 0;
    fetch_Report: any;
    citizens: any;
    currentPage: number = 1;
    pageSize: number = 10;
    totalReports: number = 0;
    filteredReports: any[] = [];
    searchQuery = '';
    policeDetails: any = {};
    avatarUrls: { [citizenId: number]: string } = {};

    
    accountData: any;
    citizenData: any;
    profilePics: { [citizenId: number]: any } = {};
    reportId: any;
    specificReport: any;
    profilePicMap: { [key: number]: string } = {};
    intervalId: any;
    selectedRemark: string = 'all';
    spammerCitizenIds: Set<number> = new Set();
    accountMap = new Map<number, number>();
    avatarMap: { [citizenId: number]: string } = {};
    userAvatars: Map<number, string> = new Map<number, string>();
    userAvatar: string = 'assets/user-default.jpg'
    profPics: any = [];
    selectedCitizenReports: any[] = [];
    isModalOpen = false;
    userData: any = []
    isProfileMenuOpen = false;
  
  


  constructor(

      private jurisdictionService: JurisdictionService,
      private policeAccountsService: PoliceAccountsService,
      private personService: PersonService,
      private caseService: CaseService,
      private router: Router,
      private authService: AuthService,
      private caseQueueService: CaseQueueService,
      private accountService: AccountService,
      private dialogService: DialogService
    ) {

    }



  ngOnInit(): void {  

    this.updateDateTime();
    this.loadUserProfile();
    // this.fetchCitizens();
    this.fetchAccounts();
    this.fetchPersons();
    this.loadUserProfile();
    

    const userData = localStorage.getItem('userData');

    
    // this.preloadAvatars();
    // setInterval(() => this.updateDateTime(), 60000);
    if (userData) {
      this.userData = JSON.parse(userData);
      console.log('Fetched User Data', this.userData);
    }
  
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

    console.log('Date', this.currentDate)
    console.log('Time', this.currentTime)

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
            this.fetchReports(this.policePersonData.station_id);
            // this.fetchReportStation(this.policePersonData.station_id);
            this.fetchStation(this.policePersonData.station_id);
            // this.fetchPoliceData(this.policePersonData.police_id);
            console.log('Police ID:', this.policePersonData.police_id);
          },
          (error) => {
            console.error('Error Police Person Data', error);
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


  onRestrict(action: (...args: any[]) => void, ...params: any[]): void {
    if (!this.userData?.is_officer_of_the_day) {
      this.dialogService.openUpdateStatusDialog('RESTRICTED', 'You are not In-Charge for today');
      return;
    }
  
    action(...params);
  }
  



  
  fetchStation(stationId: number) {
    this.jurisdictionService.getStation(stationId).subscribe(
      (response) => {
        this.stationDetails = response;
        localStorage.setItem('stationDetails', JSON.stringify(this.stationDetails));
        console.log('Station Data', this.stationDetails);
        // this.fetchCases(this.stationDetails.station_id)
      },
      (error) => {
        console.error('Error Fetching Station Data', error);
      }
    );
  }

   // Fetch stations
   fetchStations(): void {
    this.jurisdictionService.getAll().subscribe(
      (response: IStation[]) => {
        this.stations = response;
      },
      (error) => {
        console.error('Error fetching stations:', error);
        this.errorMessage = 'Failed to load stations. Please try again.';
      }
    );
  }


  fetchAccounts(): void {
    this.accountService.getAccount().subscribe(
      (response) => {
        this.accounts = response;
        // console.log('Accounts', this.accounts)
        for (let acc of this.accounts) {
          this.accountMap.set(acc.personId, acc.acc_id);
          
        }
        this.preloadAvatars();
        
        console.log('Account Map:', this.accountMap);
      },
      (error) => {
        console.error('Error fetching Accounts:', error);
      }
    );
  }

  // fetchCitizens(): void {
  //   this.currentPage = 1;
  //   let allCitizens: any[] = [];
  
  //   const fetchPage = (pageNumber: number) => {
  //     this.caseQueueService.getCitizensPage(this.pageSize,pageNumber).subscribe(
  //       (response) => {
  //         const citizens = Array.isArray(response) ? response : response.data || [];
  //         allCitizens = [...allCitizens, ...citizens];
  
      
  //         if (citizens.length < this.pageSize) {
  //           this.citizens = allCitizens; 
  //           this.citizens.sort((b, a) => {
  //             return new Date(a.date_committed || a.datetime_committed).getTime() - new Date(b.date_committed || b.datetime_committed).getTime();
  //           });
  //           console.log(`Fetched all citizens `, this.citizens);
  //           this.populateAvatars();
            
  //         } else {
  //           // Otherwise, fetch the next page
  //           fetchPage(pageNumber + 1);
  //         }
  //       },
  //       (error) => {
  //         console.error('Error fetching reports:', error);
  //         this.errorMessage = 'Failed to load all reports. Please try again.';
  //       }
  //     );
  //   };
  
  //   fetchPage(this.currentPage);
  // }

  
  fetchReports(stationId: number){
    this.caseQueueService.getReports(stationId).subscribe(
      (response) => {
        this.reports = response;
        console.log('Reportsssssssssssss', this.reports)
        this.spammerCitizenIds = new Set(
          this.reports
            .filter(report => report.is_spam)
            .map(report => report.citizen_id)
        );
  
        console.log('Spammer IDs:', this.spammerCitizenIds);
        this.fetchCitizens();
      },
      (error) => {
        console.error('Error fetching reports:', error);
        this.errorMessage = 'Failed to load reports. Please try again.';
      }
    );
  }


  fetchCitizens(): void {
    this.currentPage = 1;
    let allCitizens: any[] = [];
  
    const fetchPage = (pageNumber: number) => {
      this.caseQueueService.getCitizensPage(this.pageSize, pageNumber).subscribe(
        (response) => {
          const citizens = Array.isArray(response) ? response : response.data || [];
          allCitizens = [...allCitizens, ...citizens];
  
          console.log('Fetched Citizens before filtering:', citizens);
  
          if (citizens.length < this.pageSize) {

            if (!this.reports || !Array.isArray(this.reports)) {
              console.error('Reports data is not available or not an array.');
              this.errorMessage = 'Reports data not loaded. Please try again.';
              return;
            }

            const citizenIdsWithReports = this.reports.map(report => report.citizen_id);
            const uniqueCitizenIds = Array.from(new Set(citizenIdsWithReports));

            this.citizens = allCitizens.filter(citizen =>
              uniqueCitizenIds.includes(citizen.citizen_id)
            );
  
            // Optional: Sort by latest date if applicable
            this.citizens.sort((b, a) => {
              return new Date(a.date_committed || a.datetime_committed).getTime() -
                     new Date(b.date_committed || b.datetime_committed).getTime();
            });
  
            console.log(`Filtered Citizens who have reports:`, this.citizens);
            this.populateAvatars();
          } else {
            // Continue fetching remaining pages
            fetchPage(pageNumber + 1);
          }
        },
        (error) => {
          console.error('Error fetching citizens:', error);
          this.errorMessage = 'Failed to load citizens. Please try again.';
        }
      );
    };
  
    fetchPage(this.currentPage);
  }
  

  fetchPersons(): void {
    this.personService.getPersons().subscribe(
      (response) => {
        this.persons = response;
        // console.log('Fetched Persons', this.persons)
      },
      (error) => {
        console.error('Error fetching persons:', error);
        this.errorMessage = 'Failed to load persons. Please try again.';
      }
    );
  }




  getCitizenName(citizenId: number): string {
    const citizen = this.citizens.find((c: any) => c.citizen_id === citizenId);
    return citizen ? `${citizen.firstname} ${citizen.lastname}` : 'Unknown';
  }



  preloadAvatars(): void {
    const accountIds: number[] = Array.from(this.accountMap.values());
  
    // console.log('Sending accountIds:', accountIds);
  
    this.accountService.getMoreProfile(accountIds).subscribe(
      (res) => {
        // console.log('Profile Pics:', res);
        this.profPics = res;
        this.populateAvatars();
      },
      (error) => {
        console.error('Error loading profile pics:', error);
      }
    );
  }
  
  
  
  
  




  async populateAvatars():Promise<any>{

      // console.log('Populating Citizens', this.citizens)
      // console.log('Populating Profpics', this.profPics)

    if (!this.citizens || !this.profPics) {
      console.error('Citizens or profile pictures not loaded yet.');
    }
  
    for (const citizen of this.citizens) {
      const accountIdStr = String(citizen.account_id);
      const profilePic = this.profPics.find((pic: any) => pic.file_download_name === accountIdStr);
  
      if (profilePic) {
        const avatarUrl = `data:${profilePic.content_type};base64,${profilePic.file_contents}`;
        this.userAvatars.set(citizen.citizen_id, avatarUrl);
      } else {
        this.userAvatars.set(citizen.citizen_id, 'assets/user-default.jpg');
      }
    }
  
    // console.log('User avatars populated:', this.userAvatars);
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


  isSpammer(citizenId: number ) {

    this.dialogService.openConfirmationDialog('Are you sure you want to mark this citizen as spammer?').then(
      (confirmed) => {
        this.dialogService.openLoadingDialog();
        if(confirmed) {
          this.personService.spamCitizen(citizenId).subscribe(
            (res) => {
              console.log('Citizen marked as spammer', res);
              this.dialogService.closeLoadingDialog();
                this.dialogService.openUpdateStatusDialog('Success', 'Citizen tagged as spammer.');
                setTimeout(()=>{
                  this.dialogService.closeAllDialogs();
                  window.location.reload();
                }, 2000)
              
            },
            (err) => {
              console.error('Error marking citizen as spammer', err)
            }
          )
        } else {
          this.dialogService.closeLoadingDialog();
          this.dialogService.openUpdateStatusDialog('Canceled','Operation Canceled')
        }
      }
    )
  }


  openCitizenReports(citizenId: number) {

    // console.log('this.reports', this.reports)
    
    this.selectedCitizenReports = this.reports.filter(
      report => report.citizen_id === citizenId
    );
    this.isModalOpen = true;
  
    console.log('Reports from citizen:', this.selectedCitizenReports);
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



  toggleProfileMenu(): void {
    this.isProfileMenuOpen = !this.isProfileMenuOpen;
    
    if (this.isProfileMenuOpen) {
      setTimeout(() => {
        document.addEventListener('click', this.closeProfileMenu);
      }, 0);
    }
  }
  
  closeProfileMenu = (event: MouseEvent): void => {
    const profileContainer = document.querySelector('.profile-menu-container');
    if (profileContainer && !profileContainer.contains(event.target as Node)) {
      this.isProfileMenuOpen = false;
      document.removeEventListener('click', this.closeProfileMenu);
   
     
    }
  }

}
