import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CaseQueueService } from '../case-queue.service';
import { Router } from '@angular/router';
import { CaseService, IReport } from '../case.service';
import { IStation, JurisdictionService } from '../jurisdiction.service';
import {
  IPerson,
  IRank,
  PoliceAccountsService,
} from '../police-accounts.service';
import { PersonService } from '../person.service';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth.service';
import { PoliceDashbordService } from '../police-dashbord.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-police-cases',
  templateUrl: './police-cases.component.html',
  styleUrl: './police-cases.component.css'
})
export class PoliceCasesComponent {



  isLoading = false;
  successMessage: string | null = null;
  errorMessage: string | null = null;
  reports: any;

  stations: IStation[] = [];
  persons: IPerson[] = [];
  ranks: IRank[] = [];

  stationID: number = 0;
  citizenId: number = 0;
  fetch_Report: any;
  citizens: any;
  policeDetails: any;
  stationDetails: any;
  personData: any = {};
  accountData: any = {};
  cases: any;
  currentPage: number = 1;
  pageSize: number = 10;
  totalCases: number = 0;
  filteredCases: any[] = [];
  searchQuery = '';
  adminData: any;
  adminDetails: any;
  personId: any;
  policePersonData: any;
  reportSubscription: Subscription | undefined;
  totalUsers: number = 0;


  constructor(
    private fb: FormBuilder,
    private caseQueueService: CaseQueueService,
    private caseService: CaseService,
    private jurisdictionService: JurisdictionService,
    private policeAccountsService: PoliceAccountsService,
    private personService: PersonService,
    private router: Router,
    private http: HttpClient,
    private authService: AuthService,
    private policeDashbordService: PoliceDashbordService,
  ) { }

  // Initialize the form and fetch reports, stations, and ranks
  ngOnInit(): void {

    this.fetchCases();
  

  
    const userData = localStorage.getItem('userData');
    this.adminDetails = JSON.parse(userData);
    this.fetchAdminData(this.adminDetails.acc_id)
    console.log('Fetched Admin', this.adminDetails)
  }


  filterCases() {
    if (!this.searchQuery) {
      this.filteredCases = this.cases;
      return;
    }

    const query = this.searchQuery.toLowerCase();

    this.filteredCases = this.cases.filter((crime) => {
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

  loadUserProfile() {
    const userData = localStorage.getItem('userData');
    console.log('USER DATA SESSION', userData);
    if (userData) {
      try {
        const parsedData = JSON.parse(userData);
        this.personId = parsedData.personId;
        this.policeAccountsService.getPoliceByPersonId(this.personId).subscribe(
          (response) => {
            this.policePersonData = response;
            console.log('Fetched Police Person Data', this.policePersonData);
            // this.fetchPoliceData(this.policePersonData.police_id);
            console.log('Police ID:', this.policePersonData.police_id);
          },
          (error) => {
            console.error('Errod Police Person Data', error);
          }
        );

        console.log('Person ID', this.personId);
      } catch {
        console.error('Error fetching localStorage');
      }
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

  fetchCases() {
    this.caseService.getAllCases().subscribe(
      (response) => {
        
          this.cases = response;
       
        console.log(`List of Cases Nationwide`, this.cases);
        localStorage.setItem('cases', JSON.stringify(this.cases))
      },
      (error) => {
        console.error('Error fetching cases:', error);
        this.errorMessage = 'Failed to load cases. Please try again.';
      }
    );
  }


  pagedCases(): any[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return this.cases.slice(startIndex, startIndex + this.pageSize);
  }


  navigateToReportEndorse(citizenId: number): void {
    if (citizenId) {
      console.log('Navigating with Citizen ID:', citizenId);
      this.router.navigate(['/report-endorse'], {
        queryParams: { citizenID: citizenId },
      });
    } else {
      console.error('Citizen ID not found for the selected report.');
      alert('Invalid citizen ID. Please select a valid report.');
    }
  }

  goBack(): void {
    this.router.navigate(['/manage-police']);
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
