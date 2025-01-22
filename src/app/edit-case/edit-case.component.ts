import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CaseQueueService } from '../case-queue.service';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { IReport } from '../case.service';
import { IStation, JurisdictionService } from '../jurisdiction.service';
import {
  IPerson,
  IRank,
  PoliceAccountsService,
} from '../police-accounts.service';
import { PersonService } from '../person.service';
import { HttpClient } from '@angular/common/http';
import { AccountService } from '../account.service';
import { filter, forkJoin, Observable, tap } from 'rxjs';
import { AuthService } from '../auth.service';
import { SuspectFully, SuspectServiceService } from '../suspect-service.service';
import { VictimDataService } from '../victim-data.service';
import { CrimeService } from '../crime-service.service';
import { error } from 'console';
import { environment } from '../environment';
import { formatDate } from '@angular/common';


@Component({
  selector: 'app-edit-case',
  templateUrl: './edit-case.component.html',
  styleUrl: './edit-case.component.css',
})
export class EditCaseComponent implements OnInit, OnDestroy {
  endorseForm!: FormGroup; // Form group for report submission
  isLoading = false;
  successMessage: string | null = null;
  errorMessage: string | null = null;

  reports: any[] = [];
  stations: IStation[] = [];
  persons: any = [];
  ranks: IRank[] = [];
  locations: any = [];
  accounts: any = [];
  polices: any = [];
  citizens: any = [];
  evidences: any = [];
  suspects: any = [];
  victims: any = [];
  crimeReports: any = [];

  stationID: string | null = null;
  citizenId: number = 0;
  fetch_Report: any;
  incidentName: any;

  policeDetails: any = {};
  stationDetails: any = {};
  reportDetails: any = [];
  reportId: any;
  complainants: any = [];
  crimeId: any;

  selectedReport: any = [];
  isSignatureVisible: boolean = false;
  isEvidenceVisible: boolean = false;
  currentSignature: string | null = null;
  isModalOpen = false;
  selectedEvidence: any = null;
  avatarUrl: string = 'assets/user-default.jpg';
  isIDvisible: boolean = false;
  currentID: string | null = null;
  isCaught: any;
  dateCaught: any;
  addtlDetails: any;
  selectedFileName: string | null = null; 
  selectedFilePreview: string | null = null; 
  uploadedFiles: { [key: number]: any[] } = {}; 
  activeSuspectIndex = 0;
  isEditing = false;
  modus: any[] = [];
  selectedmodus: any = null;
  isDropdownOpen = false;

  personData: any;
  accountData: any;
  locationData: any;
  citizenData: any;
  suspectData: any;
  assignedTeam: any;
  crimeData: any;
  currentPage = 1;
  isActive = false;

  suspectModel: SuspectFully = {
    personId: 0,
    gang: '',
    reward: '',
    isCaught: false,
    dateCaught: '',
    firstName: '',
    middleName: '',
    lastName: '',
    gender: '',
    birthDate: '',
    civilStatus: '',
    motiveShort: '',
    motiveLong: '',
    deathDate: '',
    
  }





  private subscription: any;

  constructor(
    private fb: FormBuilder,
    private caseQueueService: CaseQueueService,
    private jurisdictionService: JurisdictionService,
    private policeAccountsService: PoliceAccountsService,
    private personService: PersonService,
    private router: Router,
    private http: HttpClient,
    private route: ActivatedRoute,
    private accountService: AccountService,
    private authService: AuthService,
    private suspectService: SuspectServiceService,
    private victimService: VictimDataService,
    private crimeService: CrimeService
  ) {}

