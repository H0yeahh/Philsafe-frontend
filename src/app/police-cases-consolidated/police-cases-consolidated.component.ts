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
  selector: 'app-police-cases-consolidated',
  templateUrl: './police-cases-consolidated.component.html',
  styleUrl: './police-cases-consolidated.component.css'
})
export class PoliceCasesConsolidatedComponent {

   isLoading = false;
      successMessage: string | null = null;
      errorMessage: string | null = null;
      citizen: any = [];
      filteredCitizens: any = [];
      citizenID: string | null = null;

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
      reports: any = []
      stationName: any;
      filteredReports: any = [];
      fromDate: string = '';
      toDate: string = '';
      cases: any = [];
      filteredCases: any = [];
      isOpenCrime = false;
      selectedCrime: any = null;
      
          
    
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
        this.fetchCityCases();
        this.fetchStation();
    
        const userData = localStorage.getItem('userData');
        this.adminDetails = JSON.parse(userData);
        // this.fetchAdminData(this.adminDetails.acc_id)
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



      fetchCityCases(){
this.currentPage = 1;
    let allCases: any[] = [];
  
    
this.isLoading = true;
    // setTimeout(() => {
      
    // }, 10000)
    const fetchPage = (pageNumber: number) => {
      this.caseService.getAllCasesPage(this.pageSize, pageNumber).subscribe(
        (response) => { 
          const cases = Array.isArray(response) ? response : response.data || [];
          allCases = [...allCases, ...cases];
  
      
          if (cases.length < this.pageSize) {
            this.cases = allCases; 
            this.cases.sort((a, b) => {
  return a.station_id - b.station_id;
});

            console.log(`Fetched all cases Cebu City`, this.cases);
            localStorage.setItem('cases', JSON.stringify(this.cases));
            this.isLoading = false;
            // this.filterReports();
          } else {
            // Otherwise, fetch the next page
            fetchPage(pageNumber + 1);
          }
          
        },
        (error) => {
          console.error('Error fetching cases:', error);
          this.errorMessage = 'Failed to load all cases. Please try again.';
          this.isLoading = false;
        }
      );
    };
  
    fetchPage(this.currentPage);
      }

 openCrimeDetails(crimeData: any): void {
    this.selectedCrime = crimeData;
    this.isOpenCrime = true;
  }

   closeModal(event: MouseEvent): void {
    if ((event.target as HTMLElement).className === 'modal-overlay') {
      this.isOpenCrime = false;
    }
  }

  getDisplayValue(value: any): string {
    return value !== null && value !== undefined ? value : 'Unknown, Please Contact Station';
  }

  

    
// filterReports() {
//   const query = this.searchQuery.toLowerCase();

//   this.filteredReports = this.reports.filter((report: any) => {
//     const stationId = report.jurisdiction_id?.toString().toLowerCase() || '';
//     const stationName = this.fetchStationName(report.jurisdiction_id)?.toLowerCase() || '';
//     const reportId = report.report_id?.toString().toLowerCase() || '';
//     const incident = report.subcategory_name?.toLowerCase() || '';
//     const formattedDate = this.formatDate(report.reported_date).toLowerCase();
//     // const reportDateMatched = formattedDate.includes(query);
//     return (
//       stationId.includes(query) ||
//       stationName.includes(query) ||
//       reportId.includes(query) ||
//       incident.includes(query) ||
//       formattedDate.includes(query)
//     );
//   });
// }

filterCases() {

  let filtered = this.cases;
  
  

  if (this.fromDate && this.toDate) {
    const fromDate = new Date(this.fromDate);
    const toDate = new Date(this.toDate);
    // Set toDate to end of day for inclusive filtering
    toDate.setHours(23, 59, 59, 999);
    
    filtered = filtered.filter(crime => {
      const crimeDate = new Date(crime.date_committed);
      return crimeDate >= fromDate && crimeDate <= toDate;
    });
  }
  

  if (this.searchQuery && this.searchQuery.trim() !== '') {
    filtered = filtered.filter(crime => 
      this.isFieldMatched(crime.crime_id, this.searchQuery) ||
      this.isFieldMatched(crime.station_id, this.searchQuery) ||
      this.isFieldMatched(this.fetchStationName(crime.station_id), this.searchQuery) ||
      this.isFieldMatched(crime.incident_type, this.searchQuery) ||
      this.isFieldMatched(this.formatDate(crime.date_committed), this.searchQuery)
    );
  }

  this.filteredCases = filtered;
}




formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }); // e.g. "May 1, 2025"
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
