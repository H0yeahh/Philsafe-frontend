// import { Component, OnInit } from '@angular/core';
// import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { CaseQueueService } from '../case-queue.service';
// import { Router } from '@angular/router';
// import { IReport } from '../case.service';
// import { IStation, JurisdictionService } from '../jurisdiction.service';
// import { IPerson, IRank, PoliceAccountsService } from '../police-accounts.service';
// import { PersonService } from '../person.service';

// @Component({
//   selector: 'app-case-management',
//   templateUrl: './case-management.component.html',
//   styleUrl: './case-management.component.css'
// })
// export class CaseManagementComponent implements OnInit {
//  manageCasesForm!: FormGroup;  // Form group for report submission
//   isLoading = false;
//   successMessage: string | null = null;
//   errorMessage: string | null = null;
//   reports: IReport[] = [];  // Array to hold fetched reports
//   stations: IStation[] = [];
//   persons: IPerson[] = [];
//   ranks: IRank[] = [];
  
//   stationID: string | null = null;

//   constructor(
//     private fb: FormBuilder,
//     private caseQueueService: CaseQueueService,
//     private jurisdictionService: JurisdictionService,
//     private policeAccountsService: PoliceAccountsService,
//     private personService: PersonService,
//     private router: Router
//   ) {}

//   // Initialize the form and fetch reports, stations, and ranks
//   ngOnInit(): void {
//     this.initializeForm();
//     this.getOfficerStationId(); // Fetch officer's station ID on init
//     this.fetchRanks();
//     this.fetchStations();
//     this.fetchPersons();
//     this.fetchnationwideReports();
//   }

//   // Define the form controls
//   initializeForm(): void {
//     this.manageCasesForm = this.fb.group({
//       reportID: ['', Validators.required],
//       type: ['', Validators.required],
//       complainant: ['', Validators.required],
//       dateReceived: ['', Validators.required],
//       reportBody: ['', Validators.required],
//       citizen_id: ['', Validators.required],
//       reportSubCategoryID: ['', Validators.required],
//       locationID: [''],  // Optional field
//       stationID: ['', Validators.required],
//       crimeID: [''],  // Optional field
//       reported_date: ['', Validators.required],
//       incidentDate: [''],  // Optional field
//       blotterNum: ['', Validators.required],
//       hasAccount: [true],
//       eSignature: ['', Validators.required],  // Assuming eSignature is a string or file
//       rankID: ['', Validators.required],  // Rank field added
//       personID: ['', Validators.required],  // Person field added
//       reportSubCategory: ['', Validators.required],
//       subcategory_name:['', Validators.required], 
//       status: ['', Validators.required], 
//       is_spam: ['', Validators.required], 
//     });
//   }

//   // Get the officer's station ID from the logged-in account
//   getOfficerStationId(): void {
//     // Assuming the officer's details are stored in localStorage after login
//     const officerDetails = JSON.parse(localStorage.getItem('officer_details') || '{}');
//     this.stationID = officerDetails.stationId || null;
    
//     if (this.stationID) {
//       this.fetchReports(this.stationID); // Fetch reports using the station ID
//     } else {
//       this.errorMessage = 'Station ID not found.';
//     }
//   }

//   // Fetch reports from the backend service
//   fetchReports(stationId: string): void {
//     this.isLoading = true;  // Set loading state to true
//     this.caseQueueService.getReports(Number(stationId)).subscribe(
//       (response) => {
//         if (Array.isArray(response)) {
//           this.reports = response as IReport[];
//           console.log('Fetched reports:', this.reports);
//         } else {
//           this.errorMessage = 'Unexpected response from server.';
//         }
//         this.isLoading = false;
//       },
//       (error) => {
//         console.error('Error fetching reports:', error);
//         this.errorMessage = 'Failed to load reports. Please try again.';
//         this.isLoading = false;
//       }
//     );
//   }

//   fetchnationwideReports(): void {
//     this.isLoading = true;  // Set loading state to true
//     this.caseQueueService.getNationwideReports().subscribe(
//       (response) => {
//         if (Array.isArray(response)) {
//           this.reports = response as IReport[];
//           console.log('Fetched reports:', this.reports);
//         } else {
//           this.errorMessage = 'Unexpected response from server.';
//         }
//         this.isLoading = false;
//       },
//       (error) => {
//         console.error('Error fetching reports:', error);
//         this.errorMessage = 'Failed to load reports. Please try again.';
//         this.isLoading = false;
//       }
//     );
//   }


//   // Fetch stations
//   fetchStations(): void {
//     this.jurisdictionService.getAll().subscribe(
//       (response: IStation[]) => {
//         this.stations = response;
//       },
//       (error) => {
//         console.error('Error fetching stations:', error);
//         this.errorMessage = 'Failed to load stations. Please try again.';
//       }
//     );
//   }

