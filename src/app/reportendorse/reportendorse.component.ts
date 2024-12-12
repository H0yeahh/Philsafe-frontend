// import { Component, OnInit } from '@angular/core';
// import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { CaseQueueService } from '../case-queue.service';
// import { Router } from '@angular/router';
// import { IReport } from '../case.service';
// import { IStation, JurisdictionService } from '../jurisdiction.service';
// import { IPerson, IRank, PoliceAccountsService } from '../police-accounts.service';
// import { PersonService } from '../person.service';

// @Component({
//   selector: 'app-reportendorse',
//   templateUrl: './reportendorse.component.html',
//   styleUrls: ['./reportendorse.component.css']
// })
// export class ReportEndorseComponent implements OnInit {
// onSendBlotter() {
// throw new Error('Method not implemented.');
// }
//   endorseForm!: FormGroup;  // Form group for report submission
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

//   ngOnInit(): void {
//     this.initializeForm();
//     this.getOfficerStationId();
//     this.fetchRanks();
//     this.fetchStations();
//     this.fetchPersons();
//     this.fetchnationwideReports();
//   }

//   initializeForm(): void {
//     this.endorseForm = this.fb.group({
//       reportID: ['', Validators.required],
//       type: ['', Validators.required],
//       complainant: ['', Validators.required],
//       dateReceived: ['', Validators.required],
//       reportBody: ['', Validators.required],
//       citizen_id: ['', Validators.required],
//       reportSubCategoryID: ['', Validators.required],
//       locationID: [''],
//       stationID: ['', Validators.required],
//       crimeID: [''],
//       reportedDate: ['', Validators.required],  // Use camelCase here
//       incidentDate: [''],
//       blotterNum: ['', Validators.required],
//       hasAccount: [true],
//       eSignature: ['', Validators.required],
//       rankID: ['', Validators.required],
//       personID: ['', Validators.required],
//       reportSubCategory: ['', Validators.required],
//       subcategory_name: ['', Validators.required], 
//       status: ['', Validators.required], 
//       is_spam: [true]
//     });
//   }

//   getOfficerStationId(): void {
//     const officerDetails = JSON.parse(localStorage.getItem('officer_details') || '{}');
//     this.stationID = officerDetails.stationId || null;
    
//     if (this.stationID) {
//       this.fetchReports(this.stationID);
//     } else {
//       this.errorMessage = 'Station ID not found.';
//     }
//   }

//   fetchReports(stationId: string): void {
//     this.isLoading = true;
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

//   // fetchnationwideReports(): void {
//   //   this.isLoading = true;
//   //   this.caseQueueService.getNationwideReports().subscribe(
//   //     (response) => {
//   //       if (Array.isArray(response)) {
//   //         this.reports = response as IReport[];
//   //         console.log('Fetched reports:', this.reports);
//   //       } else {
//   //         this.errorMessage = 'Unexpected response from server.';
//   //       }
//   //       this.isLoading = false;
//   //     },
//   //     (error) => {
//   //       console.error('Error fetching reports:', error);
//   //       this.errorMessage = 'Failed to load reports. Please try again.';
//   //       this.isLoading = false;
//   //     }
//   //   );
//   // }

//   fetchnationwideReports(): void {
//     this.isLoading = true;
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

//   onSubmit(): void {
//     if (this.endorseForm.invalid) {
//       alert('Please fill all required fields correctly.');
//       return;
//     }

//     this.isLoading = true;
//     const formData = this.endorseForm.value;

//       const report: IReport = {
//       reportBody: formData.reportBody,
//       citizen_id: formData.citizen_id,
//       reportSubCategoryID: formData.reportSubCategoryID,
//       locationID: formData.locationID || null,
//       stationID: formData.stationID,
//       crimeID: formData.crimeID || null,
//       reported_date: formData.reportedDate,  // Ensure camelCase here
//       incidentDate: formData.incidentDate || null,
//       blotterNum: formData.blotterNum,
//       hasAccount: formData.hasAccount,
//       eSignature: formData.eSignature,
//       report_id: 0,
//       type: formData.type,
//       complainant: formData.complainant,
//       ReportBody: formData.reportBody,
//       subcategory_name: formData.subcategory_name,
//       reportSubCategory: formData.reportSubCategory,
//       ReportSubCategoryId: formData.reportSubCategoryID.toString(),
//       DateTimeReportedDate: new Date().toISOString(),
//       HasAccount: formData.hasAccount.toString(),
//       status: formData.status,
//       is_spam: formData.is_spam
//     };

