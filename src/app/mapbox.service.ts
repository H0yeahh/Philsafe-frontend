import { Injectable } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import { HttpClient, HttpRequest } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { MAPBOX_ACCESS_TOKEN } from './mapbox-config';
import { crimeDetail } from './station-crime-map/station-crime-map.component';
const colorMap = new Map([
  ["ROBBERY", '#c6f217'],
  ["RAPE", '#a337b5'],
  ["VEHICULAR ACCIDENT", '#ff66c4'],
  ["CARNAPPING/MOTORNAPPING", '#f4c761'],
  ["DRUGS", '#ff5757'],
  ["HACKING", '#49d9d9'],
  // ["HOMICIDE", '#ec8457'],
  ["LASCIVIOUSNESS", '#b7b11e'],
  // ["MURDER", '#86c3ec'],
  ["ILLEGAL GAMBLING OPERATION", '#a5a5a5'],
  ["PHYSICAL INJURY", '#2d3cff'],
  ["SHOOTING", '#8fe0de'],
  ["STABBING", '#f29696'],
  ["THEFT", '#00bf63'],
  ["ALARMS AND SCANDAL", '#ff5757'],
  ["VIOLENCE AGAINST WOMEN AND CHILDREN", '#ff4500'],
  ["SEARCH WARRANT", '#ffd700']
])
const crimeList = ["ROBBERY", "RAPE", "VEHICULAR ACCIDENT", "CARNAPPING/MOTORNAPPING",
  "DRUGS", "HACKING", "LASCIVIOUSNESS","ILLEGAL GAMBLING OPERATION",
  "PHYSICAL INJURY", "SHOOTING", "STABBING","THEFT","ALARMS AND SCANDAL",
  "VIOLENCE AGAINST WOMEN AND CHILDREN","SEARCH WARRANT"]
interface Coordinate {
  latitude: number;
  longitude: number;
}

@Injectable({
  providedIn: 'root'
})
export class MapboxService {
  private map!: mapboxgl.Map;
  // private markersUrl = 'assets/styles.json'; // Path to your markers JSON file
  private markersUrl = 'https://localhost:7108/api/location/retrieve/mapcoordinates'; // Path to your markers JSON file
  private coordinatesUrl = 'https://localhost:7108/api/case/retrieve/nationwide'; // URL to fetch coordinates from backend
  private markers: mapboxgl.Marker[] = []
  constructor(private http: HttpClient) { }

  getMap() {
    return this.map;
  }

  initializeMap(container: string, center: [number, number], zoom: number): void {
    this.map = new mapboxgl.Map({
      container: container,
      style: 'mapbox://styles/mapbox/streets-v9', //'mapbox://styles/yeezzyy27/clzxx2om1004c01pnchyqdp3d', // Use your Mapbox style URL
      center: center,
      zoom: zoom,
      accessToken: MAPBOX_ACCESS_TOKEN
    });

    // this.map.on('load', () => {
      // this.fetchCrimeDetails()
      // this.addMarkers({longitude: 123.878983, latitude: 10.292344})
      // this.addMarkers({longitude: 123.909447, latitude: 10.309757})
    // })
  }

  // fetchCrimeDetails() {
  //   this.http.get<crimeDetail[]>('https://172.30.6.61:7108/api/case/collect/crimedata').subscribe((data) => {
  //     data.filter((x: crimeDetail) => x.incident_type.toUpperCase().includes('ROBBERY')).forEach((crime: crimeDetail) => {
  //       this.addMarkers({ longitude: crime['longitude.'], latitude: crime.latitude }, crime.incident_type)
  //     })
  //   }, error => {
  //     console.error('Error fetching crime details:', error);
  //   });
  // }

  addMarkers(lngLat: { longitude: number, latitude: number }, crime: string) {
    const { longitude, latitude } = lngLat
    let color: any = 'cyan'

    crimeList.forEach((str: string) => {
      if (crime.toUpperCase().includes(str.toUpperCase())) {
        color = colorMap.get(str)
      }
    })
    if (!!longitude && !!latitude) {
      const marker = new mapboxgl.Marker({ color }).setLngLat([longitude, latitude]).addTo(this.map)
      this.markers.push(marker)
    }
  }

  removeAllMarkers() {
    this.markers.forEach((marker: mapboxgl.Marker) => marker.remove())
  }
  getMarkers(): Observable<any[]> {
    return this.http.get<any[]>(this.markersUrl).pipe(
      catchError(error => {
        console.error('Error fetching markers:', error);
        return of([]); // Return an empty array using 'of' from RxJS
      })
    );
  }

  getMarkersByCrime(crime: string): Observable<any[]> {
    return this.http.get<any[]>(this.markersUrl).pipe(
      map(markers => {
        console.log('marker: ', markers)
        if (Array.isArray(markers)) {
          return markers.filter(marker => marker.name === crime);
        } else {
          console.error('Markers data is not an array:', markers);
          return []; // Return an empty array if data is not an array
        }
      }),
      catchError(error => {
        console.error('Error fetching markers by crime:', error);
        return of([]); // Return an empty array using 'of' from RxJS
      })
    );
  }

  getMapCoordinates(): Observable<{ lat: number, lng: number }[]> {
    // Fetch map coordinates from the backend
    return this.http.get<any[]>(this.coordinatesUrl).pipe(
      map(data => {
        const coordinates: { lat: number, lng: number }[] = [];
        if (Array.isArray(data)) {
          data.forEach(cluster => {
            if (Array.isArray(cluster.coordinates)) {
              cluster.coordinates.forEach((coord: Coordinate) => { // Explicitly type 'coord'
                if (coord.latitude && coord.longitude) {
                  coordinates.push({ lat: coord.latitude, lng: coord.longitude });
                }
              });
            } else {
              console.error('Cluster coordinates data is not an array:', cluster.coordinates);
            }
          });
        } else {
          console.error('Data is not an array:', data);
        }
        return coordinates;
      }),
      catchError(error => {
        console.error('Error fetching map coordinates:', error);
        return of([]); // Return an empty array using 'of' from RxJS
      })
    );
  }
}

