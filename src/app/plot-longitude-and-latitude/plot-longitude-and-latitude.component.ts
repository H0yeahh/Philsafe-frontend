import { Component, OnInit } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import { environment } from '../environment';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-plot-longitude-and-latitude',
  templateUrl: './plot-longitude-and-latitude.component.html',
  styleUrls: ['./plot-longitude-and-latitude.component.css']
})
export class PlotLongitudeAndLatitudeComponent implements OnInit {
  map!: mapboxgl.Map;
  longitude: number | null = null;
  latitude: number | null = null;

  locationId: number = 0;

  stationDetails: any;

   constructor(
    
      private router: Router,
      private authService: AuthService,
      private route: ActivatedRoute,

    ) {}
  

  ngOnInit() {
    
    // (mapboxgl as any).accessToken = environment.mapboxKey;

    this.map = new mapboxgl.Map({
      container: 'map', // ID in the HTML
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [123.880283, 10.324278], 
      zoom: 12,
      accessToken: environment.mapboxKey
    });

    // Add a click event listener
    this.map.on('click', (event: mapboxgl.MapMouseEvent) => {
      const { lng, lat } = event.lngLat;
      this.longitude = lng;
      this.latitude = lat;
    });

    const stationData = localStorage.getItem('stationDetails');
    if (stationData) {
      this.stationDetails = JSON.parse(stationData);

    }

    this.route.queryParams.subscribe((params) =>{
      this.locationId = +params['locationId'];
      console.log('Location Id', this.locationId)
    })
  }

  navigateToBlotter() {
    // Implement your navigation logic here
    console.log('Coordinates:', { longitude: this.longitude, latitude: this.latitude });
  }

  isReportsActive(): boolean {
    const activeRoutes = ['/plot-longitude-and-latitude', '/station-crime-map'];
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


}