//     console.log('Submitting report with data:', report);
//     this.submitReportForm(report);
//   }

//   submitReportForm(report: IReport): void {
//     this.caseQueueService.submitReport(report).subscribe(
//       (response: any) => {
//         this.isLoading = false;
//         this.successMessage = 'Report submitted successfully!';
//         this.errorMessage = null;
//         this.endorseForm.reset();
//         this.router.navigate(['/station-case-queue']);
//       },
//       (error) => {
//         this.isLoading = false;
//         console.error('Error during report submission:', error);
//         this.errorMessage = 'Submission failed. Please try again.';
//       }
//     );
//   }

//   onEndorse(): void {
//     const reportId = this.endorseForm.get('reportID')?.value;
//     console.log(`Endorsing report with ID: ${reportId}`);
//     this.successMessage = 'Report endorsed successfully!';
//   }

//   onDismiss(): void {
//     const reportId = this.endorseForm.get('reportID')?.value;
//     console.log(`Dismissing report with ID: ${reportId}`);
//     this.successMessage = 'Report dismissed successfully!';
//   }

//   goBack(): void {
//     this.router.navigate(['/manage-police']);
//   }
// }
// // } 

// import { Component, OnInit } from '@angular/core';
// import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { CaseQueueService } from '../case-queue.service';
// import { Router } from '@angular/router';
// import { IReport } from '../case.service';
// import { IStation, JurisdictionService } from '../jurisdiction.service';
// import { IPerson, IRank, PoliceAccountsService } from '../police-accounts.service';
// import { PersonService } from '../person.service';

// @Component({
//   selector: 'app-reportendorse',
//   templateUrl: './reportendorse.component.html',
//   styleUrls: ['./reportendorse.component.css']
// })
// export class ReportEndorseComponent implements OnInit {
//   endorseForm!: FormGroup; // Form group for report submission
//   isLoading = false;
//   successMessage: string | null = null;
//   errorMessage: string | null = null;
//   reports: IReport[] = [];
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

//   ngOnInit(): void {
//     this.initializeForm();
//     this.getOfficerStationId();
//     this.fetchRanks();
//     this.fetchStations();
//     this.fetchPersons();
//     this.fetchnationwideReports();
//   }

//   initializeForm(): void {
//     this.endorseForm = this.fb.group({
//       reportID: ['', Validators.required],
//       type: ['', Validators.required],
//       complainant: ['', Validators.required],
//       dateReceived: ['', Validators.required],
//       reportBody: ['', Validators.required],
//       citizen_id: ['', Validators.required],
//       reportSubCategoryID: ['', Validators.required],
//       locationID: [''],
//       stationID: ['', Validators.required],
//       crimeID: [''],
//       reportedDate: ['', Validators.required],
//       incidentDate: [''],
//       blotterNum: ['', Validators.required],
//       hasAccount: [true],
//       eSignature: ['', Validators.required],
//       rankID: ['', Validators.required],
//       personID: ['', Validators.required],
//       reportSubCategory: ['', Validators.required],
//       subcategory_name: ['', Validators.required],
//       status: ['', Validators.required],
//       is_spam: [true],
//     });
//   }

//   getOfficerStationId(): void {
//     const officerDetails = JSON.parse(localStorage.getItem('officer_details') || '{}');
//     this.stationID = officerDetails.stationId || null;

//     if (this.stationID) {
//       this.fetchReports(this.stationID);
//     } else {
//       this.errorMessage = 'Station ID not found.';
//     }
//   }

//   fetchReports(stationId: string): void {
//     this.isLoading = true;
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
//     this.isLoading = true;
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
//         console.error('Error fetching nationwide reports:', error);
//         this.errorMessage = 'Failed to load nationwide reports. Please try again.';
//         this.isLoading = false;
//       }
//     );
//   }

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

//   onSubmit(): void {
//     if (this.endorseForm.invalid) {
//       alert('Please fill all required fields correctly.');
//       return;
//     }

//     this.isLoading = true;
//     const formData = this.endorseForm.value;