//   // Fetch ranks
//   fetchRanks(): void {
//     this.policeAccountsService.getRanks().subscribe(
//       (response: IRank[]) => {
//         this.ranks = response;
//       },
//       (error) => {
//         console.error('Error fetching ranks:', error);
//         this.errorMessage = 'Failed to load ranks. Please try again.';
//       }
//     );
//   }

//   // Fetch persons
//   fetchPersons(): void {
//     this.personService.getAll().subscribe(
//       (response: IPerson[]) => {
//         this.persons = response;
//       },
//       (error) => {
//         console.error('Error fetching persons:', error);
//         this.errorMessage = 'Failed to load persons. Please try again.';
//       }
//     );
//   }

//   // Submit the form
//   onSubmit(): void {
//     if (this.manageCasesForm.invalid) {
//       alert('Please fill all required fields correctly.');
//       return;
//     }

//     this.isLoading = true;
//     const formData = this.manageCasesForm.value;

//     const report: IReport = {
//       reportBody: formData.reportBody,
//       citizen_id: formData.citizenID,
//       reportSubCategoryID: formData.reportSubCategoryID,
//       locationID: formData.locationID || null, // Handle optional fields
//       stationID: formData.stationID,
//       crimeID: formData.crimeID || null, // Handle optional fields
//       // reportedDate: formData.reportedDate,
//       incidentDate: formData.incidentDate || null, // Handle optional fields
//       blotterNum: formData.blotterNum,
//       hasAccount: formData.hasAccount,
//       eSignature: formData.eSignature,
//       report_id: 0,  // This will be set by the server
//       type: formData.type,
//       complainant: formData.complainant,
//       reported_date: formData.reported_date,
//       ReportBody: formData.reportBody, // Use reportBody from form
//       subcategory_name:formData.subcategory_name,
//       reportSubCategory: formData.reportSubCategory,
//       ReportSubCategoryId: formData.reportSubCategoryID.toString(),
//       DateTimeReportedDate: new Date().toISOString(),
//       HasAccount: formData.hasAccount.toString(),
//       status: formData.staus,
//       is_spam: formData.is_spam,
//       color: formData.color
//     };

//     console.log('Submitting report with data:', report);

//     this.submitReportForm(report);
//   }

//   // Submit the form data to the service
//   submitReportForm(report: IReport): void {
//     this.caseQueueService.submitReport(report).subscribe(
//       (response: any) => {
//         this.isLoading = false;
//         this.successMessage = 'Report submitted successfully!';
//         this.errorMessage = null;
//         this.manageCasesForm.reset();  // Clear the form after successful submission
//         this.router.navigate(['/station-case-queue']);  // Redirect
//       },
//       (error) => {
//         this.isLoading = false;
//         console.error('Error during report submission:', error);
//         this.errorMessage = 'Submission failed. Please try again.';
//       }
//     );
//   }

//   goBack(): void {
//     this.router.navigate(['/manage-police']);
//   }

//   editCase(index: number): void {
//     const caseData = this.reports[index];
//     const newStatus = prompt("Enter new status (On Process, Reviewing, Done):", caseData.status);
    
//     if (newStatus && ['On Process', 'Reviewing', 'Done'].includes(newStatus)) {
//         caseData.status = newStatus; // Update the status
//         caseData.color = this.getStatusColor(newStatus); // Set the color based on status
//     } else {
//         alert("Invalid status. Please enter 'On Process', 'Reviewing', or 'Done'.");
//     }
//   }

//   getStatusColor(status: string): string {
//     switch (status) {
//         case 'On Process':
//             return 'yellow'; // Color for 'On Process'
//         case 'Reviewing':
//             return 'blue'; // Color for 'Reviewing'
//         case 'Done':
//             return 'green'; // Color for 'Done'
//         default:
//             return 'gray'; // Default color
//     }
//   }
// }



import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CaseQueueService } from '../case-queue.service';
import { Router } from '@angular/router';
import { IReport } from '../case.service';
import { IStation, JurisdictionService } from '../jurisdiction.service';
import { IPerson, IRank, PoliceAccountsService } from '../police-accounts.service';
import { PersonService } from '../person.service';

@Component({
  selector: 'app-case-management',
  templateUrl: './case-management.component.html',
  styleUrls: ['./case-management.component.css'] // Corrected to `styleUrls`
})
export class CaseManagementComponent implements OnInit {
  manageCasesForm!: FormGroup; // Form group for report submission
  isLoading = false;
  successMessage: string | null = null;
  errorMessage: string | null = null;
  reports: any; // Array to hold fetched reports
  stations: IStation[] = [];
  persons: IPerson[] = [];
  ranks: IRank[] = [];

