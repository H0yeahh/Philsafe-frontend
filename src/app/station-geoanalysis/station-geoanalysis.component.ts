import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { PersonService } from '../person.service';
import { Router } from '@angular/router';
import { CaseService } from '../case.service';
import { AuthService } from '../auth.service';
import { CaseQueueService } from '../case-queue.service';
import { endOfWeek, format, startOfWeek } from 'date-fns';
import { AccountService } from '../account.service';
import * as mapboxgl from 'mapbox-gl';


@Component({
  selector: 'app-station-geoanalysis',
  templateUrl: './station-geoanalysis.component.html',
  styleUrl: './station-geoanalysis.component.css'
})
export class StationGeoanalysisComponent implements OnInit{

    isLoading = false;
    successMessage: string | null = null;
    errorMessage: string | null = null;
    reports: any = [];
    stations: any = [];
    persons: any = [];
    locations: any = [];
    cases: any = [];
    accounts: any = [];
    currentPage: number = 1; 
    pageSize: number = 10; 
    forCrimeMap: any = [];
    uniqueIncidentTypes: string[] = []; 
    selectedIncidentTypes: string[] = []; 
  
   
    policePersonData: any;
    policeDetails: any;
    stationDetails: any;
    weeklyAvg: any;
    monthlyAvg: any;
    annualAvg: any;
    stationId: any;
    currentDate: string = '';
    currentTime: string = '';
    intervalId: any;
    avatarUrl: string = 'assets/ccpo_logo.jpg';
    token: string;
  
    showModal = false;
    showSubModal = false;
  
    selectedReports: any[] = [];
    isModalOpen: boolean;
    filteredWeekly: any[]  = [];
    filteredMonthly: any[]  = [];
    filteredAnnually: any[]  = [];
    citizens: any = [];
    // mapboxkey: string = 'pk.eyJ1IjoieWVlenp5eTI3IiwiYSI6ImNseW1mdWM0czBiODYya3B0cjlsY3J1eGYifQ.X-NbcgGcphQd9V_2N8n_JA';
    mapboxkey: string = 'pk.eyJ1IjoibWltc2gyMyIsImEiOiJjbHltZ2F3MTIxbWY2Mmtvc2YyZXd0ZWF1In0.YP4QQgS9F_Mqj3m7cB8gLw'
    markers: mapboxgl.Marker[] = [];


    private map!: mapboxgl.Map;
    crimeIcons: { [key: string]: string } = {
      "Acts of Lasciviousness": "acts-of-lasciviousness.png",
      "Adultery": "adultery.png",
      "Alarms and scandals": "alarms-scandals.png",
      "Animal Abuse or Cruelty": "animal-abuse.png",
      "Anti-Fencing Law": "anti-fencing.png",
      "Assault": "assault.png",
      "Bouncing Check(s)": "bouncing-checks.png",
      "Burning/Arson": "arson.png",
      "Carnapping/Motornapping": "carnapping.png",
      "Child Abuse": "vawc.png",
      "Child Prostitution/sexual abuse": "child-prostitution.png",
      "Coercion": "coercion.png",
      "Concubinage": "adultery.png",
      "Domestic Violence/Domestic Abuse": "vawc.png",
      "Encounter": "shooting.png",
      "Extortion": "coercion.png",
      "Falsification of Documents": "false-docs.png",
      "Foreign National": "foreign.png",
      "Grave Threats": "grave-threats.png",
      "Hacking": "hacking.png",
      "Harassment": "rape.png",
      "Hostage Taking": "hostage.png",
      "Identity theft": "theft.png",
      "Illegal Possession of Ammunition": "illegal.png",
      "Illegal Possession of Deadly Weapon": "illegal.png",
      "Illegal Possession of Firearms": "illegal.png",
      "Libel": "libel.png",
      "Malicious Mischief": "illegal.png",
      "Mauling": "mauling.png",
      "Other acts of child abuses": "vawc.png",
      "Other Threats": "stabbing.png",
      "Other Violation(s) of Dangerous Drugs": "illegal",
      "Physical Injury": "physical-injury.png",
      "Possession of Dangerous Drug Paraphernalia": "illegal.png",
      "Possession of Dangerous Drugs": "dangerous-drugs.png",
      "Rape": "rape.png",
      "Resistance to authority": "resistance.png",
      "Robbery": "theft.png",
      "Shooting": "shooting.png",
      "Slander / Oral Defamation": "libel.png",
      "Stabbing": "stabbing.png",
      "Swindling/Estafa": "swindling.png",
      "Theft": "theft.png",
      "Trespassing": "illegal.png",
      "Unjust Vexation": "illegal.png",
      "Vehicular Accident": "vehicle.png",
      "Violence Against Women and Children": "vawc.png",
      "Voyeurism Photo or Video": "illegal.png",
      "Arrest of Most Wanted Person(s)": "illegal.png",
      "Arrest of Other Wanted Person(s)": "illegal.png",
      "Arrest without Warrant": "illegal.png",
      "Buy Bust": "illegal.png",
      "Illegal Drugs Operation": "illegal.png",
      "Illegal Gambling Operation": "illegal.png",
      "Illegal Gambling Operation - Online": "illegal.png",
      "Manhunt Charlie/Arrest with Warrant": "illegal.png",
      "Search Warrant": "illegal.png",
    };
    