//     const report: IReport = {
//       reportBody: formData.reportBody,
//       citizen_id: formData.citizen_id,
//       reportSubCategoryID: formData.reportSubCategoryID,
//       locationID: formData.locationID || null,
//       stationID: formData.stationID,
//       crimeID: formData.crimeID || null,
//       reported_date: formData.reportedDate,
//       incidentDate: formData.incidentDate || null,
//       blotterNum: formData.blotterNum,
//       hasAccount: formData.hasAccount,
//       eSignature: formData.eSignature,
//       report_id: 0,
//       type: formData.type,
//       complainant: formData.complainant,
//       ReportBody: formData.reportBody,
//       subcategory_name: formData.subcategory_name,
//       reportSubCategory: formData.reportSubCategory,
//       ReportSubCategoryId: formData.reportSubCategoryID.toString(),
//       DateTimeReportedDate: new Date().toISOString(),
//       HasAccount: formData.hasAccount.toString(),
//       status: formData.status,
//       is_spam: formData.is_spam,
//     };

//     console.log('Submitting report with data:', report);
//     this.submitReportForm(report);
//   }

//   submitReportForm(report: IReport): void {
//     this.caseQueueService.submitReport(report).subscribe(
//       (response: any) => {
//         this.isLoading = false;
//         this.successMessage = 'Report submitted successfully!';
//         this.errorMessage = null;
//         this.endorseForm.reset();
//         this.router.navigate(['/station-case-queue']);
//       },
//       (error) => {
//         this.isLoading = false;
//         console.error('Error during report submission:', error);
//         this.errorMessage = 'Submission failed. Please try again.';
//       }
//     );
//   }

//   onEndorse(): void {
//     const reportId = this.endorseForm.get('reportID')?.value;
//     console.log(`Endorsing report with ID: ${reportId}`);
//     this.successMessage = 'Report endorsed successfully!';
//   }

//   onDismiss(): void {
//     const reportId = this.endorseForm.get('reportID')?.value;
//     console.log(`Dismissing report with ID: ${reportId}`);
//     this.successMessage = 'Report dismissed successfully!';
//   }

//   goBack(): void {
//     this.router.navigate(['/manage-police']);
//   }
// }



// import { Component, OnInit } from '@angular/core';
// import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { CaseQueueService } from '../case-queue.service';
// import { Router } from '@angular/router';
// import { IReport } from '../case.service';
// import { IStation, JurisdictionService } from '../jurisdiction.service';
// import { IPerson, IRank, PoliceAccountsService } from '../police-accounts.service';
// import { PersonService } from '../person.service';

// @Component({
//   selector: 'app-reportendorse',
//   templateUrl: './reportendorse.component.html',
//   styleUrls: ['./reportendorse.component.css']
// })
// export class ReportEndorseComponent implements OnInit {
//   endorseForm!: FormGroup; // Form group for report submission
//   isLoading = false;
//   successMessage: string | null = null;
//   errorMessage: string | null = null;
//   reports: IReport[] = [];
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

//   ngOnInit(): void {
//     this.initializeForm();
//     this.getOfficerStationId();
//     this.fetchRanks();
//     this.fetchStations();
//     this.fetchPersons();
//     this.fetchnationwideReports();
//   }

//   initializeForm(): void {
//     this.endorseForm = this.fb.group({
//       reportID: ['', Validators.required],
//       type: ['', Validators.required],
//       complainant: ['', Validators.required],
//       dateReceived: ['', Validators.required],
//       reportBody: ['', Validators.required],
//       citizen_id: ['', Validators.required],
//       reportSubCategoryID: ['', Validators.required],
//       locationID: [''],
//       stationID: ['', Validators.required],
//       crimeID: [''],
//       reportedDate: ['', Validators.required],
//       incidentDate: [''],
//       blotterNum: ['', Validators.required],
//       hasAccount: [true],
//       eSignature: ['', Validators.required],
//       rankID: ['', Validators.required],
//       personID: ['', Validators.required],
//       reportSubCategory: ['', Validators.required],
//       subcategory_name: ['', Validators.required],
//       status: ['', Validators.required],
//       is_spam: [true],
//     });
//   }

//   getOfficerStationId(): void {
//     const officerDetails = JSON.parse(localStorage.getItem('officer_details') || '{}');
//     this.stationID = officerDetails.stationId || null;

//     if (this.stationID) {
//       this.fetchReports(this.stationID);
//     } else {
//       this.errorMessage = 'Station ID not found.';
//     }
//   }

//   fetchReports(stationId: string): void {
//     this.isLoading = true;
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
//     this.isLoading = true;
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
//         console.error('Error fetching nationwide reports:', error);
//         this.errorMessage = 'Failed to load nationwide reports. Please try again.';
//         this.isLoading = false;
//       }
//     );
//   }

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

