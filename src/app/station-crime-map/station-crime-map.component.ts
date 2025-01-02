import { Component, OnInit } from '@angular/core';
import { MapboxService } from '../mapbox.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environment';

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
  selector: 'app-station-crime-map',
  templateUrl: './station-crime-map.component.html',
  styleUrls: ['./station-crime-map.component.css'],
})


export class StationCrimeMapComponent implements OnInit {
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
  constructor(private mapboxService: MapboxService, private http: HttpClient) {  }

  async ngOnInit() {
    // this.iframeUrl = this.safe.transform(this.baseMapUrl)
    await this.fetchCrimeDetails();
    await this.mapboxService.initializeMap('map-container', [123.900, 10.295], 13)
    this.mapboxService.getMap().on('load', () => {
      this.filterCrimes()
    })
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
}

