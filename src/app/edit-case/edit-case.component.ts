import { Component, OnInit, OnDestroy, HostBinding } from '@angular/core';
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
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AccountService } from '../account.service';
import { filter, forkJoin, Observable, tap } from 'rxjs';
import { AuthService } from '../auth.service';
import { SuspectFully, SuspectServiceService } from '../suspect-service.service';
import { VictimDataService } from '../victim-data.service';
import { CrimeService } from '../crime-service.service';
import { error } from 'console';
import { environment } from '../environment';
import { formatDate } from '@angular/common';
import { expandCollapse } from '../animations/expand';


@Component({
  selector: 'app-edit-case',
  templateUrl: './edit-case.component.html',
  styleUrl: './edit-case.component.css',
  animations: [expandCollapse],
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
  isReportOpen: boolean = false;

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

  mugshots: any = [];
  mugshotId: any;
  isCrimeSolved: boolean = false;
  loading: boolean = false;
  activeTab: string = 'victim';
  victimDesc: any = [];
  victimDescriptions: any = [];
  previousPage: number = 1;


  private token = localStorage.getItem('token');
  private auth_headers = new HttpHeaders ({
    'Authorization': this.token
  })




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

    // this.subscription = this.router.events
    // .pipe(filter((event) => event instanceof NavigationEnd))
    // .subscribe(() => {
    //   const currentPath = this.router.url.split('?')[0];
    //   this.isActive = ['/edit-case', '/station-cases'].includes(currentPath);
    //   console.log('Updated Active State:', this.isActive);
    // });

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

      this.previousPage = params['fromPage'] ? +params['fromPage'] : 1;
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

  navigateToCases() {
    this.router.navigate(['/station-cases']).then(() => {
      window.scrollTo(0, 0); // Scroll to the top of the page
    });
  }

  
  
  // Method for back button
  goBack() {
    this.navigateToCases();
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

 


  

  // isReportsActive(): boolean {

  //   console.log('Current Path:', this.router.url);
  //   const currentPath = this.router.url.split('?')[0];
  //   const activeRoutes = ['/edit-case', '/station-cases'];
  //   return activeRoutes.includes(currentPath);
  // }
  

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
          this.suspects.forEach((suspect: any) => { 
            if (suspect.motive_long) {
              this.selectedmodus = this.modus.find(
                (modus) => modus.method_name === suspect.motive_long
              ); 
            }
          });

          this.suspects.forEach((sus) => {
            this.retrieveMugshots(sus.person_id, sus);
            // console.log('Person id retrieved from suspects', sus.person_id)
          })
          
        } else {
          console.error(
            'No suspects found or list_of_suspects is not an array.'
          );
          this.suspects = [];
        }


        if (
          this.addtlDetails?.list_of_victims &&
          Array.isArray(this.addtlDetails.list_of_victims)
        ) {
          this.victims = this.addtlDetails.list_of_victims;
          console.log('List of victims:', this.victims);
          
          
          
        } else {
          console.error(
            'No victims  found or list_of_victims is not an array.'
          );
          this.victims = [];
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

    this.loading = true;
    this.caseQueueService.sendBlotter(reportId, crimeId).subscribe(
      (res) => {
        console.log('Ticket Blotter successfully sent');
        alert('Ticket Blotter successfully sent');
        this.loading = false;
        this.router.navigate[('/edit-case')]
      },
      (err) => {
        this.loading = false;
        console.error('Failed to send ticket blotter', err);
        if(err.status === 400){
          alert('You have not caught the suspect yet')
          
        }
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


  showAlert() {
    alert('Case is solved and you can no longer modify suspects.');
  }
  

 

  openModal() {
    this.isModalOpen = true;
    
  }



  closeModal() {
    this.isModalOpen = false;
  }

  openReport(reportId: number) {

    console.log(`Opening Report ${reportId}`);
    this.isReportOpen = true;
    if (!reportId) {
      console.error("Error: reportId is undefined");
      return;
    }
    this.loadSpecificReport(reportId);
    this.fetchEvidences(reportId)
  }
  

  closeReport(){
    this.isReportOpen = false;
  }

  loadSpecificReport(reportId: number) {

    const report = this.complainants.find((report) => report.report.report_id === reportId);
    this.selectedReport = report;
    console.log('Selected Report', this.selectedReport)
    
    
  }


  setActiveSuspect(index: number) {
    this.activeSuspectIndex = index;
  }

  onBirthDateChange(selectedDate: any) {
    
    this.suspects.birth_date = formatDate(selectedDate, 'yyyy-MM-dd', 'en-US');
    console.log('Birthdate', this.suspects.birth_date)
  }


  editSuspect(index: number, status: any){

    // console.log('STATUS editSUSPECT', status)
    if(status.trim() !== 'Solved') {
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

    } else if(status.trim() === 'Solved') {
      alert('Case is solved and you can no longer modify suspects.')
    }
    
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

  addSuspect(status: any) {

    this.selectedmodus = null;
    this.suspectModel.gang = null;
    this.suspectModel.reward = null;
    this.isCaught = false;
    this.dateCaught = null;

    console.log('Status', status)
    

    if(status.trim() !== 'Solved'){
      const newSuspect = {
        ...this.createEmptySuspect(),
        isNew: true,
        isModified: false
    };
    
      this.suspects.push(newSuspect);
      this.activeSuspectIndex = this.suspects.length - 1;
      this.isEditing = true;
    } else if (status.trim() === 'Solved') {
      alert('Case is solved and you can no longer modify suspects.');
    }

    
    
  }

  addNewSus(suspect: any){

    const suspectData = new FormData();
    suspect.motive_long = this.selectedmodus?.method_name; 
    suspect.motive_short = this.selectedmodus?.method_abbr;
  
  

    suspectData.append('FirstName', suspect.first_name || '');
    suspectData.append('MiddleName', suspect.middle_name || '');
    suspectData.append('LastName', suspect.last_name || '');
    suspectData.append('Sex', suspect.sex || '');
    suspectData.append('BirthDate', suspect.birth_date || '');
    suspectData.append('CivilStatus', suspect.civil_status || '');
    suspectData.append('BioStatus', suspect.bio_status.toString());
    suspectData.append('DatetimeOfCaught', this.dateCaught || '');
    suspectData.append('IsCaught', suspect.is_caught  || '');
    suspectData.append('GangAffiliation', suspect.gang || '');
    suspectData.append('Reward', suspect.reward || '');
    suspectData.append('Date Arrested', suspect.datetime_of_caught || '');
    suspectData.append('MotiveLong', this.selectedmodus?.method_name || '');
    suspectData.append('MotiveShort', this.selectedmodus?.method_abbr || '');
    suspectData.append('CrimeId', this.crimeId || '');

    if(suspect.deathDate){
      suspectData.append('DeathDate', suspect.deathDate || '');
    }
    
    if (suspect.mugshots) {
      const positions = ['full_front', 'front_part', 'left', 'right'];
      positions.forEach((position, index) => {
        if (suspect.mugshots[position]?.file) {
          suspectData.append(`Images`, suspect.mugshots[position].file, `${position}.jpg`);
        }
      });
    }

    this.loading = true;

    this.http.post(`${environment.ipAddUrl}api/suspect/identify/suspect/fully`, suspectData).subscribe({
      next: (response) => {
        console.log('New suspect added:', response);
        alert('New suspect added successfully!');
        suspect.isNew = false;
        window.location.reload();
        this.loading = false;
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


    // suspect.isModified = true;
    // suspect.isNew = false;
  
    // let suspectData = {
    //     suspectId: suspect.suspect_id,
    //     personId: suspect.person_id,
    //     crimeId: suspect.crime_id,
    //     gangaffliation: suspect.gang, 
    //     reward: suspect.reward,
    //     isCaught: suspect.isCaught,
    //     dateTimeOfCaught: this.dateCaught,
    //     motiveLong: this.selectedmodus?.method_name,
    //     motiveShort: this.selectedmodus?.method_abbr,
    //     firstName: suspect.first_name,
    //     middleName: suspect.middle_name,
    //     lastName: suspect.last_name,
    //     sex: suspect.sex,
    //     birthData: suspect.birth_date,
    //     bioStatus: suspect.bio_status,
    //     civilStatus: suspect.civil_status,
    //     deathDate: suspect.deathDate

    // };
    const suspectData = new FormData();
    suspect.motive_long = this.selectedmodus?.method_name; 
    suspect.motive_short = this.selectedmodus?.method_abbr;
  
  

    suspectData.append('FirstName', suspect.first_name || '');
    suspectData.append('MiddleName', suspect.middle_name || '');
    suspectData.append('LastName', suspect.last_name || '');
    suspectData.append('Sex', suspect.sex || '');
    suspectData.append('BirthDate', suspect.birth_date || '');
    suspectData.append('CivilStatus', suspect.civil_status || '');
    suspectData.append('BioStatus', suspect.bio_status || '');
    suspectData.append('DatetimeOfCaught', this.dateCaught || '');
    suspectData.append('IsCaught', suspect.is_caught  || '');
    suspectData.append('GangAffiliation', suspect.gang || '');
    suspectData.append('Reward', suspect.reward || '');
    suspectData.append('Date Arrested', suspect.datetime_of_caught || '');
    suspectData.append('MotiveLong', this.selectedmodus?.method_name || '');
    suspectData.append('MotiveShort', this.selectedmodus?.method_abbr || '');
    suspectData.append('CrimeId', this.crimeData.crime_id || '');
    suspectData.append('SuspectId', suspect.suspect_id || '');
    suspectData.append('Sex', suspect.sex || '');


    if(suspect.deathDate){
      suspectData.append('DeathDate', suspect.deathDate || '');
    }
    
    if (suspect.mugshots) {
      const positions = ['full_front', 'front_part', 'left', 'right'];
      positions.forEach((position, index) => {
        if (suspect.mugshots[position]?.file) {
          suspectData.append(`Images`, suspect.mugshots[position].file, `${position}.jpg`);
        }
      });
    }

    this.loading = true;

      console.log('Suspect Data to be editted', suspectData)
  
      this.http.post(`${environment.ipAddUrl}api/suspect/identify/existingSuspect`, suspectData).subscribe({
        next: (response) => {
          console.log('Existing suspect updated:', response);
          alert('Suspect updated successfully!');
              suspect.isModified = false;
              suspect.isNew = false;
              this.isEditing = false;
              window.location.reload();
              this.loading = false;
        },
        error: (error) => {
          console.error('Error updating suspect:', error);
          alert('Failed to update suspect.');
          suspect.isModified = true;
          this.loading = false;
        }
      });

    

    
  }

  updateMugshots(suspect:any){

    
    const suspectData = new FormData();
    suspect.motive_long = this.selectedmodus?.method_name; 
    suspect.motive_short = this.selectedmodus?.method_abbr;
    


    suspectData.append('PersonId', suspect.personId || '');
    suspectData.append('MugshotId', suspect.mugshotId || '');

      const positions = ['front_part', 'front', 'left', 'right'];
      positions.forEach((position, index) => {
        if (suspect.mugshots[position]?.file) {
          
          suspectData.append(`Proof`, suspect.mugshots[position].file, `${position}.jpg`);
        }
      });
    

    this.http.put(`${environment.ipAddUrl}api/citizen/identity/prove`, suspectData).subscribe({
      next: (response) => {
        console.log('Suspect Data updated:', response);
   
      },
      error: (error) => {
        console.error('Error updating suspect:', error);
        alert('Failed to add new suspect.');
      }
    });

  }

  saveSuspect(status: any) {

    console.log('STATUS: ',status)

    this.suspects.forEach((suspect) => {
      if (status.trim() !== 'Solved') {
      
        this.loading = true;
        
      if (suspect.isNew) {
        console.log('Adding new suspect:', suspect);
        this.addNewSus(suspect);
      } else if (suspect.isModified) {
        console.log('Updating existing suspect:', suspect);

        const updateData: any = {
          suspect_id: suspect.suspect_id,
          gangaffliation: suspect.affliated_gang,
          reward: suspect.reward,
          datetimeOfCaught: this.dateCaught,
          isCaught: suspect.is_caught,
          motiveLong: this.selectedmodus?.method_name,
          motiveShort: this.selectedmodus?.method_abbr,
          personId: suspect.person_id,
          crimeId: suspect.crime_id
        };

        this.updateExistingSus(suspect);
        this.updateMugshots(updateData)
      }
      
      suspect.isNew = false;
      suspect.isModified = false;
      } else if(status.trim() === 'Solved'){
        alert('Case is solved and you can no longer modify suspects.');
      }
    
      
    });
    
  }

  deleteSuspect(suspectId: number) {
    const suspectToDelete = this.suspects.find((suspect) => suspect.suspect_id === suspectId);
  
    if (suspectToDelete) {
      
      const isConfirmed = window.confirm(`Are you sure you want to permanently delete the suspect "${suspectToDelete.first_name} ${suspectToDelete.last_name}"?`);
  
      if (isConfirmed) {
        console.log('Deleting suspect:', suspectToDelete);
  
    
        this.suspects = this.suspects.filter((suspect) => suspect.suspect_id !== suspectId);
  
       
        this.deleteSuspectService(suspectId);
      } else {
        console.log('Deletion canceled by the user');
      }
    } else {
      console.error('Suspect not found');
    }
  }


  deleteSuspectService(id: number) {
    this.http.delete(`${environment.ipAddUrl}api/suspect/discard/${id}`).subscribe({
      next: (response) => {
        console.log('Suspect Deleted', response);
        alert(`Suspect ${id} susccessfully deleted`);
        
      },
      error: (error) => {
        console.error('Error deleting suspect:', error);
        alert('Failed to delete suspect.');
      }
    });
  }

  // onFilesSelected(event: any, suspect: any, position: 'front' | 'left' | 'right') {
  //   const file = event.target.files[0]; 
  
  //   if (!file) return;
  
  //   const reader = new FileReader();
  //   reader.readAsDataURL(file);
  //   reader.onload = () => {
  //     suspect.mugshots = suspect.mugshots || {}; // Ensure mugshots object exists
  //     suspect.mugshots[position] = { file, preview: reader.result };
      
  //   };
 
  // }
  

  onFilesSelected(event: any, suspect: any, position: 'full_front' | 'front_part' | 'left' | 'right') {
    const file = event.target.files[0];
  
    if (!file) return;
  
    suspect.mugshots = suspect.mugshots || {}; 
    const readerArrayBuffer = new FileReader();
    const readerDataURL = new FileReader();
  
 
    readerDataURL.onload = () => {
      suspect.mugshots[position] = {
        ...suspect.mugshots[position], 
        preview: readerDataURL.result, 
      };
    };
  
 
    readerArrayBuffer.onload = () => {
      const byteArray = new Uint8Array(readerArrayBuffer.result as ArrayBuffer);
      const mimeType = file.type;
      
     
      const blob = new Blob([byteArray], { type: mimeType });
      const extensionWithoutDot = mimeType.split('/')[1];
      const extensionWithDot = '.' + extensionWithoutDot;
  
      suspect.mugshots[position] = {
        ...suspect.mugshots[position], 
        file: blob,
        contentType: mimeType,
        filename: file.name,
        extension: extensionWithDot, 
      };
    };

    console.log('Mgushot details', suspect.mugshots)
  
    readerDataURL.readAsDataURL(file);
    readerArrayBuffer.readAsArrayBuffer(file); 
   
  }
  
  
  retrieveMugshots(personId: number, suspect: any) {
    const url = `${environment.ipAddUrl}api/citizen/retrieve/mugshot/fromperson/${personId}`;
  
    this.http.get(url, { headers: this.auth_headers }).subscribe({
      next: (res) => {
        console.log('Mugshots retrieved:', res);
        suspect.mugshots = res; // Assign mugshots specifically to the suspect
        // console.log(`Mugshots for suspect ${personId}:`, suspect.mugshots);
      },
      error: (err) => {
        console.error('Error retrieving mugshots:', err);
      }
    });
  }
  

getMugshotImage(mugshots: any[], fileName: string): string | null {
  if (!Array.isArray(mugshots)) return null; 

  const foundMugshot = mugshots.find(m => m.file_download_name === fileName);
  if (!foundMugshot || !foundMugshot.file_contents) return null;

  return `data:${foundMugshot.content_type};base64,${foundMugshot.file_contents}`;
}



  viewID(idData: string) {
    if (idData) {
      this.currentID = idData; 
      this.isIDvisible = true; 
    } else {
      console.error('No id data available.');
    }
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  getCivilStatus(personId: number): string {
 
   
    const person = this.persons.find((p) => p.person_id === personId);
    return person ? person.civil_status : 'Unknown';
  }

  isCitizenDeceased(deceased: boolean): string {
    return deceased ? 'No' : 'Yes';
  }


  // fetchReportedVictim(reportID: number) {

  //   console.log('Report id from victims', reportID)
  //   this.victimService.retrieveReportedVictim(reportID).subscribe(
  //     (response) => {
  //       if (Array.isArray(response) && response.length > 0) {
  //         this.victims = response; 
  //         let victimData = response
  //         console.log('Fetched Reported victim', this.victims);
  //         this.victims.forEach((victim) => {
  //           this.fetchVictimDescription(victim.person_id);  
  //         });
  //         // this.fetchVictimDescription(this.victims.person_id);

  //       } else {
  //         console.error('No victim data found');
  //       }
  //       // this.victims = response; // Extract the first element of the array
  //       //   console.log('Fetched Reported victim', this.victims);
  //     },
  //     (error) => {
  //       console.error('Error fetching reported victim:', error);
  //       this.errorMessage = 'Failed to load victim. Please try again.';
  //     }
  //   );
  // }

  fetchVictimDescription(personId: number){
    
    this.victimService.getDescription(personId).subscribe({
      next: (response) => {
        console.log('Fetched Description:', response);
        console.log('Person ID in description', personId)
        this.victimDescriptions = response
        const vicDesc = this.victimDescriptions.find((p: any) => p.person_id === personId);
          if (vicDesc) {
            this.victimDesc = vicDesc;
          }
          console.log(`victim ${personId} Description:`, this.victimDesc);
      },
      error: (error) => {
        console.error('Error fetching description:', error);
        this.errorMessage = 'Failed to load description. Please try again.';
      }
    });
  }

  fetchEvidences(reportId: number): void {
    this.personService.getEvidences(reportId).subscribe(
      (response) => {
        this.evidences = response;
        console.log('Fetched Evidences', this.evidences)
       
      },
      (error) => {
        console.error('Error fetching evidences:', error);
        this.errorMessage = 'Failed to load evidences. Please try again.';
      }
    );
  }

  closeID() {
    this.isIDvisible = false; 
    this.currentID = null;
  }

  closeSignature() {
    this.isSignatureVisible = false; 
    this.currentSignature = null;
  }



  cleanBase64(base64String: string): string {
    return base64String.replace(/(\r\n|\n|\r| )/gm, '');  // Remove unwanted characters
  }

  decodeBase64(base64String: string): string {
    try {
      const decodedString = atob(base64String);  // atob decodes a base64-encoded string
      return decodedString;
    } catch (e) {
      console.error('Error decoding base64 string', e);
      return '';  // Return an empty string if there's an error
    }
  }

  openModalEvidence(evidence: any) {
    this.selectedEvidence = evidence;
    this.isModalOpen = true;
  }

  getComplainantInfo(citizenId: number) {
  
    // console.log("Citizen id", citizenId);
  

    const citizen = this.citizens.find((citizen: any) => citizen.citizen_id === citizenId);
    if (!citizen) {
      console.error("Citizen with ID", citizenId, "not found.");
     
    }
    
    this.citizenData = citizen;
    return `${this.citizenData.firstname}, ${this.citizenData.lastname}`;
  }

 
    

  @HostBinding('@expandCollapse') pageTransitions = true;

}
