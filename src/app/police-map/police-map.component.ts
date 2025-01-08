import { Component, OnInit } from '@angular/core';
import { MapboxService } from '../mapbox.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environment';
import { PoliceDashboardComponent } from '../police-dashboard/police-dashboard.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CaseQueueService } from '../case-queue.service';
import { Router } from '@angular/router';
import { IReport } from '../case.service';
import { IStation, JurisdictionService } from '../jurisdiction.service';
import { IPerson, IRank, PoliceAccountsService } from '../police-accounts.service';
import { PersonService } from '../person.service';
// import { CreateCaseService, ICase } from '../create-case.service';
import { CreateCasesService, ICase } from '../create-cases.service';
import { PoliceDashbordService } from '../police-dashbord.service';
import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';

export interface crimeDetail {
    blotter_num: string;
    source: string;
    committed_time: string;
    committed_date: string;
    station: string;
    pro: string;
    ppo: string;
    region: string;
    province: string;
    barangay: string;
    street: string;
    incident_type: string;
    offense_type: string;
    latitude: number;
    // 'longitude.': number;
    longitude: number;
}

@Component({
  selector: 'app-police-map',
  templateUrl: './police-map.component.html',
  styleUrl: './police-map.component.css'
})
export class PoliceMapComponent implements OnInit {
  adminData: any;
  adminDetails: any;
  personId: any;
  policePersonData: any;
  reportSubscription: Subscription | undefined;
  isDropdownOpen = false; // Track dropdown state
  selectedCrimes: string[] = ['ROBBERY']; // Track selected crimes
  crimeDetails: crimeDetail[] = []; // Object to hold crime details
  filteredCrimes: crimeDetail[] = [];
  crimes = [
    { name: 'ROBBERY', icon: 'assets/robbery.png' },
    { name: 'RAPE', icon: 'assets/rape.png' },
    { name: 'VEHICULAR ACCIDENT', icon: 'assets/traffic incident.png' },
    { name: 'CARNAPPING/MOTORNAPPING', icon: 'assets/car motor napping.png' },
    { name: 'HACKING', icon: 'assets/img/hacking.png' },
    { name: 'LASCIVIOUSNESS', icon: 'assets/lasciviousness.png' },
    { name: 'MURDER', icon: 'assets/murder.png' },
    { name: 'Illegal Gambling Operation', icon: 'assets/operation for illegals.png' },
    { name: 'PHYSICAL INJURY', icon: 'assets/physical injury.png' },
    { name: 'SHOOTING', icon: 'assets/shooting.png' },
    { name: 'STABBING', icon: 'assets/stabbing.png' },
    { name: 'THEFT', icon: 'assets/theft.png' },
    { name: 'ALARMS AND SCANDAL', icon: 'assets/alarms and scandal.png' },
    { name: 'VIOLENCE AGAINST WOMEN AND CHILDREN', icon: 'assets/Violence Against Women and Children.png' },
    { name: 'SEARCH WARRANT', icon: 'assets/Search Warrant.png' },

  ];

  summary:any = {}
  // map:any ={};

  // localToken = 'pk.eyJ1IjoibWltc2gyMyIsImEiOiJjbHltZ2F3MTIxbWY2Mmtvc2YyZXd0ZWF1In0.YP4QQgS9F_Mqj3m7cB8gLw'
  // Base URL for the Mapbox iframe
  // baseMapUrl = `https://api.mapbox.com/styles/v1/mimsh23/clzxya994004p01rbbsifgctv.html?title=false&access_token=${this.localToken}&zoomwheel=false#14.01/10.31534/123.88184`;
  // iframeUrl: SafeResourceUrl = ''; // Initialize iframe URL
  constructor(private mapboxService: MapboxService, private http: HttpClient, private fb: FormBuilder,
    private caseQueueService: CaseQueueService,
    private jurisdictionService: JurisdictionService,
    private policeAccountsService: PoliceAccountsService,
    private personService: PersonService,
    // private createCaseService: CreateCaseService,
    private router: Router,
    private policeDashbordService: PoliceDashbordService,
    private authService: AuthService,) {  }

  async ngOnInit() {
    // this.iframeUrl = this.safe.transform(this.baseMapUrl)
    await this.fetchCrimeDetails();
    await this.mapboxService.initializeMap('map-container', [123.900, 10.295], 13)
    this.mapboxService.getMap().on('load', () => {
      this.filterCrimes()
    })

    const userData = localStorage.getItem('userData');
    this.adminDetails = JSON.parse(userData);
    this.fetchAdminData(this.adminDetails.acc_id)
    console.log('Fetched Admin', this.adminDetails)
  }

  getSummary() {
    return Object.keys(this.summary).map((key: string) => ({
      name: key,
      count: this.summary[key]
    }))
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  toggleCrimeSelection(crime: { name: string; icon: string }) {
    const index = this.selectedCrimes.indexOf(crime.name);
    if (index > -1) {
      this.selectedCrimes.splice(index, 1);
    } else {
      this.selectedCrimes.push(crime.name);
    }
    if (this.selectedCrimes.length < 1) {
      this.selectedCrimes = ['ROBBERY']
    }
    this.filterCrimes(); // Fetch crime details based on selected crimes
  }

  isCrimeSelected(crime: { name: string; icon: string }): boolean {
    return this.selectedCrimes.includes(crime.name);
  }

  fetchCrimeDetails() {
    this.http.get<crimeDetail[]>(`${environment.ipAddUrl}api/case/retrieve/nationwide`).subscribe((data) => {
      this.crimeDetails = data || [];
      this.filteredCrimes = data || [];
      console.log('Fetched Crimes:', this.crimeDetails)
    }, error => {
      console.error('Error fetching crime details:', error);
    });
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

  filterCrimes(){
    if(this.selectedCrimes.length < 1){
      this.filteredCrimes = this.crimeDetails
    }else{
      this.filteredCrimes = this.crimeDetails.filter((crime: crimeDetail) => {
        return this.selectedCrimes.some((selected: string) => {
            return crime.incident_type.toLowerCase().includes(selected.toLowerCase())
        })
      }) 
    }
    this.filteredCrimes.forEach((crime: crimeDetail) => {
      this.selectedCrimes.forEach((selected: string) => {
        if(crime.incident_type.toLowerCase().includes(selected.toLowerCase())){
              this.summary.push
        }
      })
    })

    this.selectedCrimes.forEach((selected: string) => {
      const filterByCrime = this.filteredCrimes.filter((crime: crimeDetail) => crime.incident_type.toLowerCase().includes(selected.toLowerCase()))
      this.summary[selected] = filterByCrime.length
    })
    console.log(this.summary)
    this.mapboxService.removeAllMarkers()
    this.filteredCrimes.forEach((crime: crimeDetail) => {
      // this.mapboxService.addMarkers({longitude: crime['longitude.'], latitude: crime.latitude}, crime.incident_type)
      this.mapboxService.addMarkers({longitude: crime.longitude, latitude: crime.latitude}, crime.incident_type)
    })
  }
  
  goBack(): void {
    this.router.navigate(['/dashboard']);
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

  ngOnDestroy(): void {
    if (this.reportSubscription) {
      this.reportSubscription.unsubscribe();
    }
  }
}