//   onEndorse(): void {
//     const reportId = this.endorseForm.get('reportID')?.value;
//     console.log(`Endorsing report with ID: ${reportId}`);
//     this.successMessage = 'Report endorsed successfully!';
//   }

//   onDismiss(): void {
//     const reportId = this.endorseForm.get('reportID')?.value;
//     console.log(`Dismissing report with ID: ${reportId}`);
//     this.successMessage = 'Report dismissed successfully!';
//   }

//   onSendBlotter(): void {
//     const blotterNum = this.endorseForm.get('blotterNum')?.value;
//     if (!blotterNum) {
//       this.errorMessage = 'Blotter number is required!';
//       return;
//     }
//     console.log(`Sending blotter with number: ${blotterNum}`);
//     this.successMessage = `Blotter with number ${blotterNum} sent successfully!`;
//   }

//   openSignaturePad(): void {
//     console.log('Opening signature pad for electronic signing...');
//     // Logic for opening the signature pad can be implemented here.
//     // If using a signature library or modal, trigger its initialization here.
//     this.successMessage = 'Signature pad opened successfully!';
//   }

//   goBack(): void {
//     this.router.navigate(['/manage-police']);
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
  selector: 'app-reportendorse',
  templateUrl: './reportendorse.component.html',
  styleUrls: ['./reportendorse.component.css']
})
export class ReportEndorseComponent implements OnInit {
  endorseForm!: FormGroup; // Form group for report submission
  isLoading = false;
  successMessage: string | null = null;
  errorMessage: string | null = null;
  reports: IReport[] = [];
  stations: IStation[] = [];
  persons: IPerson[] = [];
  ranks: IRank[] = [];
  stationID: string | null = null;

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

  getOfficerStationId(): void {
    const officerDetails = JSON.parse(localStorage.getItem('officer_details') || '{}');
    this.stationID = officerDetails.stationId || null;

    if (this.stationID) {
      this.fetchReports(this.stationID);
    } else {
      this.errorMessage = 'Station ID not found.';
    }
  }