  ngOnInit() {
    
    this.loadModus();

    this.subscription = this.router.events
    .pipe(filter((event) => event instanceof NavigationEnd))
    .subscribe(() => {
      const currentPath = this.router.url.split('?')[0];
      this.isActive = ['/edit-case', '/station-cases'].includes(currentPath);
      console.log('Updated Active State:', this.isActive);
    });

    const policeData = localStorage.getItem('policeDetails');
    const stationData = localStorage.getItem('stationDetails');
    const reportsData = localStorage.getItem('reports');
    const accountsData = localStorage.getItem('accounts');
    const citizensData = localStorage.getItem('citizens');

    // Parse and assign the data if it exists
    if (policeData) {
      this.policeDetails = JSON.parse(policeData);
    }

    if (stationData) {
      this.stationDetails = JSON.parse(stationData);
      // this.fetchPoliceByStation(this.stationDetails.station_id)
    }

    if (reportsData) {
      this.reports = JSON.parse(reportsData);
    }
    if (accountsData) {
      this.accounts = JSON.parse(accountsData);
    }
    if (citizensData) {
      this.citizens = JSON.parse(citizensData);
      console.log('Fetched Citizens', this.citizens);
    }

    // console.log('Retrieved Police Details:', this.policeDetails);
    // console.log('Retrieved Station Details:', this.stationDetails);
    // console.log('Retrieved Reports:', this.reports);

    this.route.queryParams.subscribe((params) => {
      const crimeId = params['crimeID'];
      console.log('Crime ID:', crimeId);
      this.crimeId = crimeId;
      this.fetchACrime(crimeId);
      this.fetchCrimeReports(crimeId);

      const page = params['page'];
      if (page) {
        this.currentPage = +page;
      } else {
        const savedPage = localStorage.getItem('currentPage');
        this.currentPage = savedPage ? +savedPage : 1;
      }
     
    });

  }

  ngOnDestroy(): void {
  
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

 
  fetchLocations(): Observable<any> {
    return this.personService.getLocations().pipe(
      tap((response) => {
        this.locations = response;
        
        localStorage.setItem('locations', JSON.stringify(response));
      })
    );
  }





  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }
  
  selectOption(method: any) {
    this.selectedmodus = method;
    this.isDropdownOpen = false;
  }


  getGenderName(gender: string): string {
    switch (gender) {
      case 'M':
        return 'Male';
      case 'F':
        return 'Female';
      case 'X':
        return 'Prefer not to say';
      case '':
      case 'NULL':
        return '';
      default:
        return 'No gender found';
    }
  }

 


  

