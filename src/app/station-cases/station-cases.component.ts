import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CaseQueueService } from '../case-queue.service';
import { Router } from '@angular/router';
import { IReport } from '../case.service';
import { IStation, JurisdictionService } from '../jurisdiction.service';
import {
  IPerson,
  IRank,
  PoliceAccountsService,
} from '../police-accounts.service';
import { PersonService } from '../person.service';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-station-cases',
  templateUrl: './station-cases.component.html',
  styleUrl: './station-cases.component.css'
})
export class StationCasesComponent implements OnDestroy{


 
    isLoading = false;
    successMessage: string | null = null;
    errorMessage: string | null = null;
    //reports: IReport[] = [];  // Array to hold fetched reports`3
    reports: any;
  
    stations: IStation[] = [];
    persons: IPerson[] = [];
    ranks: IRank[] = [];
  
    stationID: number = 0;
    citizenId: number = 0;
    fetch_Report: any;
    citizens: any = [];
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
    selectedStatus: string | null = null;

    currentDate: string = '';
    currentTime: string = '';
    intervalId: any;

  
    constructor(
      private fb: FormBuilder,
      private caseQueueService: CaseQueueService,
      private jurisdictionService: JurisdictionService,
      private policeAccountsService: PoliceAccountsService,
      private personService: PersonService,
      private router: Router,
      private http: HttpClient,
      private authService: AuthService,
    ) {}
  
    // Initialize the form and fetch reports, stations, and ranks
    ngOnInit(): void {

      this.fetchCitizens();

      localStorage.removeItem('sessionData');

      const storedStationDetails = localStorage.getItem('stationDetails');
      if (storedStationDetails) {
        try {
          this.stationDetails = JSON.parse(storedStationDetails);
          this.stationID = this.stationDetails.station_id || 0;
          console.log('Station ID:', this.stationID);
    
          // Fetch reports after setting stationID
          if (this.stationID !== 0) {
            this.fetchCases(this.stationID);
          }
        } catch (error) {
          console.error('Error parsing stationDetails:', error);
        }
      } else {
        console.warn('No stationDetails found in localStorage.');
      }

      this.updateDateTime();
      setInterval(() => this.updateDateTime(), 60000);
      this.intervalId = setInterval(() => this.updateDateTime(), 1000);

      const savedPage = localStorage.getItem('currentPage');
      if (savedPage) {
        this.currentPage = +savedPage; // Restore the saved page
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
    }

    ngOnDestroy(): void {
      if (this.intervalId) {
        clearInterval(this.intervalId); // Clear the interval when the component is destroyed
      }
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

    
  // fetchCitizens(): void {
  //   this.caseQueueService.getCitizens().subscribe(
  //     (response) => {
  //       this.citizens = response;
  //       localStorage.setItem('citizens', JSON.stringify(response));
  //       console.log('citizens length', JSON.stringify(localStorage.getItem('citizens')).length)

      
  //       // console.log('Fetched citizens:', this.citizens);
   
  //     },
  //     (error) => {
  //       console.error('Error fetching citizens:', error);
  //       this.errorMessage = 'Failed to load citizens. Please try again.';
  //     }
  //   );
  // }

  fetchCitizens(): void {
    this.caseQueueService.getCitizens().subscribe(
      (response) => {
        // Limit the number of citizens stored
        const limitedCitizens = response.slice(0, 100); // Limit to 50 most recent citizens
  
        this.citizens = limitedCitizens;
        
        try {
          // Store only essential, compact information
          const compactCitizens = limitedCitizens.map(citizen => ({
            citizen_id: citizen.citizen_id,
            name: citizen.name || `${citizen.firstname} ${citizen.lastname}`,
            id_proof: citizen.citizen_proof,
            timestamp: Date.now()
          }));
  
          localStorage.setItem('citizens', JSON.stringify(response));
          
          // Log the size of stored data
          console.log('Citizens length', JSON.stringify(localStorage.getItem('citizens')).length);
        } catch (error) {
          if (error instanceof DOMException && error.name === 'QuotaExceededError') {
            this.handleStorageOverflow();
          } else {
            console.error('Error storing citizens:', error);
          }
        }
      },
      (error) => {
        console.error('Error fetching citizens:', error);
        this.errorMessage = 'Failed to load citizens. Please try again.';
      }
    );
  }
  
  // Optional: Add a method to handle storage overflow
  private handleStorageOverflow() {
    console.warn('Local storage quota exceeded. Clearing oldest citizens.');
    
    try {
      // Retrieve existing citizens
      const storedCitizens = JSON.parse(localStorage.getItem('citizens') || '[]');
      
      // Sort by timestamp and keep only the most recent
      const sortedCitizens = storedCitizens
        .sort((a, b) => b.timestamp - a.timestamp)
        .slice(0, 30); // Keep only 30 most recent
  
      localStorage.setItem('citizens', JSON.stringify(sortedCitizens));
    } catch (error) {
      console.error('Error handling storage overflow:', error);
      localStorage.removeItem('citizens'); // Last resort
    }
  }


  

    fetchCases(stationId: number): void {
      this.currentPage = 1;
      let allCases: any[] = [];
    
      const fetchPage = (pageNumber: number) => {
        this.caseQueueService.fetchCasesPage(stationId, pageNumber, this.pageSize).subscribe(
          (response) => {
            const cases = Array.isArray(response) ? response : response.data || [];
            allCases = [...allCases, ...cases];
    
        
            if (cases.length < this.pageSize) {
              this.cases = allCases; 
              this.cases.sort((b, a) => {
                return new Date(a.date_committed || a.datetime_committed).getTime() - new Date(b.date_committed || b.datetime_committed).getTime();
              });
              // console.log(`Fetched all cases for Station ${stationId}:`, this.cases);
              // localStorage.setItem('cases', JSON.stringify(this.cases));
            } else {
              // Otherwise, fetch the next page
              fetchPage(pageNumber + 1);
            }
          },
          (error) => {
            console.error('Error fetching cases:', error);
            this.errorMessage = 'Failed to load all cases. Please try again.';
          }
        );
      };
    
      // Start fetching from the first page
      fetchPage(this.currentPage);
    }
    

    onPageChange(page: any) {
      this.currentPage = page;
      localStorage.setItem('currentPage', page.toString()); 
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

    editCase(crimeId: number): void {
      if (crimeId) {
        console.log('Navigating with Crime ID:', crimeId);
        this.router.navigate(['/edit-case'], {
          queryParams: { 
            crimeID: crimeId,
            page: this.currentPage
           },
        });
      } else {
        console.error('report ID not found for the selected report.');
        alert('Invalid report id. Please select a valid report.');
      }
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
          localStorage.removeItem('currentPage');
        },
        (error) => {
          console.error('Error during sign out:', error);
        }
      );
    }


    getStatusProgress(status: string): number {
   
      const normalizedStatus = status.trim().toLowerCase();
      
      switch (normalizedStatus) {
        case 'under investigation':
          return 50;
        case 'solved':
        case 'cleared':
          return 100;
        default:
          console.log('Unmatched status:', status); 
          return 0;
      }
    }
    
    getStatusColor(status: string): string {
      // Normalize the status string
      const normalizedStatus = status.trim().toLowerCase();
      
      switch (normalizedStatus) {
        case 'under investigation':
          return '#2196F3';
        case 'solved':
        case 'cleared':
          return '#4CAF50';
        default:
          console.log('Unmatched status:', status); 
          return '#9E9E9E';
      }
    }

}