  stationID: string | null = null;
  editingRow: number | null = null; // Track the currently edited row

  constructor(
    private fb: FormBuilder,
    private caseQueueService: CaseQueueService,
    private jurisdictionService: JurisdictionService,
    private policeAccountsService: PoliceAccountsService,
    private personService: PersonService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.getOfficerStationId();
    this.fetchRanks();
    this.fetchStations();
    this.fetchPersons();
    this.fetchnationwideReports();
  }

  initializeForm(): void {
    this.manageCasesForm = this.fb.group({
      reportID: ['', Validators.required],
      type: ['', Validators.required],
      complainant: ['', Validators.required],
      dateReceived: ['', Validators.required],
      reportBody: ['', Validators.required],
      citizen_id: ['', Validators.required],
      reportSubCategoryID: ['', Validators.required],
      locationID: [''], // Optional field
      stationID: ['', Validators.required],
      crimeID: [''], // Optional field
      reported_date: ['', Validators.required],
      incidentDate: [''], // Optional field
      blotterNum: ['', Validators.required],
      hasAccount: [true],
      eSignature: ['', Validators.required],
      rankID: ['', Validators.required],
      personID: ['', Validators.required],
      reportSubCategory: ['', Validators.required],
      subcategory_name: ['', Validators.required],
      status: ['', Validators.required],
      is_spam: ['', Validators.required]
    });
  }

  getOfficerStationId(): void {
    const officerDetails = JSON.parse(localStorage.getItem('officer_details') || '{}');
    this.stationID = officerDetails.stationId || null;

    // if (this.stationID) {
    //   this.fetchReports(this.stationID);
    // } else {
    //   this.errorMessage = 'Station ID not found.';
    // }
  }

  // fetchReports(stationId: string): void {
  //   this.isLoading = true;
  //   this.caseQueueService.getReports(Number(stationId)).subscribe(
  //     (response) => {
  //       if (Array.isArray(response)) {
  //         this.reports = response;
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

  fetchnationwideReports(): void {
    this.isLoading = true;
    this.caseQueueService.getNationwideReports().subscribe(
      (response) => {
        if (Array.isArray(response)) {
          this.reports = response;
          console.log('Fetched reports:', this.reports);
        } else {
          this.errorMessage = 'Unexpected response from server.';
        }
        this.isLoading = false;
      },
      (error) => {
        console.error('Error fetching reports:', error);
        this.errorMessage = 'Failed to load reports. Please try again.';
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

  fetchPersons(): void {
    this.personService.getAll().subscribe(
      (response: IPerson[]) => {
        this.persons = response;
      },
      (error) => {
        console.error('Error fetching persons:', error);
        this.errorMessage = 'Failed to load persons. Please try again.';
      }
    );
  }

  onSubmit(): void {
    if (this.manageCasesForm.invalid) {
      alert('Please fill all required fields correctly.');
      return;
    }

    this.isLoading = true;
    const formData = this.manageCasesForm.value;

    const report: IReport = {
      ...formData,
      report_id: 0, // Will be set by the server
      DateTimeReportedDate: new Date().toISOString(),
      color: formData.color
    };

    // console.log('Submitting report with data:', report);
    // this.submitReportForm(report);
  }

  // submitReportForm(report: IReport): void {
  //   this.caseQueueService.submitReport(report).subscribe(
  //     (response: any) => {
  //       this.isLoading = false;
  //       this.successMessage = 'Report submitted successfully!';
  //       this.errorMessage = null;
  //       this.manageCasesForm.reset();
  //       this.router.navigate(['/station-case-queue']);
  //     },
  //     (error) => {
  //       this.isLoading = false;
  //       console.error('Error during report submission:', error);
  //       this.errorMessage = 'Submission failed. Please try again.';
  //     }
  //   );
  // }

  goBack(): void {
    this.router.navigate(['/manage-police']);
  }

  toggleEdit(index: number): void {
    if (this.editingRow === index) {
      this.editingRow = null; // Save changes and exit edit mode
    } else {
      this.editingRow = index; // Enter edit mode for the selected row
    }
  }

  updateStatus(index: number, newStatus: string): void {
    const caseData = this.reports[index];
    caseData.status = newStatus;
    caseData.color = this.getStatusColor(newStatus);
    console.log(`Updated case ${index} to status: ${newStatus}`);
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'On Process':
        return 'yellow';
      case 'Reviewing':
        return 'blue';
      case 'Done':
        return 'green';
      default:
        return 'gray';
    }
  }
}
