import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CaseQueueService } from '../case-queue.service';
import { ActivatedRoute, Router } from '@angular/router';
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
import { forkJoin, Observable, tap } from 'rxjs';
import { AuthService } from '../auth.service';
import { SuspectServiceService } from '../suspect-service.service';
import { VictimDataService } from '../victim-data.service';
import { CrimeService } from '../crime-service.service';
import { error } from 'console';


@Component({
  selector: 'app-edit-case',
  templateUrl: './edit-case.component.html',
  styleUrl: './edit-case.component.css'
})
export class EditCaseComponent {

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
    citizens: any = []
    evidences: any = []
    suspects: any = [];
    victims: any = [];
  
    stationID: string | null = null;
    citizenId: number = 0;
    fetch_Report: any;
    incidentName: any;
    
  
  
    policeDetails: any = {};
    stationDetails: any = {};
    reportDetails: any = [];
    reportId: any;
  
    
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
    addtlDetails: any;
  
  
    
    personData: any;
    accountData: any;
    locationData: any;
    citizenData: any;
    suspectData: any;
    assignedTeam: any;
    crimeData: any;
    currentPage = 1;
  
  
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
    
      this.fetchRanks();
      this.fetchStations();
      this.fetchPersons();
      // this.fetchVictims();
      // this.fetchSuspects();
     
     
  
      const policeData = localStorage.getItem('policeDetails');
      const stationData = localStorage.getItem('stationDetails');
      const reportsData = localStorage.getItem('reports');
      const accountsData = localStorage.getItem('accounts');
  
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
  
      console.log('Retrieved Police Details:', this.policeDetails);
      console.log('Retrieved Station Details:', this.stationDetails);
      console.log('Retrieved Reports:', this.reports);
  
      this.route.queryParams.subscribe((params) => {
        const crimeId = params['crimeID'];
        console.log('Crime ID:', crimeId);
        this.fetchACrime(crimeId);
        
        const page = params['page'];
        if (page) {
          this.currentPage = +page;
        } else {
          const savedPage = localStorage.getItem('currentPage');
          this.currentPage = savedPage ? +savedPage : 1;
        }
        // if (reportId) {
        //     this.reportId = Number(reportId);
        //     this.fetchReportedSuspect(this.reportId);
        //     this.fetchReportedVictim(this.reportId);
  
        //     // Check if the report ID exists in the reports data
        //     const matchingReport = this.reports.find((report: any) => report.report_id === this.reportId);
        //     this.fetchEvidences(matchingReport.report_id)
        //     localStorage.setItem('report-data', JSON.stringify(matchingReport))
  
        //     if (matchingReport && matchingReport.citizen_id ) {
        //         console.log('Matching Report:', matchingReport);
        //         this.selectedReport = matchingReport;
                
  
        //         this.citizenId = this.selectedReport.citizen_id;
        //         console.log("Citizen ID: ", this.citizenId)
                
        //         this.fetchCitizens(() => {
        //           forkJoin({
        //             accounts: this.accounts,
        //             locations: this.fetchLocations()
        //           }).subscribe({
        //             next: (responses) => {
        //               // console.log('All data fetched successfully:', responses);
        //               this.getComplainantInfo(this.citizenId);
        //             },
        //             error: (error) => {
        //               console.error('Error fetching data:', error);
        //               this.errorMessage = 'Failed to load data. Please try again.';
        //             }
        //           });
        //         });
        //     } else {
        //         console.error('Report ID not found in the retrieved reports.');
        //         this.errorMessage = 'Report not found.';
        //     }
        // } else {
        //     console.error('Report ID is missing in query parameters.');
        //     this.errorMessage = 'Report ID is required to fetch the report.';
        // }
    });
  
  
     
      //this.fetchReport(this.citizenId);
  
