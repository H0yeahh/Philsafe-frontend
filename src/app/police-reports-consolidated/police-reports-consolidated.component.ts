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
  selector: 'app-police-reports-consolidated',
  templateUrl: './police-reports-consolidated.component.html',
  styleUrl: './police-reports-consolidated.component.css'
})
export class PoliceReportsConsolidatedComponent {

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
      isOpenReport: boolean = false;
      selectedReport: any;
    
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
        this.fetchCityReports();
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



      fetchCityReports(){
        this.currentPage = 1;
    let allReports: any[] = [];
  
    this.isLoading = true
    const fetchPage = (pageNumber: number) => {
      this.caseService.getAllReportsPage(this.pageSize, pageNumber).subscribe(
        (response) => {
          const reports = Array.isArray(response) ? response : response.data || [];
          allReports = [...allReports, ...reports];
  
      
          if (reports.length < this.pageSize) {
            this.reports = allReports; 
            this.reports.sort((b, a) => {
              return new Date(a.date_committed || a.datetime_committed).getTime() - new Date(b.date_committed || b.datetime_committed).getTime();
            });
            console.log(`Fetched all reports Cebu City`, this.reports);
            localStorage.setItem('reports', JSON.stringify(this.reports));
            this.isLoading = false;
            // this.filterReports();
          } else {
            // Otherwise, fetch the next page
            fetchPage(pageNumber + 1);
          }
        },
        (error) => {
          console.error('Error fetching reports:', error);
          this.errorMessage = 'Failed to load all reports. Please try again.';
          this.isLoading = false;
        }
      );
    };
  
    fetchPage(this.currentPage);
      }

getStationName(stationId: any){
  this.jurisdictionService.getStation(stationId).subscribe(
    (res) => {
      this.stationName = res.hq;
    },
    (err) => {
      console.error('Error fetching station', err)
    }
  )
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

filterReports() {

  let filtered = this.reports;
  

  if (this.fromDate && this.toDate) {
    const fromDate = new Date(this.fromDate);
    const toDate = new Date(this.toDate);

    toDate.setHours(23, 59, 59, 999);
    
    filtered = filtered.filter(report => {
      const reportDate = new Date(report.reported_date);
      return reportDate >= fromDate && reportDate <= toDate;
    });
  }
  

  if (this.searchQuery && this.searchQuery.trim() !== '') {
    filtered = filtered.filter(report => 
      this.isFieldMatched(report.report_id, this.searchQuery) ||
      this.isFieldMatched(report.jurisdiction_id, this.searchQuery) ||
      this.isFieldMatched(this.fetchStationName(report.jurisdiction_id), this.searchQuery) ||
      this.isFieldMatched(report.subcategory_name, this.searchQuery) ||
      this.isFieldMatched(this.formatDate(report.reported_date), this.searchQuery)
    );
  }


  this.filteredReports = filtered;
}


filterDateReports(){
  console.log('From:', this.fromDate, 'To:', this.toDate);
  
  this.filteredReports = this.reports.filter((report: any) => {
    const dateObj = new Date(report.reported_date);
    console.log('Report Date:', dateObj);

    const from = this.fromDate ? new Date(this.fromDate) : null;
    const to = this.toDate ? new Date(this.toDate) : null;

    const inDateRange =
      (!from || dateObj >= from) &&
      (!to || dateObj <= to);

    console.log('In Date Range:', inDateRange);

    return inDateRange;
  });
}


formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }); // e.g. "May 1, 2025"
}


showReportDetails(report: any): void {
    this.selectedReport = report;
    this.isOpenReport = true;
    
    // Add this for accessibility and to prevent background scrolling
    document.body.style.overflow = 'hidden';
  }

  closeReportDetails(): void {
    this.isOpenReport = false;
    this.selectedReport = {};
    
    // Restore scrolling
    document.body.style.overflow = 'auto';
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