    constructor(
     
        private personService: PersonService,
        private caseService: CaseService,
        private router: Router,
        private authService: AuthService,
        private caseQueueService: CaseQueueService,
        private accountService: AccountService
      ) {
        
      }
    
     ngOnInit(): void {
     
    
        this.updateDateTime();
      setInterval(() => this.updateDateTime(), 60000);
      this.intervalId = setInterval(() => this.updateDateTime(), 1000);

      const stationName = localStorage.getItem('stationDetails')
      this.stationDetails = JSON.parse(stationName);
      this.initializeMap();
      this.fetchAllCases();
      // this.fetchLocations();
      // this.fetchData();
     
      
      }
    
      initializeMap(): void {
       

          this.map = new mapboxgl.Map({
            container: 'map-container',
            style: 'mapbox://styles/mapbox/streets-v9', //'mapbox://styles/yeezzyy27/clzxx2om1004c01pnchyqdp3d', // Use your Mapbox style URL
            center: [123.900, 10.295],
            zoom: 13,
            accessToken: this.mapboxkey
          });

          setTimeout(() => {
            this.map.resize();
          }, 1000);
        

          this.map.addControl(new mapboxgl.NavigationControl());
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

fetchAllCases(){

  this.caseService.getAllCases().subscribe({
    next: (res) => {
      this.cases = res;
      // console.log('Cases', this.cases)
      setTimeout(() => {
        this.addMarkers();

      }, 5000)
      this.loadIncidentTypes()
    },
    error: (err) => {
      console.error('Failed to retrieve cases', err)
    }
  });
  
}


// fetchData() {

//   this.personService.getLocations().subscribe({
//     next: (locationsRes) => {
//       this.locations = locationsRes;

//       // Then fetch cases
//       this.caseService.getAllCases().subscribe({
//         next: (casesRes) => {
//           this.cases = casesRes;

//           this.mergeLocationsAndCases();
//         },
//         error: (err) => console.error('Failed to fetch cases', err)
//       });
//     },
//     error: (err) => console.error('Failed to fetch locations', err)
//   });
// }

// mergeLocationsAndCases() {
//   this.forCrimeMap = this.locations
//     .map(location => {
//       const matchedCases = this.cases.filter(c => c.location_id === location.location_id);
//       return matchedCases.length > 0 ? { location, cases: matchedCases } : null;
//     })
//     .filter(item => item !== null);

//   // console.log('Filtered Crime Map Data:', this.forCrimeMap);
  
// }

loadIncidentTypes() {
  const types: string = this.cases.map(c => c.incident_type.replace(/^\(Incident\) |\((Operation)\) /, '').trim());
  this.uniqueIncidentTypes = [...new Set(types)];
  console.log('Unique incident', this.uniqueIncidentTypes)
}

addMarkers() {
  console.log('Adding markers....');
  this.clearMarkers();

  if (!this.cases || this.cases.length === 0) {
    console.warn('Cases array is empty or undefined');
    return;
  }

  this.cases.forEach((caseItem, index) => {
    // console.log(`Case ${index + 1}:`, caseItem);

    const latitude = caseItem.latitude;  
    const longitude = caseItem.longitude; 

    if (latitude === undefined || longitude === undefined) {
      // console.warn(`Missing latitude/longitude for case ${index + 1}`, caseItem);
      return;
    }

    const incident_type = caseItem.incident_type?.replace(/^\(Incident\) |\((Operation)\) /, '').trim();

    if (!incident_type) {
      // console.warn(`No valid incident type for case ${index + 1}`, caseItem);
      return;
    }

    // console.log(`Adding marker for: ${incident_type} at (${latitude}, ${longitude})`);

    const iconFileName = this.getCrimeIcon(incident_type);
    const iconUrl = `assets/icons/${iconFileName}`;

    const marker = new mapboxgl.Marker({
      element: this.createMarkerElement(iconUrl)
    })
      .setLngLat([longitude, latitude])
      .addTo(this.map);
  });
}


createMarkerElement(iconUrl: string): HTMLElement {
  const markerElement = document.createElement('div');
  markerElement.className = 'mapbox-marker';  
  markerElement.style.backgroundImage = `url(${iconUrl})`;  // Use backticks here for string interpolation
  markerElement.style.backgroundSize = 'cover';
  markerElement.style.width = '50px'; 
  markerElement.style.height = '50px'; 
  return markerElement;
}


clearMarkers() {
  this.markers.forEach(marker => marker.remove());
  this.markers = [];
}

filterMarkers() {
  this.addMarkers();
}

getCrimeIcon(incidentType: string): string {
  const defaultIcon = 'marker';
  // console.log(`Looking up icon for incident type: "${incidentType}"`); 
  const icon = this.crimeIcons[incidentType] || defaultIcon;
  // console.log(`Matched icon: "${icon}"`); 
  return icon;
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
}