  fetchReports(stationId: string): void {
    this.isLoading = true;
    this.caseQueueService.getReports(Number(stationId)).subscribe(
      (response) => {
        if (Array.isArray(response)) {
          this.reports = response as IReport[];
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

  fetchnationwideReports(): void {
    this.isLoading = true;
    this.caseQueueService.getNationwideReports().subscribe(
      (response) => {
        if (Array.isArray(response)) {
          this.reports = response as IReport[];
          console.log('Fetched reports:', this.reports);
        } else {
          this.errorMessage = 'Unexpected response from server.';
        }
        this.isLoading = false;
      },
      (error) => {
        console.error('Error fetching nationwide reports:', error);
        this.errorMessage = 'Failed to load nationwide reports. Please try again.';
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
    if (this.endorseForm.invalid) {
      alert('Please fill all required fields correctly.');
      return;
    }

    this.isLoading = true;
    const formData = this.endorseForm.value;

    const report: IReport = {
      reportBody: formData.reportBody,
      citizen_id: formData.citizen_id,
      reportSubCategoryID: formData.reportSubCategoryID,
      locationID: formData.locationID || null,
      stationID: formData.stationID,
      crimeID: formData.crimeID || null,
      reported_date: formData.reportedDate,
      incidentDate: formData.incidentDate || null,
      blotterNum: formData.blotterNum,
      hasAccount: formData.hasAccount,
      eSignature: formData.eSignature,
      report_id: 0,
      type: formData.type,
      complainant: formData.complainant,
      ReportBody: formData.reportBody,
      subcategory_name: formData.subcategory_name,
      reportSubCategory: formData.reportSubCategory,
      ReportSubCategoryId: formData.reportSubCategoryID.toString(),
      DateTimeReportedDate: new Date().toISOString(),
      HasAccount: formData.hasAccount.toString(),
      status: formData.status,
      is_spam: formData.is_spam,
      color: formData.color,
    
    };

    console.log('Submitting report with data:', report);
    this.submitReportForm(report);
  }

  submitReportForm(report: IReport): void {
    this.caseQueueService.submitReport(report).subscribe(
      (response: any) => {
        this.isLoading = false;
        this.successMessage = 'Report submitted successfully!';
        this.errorMessage = null;
        this.endorseForm.reset();
        this.router.navigate(['/station-case-queue']);
      },
      (error) => {
        this.isLoading = false;
        console.error('Error during report submission:', error);
        this.errorMessage = 'Submission failed. Please try again.';
      }
    );
  }

  onEndorse(): void {
    const reportId = this.endorseForm.get('reportID')?.value;
    console.log(`Endorsing report with ID: ${reportId}`);
    this.successMessage = 'Report endorsed successfully!';
  }

  onDismiss(): void {
    // Get the report ID from the form
    const reportId = this.endorseForm.get('reportID')?.value;
  
    if (!reportId) {
      this.errorMessage = 'Please select a report to dismiss.';
      return;
    }
  
    console.log(`Dismissing report with ID: ${reportId}`);
  
    // Call the backend service to dismiss the report
    this.caseQueueService.dismissReport(reportId).subscribe(
      (response) => {
        // Success: Remove the dismissed report from the local list
        this.reports = this.reports.filter(report => report.report_id !== reportId);
  
        // Display success message
        this.successMessage = 'Report dismissed successfully!';
        this.errorMessage = null;
  
        // Optionally reset the form if needed
        this.endorseForm.reset();
      },
      (error) => {
        // Handle errors if the API call fails
        console.error('Error dismissing report:', error);
        this.errorMessage = 'Failed to dismiss the report. Please try again.';
      }
    );
  }

  // onDismiss(): void {
  //   const reportId = this.endorseForm.get('reportID')?.value;
  //   console.log(`Dismissing report with ID: ${reportId}`);
  //   this.successMessage = 'Report dismissed successfully!';
  // }

  // onSendBlotter(): void {
  //   const blotterNum = this.endorseForm.get('blotterNum')?.value;

  //   // Ensure the blotter number is assigned if it hasn't been provided.
  //   if (!blotterNum) {
  //     this.endorseForm.patchValue({
  //       blotterNum: this.generateBlotterNumber() // Method to generate a blotter number
  //     });
  //   }

  //   const updatedBlotterNum = this.endorseForm.get('blotterNum')?.value;
  //   console.log(`Sending blotter with number: ${updatedBlotterNum}`);

  //   // Endorsing the report and moving it to another UI
  //   this.successMessage = `Blotter with number ${updatedBlotterNum} sent successfully!`;

  //   // Assuming we store this report in a new state, or update it in the database
  //   const reportData = this.endorseForm.value;
  //   this.caseQueueService.moveToEndorsedQueue(reportData).subscribe(
  //     (response) => {
  //       console.log('Report moved to endorsed queue:', response);
  //       // Route to the email UI
  //       this.router.navigate(['/email', updatedBlotterNum]); // Adjust this route as per your app structure
  //     },
  //     (error) => {
  //       console.error('Error moving report to endorsed queue:', error);
  //       this.errorMessage = 'Failed to move the report. Please try again.';
  //     }
  //   );
  // }

  onSendBlotter(): void {
    const blotterNum = this.endorseForm.get('blotterNum')?.value;

    // Ensure the blotter number is assigned if it hasn't been provided.
    if (!blotterNum) {
      this.endorseForm.patchValue({
        blotterNum: this.generateBlotterNumber() // Method to generate a blotter number
      });
    }

    const updatedBlotterNum = this.endorseForm.get('blotterNum')?.value;
    console.log(`Sending blotter with number: ${updatedBlotterNum}`);

    // Endorsing the report and moving it to another UI
    this.successMessage = `Blotter with number ${updatedBlotterNum} sent successfully!`;

    const reportData = this.endorseForm.value;

    // Call the service method to move the report to the endorsed queue
    this.caseQueueService.moveToEndorsedQueue(reportData.report_id).subscribe(
      (response) => {
        console.log('Report moved to endorsed queue:', response);
        // Route to the email UI
        this.router.navigate(['/email', updatedBlotterNum]); // Adjust this route as per your app structure
      },
      (error) => {
        console.error('Error moving report to endorsed queue:', error);
        this.errorMessage = 'Failed to move the report. Please try again.';
      }
    );
  }

  generateBlotterNumber(): string {
    // Logic for generating a blotter number
    const currentDate = new Date();
    const blotterNum = `BLT-${currentDate.getFullYear()}-${Math.floor(Math.random() * 10000)}`;
    return blotterNum;
  }

  openSignaturePad(): void {
        console.log('Opening signature pad for electronic signing...');
        // Logic for opening the signature pad can be implemented here.
        // If using a signature library or modal, trigger its initialization here.
        this.successMessage = 'Signature pad opened successfully!';
      }

  goBack(): void {
    this.router.navigate(['/manage-police']);
  }
}
