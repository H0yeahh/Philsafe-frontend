import { Component, OnInit, OnDestroy, NgZone } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { IStation, ManageStationService } from '../manage-station.service';
import { Router } from '@angular/router';
import { ICreateParam, IStation, JurisdictionService } from '../jurisdiction.service';
import { IPerson,IRank,LocationUpgrade,PoliceAccountsService, UpgradeAccount} from '../police-accounts.service';
import { PersonService } from '../person.service';
import { ICitizen, ManageUsersService } from '../manage-users.service';
import { AuthService } from '../auth.service';
import { PoliceDashbordService } from '../police-dashbord.service';
import { HttpClient } from '@angular/common/http';
import { CaseQueueService } from '../case-queue.service';
import { catchError, map, Observable, of, Subscription } from 'rxjs';
import { CaseService } from '../case.service';
import { environment } from '../environment';
import { AccountService } from '../account.service';
import { DialogService } from '../dialog/dialog.service';
import * as mapboxgl from 'mapbox-gl';



@Component({
  selector: 'app-police-stations',
  templateUrl: './police-stations.component.html',
  styleUrl: './police-stations.component.css'
})
export class PoliceStationsComponent implements OnInit, OnDestroy{


  upgraded: UpgradeAccount = {
            firstname: '',
            middlename: '',
            lastname: '',
            sex: '',
            birthdate: '',
            civilStatus: '',
            bioStatus: true,
            email: '',
            password: '',
            telNum: '',
            contactNum: '',
            homeAddressId: 0,
            workAddressId: 0,
            role: 'StationAdmin',
            unit: '',
            badgeNum: '',
            debutDate: '',
            stationId: 0,
            rankId: '',
            createdBy: 'Regional Administrator',
            dateTimeCreated: '',
            personId: 0,
            profile_pic: null,
            profile_ext: '',
        
            homeAddress: {
              locationId: 0, province: '', municipality: '', street: '', region: '', barangay: '', block:'', zipCode: 0
            },
        
            workAddress: {
              locationId: 0, province: '', municipality: '', street: '', region: '', barangay: '', block:'', zipCode: 0
            }
        
          };
  
          userHomeAddress: LocationUpgrade = {
                  locationId: 0,
                  province: '',
                  municipality: '',
                  street: '',
                  region: '',
                  barangay: '',
                  block: '',
                  zipCode: 0,
                };
                userWorkAddress: LocationUpgrade = {
                  locationId: 0,
                  province: '',
                  municipality: '',
                  street: '',
                  region: '',
                  barangay: '',
                  block: '',
                  zipCode: 0,
                };
                home_zip_code: string = '';
                work_zip_code: string = '';

        stationAddress: LocationUpgrade = {
          locationId: 0,
          province: '',
          municipality: '',
          street: '',
          region: '',
          barangay: '',
          zipCode: 0,
          longtitude: '',
          latitude: ''
        }
        
        station: ICreateParam = {
          hq: '',
          locationId: 0,
          isApproved: true
        }

    isLoading = false;
    isSameAddress: boolean = false;
    isAddAdminOpen: boolean = false;
    successMessage: string | null = null;
    errorMessage: string | null = null;
    citizen: any = [];
    filteredCitizens: any = [];
    citizenID: string | null = null;
    // filtered: IStation[] = [];
    persons: IPerson[] = [];
    ranks: IRank[] = [];
    stationID: string | null = null;
    adminData: any;
    adminDetails: any;
    personId: any;
    policePersonData: any;
    reportSubscription: Subscription | undefined;
    searchQuery = '';
    filteredUsers: any[] = [];
    Users: any;
    totalUsers: number = 0;
    currentPage: number = 1;
    pageSize: number = 10;
    avatarUrl: string = 'assets/user-default.jpg';
    filter: string = 'Certified';
    certified: any = [];
    pending: any = [];
    uncertified = [];
    isUserDataOpen: boolean = false;
    userData: any = []
    userPic: string = 'assets/user-default.jpg';
    userProof: string = ''
    police: any = [];
    stations: any = [];
    filteredStations: any[] = [];
    showMapModal: boolean = false;
    private map!: mapboxgl.Map;    
    // registerMap: mapboxgl.Map;
    mapboxkey = 'pk.eyJ1IjoibWltc2gyMyIsImEiOiJjbHltZ2F3MTIxbWY2Mmtvc2YyZXd0ZWF1In0.YP4QQgS9F_Mqj3m7cB8gLw'
    selectedStation: any = null;
    showDetailsModal: boolean = false;
    stationAdmin: any = [];
    policeWithAdmins: any[] = [];
    selectedStationAdmins: any[] = [];
    isStationOpen: boolean = false; 
    isMapOpen = false;
    isModalOpen = false;
    addStationMap: mapboxgl.Map | null = null;
    markerForNewStation: mapboxgl.Marker | null = null;
    initialMapCenter: [number, number] = [123.900, 10.295]; 
    initialMapZoom: number = 10; 

  

  
    constructor(
      private fb: FormBuilder,
      // private managestationService: ManageStationService,
      private jurisdictionService: JurisdictionService,
      private policeAccountsService: PoliceAccountsService,
      private personService: PersonService,
      private manageUserService: ManageUsersService,
      private router: Router,
      private caseQueueService: CaseQueueService,
      private http: HttpClient,
      private authService: AuthService,
      private policeDashbordService: PoliceDashbordService,
      private caseService: CaseService,
      private accountService: AccountService,
      private dialogService: DialogService,
      private zone: NgZone
    ) {}
  