      // const navigation = this.router.getCurrentNavigation();
      // if (navigation?.extras.state) {
      //   this.citizenId = navigation.extras.state['citizenID'];
      //   console.log('Citizen ID:', this.citizenId); // Use the citizenId as needed
      // if (this.citizenId) {
      //   this.fetchReport(this.citizenId);
      // } else {
      //   this.errorMessage = 'Invalid citizen ID.';
      // }
      // }
    }
  
  
  
    fetchReport(citizenId: number): void {
   
      this.caseQueueService.fetchReport(citizenId).subscribe(
        (response) => {
        console.log('Fetched report:', response);
        //  this.reports.push(response);
        //  console.log("REPORT DATAAAAAAAAAA!!!!!!!!!", this.reports)
        //   this.isLoading = false;
        console.log('Fetched report:', response);
              // Assuming response is an object with report data
              if (response && response.data) {
                  this.reports.push(...response.data); // Use spread operator if response.data is an array
              } else {
                  this.reports.push(response); // Push the response directly if it's a single report object
              }
              // console.log("REPORT DATAAAAAAAAAA!!!!!!!!!", this.reports);
              this.isLoading = false;
          
        },
        (error) => {
          console.error('Error fetching reports:', error);
          this.errorMessage = 'Failed to load reports. Please try again.';
          this.isLoading = false;
        }
      );
      
    }
  
    fetchCitizens(callback: Function): void {
      this.caseQueueService.getCitizens().subscribe(
        (response) => {
          this.citizens = response;
          // localStorage.setItem('citizens', this.citizens)
          // console.log('Fetched citizens:', this.citizens);
          callback();
        },
        (error) => {
          console.error('Error fetching citizens:', error);
          this.errorMessage = 'Failed to load citizens. Please try again.';
        }
      );
    }
  
  
  
    getCitizenName(citizenId: number): string {
      const citizen = this.citizens.find((c: any) => c.citizen_id === citizenId);
      return citizen ? `${citizen.firstname} ${citizen.lastname}` : 'Unknown';
    }
  
 
    fetchnationwideReports(): void {
      this.isLoading = true;
      this.caseQueueService.getNationwideReports().subscribe(
        (response) => {
          if (Array.isArray(response)) {
            this.reports = response; // Use type assertion cautiously
            console.log('Fetched reports:', this.reports);
          } else {
            this.errorMessage = 'Unexpected response from server.';
          }
          this.isLoading = false;
        },
        (error) => {
          console.error('Error fetching nationwide reports:', error);
          this.errorMessage =
            'Failed to load nationwide reports. Please try again.';
          this.isLoading = false;
        }
      );
    }
  
    fetchStations(): void {
      this.jurisdictionService.getAll().subscribe(
        (response: IStation[]) => {
          this.stations = response;
        },
        (error) => {
          console.error('Error fetching stations:', error);
          this.errorMessage = 'Failed to load stations. Please try again.';
        }
      );
    }
  
    fetchRanks(): void {
      this.policeAccountsService.getRanks().subscribe(
        (response: IRank[]) => {
          this.ranks = response;
        },
        (error) => {
          console.error('Error fetching ranks:', error);
          this.errorMessage = 'Failed to load ranks. Please try again.';
        }
      );
    }
  
    // fetchPoliceByStation(stationId: number): void {
    //   this.policeAccountsService.getPoliceByStation(stationId).subscribe(
    //     (response) => {
    //       this.polices = response;
    //       console.log("Fetched Police in Station", this.polices)
    //       localStorage.setItem('policeByStation', JSON.stringify(this.polices))
    //       this.assignedTeam = this.polices.unit
    //     },
    //     (error) => {
    //       console.error('Error fetching ranks:', error);
    //       this.errorMessage = 'Failed to load ranks. Please try again.';
    //     }
    //   );
    // }
  
    fetchPersons(): void {
      this.personService.getPersons().subscribe(
        (response) => {
          this.persons = response;
          localStorage.setItem('persons', JSON.stringify(this.persons))
          // console.log('Fetched persons:', this.persons);
        },
        (error) => {
          console.error('Error fetching persons:', error);
          this.errorMessage = 'Failed to load persons. Please try again.';
        }
      );
    }
  
    // fetchAccounts(): Observable<any> {
    //   return this.accountService.getAccount().pipe(
    //     tap((response) => {
    //       this.accounts = response;
    //       // Store as JSON string
    //       localStorage.setItem('accounts', JSON.stringify(response));
    //     })
    //   );
    // }
  
  
    fetchEvidences(reportId: number): void {
      this.personService.getEvidences(reportId).subscribe(
        (response) => {
          this.evidences = response;
          console.log('Fetched Evidences', this.evidences)
          // console.log('Fetched persons:', this.persons);
        },
        (error) => {
          console.error('Error fetching evidences:', error);
          this.errorMessage = 'Failed to load evidences. Please try again.';
        }
      );
    }
  
    fetchLocations(): Observable<any> {
      return this.personService.getLocations().pipe(
        tap((response) => {
          this.locations = response;
          // Store as JSON string
          localStorage.setItem('locations', JSON.stringify(response));
        })
      );
    }


   
  
    // fetchReportedSuspect(crimeId: number) {
    //   this.crimeService.getInvolvedCases(this.reportId).subscribe(
    //     (response) => {
    //       if (Array.isArray(response) && response.length > 0) {
    //         this.suspects = response[0]; // Extract the first element of the array
    //         let suspectData = response;
    //         console.log('Fetched Reported suspect', this.suspects);
    //         localStorage.setItem('reported-suspect', JSON.stringify(suspectData));
    //         this.isSuspectCaught(this.suspects.is_caught);
    //       } else {
    //         console.error('No suspect data found');
    //       }
    //     },
    //     (error) => {
    //       console.error('Error fetching reported suspect:', error);
    //       this.errorMessage = 'Failed to load suspect. Please try again.';
    //     }
    //   );
    // }
  
    // fetchReportedVictim(reportID: number) {
    //   this.victimService.retrieveReportedVictim(this.reportId).subscribe(
    //     (response) => {
    //       if (Array.isArray(response) && response.length > 0) {
    //         this.victims = response[0]; // Extract the first element of the array
    //         let victimData = response
    //         console.log('Fetched Reported victim', this.victims);
    //         localStorage.setItem('reported-victim', JSON.stringify(victimData));
  
    //       } else {
    //         console.error('No victim data found');
    //       }
    //       // this.victims = response; // Extract the first element of the array
    //       //   console.log('Fetched Reported victim', this.victims);
    //     },
    //     (error) => {
    //       console.error('Error fetching reported suspect:', error);
    //       this.errorMessage = 'Failed to load suspect. Please try again.';
    //     }
    //   );
    // }
  
    // fetchVictims(){
    //   this.victimService.getAllVictims().subscribe(
    //     (response) => {
    //       // console.log('Fetched Victims', response)
    //       let victimss = '';
    //       victimss = JSON.stringify(response)
    //       localStorage.setItem('victims', victimss);
    //     },
    //     (error) => {
    //       console.error('Error fetching victims')
    //     }
    //   )
    // }
  
    // fetchSuspects(){
    //   this.suspectService.retrieveAllSuspects().subscribe(
    //     (response) => {
    //       // console.log('Fetched Suspects', response)
    //       let suspectss = '';
    //       suspectss = JSON.stringify(response)
    //       localStorage.setItem('suspects', suspectss)
    //     },
    //     (error) => {
    //       console.error('Error fetching suspects')
    //     }
    //   )
    // }
    
    // isSuspectCaught(isCaught: boolean){
    //   if(isCaught) {
    //     this.isCaught = 'Yes';
    //   } else {
    //     this.isCaught = 'No'
    //   }
    // }
  
  
  
  
    getGenderName(gender: string): string {
      switch (gender) {
        case 'M':
          return 'Male';
        case 'F':
          return 'Female';
        case 'X':
          return 'Prefer not to say';
        default:
          return 'No gender found';
      }
    }
   
    
    getComplainantInfo(citizenId: number) {
      // 1. Check Citizens Data
      if (!this.citizens || this.citizens.length === 0) {
        console.error("Citizens data is empty or undefined");
        return;
      }
      console.log("Citizens Data:", this.citizens);
    
      // 2. Find Citizen
      const citizen = this.citizens.find((citizen: any) => citizen.citizen_id === citizenId);
      if (!citizen) {
        console.error("Citizen with ID", citizenId, "not found.");
        return;
      }
      console.log("Citizen found:", citizen);
      this.citizenData = citizen;
      
      // 3. Get Person ID
      const personId = citizen.person_id;
      console.log("Looking for accounts with person_id:", personId);
    
      // 4. Check Accounts Data
      if (!this.accounts || this.accounts.length === 0) {
        console.error("Accounts data is empty or undefined");
        // Try to load from localStorage
        const storedAccounts = localStorage.getItem('accounts');
        if (storedAccounts) {
          this.accounts = JSON.parse(storedAccounts);
          console.log("Loaded accounts from localStorage:", this.accounts);
        } else {
          return;
        }
      }
      
      // Debug: Log all accounts to see what we're working with
      // console.log("All available accounts:", this.accounts);
    
      // 5. Find Account
      const account = this.accounts.find((acc: any) => {
        //  console.log("Checking account:", acc, "against personId:", personId);
        return acc.personId === personId;
      });
    
      if (!account) {
        console.error("No account found for person_id:", personId);
        return;
      }
    
      this.accountData = account;
      console.log("Account Data found:", this.accountData);
  
      this.accountService.getProfPic(this.accountData.acc_id).subscribe(
        (profilePicBlob: Blob) => {
            if (profilePicBlob) {
                // Create a URL for the Blob
                this.avatarUrl = URL.createObjectURL(profilePicBlob);
                console.log('PROFILE PIC URL', this.avatarUrl);
            } else {
                console.log('ERROR, DEFAULT PROF PIC STREAMED', this.avatarUrl);
                this.avatarUrl = 'assets/user-default.jpg';
            }
        },
        (error) => {
            console.error('Error fetching profile picture:', error);
            this.avatarUrl = 'assets/user-default.jpg'; 
        }
    );
    
      // 6. Check Locations Data
      if (!this.locations || this.locations.length === 0) {
        console.error("Locations data is empty or undefined");
        // Try to load from localStorage
        const storedLocations = localStorage.getItem('locations');
        if (storedLocations) {
          this.locations = JSON.parse(storedLocations);
          console.log("Loaded locations from localStorage:", this.locations);
        } else {
          return;
        }
      }
    
      // Debug: Log all locations
      // console.log("All available locations:", this.locations);
    
      // 7. Find Location
      if (!this.accountData.home_address_id) {
        console.error("homeAddressId is undefined in account data:", this.accountData);
        return;
      }
    
      const location = this.locations.find((loc: any) => loc.location_id === this.accountData.home_address_id);
      
      if (!location) {
        console.error("No location found for homeAddressId:", this.accountData.homeAddressId);
        return;
      }
    
      this.locationData = location;
      console.log("Location Data found:", this.locationData);
    }
   
  
    openSignaturePad(): void {
      console.log('Opening signature pad for electronic signing...');
      this.successMessage = 'Signature pad opened successfully!';
    }
  
    goBack(): void {
      this.router.navigate(['/manage-police']);
    }
  
  
    viewSignature(signatureData: string) {
      if (signatureData) {
        this.currentSignature = signatureData; 
        this.isSignatureVisible = true; 
      } else {
        console.error('No signature data available.');
      }
    }
  
  
    viewID(idData: string) {
      if (idData) {
        this.currentID = idData; 
        this.isIDvisible = true; 
      } else {
        console.error('No id data available.');
      }
    }
  
    closeID() {
      this.isIDvisible = false; 
      this.currentID = null;
    }
  
    closeSignature() {
      this.isSignatureVisible = false; // Close the modal
      this.currentSignature = null; // Clear the signature to free up memory
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
  
    debugEvidence(evidence: any): string {
      // console.log('Content Type:', evidence.content_type);  // Logs the content type
      // console.log('File Contents (Base64):', evidence.file_contents);  // Logs the base64 file contents
      return `Content Type: ${evidence.content_type}\nFile Length: ${evidence.file_contents?.length} characters`;
    }
  
  
    cleanBase64(base64String: string): string {
      return base64String.replace(/(\r\n|\n|\r| )/gm, '');  // Remove unwanted characters
    }
    
    convertBase64ToBlobUrl(base64: string, contentType: string): string {
      const byteCharacters = atob(base64); // Decode base64 string
      const byteArrays = [];
      
      for (let offset = 0; offset < byteCharacters.length; offset += 1024) {
        const byteArray = new Array(byteCharacters.length);
        for (let i = offset, j = 0; i < offset + 1024 && i < byteCharacters.length; i++, j++) {
          byteArray[j] = byteCharacters.charCodeAt(i);
        }
        byteArrays.push(new Uint8Array(byteArray));
      }
    
      const blob = new Blob(byteArrays, { type: contentType });
      return URL.createObjectURL(blob); // Create Blob URL
    }
  
    openModal(evidence: any) {
      this.selectedEvidence = evidence;
      this.isModalOpen = true;
    }
  
    closeModal() {
      this.isModalOpen = false;
      this.selectedEvidence = null;
    }
  
    isReportsActive(): boolean {
      const activeRoutes = ['/edit-case', '/station-cases'];
      return activeRoutes.some(route => this.router.url.includes(route));
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
  
    onAssignChange(selectedValue: any): void {
      const unit = selectedValue.target.value
      console.log('Selected Police Unit:', unit);
      this.assignedTeam = unit;
    }
    
    
    
  
    navigateToCase(reportId: number) {
  
      if(!this.assignedTeam){
        alert("Please choose Assigned Team");
      }
      if(reportId) {
        console.log("Pre-navigation values:", {
          reportId: reportId,
          assignedTeam: this.assignedTeam // Add this log
        });
        
        // Only navigate if both values are present
        if (this.assignedTeam) {
          this.router.navigate(['/add-case'], {
            state: {
              reportId: reportId,
              team: this.assignedTeam
            }
          });
        }
      }
    }

    fetchACrime(crimeId: number){
      this.crimeService.getSpecificCase(crimeId).subscribe(
        (res) => {
          this.crimeData = res;
          console.log('Crime Data', this.crimeData);
          this.fetchIncident(this.crimeData.incident_type_id);
          this.fetchALocation(this.crimeData.location_id)
          this.fetchFurtherCase(this.crimeData.crime_id);
        },
        (err) => {
          console.error('Error fetching crime', err)
        }
      )
    }

    fetchIncident(incidentId: number){
      this.crimeService.getIncidentTypes().subscribe(
        (res) => {
          // console.log('All incident', res)
          const incident = res.find((i: any) => i.incident_id === incidentId)
          this.incidentName = incident;
          // console.log("Incident Name", this.incidentName)
        },
        (err) => {
          console.error('Error fetching Incident', err)
        }
      )
    }

    fetchALocation(locationId: number) {
      this.personService.getALocation(locationId).subscribe(
        (res) => {
          this.locationData = res;
          //  console.log('Location Data', this.locationData);
        },
        (err) => {
          console.error('Error fetching location', err)
        }
      )
    }

    fetchFurtherCase(crimeId: number){
      this.crimeService.getFurtherCase(crimeId).subscribe(
        (res) => {
          this.addtlDetails = res;

          console.log("Additional Details", this.addtlDetails);

          if (this.addtlDetails?.list_of_officers && Array.isArray(this.addtlDetails.list_of_officers)) {
            this.polices = this.addtlDetails.list_of_officers;
            console.log('Officers assigned to polices:', this.polices);
          } else {
            console.error('No officers found or list_of_officers is not an array.');
            this.polices = []; 
          }
        },
        (err) => {
          console.error('Error fetching addtl details', err)
        }
      )
    }

    plotLongAndLat(locationId: number){
      console.log('Navigating Plot with location ID', locationId)
      console.log('Navigating Plot with location Data', this.locationData);

      const serializedData = JSON.stringify(this.locationData);


      this.router.navigate(['/plot-longitude-and-latitude'], {
       queryParams: { 
        locationID: locationId,
        data: serializedData, 
      }
      });
    }

    markSolved(crimeId: number) {
      this.crimeService.markSolved(crimeId).subscribe(
        (res) => {
          console.log('Case Solved',res);
          alert('Case solved!')
          this.router.navigate(['/station-dashboard'])
        },
        (err) => {
          console.error('Error solving case',err)
        }
      )
    }
    
}
