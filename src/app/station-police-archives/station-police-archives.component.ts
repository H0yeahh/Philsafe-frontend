import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { AccountService, IAccount, IPerson, ILocation } from '../account.service'; // Import the service
import { Router } from '@angular/router'; // Import Router for navigation
import moment from "moment";
import { resolve } from 'node:path';
import { PoliceAccountsService, IRank, ILocation, IAccount, IPolice, IPerson } from '../police-accounts.service';
import { IStation, JurisdictionService } from '../jurisdiction.service';
import { AuthService } from '../auth.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environment';

@Component({
  selector: 'app-station-police-archives',
  templateUrl: './station-police-archives.component.html',
  styleUrl: './station-police-archives.component.css'
})
export class StationPoliceArchivesComponent {

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


  constructor(
    private fb: FormBuilder,
    private jurisdictionService: JurisdictionService,
    private policeAccountsService: PoliceAccountsService,
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
      const url = `${environment.ipAddUrl}api/police/collect/retired/all/${pageSize}/${currentPage}`;
      this.http.get<any[]>(url).subscribe(
        (response) => {
          const police = Array.isArray(response) ? response : response|| [];
          allPolice = [...allPolice, ...police]; 
          if (police.length < pageSize) {
            this.policeByStation = allPolice; 
            console.log(`Fetched all police for Station ${stationId}:`, this.policeByStation);
            
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


  isReportsActive(): boolean {
    const activeRoutes = ['/station-police-archives', '/station-list-of-officers'];
    return activeRoutes.some((route) => this.router.url.includes(route));
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



  reinstatePolice(policeId: number, policeLastName: string) {
    const userConfirmed = window.confirm(`Are you sure you want to reinstate Officer ${policeLastName}?`);
    
    if (userConfirmed) {
      this.policeAccountsService.reinstatePolice(policeId).subscribe(
        () => {
          alert(`Officer ${policeLastName} has been successfully reinstated.`);
          this.policeByStation = this.policeByStation.filter(police => police.police_id !== policeId);
        },
        error => {
          console.error('Failed to reinstate officer:', error);
          alert('An error occurred while reinstating the officer.');
        }
      );
    } else {
      console.log('Reinstatement was canceled');
    }
  }
  
  
}
