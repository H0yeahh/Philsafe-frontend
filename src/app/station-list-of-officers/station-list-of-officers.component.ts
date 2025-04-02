

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IStation, ManageStationService } from '../manage-station.service';
import { Router } from '@angular/router';
import { JurisdictionService } from '../jurisdiction.service';
import {
  IPerson,
  IRank,
  PoliceAccountsService,
} from '../police-accounts.service';
import { PersonService } from '../person.service';
import {
  IPolice,
  StationListOfOfficersService,
} from '../station-list-of-officers.service';
import { PoliceOfficerService } from '../police-officer.service';
import { AuthService } from '../auth.service';
import { environment } from '../environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-station-list-of-officers',
  templateUrl: './station-list-of-officers.component.html',
  styleUrl: './station-list-of-officers.component.css',
})
export class StationListOfOfficersComponent implements OnInit {
 

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
      citizens: any;
      policeDetails: any;
      stationDetails: any;
      personData: any = {};
      accountData: any = {};
     
      currentPage: number = 1; 
      pageSize: number = 10; 
      totalPolice: number = 0;

      filteredPolice: any[] = [];
      searchQuery = '';
      selectedStatus: string | null = null;
  
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
    private http: HttpClient
  ) {}

  ngOnInit(): void {

    const policeData = localStorage.getItem('policeDetails');
    const stationData = localStorage.getItem('stationDetails');
    const policeByStation = localStorage.getItem('policeByStation');

   
    if (policeData) {
      this.policeDetails = JSON.parse(policeData);
    }

    if (stationData) {
      this.stationDetails = JSON.parse(stationData);
      this.fetchAllPolice(this.stationDetails.station_id);
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
    const userConfirmed = window.confirm(`Are you sure you want to delete Officer ${policeLastName}?`);
  
    if (userConfirmed) {
      this.policeAccountsService.resignedPolice(policeId).subscribe(
        () => { 
          alert(`Officer ${policeLastName} has been successfully deleted.`);
          window.location.reload(); 
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
  
  
}
