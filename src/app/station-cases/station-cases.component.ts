import { Component } from '@angular/core';
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

@Component({
  selector: 'app-station-cases',
  templateUrl: './station-cases.component.html',
  styleUrl: './station-cases.component.css'
})
export class StationCasesComponent {


 
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
    cases: any;
    currentPage: number = 1; 
    pageSize: number = 10; 
    totalCases: number = 0; 
  
    constructor(
      private fb: FormBuilder,
      private caseQueueService: CaseQueueService,
      private jurisdictionService: JurisdictionService,
      private policeAccountsService: PoliceAccountsService,
      private personService: PersonService,
      private router: Router,
      private http: HttpClient
    ) {}
  
    // Initialize the form and fetch reports, stations, and ranks
    ngOnInit(): void {
      
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
    }


    fetchCases(stationId){
      this.caseQueueService.fetchCases(stationId).subscribe(
        (response) => {
          if (Array.isArray(response)) {
            this.cases = response;
          } else {
            this.cases = response.data || [];
            this.totalCases = this.cases.length;
          }
          console.log("Station ID", stationId);
          console.log(`List of Cases in Station ${stationId}`, this.cases);
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
  



}