import { Component, OnInit, HostBinding } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CaseQueueService } from '../case-queue.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CaseService, IReport } from '../case.service';
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
import { expandCollapse } from '../animations/expand';
import { DialogService } from '../dialog/dialog.service';  
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import html2pdf from 'html2pdf.js';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';


@Component({
  selector: 'app-reportendorse',
  templateUrl: './reportendorse.component.html',
  styleUrls: ['./reportendorse.component.css'],
  animations: [expandCollapse],
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
  cases: any = [];
  reportId: any;

  showModal = false;
  showSubModal = false;
  existingCaseId: any = '';

  
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
  
  
  personData: any;
  accountData: any;
  locationData: any;
  citizenData: any;
  suspectData: any;
  assignedTeam: any;
  showCasesModal = false;


  currentPage: number = 1; 
  pageSize: number = 10; 
  totalCases: number = 0; 
  filteredCases: any[] = [];
  searchQuery = '';
  activeTab: string = 'suspect';
  descriptions: any = [];
  viewsusDesc: boolean = false;
  suspectDesc: any = []
  isDeceased: string = '';
  currentSuspectName: string = '';
  victimDesc: any = [];
  victimDescriptions: any = [];
  forExport: boolean = false;
  userData: any = [];


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
    private caseService: CaseService,
    private dialogService: DialogService


  ) {
  }

  ngOnInit() {
    // console.log('ReportEndorseComponent initialized!');
    // this.route.queryParams.subscribe(params => {
    //   const citizenId = params['citizenID'];
    //   console.log('Citizen ID:', citizenId);
    // });

    // this.initializeForm();
    //this.getOfficerStationId();
    this.fetchRanks();
    this.fetchStations();
    this.fetchPersons();
    this.fetchVictims();
    this.fetchSuspects();
    this.fetchAccounts();
    this.fetchCases();
    this.getAllLocation();
   

    const policeData = localStorage.getItem('policeDetails');
    const stationData = localStorage.getItem('stationDetails');
    const reportsData = localStorage.getItem('reports');
    const accountsData = localStorage.getItem('accounts');
    const caseDetails = localStorage.getItem('cases');
    const personDetails = localStorage.getItem('persons');
    const userData = localStorage.getItem('userData');


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
    // if (accountsData) {
    //   this.accounts = JSON.parse(accountsData);
    // }
    // if (caseDetails) {
    //   this.cases = JSON.parse(caseDetails);
    // }

    if (personDetails) {
      this.persons = JSON.parse(personDetails);
    }

    if (userData) {
      this.userData = JSON.parse(userData);
      console.log('Fetched User Data', this.userData);
    }

    // console.log('Retrieved Police Details:', this.policeDetails);
    // console.log('Retrieved Station Details:', this.stationDetails);
    // console.log('Retrieved Reports:', this.reports);

    this.route.queryParams.subscribe((params) => {
      const reportId = params['reportID'];
      console.log('Report ID:', reportId);

      if (reportId) {
          this.reportId = Number(reportId);
          

          
          const matchingReport = this.reports.find((report: any) => report.report_id === this.reportId);

          this.fetchReportedSuspect(matchingReport.report_id);
          this.fetchReportedVictim(matchingReport.report_id);
          this.fetchEvidences(matchingReport.report_id)
          localStorage.setItem('report-data', JSON.stringify(matchingReport))

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


  onRestrict(action: (...args: any[]) => void, ...params: any[]): void {
    if (!this.userData?.is_officer_of_the_day) {
      this.dialogService.openUpdateStatusDialog('RESTRICTED', 'You are not In-Charge for today');
      return;
    }
  
    action(...params);
  }

  fetchPerson(){
    
  }


  onShowModal() {
    this.showModal = true;
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

    // this.endorseForm.patchValue({
    //   reportID: report.report_id,
    //   type: report.type,
    //   complainant: report.complainant,
    //   dateReceived: report.reported_date, // Assuming reported_date is the field in queue params
    //   reportBody: report.ReportBody, // Mapping from 'reportBody' in the form to 'ReportBody' in params
    //   citizen_id: report.citizen_id,
    //   reportSubCategoryID: report.ReportSubCategoryId, // Matching 'reportSubCategoryID' with 'ReportSubCategoryId'
    //   locationID: report.locationID,
    //   stationID: report.stationID,
    //   crimeID: report.crimeID,
    //   reportedDate: report.DateTimeReportedDate, // Mapping to DateTimeReportedDate in params
    //   incidentDate: report.DateTimeIncidentDate, // Mapping to DateTimeIncidentDate
    //   blotterNum: report.blotterNum,
    //   hasAccount: report.HasAccount, // Assuming HasAccount should be mapped
    //   eSignature: report.eSignature,
    //   // rankID: report.rankID, // Ensure rankID is included if it's available in case params
    //   // personID: report.personID, // Ensure personID is included if it's available in case params
    //   reportSubCategory: report.reportSubCategory,
    //   subcategory_name: report.subcategory_name,
    //   status: report.status,
    //   is_spam: report.is_spam, // Optional: only patch if available in service params
    //   color: report.color, // Optional: only patch if available in service params
    // });
    // console.log('Form Value:', this.endorseForm.value);
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

  fetchCases(){

    this.caseService.getAllCases().subscribe(
      (response) => {
        this.cases = response;
        // console.log('Fetched Cases:', this.cases);
        // localStorage.setItem('cases', JSON.stringify(this.cases));
      },
      (error) => {
        console.error('Error Fetching Cases:', error);
      });

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

        this.polices = response.filter(police => police.unit !== 'Default');
        console.log("Fetched Police in Station", this.polices)
        localStorage.setItem('policeByStation', JSON.stringify(this.polices))
       
        
        this.assignedTeam = this.polices.unit
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
        localStorage.setItem('persons', JSON.stringify(this.persons))
        // console.log('Fetched persons:', this.persons);
      },
      (error) => {
        console.error('Error fetching persons:', error);
        this.errorMessage = 'Failed to load persons. Please try again.';
      }
    );
  }

    deleteReport(reportId: number) {
    // const userConfirmed = window.confirm(`Please be informed that this report can no longer be retrieved. Are you sure you want to permanently delete the report?`);

    this.dialogService.openConfirmationDialog('Are you sure you want to delete the report?').then(
      (userConfirmed) => {
        if (userConfirmed) {
          this.dialogService.openLoadingDialog();
      this.caseQueueService.spamReport(reportId).subscribe(
        () => {
          // alert(`Report ${reportId} has been successfully deleted.`);
          
          setTimeout(() => {
            this.dialogService.closeLoadingDialog();
            this.dialogService.openUpdateStatusDialog('Success', `Report ${reportId} has been successfully deleted.`);
            
            setTimeout(() => {
              this.dialogService.closeAllDialogs();
              this.router.navigate(['/station-case-queue']); 
            }, 2000);
          }, 5000);
  
          // this.dialogService.closeAllDialogs();
          this.reports = this.reports.filter(report => report.report_id !== reportId);
        }
      );
    } else {
      this.dialogService.closeLoadingDialog();
      this.dialogService.openUpdateStatusDialog('Report deletion was canceled', 'The report deletion was canceled.');
      console.log('Report deletion was canceled');
    }
      }
    )
  
    
  }

   getAllLocation(){
    this.accountService.getAllLocation().subscribe(
      (res) => {
        this.locations = res;
        // console.log('All Location', this.locations)
      },
      (err) => {
        console.error('Error fetching location', err)
      }
    )
  }


  getLocationName(locationId: any){
    const location = this.locations.find((loc: any) => loc.location_id === locationId);
    return location ? `${location.street}, ${location.barangay}, ${location.province}`  : "Unknown Location"
  }

 

  fetchAccounts(): void {
    this.accountService.getAccount().subscribe(
      (response) => {
        this.accounts = response;
        // localStorage.setItem('accounts', JSON.stringify(response));
        // console.log('Fetched Accounts', this.accounts);
       
      },
      (error) => {
        console.error('Error fetching Accounts:', error);
        this.errorMessage = 'Failed to load persons. Please try again.';
      }
    );
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

  fetchLocations(): Observable<any> {
    return this.personService.getLocations().pipe(
      tap((response) => {
        this.locations = response;
        // Store as JSON string
        // localStorage.setItem('locations', JSON.stringify(response));
      })
    );
  }

  fetchReportedSuspect(reportID: number) {
    this.suspectService.retrieveReportedSus(reportID).subscribe(
      (response) => {
        console.log('Raw Suspect Response:', response);
        if (Array.isArray(response) && response.length > 0) {
          this.suspects = response;
          let suspectData = response;
          console.log('Fetched Reported suspect', this.suspects);
          localStorage.setItem('reported-suspect', JSON.stringify(suspectData));
          this.suspects.forEach((suspect) => {
            this.isSuspectCaught(suspect.is_caught); 
            this.fetchDescription(suspect.suspect_id); 
          });
        
        } else {
          console.error('No suspect data found');
        }
      },
      (error) => {
        console.error('Error fetching reported suspect:', error);
        this.errorMessage = 'Failed to load suspect. Please try again.';
      }
    ); 
  }

  fetchReportedVictim(reportID: number) {
    this.victimService.retrieveReportedVictim(reportID).subscribe(
      (response) => {
        if (Array.isArray(response) && response.length > 0) {
          this.victims = response; 
          let victimData = response
          console.log('Fetched Reported victim', this.victims);
          localStorage.setItem('reported-victim', JSON.stringify(victimData));
          this.victims.forEach((victim) => {
            this.fetchVictimDescription(victim.person_id);  
          });
          // this.fetchVictimDescription(this.victims.person_id);

        } else {
          console.error('No victim data found');
        }
        // this.victims = response; // Extract the first element of the array
        //   console.log('Fetched Reported victim', this.victims);
      },
      (error) => {
        console.error('Error fetching reported victim:', error);
        this.errorMessage = 'Failed to load victim. Please try again.';
      }
    );
  }

  fetchVictims(){
    this.victimService.getAllVictims().subscribe(
      (response) => {
        // console.log('Fetched Victims', response)
        let victimss = '';
        victimss = JSON.stringify(response)
        localStorage.setItem('victims', victimss);
      },
      (error) => {
        console.error('Error fetching victims')
      }
    )
  }

  fetchSuspects(){
    this.suspectService.retrieveAllSuspects().subscribe(
      (response) => {
        // console.log('Fetched Suspects', response)
        let suspectss = '';
        suspectss = JSON.stringify(response)
        localStorage.setItem('suspects', suspectss)
      },
      (error) => {
        console.error('Error fetching suspects')
      }
    )
  }

  fetchDescription(suspectId: number){
    
    this.suspectService.getDescription(suspectId).subscribe({
      next: (response) => {
        console.log('Fetched Description:', response);
        console.log('Suspect ID in description', suspectId)
        this.descriptions = response
        const susDesc = this.descriptions.find((p: any) => p.suspect_id === suspectId);
          if (susDesc) {
            this.suspectDesc = susDesc;
          }
          console.log(`Suspect ${suspectId} Description:`, this.suspectDesc);
      },
      error: (error) => {
        console.error('Error fetching description:', error);
        this.errorMessage = 'Failed to load description. Please try again.';
      }
    });
  }


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

  // fetchDescription(suspectId: number): Promise<void> {
  //   return new Promise((resolve, reject) => {
  //     this.suspectService.getDescription(suspectId).subscribe({
  //       next: (response) => {
  //         this.suspectDesc = response;
  //         resolve();
  //       },
  //       error: (error) => {
  //         console.error('Error fetching description:', error);
  //         reject();
  //       }
  //     });
  //   });
  // }

  isCitizenDeceased(deceased: boolean): string {
    return deceased ? 'No' : 'Yes';
  }


  viewSuspectDesc(suspectId: number){
    this.viewsusDesc = true;
    this.isLoading = true; 
    this.fetchDescription(suspectId);

    const suspect = this.suspects.find((s) => s.suspect_id === suspectId);
    if (suspect) {
      this.currentSuspectName = `${suspect.first_name} ${suspect.last_name}`;
    } else {
      this.currentSuspectName = 'Unknown';
    }
  }

  
  
  isSuspectCaught(isCaught: boolean){
    if(isCaught) {
      this.isCaught = 'Yes';
    } else {
      this.isCaught = 'No'
    }
  }



  getCivilStatus(personId: number): string {
 
   
    const person = this.persons.find((p) => p.person_id === personId);
    return person ? person.civil_status : 'Unknown';
  }


  getGenderName(gender: string): string {
    switch (gender) {
      case 'M':
        return 'Male';
      case 'F':
        return 'Female';
      case 'U':
        return 'Undetermined';
      case 'X':
        return 'Prefer not to say';
      default:
        return 'Undetermined';
    }
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
  

  

  
  getComplainantInfo(citizenId: number) {
    // 1. Check Citizens Data
    if (!this.citizens || this.citizens.length === 0) {
      console.error("Citizens data is empty or undefined");
      return;
    }
    // console.log("Citizens Data:", this.citizens);
  
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

    return base64String.replace(/(\r\n|\n|\r| )/gm, '');
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

  openSubModal() {
    this.showModal = false;
    this.showSubModal = true;
  }
  

  closeModal() {
    this.isModalOpen = false;
    this.selectedEvidence = null;
    this.viewsusDesc = false
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

  onAssignChange(selectedValue: any): void {
    const unit = selectedValue.target.value
    console.log('Selected Police Unit:', unit);
    this.assignedTeam = unit;
    
    
  }
  
  
  addExistingCase(reportId:number, caseId: number) {
    if (caseId) {
      console.log('Existing Case ID:', caseId);
      
      this.caseQueueService.existingCase(reportId, caseId).subscribe(
        (res) => {
          console.log('Report successfully added to the case', res);
          this.router.navigate(['/station-dashboard']);
        },
        (err) => {
          console.error('Failed to add the report to existing case', err)
        }
      )
      this.showSubModal = false;
      this.showModal = false;
    } else {
      this.dialogService.openUpdateStatusDialog('Note', 'Please enter Case ID');
    }
  }

  selectCase(caseId: string) {
    this.existingCaseId = caseId;
    this.showCasesModal = false; // Close the modal after selecting
  }
  

  navigateToCase(reportId: number) {

    if(!this.assignedTeam){
      // alert("Please choose Assigned Team");
      this.dialogService.openUpdateStatusDialog('Note', 'Please choose Assigned Team!');
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

  filterCases() {
    if (!this.searchQuery) {
      this.filteredCases = this.cases;
      return;
    }
  
    const query = this.searchQuery.toLowerCase();
  
    this.filteredCases = this.cases.filter((crime) => {
      const crimeIdMatch = crime.crime_id?.toString().toLowerCase().includes(query);
      const citeNumMatch = crime.cite_number?.toString().toLowerCase().includes(query);
      const incidentNameMatch = crime.incident_type 
        ? crime.incident_type.toString().toLowerCase().includes(query) 
        : false;
      const statusMatch = crime.status?.toLowerCase().includes(query);
  
      return crimeIdMatch || citeNumMatch || incidentNameMatch || statusMatch;
    });
  }
  


exportToPDF(reportId: any) {
  this.forExport = true;
  
  // Increase timeout to ensure content is fully rendered
  setTimeout(() => {
    const content = document.getElementById('report-content');
    this.dialogService.openLoadingDialog();
    console.log('content', content);
    
    // Debug the content dimensions and visibility
    if (content) {
      console.log('Content dimensions:', content.offsetWidth, content.offsetHeight);
      console.log('Content visibility:', window.getComputedStyle(content).visibility);
      console.log('Content display:', window.getComputedStyle(content).display);
      
      // Force display if needed
      content.style.display = 'block';
      content.style.visibility = 'visible';
      
      // Ensure the content has some minimum dimensions
      if (content.offsetWidth === 0 || content.offsetHeight === 0) {
        console.error('Content has zero dimensions!');
        this.dialogService.closeAllDialogs();
        this.dialogService.openUpdateStatusDialog('Error', 'Content has zero dimensions');
        return;
      }
      
      html2canvas(content, {
        logging: true,
        allowTaint: true,
        useCORS: true,
        scale: 2
      }).then((canvas) => {
    
        if (canvas.width < 10 || canvas.height < 10) {
          console.error('Canvas is too small, likely empty content');
          this.dialogService.closeAllDialogs();
          this.dialogService.openUpdateStatusDialog('Error', 'Unable to generate PDF - empty content');
          return;
        }
        
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');

        const imgWidth = 190;
        const pageHeight = pdf.internal.pageSize.height;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        let heightLeft = imgHeight;
        let position = 10;

        pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        while (heightLeft > 0) {
          position = heightLeft - imgHeight;
          pdf.addPage();
          pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }

        pdf.save(`Report ${reportId}.pdf`);
        this.dialogService.closeLoadingDialog();
        this.dialogService.openUpdateStatusDialog('Success', 'Report successfully exported');
        
      }).catch(err => {
        console.error('PDF generation error:', err);
        this.dialogService.closeAllDialogs();
        this.dialogService.openUpdateStatusDialog('Error', 'Error generating PDF: ' + err.message);
      });
    } else {
      this.dialogService.closeAllDialogs();
      this.dialogService.openUpdateStatusDialog('Error', 'Report content element not found');
      console.error("Element not found!");
    }
  }, 1000); // Increase timeout to 1 second
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

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  @HostBinding('@expandCollapse') pageTransitions = true;
 
}