  isReportsActive(): boolean {

    console.log('Current Path:', this.router.url);
    const currentPath = this.router.url.split('?')[0];
    const activeRoutes = ['/edit-case', '/station-cases'];
    return activeRoutes.includes(currentPath);
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


  fetchACrime(crimeId: number) {
    this.crimeService.getSpecificCase(crimeId).subscribe(
      (res) => {
        this.crimeData = res;
        console.log('Crime Data', this.crimeData);
        this.fetchIncident(this.crimeData.incident_type_id);
        this.fetchALocation(this.crimeData.location_id);
        this.fetchFurtherCase(this.crimeData.crime_id);
      },
      (err) => {
        console.error('Error fetching crime', err);
      }
    );
  }

  fetchIncident(incidentId: number) {
    this.crimeService.getIncidentTypes().subscribe(
      (res) => {
        // console.log('All incident', res)
        const incident = res.find((i: any) => i.incident_id === incidentId);
        this.incidentName = incident;
        // console.log("Incident Name", this.incidentName)
      },
      (err) => {
        console.error('Error fetching Incident', err);
      }
    );
  }

  fetchALocation(locationId: number) {
    this.personService.getALocation(locationId).subscribe(
      (res) => {
        this.locationData = res;
        //  console.log('Location Data', this.locationData);
      },
      (err) => {
        console.error('Error fetching location', err);
      }
    );
  }

  fetchFurtherCase(crimeId: number) {
    this.crimeService.getFurtherCase(crimeId).subscribe(
      (res) => {
        this.addtlDetails = res;

        console.log('Additional Details', this.addtlDetails);

        if (
          this.addtlDetails?.list_of_officers &&
          Array.isArray(this.addtlDetails.list_of_officers)
        ) {
          this.polices = this.addtlDetails.list_of_officers;
          console.log('Officers assigned to polices:', this.polices);
        } else {
          console.error(
            'No officers found or list_of_officers is not an array.'
          );
          this.polices = [];
        }

        if (
          this.addtlDetails?.list_of_suspects &&
          Array.isArray(this.addtlDetails.list_of_suspects)
        ) {
          this.suspects = this.addtlDetails.list_of_suspects;
          console.log('List of Suspects:', this.suspects);
        } else {
          console.error(
            'No suspects found or list_of_suspects is not an array.'
          );
          this.suspects = [];
        }
      },
      (err) => {
        console.error('Error fetching addtl details', err);
      }
    );
  }

  plotLongAndLat(locationId: number) {
    console.log('Navigating Plot with location ID', locationId);
    console.log('Navigating Plot with location Data', this.locationData);

    const serializedData = JSON.stringify(this.locationData);

    this.router.navigate(['/plot-longitude-and-latitude'], {
      queryParams: {
        locationID: locationId,
        data: serializedData,
      },
    });
  }

  markSolved(crimeId: number) {
    this.crimeService.markSolved(crimeId).subscribe(
      (res) => {
        console.log('Case Solved', res);
        alert('Case solved!');
        this.router.navigate(['/station-dashboard']);
      },
      (err) => {
        console.error('Error solving case', err);
      }
    );
  }

  onSendBlotter(reportId: number, crimeId: number): void {

    console.log('Report Id', reportId);
    console.log('Crime Id', crimeId)
    this.caseQueueService.sendBlotter(reportId, crimeId).subscribe(
      (res) => {
        console.log('Ticket Blotter successfully sent');
      },
      (err) => {
        console.error('Failed to send ticket blotter', err);
      }
    );
  }

  fetchCrimeReports(crimeId: number) {
    this.caseQueueService.getCrimeReports(crimeId).subscribe({
      next: (res) => {
        console.log('Reports fetched from crime:', res);
        this.crimeReports = res;
        
        
        this.complainants = [];
  
        
        this.crimeReports.forEach(report => {
          const complainant = this.citizens?.find(citizen => 
            citizen.citizen_id === report.citizen_id
          );
          
          if (complainant) {
            this.complainants.push({
              report: report,
              complainant: complainant
            });

          }
        });
  
        console.log('Reports with complainants:', this.complainants);
      },
      error: (err) => {
        console.error('Error fetching reports:', err);
      }
    });
  }


  
  getGender(gender: string | undefined){
    switch(gender){
      case 'M':
        return 'Male';
      case 'F':
        return 'Female';
      default:
        return 'Prefer not to say'; 
      
    }
  }

  loadModus() {
    this.crimeService.getModus().subscribe(data => {
      this.modus = data;
    });
  }


  onModusChange(event: any){
    const selectedMethod = event.target.value;

    const motive = JSON.stringify(this.selectedmodus) 
    console.log("Motive long: ", this.selectedmodus.method_name);
    console.log("Motive short: ", this.selectedmodus.method_abbr);

  }


 

 

  openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }


  setActiveSuspect(index: number) {
    this.activeSuspectIndex = index;
  }

  onBirthDateChange(selectedDate: any) {
    
    this.suspects.birth_date = formatDate(selectedDate, 'yyyy-MM-dd', 'en-US');
    console.log('Birthdate', this.suspects.birth_date)
  }


  editSuspect(index: number){
    this.isEditing = true;
    const suspect = this.suspects[index];
  suspect.isModified = true;

  this.selectedmodus = this.selectedmodus || { method_name: suspect.motive_long, method_abbr: suspect.motive_short };
    this.isCaught = this.isCaught || suspect.is_caught;
    this.dateCaught = this.dateCaught || suspect.datetime_of_caught;

    const inputs = document.querySelectorAll('input');
    inputs.forEach((input) => {
      (input as HTMLInputElement).disabled = false;
    });
  }


  createEmptySuspect() {
    return {
      person_id: null, 
      first_name: '',
      middle_name: '',
      last_name: '',
      sex: '',
      birth_date: '',
      civil_status: '',
      bio_status: true,
      mugshots: [],
      isNew: true, 
      isModified: false,
      datetime_of_caught: '',
      is_caught: false
    };
  }

