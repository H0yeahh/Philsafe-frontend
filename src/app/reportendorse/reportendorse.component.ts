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

@Component({
  selector: 'app-reportendorse',
  templateUrl: './reportendorse.component.html',
  styleUrls: ['./reportendorse.component.css'],
})
export class ReportEndorseComponent implements OnInit {
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
  


  
  personData: any;
  accountData: any;
  locationData: any;
  citizenData: any;


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
    private victimService: VictimDataService

  ) {}

  ngOnInit() {
    // console.log('ReportEndorseComponent initialized!');
    // this.route.queryParams.subscribe(params => {
    //   const citizenId = params['citizenID'];
    //   console.log('Citizen ID:', citizenId);
    // });

    this.initializeForm();
    //this.getOfficerStationId();
    this.fetchRanks();
    this.fetchStations();
    this.fetchPersons();
    this.fetchVictims();
   

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
      this.fetchPoliceByStation(this.stationDetails.station_id)
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
      const reportId = params['reportID'];
      console.log('Report ID:', reportId);

      if (reportId) {
          this.reportId = Number(reportId);
          this.fetchReportedSuspect(this.reportId);

          // Check if the report ID exists in the reports data
          const matchingReport = this.reports.find((report: any) => report.report_id === this.reportId);
          this.fetchEvidences(matchingReport.report_id)

          if (matchingReport && matchingReport.citizen_id ) {
              console.log('Matching Report:', matchingReport);
              this.selectedReport = matchingReport;
              

              this.citizenId = this.selectedReport.citizen_id;
              console.log("Citizen ID: ", this.citizenId)
              
              this.fetchCitizens(() => {
                forkJoin({
                  accounts: this.accounts,
                  locations: this.fetchLocations()
                }).subscribe({
                  next: (responses) => {
                    // console.log('All data fetched successfully:', responses);
                    this.getComplainantInfo(this.citizenId);
                  },
                  error: (error) => {
                    console.error('Error fetching data:', error);
                    this.errorMessage = 'Failed to load data. Please try again.';
                  }
                });
              });
          } else {
              console.error('Report ID not found in the retrieved reports.');
              this.errorMessage = 'Report not found.';
          }
      } else {
          console.error('Report ID is missing in query parameters.');
          this.errorMessage = 'Report ID is required to fetch the report.';
      }
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

  initializeForm(): void {
    this.endorseForm = this.fb.group({
      reportID: ['', Validators.required],
      type: ['', Validators.required],
      complainant: ['', Validators.required],
      dateReceived: ['', Validators.required],
      reportBody: ['', Validators.required],
      citizen_id: ['', Validators.required],
      reportSubCategoryID: ['', Validators.required],
      locationID: [''],
      stationID: ['', Validators.required],
      crimeID: [''],
      reportedDate: ['', Validators.required],
      incidentDate: [''],
      blotterNum: ['', Validators.required],
      hasAccount: [true],
      eSignature: ['', Validators.required],
      rankID: ['', Validators.required],
      personID: ['', Validators.required],
      reportSubCategory: ['', Validators.required],
      subcategory_name: ['', Validators.required],
      status: ['', Validators.required],
      is_spam: [true],
      color: ['', Validators.required],
    });
  }

  // getOfficerStationId(): void {
  //   const officerDetails = JSON.parse(
  //     localStorage.getItem('officer_details') || '{}'
  //   );
  //   this.stationID = officerDetails.stationId || null;

  //   if (this.stationID) {
  //     this.fetchReports(this.stationID);
  //   } else {
  //     this.errorMessage = 'Station ID not found.';
  //   }
  // }

  // fetchReports(stationId: string): void {
  //   this.isLoading = true;
  //   this.caseQueueService.getReports(Number(stationId)).subscribe(
  //     (response) => {
  //       if (Array.isArray(response)) {
  //         this.reports = response as IReport[];
  //         console.log('Fetched reports:', this.reports);
  //       } else {
  //         this.errorMessage = 'Unexpected response from server.';
  //       }
  //       this.isLoading = false;
  //     },
  //     (error) => {
  //       console.error('Error fetching reports:', error);
  //       this.errorMessage = 'Failed to load reports. Please try again.';
  //       this.isLoading = false;
  //     }
  //   );
  // }

  // fetchReport(citizenId: number): void {
  //   if (!citizenId) {
  //     this.errorMessage = 'Citizen ID is required.';
  //     return;
  //   }

  //   this.isLoading = true;
  //   const url = `https://172.30.1.26:7108/api/retrieve/citizen/${citizenId}`;
  //   this.http.get(url).subscribe(
  //     (response) => {
  //       if (Array.isArray(response)) {
  //         // const fetchReports = response;
  //         this.fetch_Report = response;
  //         let fetch: any = '';
  //         // this.reports = response as IReport[];
  //         fetch = {
  //           reportId: this.fetch_Report.report_id,
  //           citizenId: this.fetch_Report.citizen_id
  //         }
  //         console.log('Fetched report of citizen:', fetch);
  //       } else {
  //         this.errorMessage = 'Unexpected response from server.';
  //       }
  //       this.isLoading = false;
  //     },
  //     (error) => {
  //       console.error('Error fetching reports:', error);
  //       this.errorMessage = 'Failed to load reports. Please try again.';
  //       this.isLoading = false;
  //     }
  //   );
  // }




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
        localStorage.setItem('citizens', this.citizens)
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


  // Method to populate the form with fetched report data
  populateForm(report: IReport): void {
    // this.endorseForm.patchValue({
    //   reportID: report.report_id,
    //   policeId1: report.stationID, // Adjust based on your report structure
    //   policeId2: report.stationID, // Adjust based on your report structure
    //   // Add other fields as necessary
    if (!report) {
      console.error('No report data to populate the form.');
      this.errorMessage = 'Failed to populate form. Report data is missing.';
      return;
    }

    this.endorseForm.patchValue({
      reportID: report.report_id,
      type: report.type,
      complainant: report.complainant,
      dateReceived: report.reported_date, // Assuming reported_date is the field in queue params
      reportBody: report.ReportBody, // Mapping from 'reportBody' in the form to 'ReportBody' in params
      citizen_id: report.citizen_id,
      reportSubCategoryID: report.ReportSubCategoryId, // Matching 'reportSubCategoryID' with 'ReportSubCategoryId'
      locationID: report.locationID,
      stationID: report.stationID,
      crimeID: report.crimeID,
      reportedDate: report.DateTimeReportedDate, // Mapping to DateTimeReportedDate in params
      incidentDate: report.DateTimeIncidentDate, // Mapping to DateTimeIncidentDate
      blotterNum: report.blotterNum,
      hasAccount: report.HasAccount, // Assuming HasAccount should be mapped
      eSignature: report.eSignature,
      // rankID: report.rankID, // Ensure rankID is included if it's available in case params
      // personID: report.personID, // Ensure personID is included if it's available in case params
      reportSubCategory: report.reportSubCategory,
      subcategory_name: report.subcategory_name,
      status: report.status,
      is_spam: report.is_spam, // Optional: only patch if available in service params
      color: report.color, // Optional: only patch if available in service params
    });
    console.log('Form Value:', this.endorseForm.value);
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

  fetchPoliceByStation(stationId: number): void {
    this.policeAccountsService.getPoliceByStation(stationId).subscribe(
      (response) => {
        this.polices = response;
        console.log("Fetched Police in Station", this.polices)
        localStorage.setItem('policeByStation', JSON.stringify(this.polices))
      },
      (error) => {
        console.error('Error fetching ranks:', error);
        this.errorMessage = 'Failed to load ranks. Please try again.';
      }
    );
  }

  fetchPersons(): void {
    this.personService.getPersons().subscribe(
      (response) => {
        this.persons = response;
        localStorage.setItem('persons', this.persons)
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

  fetchReportedSuspect(reportID: number) {
    this.suspectService.retrieveReportedSus(this.reportId).subscribe(
      (response) => {
        this.suspects = response; 
        console.log('Fetched Reported suspect', this.suspects)
        localStorage.setItem('reported-suspect', JSON.stringify(this.suspects))

      },
      (error) => {
        console.error('Error fetching reported suspect:', error);
        this.errorMessage = 'Failed to load suspect. Please try again.';
      }
    );
  }

  fetchVictims() {
    this.victimService.getAllVictims().subscribe(
      (response) => {
        this.victims = response;
        console.log('Fetched victims', this.victims)
        localStorage.setItem('victims', JSON.stringify(this.victims))

      },
      (error) => {
        console.error('Error fetching victims:', error);
        this.errorMessage = 'Failed to load victims. Please try again.';
      }
    );
  }

  onReportClick(reportID: number): void {
    console.log(`Report ID clicked: ${reportID}`);
    
    // Find the report data for the selected report ID
    const selectedReport = this.reports.find((report: { report_id: number; }) => report.report_id === reportID);
  
    if (selectedReport) {
      this.populateForm(selectedReport); // Populate the form with the report data
    } else {
      console.error('Selected report not found.');
      this.errorMessage = 'Selected report not found.';
    }
  }
  

  onSendBlotter(): void {
    const blotterNum = this.endorseForm.get('blotterNum')?.value;

    if (!blotterNum) {
      this.endorseForm.patchValue({
        blotterNum: this.generateBlotterNumber(),
      });
    }

    const updatedBlotterNum = this.endorseForm.get('blotterNum')?.value;
    console.log(`Sending blotter with number: ${updatedBlotterNum}`);

    this.successMessage = `Blotter with number ${updatedBlotterNum} sent successfully!`;

    const reportData = this.endorseForm.value;

    this.caseQueueService.moveToEndorsedQueue(reportData.report_id).subscribe(
      (response) => {
        console.log('Report moved to endorsed queue:', response);
        this.router.navigate(['/email', updatedBlotterNum]);
      },
      (error) => {
        console.error('Error moving report to endorsed queue:', error);
        this.errorMessage = 'Failed to move the report. Please try again.';
      }
    );
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
 

  onEndorse(): void {
    const reportId = this.endorseForm.get('reportID')?.value;
    console.log(`Endorsing report with ID: ${reportId}`);
    this.successMessage = 'Report endorsed successfully!';
  }

  onDismiss(): void {
    const reportId = this.endorseForm.get('reportID')?.value;
    console.log(`Dismissing report with ID: ${reportId}`);
    this.successMessage = 'Report dismissed successfully!';
  }

  generateBlotterNumber(): string {
    const currentDate = new Date();
    const blotterNum = `BLT-${currentDate.getFullYear()}-${Math.floor(
      Math.random() * 10000
    )}`;
    return blotterNum;
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
    const activeRoutes = ['/report-endorse', '/station-case-queue'];
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
}