    ngOnInit(): void {
      
      
      this.loadUserProfile();
      // this.fetchAllPolice();
      this.fetchStation();
      this.fetchStationAdmin();
      this.fetchRanks();
      // (mapboxgl as any).accessToken = this.mapboxkey;
   
  
  
      const userData = localStorage.getItem('userData');
      this.adminDetails = JSON.parse(userData);
      this.fetchAdminData(this.adminDetails.acc_id)
      // console.log('Fetched Admin', this.adminDetails)
    }
  
   
  
   
  
    
    loadUserProfile() {
      const userData = localStorage.getItem('userData');
      const parsedData = JSON.parse(userData);
      console.log('USER DATA SESSION', userData);
      if (userData) {
        try {
          
          this.personId = parsedData.personId;
     
          console.log('Person ID', this.personId);
        } catch {
          console.error('Error fetching localStorage');
        }
  
        this.accountService.getProfPic(parsedData.acc_id).subscribe(
          (profilePicBlob: Blob) => {
            if (profilePicBlob) {
                // Create a URL for the Blob
                this.avatarUrl = URL.createObjectURL(profilePicBlob);
                console.log('PROFILE PIC URL', this.avatarUrl);
  
            } else {
                console.log('ERROR, DEFAULT PROF PIC STREAMED', this.avatarUrl);
                this.avatarUrl = 'assets/user-default.jpg';
            }
          }
        )
      }
    }


    // fetchAllPolice(){
  
    //   this.policeAccountsService.getAllPoliceArchives().subscribe(
    //     (res) => {
    //       // console.log('Fetched all retired police ', res);
    //       // this.police = res;
    //     },
    //     (err) => {
    //       console.error('Error fetching all retired police :', err);
    //     }
    //   )
    // }
  


  
    filterPolice(){
  
      const query = this.searchQuery.toLowerCase();
      this.filteredStations = this.stations.filter((station: any) => {
  
       
        const isStationIdMatched = station.station_id?.toString().includes(query);
        const isStationNameMatched = station.hq.toString().toLowerCase().includes(query)
        const isBarangayMatched = station.barangay.toString().toLowerCase().includes(query)
        const isMunicipalityMatched = station.municipality.toLowerCase().includes(query);
        const isProvinecMatched = station.province.toLowerCase().includes(query);

        
        return isStationIdMatched || isStationNameMatched || isBarangayMatched || isMunicipalityMatched || isProvinecMatched;
      })
    }


    // viewLocation(longtitude: number, latitude: number) {

    
    //   this.showMapModal = true;
    //   console.log('Longitude', longtitude);
    //   console.log('Latitude', latitude);
    //   setTimeout(() => {
    //     // (mapboxgl as any).accessToken = 'YOUR_MAPBOX_ACCESS_TOKEN';
    
    //     this.map = new mapboxgl.Map({
    //       container: 'map',
    //       style: 'mapbox://styles/mapbox/streets-v11',
    //       center: [123.900, 10.295], // temporary center
    //       zoom: 13,
    //       accessToken: this.mapboxkey,
    //     });

    
    