  addSuspect() {

    this.selectedmodus = null;
    this.suspectModel.gang = null;
    this.suspectModel.reward = null;
    this.isCaught = false;
    this.dateCaught = null;
    
    const newSuspect = {
      ...this.createEmptySuspect(),
      isNew: true,
      isModified: false
  };
  
    this.suspects.push(newSuspect);
    this.activeSuspectIndex = this.suspects.length - 1;
    this.isEditing = true;
  }

  addNewSus(suspect: any){

    const suspectData = new FormData();
  
    // Append text fields
    suspectData.append('FirstName', suspect.first_name || '');
    suspectData.append('MiddleName', suspect.middle_name || '');
    suspectData.append('LastName', suspect.last_name || '');
    suspectData.append('Sex', suspect.sex || '');
    suspectData.append('BirthDate', suspect.birth_date || '');
    suspectData.append('CivilStatus', suspect.civil_status || '');
    suspectData.append('BioStatus', suspect.bio_status.toString());
    suspectData.append('DatetimeOfCaught', this.dateCaught || '');
    suspectData.append('IsCaught', this.isCaught || '');
    suspectData.append('GangAffiliation', this.suspectModel.gang || '');
    suspectData.append('Reward', this.suspectModel.reward || '');
    suspectData.append('CrimeId', this.crimeId || '');
    


    this.http.post(`${environment.ipAddUrl}api/suspect/identify/suspect/fully`, suspectData).subscribe({
      next: (response) => {
        console.log('New suspect added:', response);
        alert('New suspect added successfully!');
        suspect.isNew = false;
      },
      error: (error) => {
        console.error('Error adding suspect:', error);
        alert('Failed to add new suspect.');
      }
    });
  }

  updateExistingSus(suspect: any){

    suspect.isModified = true;
    suspect.isNew = false;

    if (!this.selectedmodus) {
      alert('Motive must be selected!');
      return; 
  }

  // suspect.isModified = true;
  // suspect.isNew = false;

  let suspectData = {
      suspect_id: suspect.suspect_id,
      person_id: suspect.person_id,
      gangaffliation: this.suspectModel.gang, 
      reward: this.suspectModel.reward,
      isCaught: this.isCaught,
      datetimeOfCaught: this.dateCaught,
      motive_long: this.selectedmodus?.method_name,
      motive_short: this.selectedmodus?.method_abbr,
  };
    console.log('Suspect Data to be editted', suspectData)

    this.http.put(`${environment.ipAddUrl}api/suspect/edit/${suspect.suspect_id}`, suspectData).subscribe({
      next: (response) => {
        console.log('Existing suspect updated:', response);
        alert('Suspect updated successfully!');
            suspect.isModified = false;
            suspect.isNew = false;
            this.isEditing = false;
      },
      error: (error) => {
        console.error('Error updating suspect:', error);
        alert('Failed to update suspect.');
        suspect.isModified = true;
      }
    });
  }

  saveSuspect() {

    this.suspects.forEach((suspect) => {
      if (suspect.isNew) {
        console.log('Adding new suspect:', suspect);
        this.addNewSus(suspect);
      } else if (suspect.isModified) {
        console.log('Updating existing suspect:', suspect);

        const updateData: any = {
          suspect_id: suspect.suspect_id,
          gangaffliation: this.suspectModel.gang,
          reward: this.suspectModel.reward,
          datetime_of_caught: this.dateCaught,
          is_caught: this.isCaught,
          motive_long: this.selectedmodus?.method_name,
          motive_short: this.selectedmodus?.method_abbr,
        };

        this.updateExistingSus(updateData);
      }
      
      suspect.isNew = false;
      suspect.isModified = false;
    });
    
  }


  onFilesSelected(event: any, index: number) {
    const files = Array.from(event.target.files);
    const previews = files.map((file: any) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      return new Promise((resolve) => {
        reader.onload = () => resolve({ preview: reader.result, file });
      });
    });
    Promise.all(previews).then((result) => {
      this.uploadedFiles[index] = result;
    });
  }
}
