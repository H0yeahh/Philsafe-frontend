import { Component, OnInit } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import { environment } from '../environment';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { LocationData, LocationsService } from '../locations.service';
import { DialogService } from '../dialog/dialog.service';  


@Component({
  selector: 'app-plot-longitude-and-latitude',
  templateUrl: './plot-longitude-and-latitude.component.html',
  styleUrls: ['./plot-longitude-and-latitude.component.css'],
})
export class PlotLongitudeAndLatitudeComponent implements OnInit {
  map!: mapboxgl.Map;
  longitude: number | null = null;
  latitude: number | null = null;
  marker!: mapboxgl.Marker;
  locationId: number = 0;

  stationDetails: any;

  locationData: LocationData = {
    locationId: 0,
    province: '',
    municipality: '',
    barangay: '',
    street: '',
    region: '',
    block: '',
    longtitude: 0,
    latitude: 0,
  };

  constructor(
    private router: Router,
    private authService: AuthService,
    private route: ActivatedRoute,
    private locationService: LocationsService,
    private dialogService: DialogService

  ) {}

  ngOnInit() {
    // (mapboxgl as any).accessToken = environment.mapboxKey;

    this.map = new mapboxgl.Map({
      container: 'map', // ID in the HTML
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [123.880283, 10.324278],
      zoom: 12,
      accessToken: environment.mapboxKey,
    });

    // Add a click event to the map
    this.map.on('click', (event: mapboxgl.MapMouseEvent) => {
      const { lng, lat } = event.lngLat;

      // Update the coordinates
      this.longitude = lng;
      this.latitude = lat;

   
      console.log('Selected Coordinates:', { longitude: lng, latitude: lat });

    
      if (this.marker) {
        this.marker.remove();
      }

      this.marker = new mapboxgl.Marker({ color: 'red' })
        .setLngLat([lng, lat])
        .addTo(this.map);
    });

    const stationData = localStorage.getItem('stationDetails');
    if (stationData) {
      this.stationDetails = JSON.parse(stationData);
    }

    this.route.queryParams.subscribe((params) => {
      this.locationId = +params['locationID'];
      this.locationData = params['data'] ? JSON.parse(params['data']) : null;
      
      console.log('Location Data', this.locationData);
      console.log('Location Id', this.locationId);
    });
  }

  navigateToBlotter() {
    // Implement your navigation logic here
    console.log('Coordinates:', {
      longtitude: this.longitude,
      latitude: this.latitude,
    });
    this.locationData.longtitude  = this.longitude;
    this.locationData.latitude = this.latitude;
    console.log('Final Data for edit', this.locationData);
    this.dialogService.openLoadingDialog();
    this.locationService.editLoc(this.locationId, this.locationData).subscribe(
      (res) => {
        // alert('Location successfully plotted on the crime map.')
        
        setTimeout(() => {
          this.dialogService.closeLoadingDialog();
          this.dialogService.openUpdateStatusDialog('Success', 'Location successfully plotted on the crime map.');
          
          setTimeout(() => {
            console.log('Location Data successfully updated!', res);
            this.router.navigate(['station-dashboard'])
          }, 2000);
        }, 5000);
        
      },
      (err) => {
        console.error('Location Data failed to updated', err);
      }
    )

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