    //     this.map.on('load', () => {
    //       this.map!.flyTo({
    //         center: [longtitude, latitude],
    //         zoom: 19,
    //         speed: 1.5,
    //         curve: 1,
    //         pitch: 40,
    //         essential: true,
    //         easing: (t) => t,
    //       });
    
    //       new mapboxgl.Marker()
    //         .setLngLat([longtitude, latitude])
    //         .addTo(this.map!);
    //     });
    //   }, 200);
    // }

    viewLocation(longtitude: number, latitude: number) {
      console.log('Opening map at:', longtitude, latitude); // Add logging
      this.showMapModal = true;
      
      // Give the modal time to render in the DOM
      setTimeout(() => {
        const mapContainer = document.getElementById('map');
        
        if (!mapContainer) {
          console.error('Map container not found');
          return;
        }
        
        console.log('Creating map in container:', mapContainer);
        
        try {
          this.map = new mapboxgl.Map({
            container: 'map',
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [longtitude, latitude], // Set initial center to the target location
            zoom: 15,
            accessToken: this.mapboxkey,
          });
  
          this.map.on('load', () => {
            console.log('Map loaded');
            
            // Add marker at the location
            new mapboxgl.Marker()
              .setLngLat([longtitude, latitude])
              .addTo(this.map!);
              
            // Optional: animate to the location
            this.map!.flyTo({
              center: [longtitude, latitude],
              zoom: 19,
              speed: 1.5,
              curve: 1,
              pitch: 40,
              essential: true,
            });
          });
          
          this.map.on('error', (e) => {
            console.error('Mapbox error:', e);
          });
        } catch (error) {
          console.error('Error initializing map:', error);
        }
      }, 300); // Increased timeout for modal to fully render
    }
    

    closeMapModal() {
      this.showMapModal = false;
  
      if (this.map) {
        this.map.remove();
        this.map = null;
      }
    }

  





    // openDetailsModal(station: any): void {
    //   this.selectedStation = station;
    //   this.showDetailsModal = true;
    // }



openDetailsModal(station: any): void {
  this.selectedStation = station;
  
  
  this.selectedStationAdmins = []; 
  
 
  const policeInStation = this.police.filter(police => 
    police.station_id === station.station_id
  );
  
  
  for (const police of policeInStation) {
    const adminMatches = this.policeWithAdmins.filter(item => 
      item.police.person_id === police.person_id
    );
    
  
    adminMatches.forEach(match => {
  
      const alreadyAdded = this.selectedStationAdmins.some(admin => 
        admin.personId === match.admin.personId
      );
      
      if (!alreadyAdded) {
        this.selectedStationAdmins.push(match.admin);
      }
    });
  }
  
  this.showDetailsModal = true;
}

closeDetailsModal(): void {
  this.showDetailsModal = false;
  this.selectedStation = null;
  this.selectedStationAdmins = []; // Clear the selected admins array
}


    fetchStationAdmin() {
      this.accountService.getAccount().subscribe(
        (res) => {
          console.log('Fetched all accounts', res);
          this.stationAdmin = res.filter(account => account.role === 'StationAdmin');
          console.log('Filtered Station Admins', this.stationAdmin);
          

          this.fetchPolice();
        },
        (err) => {
          console.error('Error fetching all accounts', err)
        }
      );
    }
    
    fetchPolice() {
      this.policeAccountsService.getAllPoliceData().subscribe(
        (res: any[]) => {
          this.police = res;
          console.log('Fetched police data', this.police);
          
     
          this.policeWithAdmins = [];
          
          
          this.stationAdmin.forEach(admin => {
            const matchedPolice = this.police.find(police => admin.personId === police.person_id);
            if (matchedPolice) {
              this.policeWithAdmins.push({
                admin: admin,
                police: matchedPolice
              });
            }
          });
          
          console.log('Police with matched Station Admins', this.policeWithAdmins);
        },
        (err) => {
          console.error('Error fetching police data', err);
        }
      );
    }      


 
    fetchAdminData(accountID: number) {
      this.policeDashbordService.getAdmin(accountID).subscribe(
        (res) => {
          // Find the matching police data by policeId
          const adminData = res.find((p) => p.acc_id === accountID);
          this.adminData = adminData;
          localStorage.setItem('adminDetails', JSON.stringify(adminData));
          if (adminData) {
  
            // console.log('Found admin data:', adminData);
  
          } else {
            console.error('Police ID not found in all admin data');
          }
        },
        (error) => {
          console.error('Error Fetching All Admin Data:', error);
        }
      );
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
    
    fetchRanks(): void {
      this.policeAccountsService.getRanks().subscribe(
        (response: IRank[]) => {
          this.ranks = response;
          console.log('Fetched Ranks', this.ranks)
        },
        (error) => {
          console.error('Error fetching ranks:', error);
          this.errorMessage = 'Failed to load ranks. Please try again.';
        }
      );
    }
  
  
    fetchStation() {
        this.jurisdictionService.getAll().subscribe(
          (res) => {
            this.stations = res;
            console.log('Fetched all stations', this.stations);
          },
          (err) => {
            console.error(err)
          }
        
        )
    }




    onAddAdmin(stationID: any): void {
      this.isAddAdminOpen = true;

      this.upgraded = {
        email: '',
        password: '',
        firstname: '',
        middlename: '',
        lastname: '',
        birthdate: '',
        sex: '',
        civilStatus: '',
        telNum: '',
        contactNum: '',
        bioStatus: true,
        homeAddressId: this.userHomeAddress.locationId,
        workAddressId: this.userWorkAddress.locationId,
        homeAddress: this.userHomeAddress,
        workAddress: this.userWorkAddress,
        role: 'StationAdmin',
        stationId: stationID
        
      }

      this.userHomeAddress = {
        region: '',
        province: '',
        municipality: '',
        barangay: '',
        street: '',
        block: '',
        zipCode: 0
      }

      this.userWorkAddress = {
        region: '',
        province: '',
        municipality: '',
        barangay: '',
        street: '',
        block: '',
        zipCode: 0
      }
      this.isSameAddress = false;
    }




    
     onAddressCheckboxChange(event: any) {
            this.isSameAddress = event.target.checked;
        
            if (this.isSameAddress) {
              this.copyAddress(this.userHomeAddress, this.userWorkAddress);
              console.log('User work address:', this.userWorkAddress)
          } else  {
              this.resetAddress(this.userWorkAddress);
              console.log("Work Address Resetted",this.userWorkAddress)
          }
          
        }
        
        copyAddress(source: LocationUpgrade, target: LocationUpgrade) {
          target.region = source.region;
          target.province = source.province;
          target.municipality = source.municipality;
          target.barangay = source.barangay;
          target.street = source.street; 
          target.block = source.block;   
          target.zipCode = source.zipCode;  
        
          
    
        
          console.log(`Address copied:`);
          console.log(`Region: ${target.region}`);
          console.log(`Province: ${target.province}`);
          console.log(`Municipality: ${target.municipality}`);
          console.log(`Barangay: ${target.barangay}`);
        }
        
        resetAddress(address: LocationUpgrade) {
          address.region = '';
          address.province = '';
          address.municipality = '';
          address.barangay = '';
          address.street = '';
          address.block = '';
          address.zipCode = 0;
        }
    
        onPoliceRoleChange(event: any) {
          const selectedRole = event.target.value;
          console.log('Selected Role:', selectedRole);
          this.upgraded.policeRole = selectedRole;
      }


    

    onAddStation(){
      this.isStationOpen = true;
      this.resetStationForm();
    }



    toggleAddStationMap() {
      this.isMapOpen = !this.isMapOpen;
      
      if (this.isMapOpen) {
        setTimeout(() => {
          this.initializeAddStationMap();
        }, 300);
      } else {
        this.closeAddStationMap();
      }
    }
  
    // initializeAddStationMap() {
    //   const mapContainer = document.getElementById('map-station');
      
    //   if (!mapContainer) {
    //     console.error('Add station map container not found');
    //     return;
    //   }
      
    //   try {
    
        
    //     this.addStationMap = new mapboxgl.Map({
    //       container: 'map-station',
    //       style: 'mapbox://styles/mapbox/streets-v11',
    //       center: [123.900, 10.295],
    //       zoom: 10,
    //       accessToken: this.mapboxkey,
    //     });
  
    //     this.addStationMap.on('load', () => {
    //       console.log('Add station map loaded');
          
    //       // Add navigation controls
    //       this.addStationMap!.addControl(new mapboxgl.NavigationControl(), 'top-right');
          
    //       // If coordinates are already entered, show them on the map
    //       if (this.stationAddress.longtitude && this.stationAddress.latitude) {
    //         const lng = parseFloat(this.stationAddress.longtitude);
    //         const latitude = parseFloat(this.stationAddress.latitude);
            
    //         if (!isNaN(lng) && !isNaN(latitude)) {
    //           this.addMarkerToAddStationMap(lng, latitude);
    //           this.addStationMap!.flyTo({
    //             center: [lng, latitude],
    //             zoom: 19,
    //             speed: 1.5,
    //             curve: 1,
    //             pitch: 40,
    //             essential: true,
    //           });
    //         }
    //       }
    //     });
        
    //     // Add click event to the map
    //     this.addStationMap.on('click', (e) => {
    //       const lngLat = e.lngLat;
    //       this.addMarkerToAddStationMap(lngLat.lng, lngLat.latitude);
    //       this.performReverseGeocoding(lngLat.lng, lngLat.latitude);
    //     });
        
    //     this.addStationMap.on('error', (e) => {
    //       console.error('Add station map error:', e);
    //     });
    //   } catch (error) {
    //     console.error('Error initializing add station map:', error);
    //   }
    // }

    // Add this to your initializeAddStationMap function
initializeAddStationMap() {
  const mapContainer = document.getElementById('map-station');

  if (!mapContainer) {
    console.error('Add station map container not found');
    return;
  }
  
  try {
    this.addStationMap = new mapboxgl.Map({
      container: 'map-station',
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [123.900, 10.295],
      zoom: 10,
      accessToken: this.mapboxkey,
    });

    this.addStationMap.on('load', () => {
      console.log('Add station map loaded');
      
      // Add navigation controls
      this.addStationMap!.addControl(new mapboxgl.NavigationControl(), 'top-right');
      
      // If coordinates are already entered, show them on the map
      if (this.stationAddress.longtitude && this.stationAddress.latitude) {
        const lng = parseFloat(this.stationAddress.longtitude);
        const latitude = parseFloat(this.stationAddress.latitude);
        
        if (!isNaN(lng) && !isNaN(latitude)) {
          this.addMarkerToAddStationMap(lng, latitude);
          this.addStationMap!.flyTo({
            center: [lng, latitude],
            zoom: 19,
            speed: 1.5,
            curve: 1,
            pitch: 40,
            essential: true,
          });
        }
      }
    });
    
    // Add click event to the map
    this.addStationMap.on('click', (e) => {
      const lngLat = e.lngLat;
      
      // Add marker at clicked location
      this.addMarkerToAddStationMap(lngLat.lng, lngLat.lat);
      
      // Pan the map to the clicked coordinates with animation
      this.addStationMap!.flyTo({
        center: [lngLat.lng, lngLat.lat],
        zoom: 17,
        pitch: 40,
        bearing: 0,
        speed: 1.2,
        curve: 1.5,
        essential: true
      });
      
      // Perform reverse geocoding to update address fields
      this.reverseGeocode(lngLat.lat, lngLat.lng);
    });
    
    // Click event for specific map features/layers (if you have any)
    // Example: To detect clicks on specific map features like stations
    this.addStationMap.on('click', 'stations-layer', (e) => {
      if (e.features && e.features.length > 0) {
        const feature = e.features[0];
        
        if (feature.geometry.type === 'Point') {
          const coordinates = feature.geometry.coordinates as [number, number];
          const properties = feature.properties;
          
          console.log('Station properties:', properties);
          
          // Pan to the station
          this.addStationMap!.flyTo({
            center: coordinates,
            zoom: 17,
            pitch: 45,
            bearing: -20,
            speed: 1.2,
            curve: 1.5,
            essential: true
          });
          
          // Update coordinates in form fields
          this.stationAddress.longtitude = coordinates[0].toFixed(6);
          this.stationAddress.latitude = coordinates[1].toFixed(6);
          
          // Perform reverse geocoding
          this.reverseGeocode(coordinates[1], coordinates[0]);
        }
      }
    });
    
    this.addStationMap.on('error', (e) => {
      console.error('Add station map error:', e);
    });
  } catch (error) {
    console.error('Error initializing add station map:', error);
  }
}
    
    addMarkerToAddStationMap(lng: number, latitude: number) {
      // Update form fields
      this.stationAddress.longtitude = lng.toFixed(6);
      this.stationAddress.latitude = latitude.toFixed(6);
      
      // Remove existing marker if any
      if (this.markerForNewStation) {
        this.markerForNewStation.remove();
      }
      
      // Add new marker
      this.markerForNewStation = new mapboxgl.Marker({ draggable: true })
        .setLngLat([lng, latitude])
        .addTo(this.addStationMap!);
        
      // Allow marker to be dragged to refine location
      this.markerForNewStation.on('dragend', () => {
        const lngLat = this.markerForNewStation!.getLngLat();
        this.stationAddress.longtitude = lngLat.lng.toFixed(6);
        this.stationAddress.latitude = lngLat.lat.toFixed(6);
        this.reverseGeocode(lngLat.lat, lngLat.lng);
      });
    }
    
 
    reverseGeocode(latitude: number, lng: number) {
      const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${latitude}.json?access_token=${this.mapboxkey}&types=address,place,locality,region,postcode,district,address`;
  
      this.http.get(url).subscribe((res: any) => {
        const context = res.features.flatMap((f:any) => f.context || []);
        const getContext = (type: string) =>
          context.find((c:any) => c.id.includes(type))?.text || '';
  
        const barangay = getContext('locality') || '';
        const municipality = getContext('district') || '';
        const province = getContext('place') || '';
        const region = getContext('region') || '';
        const zipcode = getContext('postcode');
        const street = res.features[0]?.text || '';


        this.stationAddress.barangay = barangay;
        this.stationAddress.municipality = municipality;
        this.stationAddress.province = province;
        this.stationAddress.region = region;
        this.stationAddress.zipCode = zipcode;
        this.stationAddress.street = street;
  
        // const station_address = {
        //   street: street,
        //   latitudeitude: latitude,
        //   longtitudeitude: lng,
        //   barangay: barangay,
        //   municipality: municipality,
        //   province: province,
        //   region: region,
        //   zipCode: zipcode,
          
        // };

        // this.stationAddress = station_address;
      });

      console.log('Station Address', this.stationAddress)
    }

    resetMapView() {
      if (!this.addStationMap) {
        console.error('Map not initialized');
        return;
      }
      
      // Reset to initial center and zoom
      this.addStationMap.flyTo({
        center: this.initialMapCenter,
        zoom: this.initialMapZoom,
        pitch: 0,
        bearing: 0,
        speed: 1.2,
        essential: true
      });
      
      // Remove existing marker if any
      if (this.markerForNewStation) {
        this.markerForNewStation.remove();
        this.markerForNewStation = null;
      }
      
      // Reset coordinate fields
      this.stationAddress.longtitude = '';
      this.stationAddress.latitude = '';
      
      // Optionally reset address fields if needed
      this.stationAddress.street = '';
      this.stationAddress.barangay = '';
      this.stationAddress.municipality = '';
      this.stationAddress.province = '';
      this.stationAddress.region = '';
      this.stationAddress.zipCode = null;
    }
    
    // Function to center the map on the current marker or default center
    centerMapView() {
      if (!this.addStationMap) {
        console.error('Map not initialized');
        return;
      }
      
      // If we have a marker, center on it
      if (this.markerForNewStation) {
        const markerPosition = this.markerForNewStation.getLngLat();
        
        this.addStationMap.flyTo({
          center: this.initialMapCenter,
          zoom: this.initialMapZoom,
          pitch: 0,
          bearing: 0,
          speed: 1.2,
          essential: true
        });
        
        return;
      }
      
      this.addStationMap.flyTo({
        center: this.initialMapCenter,
        zoom: this.initialMapZoom,
        pitch: 0,
        speed: 1.2,
        essential: true
      });
    }
    
    closeAddStationMap() {
      if (this.addStationMap) {
        this.addStationMap.remove();
        this.addStationMap = null;
        this.markerForNewStation = null;
      }
    }
    
    resetStationForm() {
      this.station = { 
        hq: '',
        isApproved: true
      };
      this.stationAddress = {
        region: '',
        province: '',
        municipality: '',
        barangay: '',
        street: '',
        zipCode: 0,
        longtitude: '',
        latitude: ''
      };
      
      if (this.markerForNewStation) {
        this.markerForNewStation.remove();
        this.markerForNewStation = null;
      }
    }
    
    submitStation() {
  
      this.dialogService.openLoadingDialog()
      console.log('Submitting station with data:', {
        station: this.station,
        address: this.stationAddress
      
      });

      this.policeAccountsService.postLocation(this.stationAddress.zipCode, this.stationAddress)
        .toPromise()
        .then((response) => {
          if (response.locationFound) {
            
            this.station.locationId = response.id;
            console.log('Station address exists with ID:', response.id);
          } else {
            this.station.locationId = response.id;
            console.log('Station address created with ID:', response.id);
          }

          return this.jurisdictionService.addStation(this.station).toPromise();
        })
        .then((res) => {
            this.dialogService.closeAllDialogs();
            setTimeout(() => {
              this.dialogService.openUpdateStatusDialog('Success', 'Station successfully Added')
              window.location.reload();
            })
          console.log('Station added successfully:', res);
        })
        .catch((err) => {
          this.dialogService.closeAllDialogs();
          console.error('Error occurred:', err);
        });
      
      
      this.isStationOpen = false;
      this.isMapOpen = false;
      this.closeAddStationMap();
    }
    
    cancelStation() {
      this.isStationOpen = false;
      this.isMapOpen = false;
      this.closeAddStationMap();
    }


    deleteStation(stationId: any){

      this.jurisdictionService.delete(stationId).subscribe(
        (res)=>{
          this.dialogService.openConfirmationDialog(`Do you confirm to permanently delete Station "${stationId}"?`)
          .then((confirmed) => {
            this.jurisdictionService.delete(stationId)
            if(confirmed){
                  
                  setTimeout(() => {
                    this.dialogService.openLoadingDialog();
                    

                    setTimeout(() => {
                      this.dialogService.closeLoadingDialog();
                       this.dialogService.openUpdateStatusDialog('Success', `Station "${stationId}" successfully deleted`)
                      window.location.reload();
                    }, 100)
                    
                  }, 100)
                } else {
              this.dialogService.closeLoadingDialog();
              this.dialogService.openUpdateStatusDialog('Canceled', 'Deletion canceled')
            }
          })
        }
      
      )
    }

   
    async submitAdmin(){
    
      console.log('UPGRADED DATA TO BE SENT', this.upgraded)
    
      this.dialogService.openLoadingDialog()
      
    
      if (!this.upgraded.firstname ||
        !this.upgraded.middlename ||
        !this.upgraded.lastname || 
        !this.upgraded.birthdate ||
        !this.upgraded.sex ||
        !this.upgraded.civilStatus ||    
        !this.upgraded.email || 
        !this.upgraded.password || 
        // !this.confirmPassword || 
        !this.upgraded.contactNum ||
        !this.upgraded.telNum ||
        !this.upgraded.badgeNum ||
        !this.upgraded.debutDate ||
        !this.upgraded.policeRole ||
        !this.userHomeAddress.region ||
        !this.userHomeAddress.province ||
        !this.userHomeAddress.municipality ||
        !this.userHomeAddress.barangay ||
        !this.userHomeAddress.street ||
        !this.userHomeAddress.block ||
        !this.userHomeAddress.zipCode ||
        !this.userWorkAddress.region ||
        !this.userWorkAddress.province ||
        !this.userWorkAddress.municipality ||
        !this.userWorkAddress.street ||
        !this.userWorkAddress.block ||
        !this.userWorkAddress.zipCode ||
        !this.upgraded.unit ||
        !this.upgraded.rankId
      ) {
        this.dialogService.closeLoadingDialog();
        this.dialogService.openUpdateStatusDialog('Error', 'Missing required fields');
        return;
    }
    
    // if (!this.isValidEmail(this.upgraded.email)) {
    //     console.error('Invalid email address');
    //     return;
    // }
    
    // if (this.confirmPassword !== this.upgraded.password) {
    //     console.error('Passwords do not match');
    //     return;
    // }
    
    if (this.upgraded.password.length < 8) {
      
        console.error('Password must be at least 8 characters');
        return;
    }
    
    
    if (!this.upgraded.contactNum.startsWith('09')) {
        console.error('Contact number must start with 09');
        return;
    }
    
    // Prepare address data
    this.userHomeAddress.zipCode = Number(this.home_zip_code);
    this.userWorkAddress.zipCode = Number(this.work_zip_code);
    
    

    
    try {
        const homeAddressPromise = this.policeAccountsService.postLocation( this.userHomeAddress.zipCode, this.userHomeAddress,)
            .toPromise()
            .then((homeResponse) => {
                if (homeResponse.locationFound) {
                    this.upgraded.homeAddressId = homeResponse.id;
                    console.log('Home address exists with ID:', homeResponse.id);
                    
                } else {
                    this.upgraded.homeAddressId = homeResponse.id;
                    console.log('New home address created with ID:', homeResponse.id);
                }
            });
    
        const workAddressPromise = 
        this.policeAccountsService.postLocation( this.userHomeAddress.zipCode, this.userHomeAddress,)
                .toPromise()
                .then((workResponse) => {
                    if (workResponse.locationFound) {
                        this.upgraded.workAddressId = workResponse.id;
                        console.log('Work address exists with ID:', workResponse.id);
                        
                    } else {
                        this.upgraded.workAddressId = workResponse.id;
                        console.log('New work address created with ID:', workResponse.id);
                    }
                })
            // : Promise.resolve();
    
    
    
    
        await Promise.all([homeAddressPromise, workAddressPromise]);
    
        const formDataUpgraded = new FormData();
        formDataUpgraded.append('Firstname', this.upgraded.firstname);
        formDataUpgraded.append('Middlename', this.upgraded.middlename);
        formDataUpgraded.append('Lastname', this.upgraded.lastname);
        formDataUpgraded.append('Password', this.upgraded.password);
        formDataUpgraded.append('Sex', this.upgraded.sex);
        formDataUpgraded.append('Birthdate', this.upgraded.birthdate);
        formDataUpgraded.append('CivilStatus', this.upgraded.civilStatus || '');
        formDataUpgraded.append('BioStatus', this.upgraded.bioStatus.toString());
        formDataUpgraded.append('Email', this.upgraded.email);
        formDataUpgraded.append('TelNum', this.upgraded.telNum?.toString() || '');
        formDataUpgraded.append('ContactNum', this.upgraded.contactNum);
        formDataUpgraded.append('HomeAddressId', this.upgraded.homeAddressId ? this.upgraded.homeAddressId.toString() : '');
        formDataUpgraded.append('WorkAddressId', this.upgraded.workAddressId ? this.upgraded.workAddressId.toString() : '');
        formDataUpgraded.append('Role', this.upgraded.role); 
        formDataUpgraded.append('PoliceRole', this.upgraded.policeRole); 
        formDataUpgraded.append('Unit', this.upgraded.unit);
        formDataUpgraded.append('BadgeNumber', this.upgraded.badgeNum); 
        formDataUpgraded.append('DebutDate', this.upgraded.debutDate); 
        formDataUpgraded.append('StationId', this.upgraded.stationId.toString()); 
        formDataUpgraded.append('RankId', this.upgraded.rankId); 
        formDataUpgraded.append('CreatedBy', this.upgraded.createdBy); 
        formDataUpgraded.append('DateTimeCreated', this.upgraded.dateTimeCreated); 
        // if (this.upgraded.profile_pic) {
        //   formDataUpgraded.append('ProfilePic', profilePicFile);
        //   formDataUpgraded.append('ProfileExt', profilePicExt);
        // } else {
          
        //   console.log("No profile picture to upload.");
        // }
    
        console.log('Final Home Address ID:', this.upgraded.homeAddressId);
        console.log('Final Work Address ID:', this.upgraded.workAddressId);
    
        const response = await this.policeAccountsService.postAccountUpgrade(formDataUpgraded).subscribe(
          () => {
            this.dialogService.closeLoadingDialog();
            this.dialogService.openUpdateStatusDialog('Success', 'New Station Admin added successfully.');
            // alert('Registration successful');
            setTimeout(() => {
              this.dialogService.closeLoadingDialog();
              window.location.reload();
            }, 3000)
            
           
          });
    
    } catch (error: any) {
        if (error.status === 0) {
            alert('Network error: Unable to reach the server. Please check your connection.');
            console.log('Error Status:', error.status);
        } else {
          this.dialogService.closeLoadingDialog();
            this.dialogService.openUpdateStatusDialog('Error', 'Error Adding New Police Officer');
            // alert(`Error Code: ${error.status}\nMessage: ${error.message}`);
            console.log('Error Message:', error);
        }
      
    } finally {
      console.log('Hiding loading indicator');
        // this.loading = false; 
    }
    
    
    }

        
    cancelAddAdmin(): void {
      this.isAddAdminOpen = false;
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
        },
        (error) => {
          console.error('Error during sign out:', error);
        }
      );
    }
  
    ngOnDestroy(): void {

      this.closeMapModal();


      if (this.reportSubscription) {
        this.reportSubscription.unsubscribe();
      }
    }


}
