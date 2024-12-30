import { Component } from '@angular/core';
import { JurisdictionService } from '../jurisdiction.service';
import { PoliceAccountsService } from '../police-accounts.service';
import { PersonService } from '../person.service';
import { CaseService } from '../case.service';
import { AuthService } from '../auth.service';
import { CaseQueueService } from '../case-queue.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-case',
  templateUrl: './add-case.component.html',
  styleUrl: './add-case.component.css'
})
export class AddCaseComponent {
  
  stationDetails:  any;
  constructor(
    
      private jurisdictionService: JurisdictionService,
      private policeAccountsService: PoliceAccountsService,
      private personService: PersonService,
      private caseService: CaseService,
      private router: Router,
      private authService: AuthService,
      private caseQueueService: CaseQueueService
    ) {}


    ngOnInit(): void {
    
      const stationData = localStorage.getItem('stationDetails');
     
      if (stationData) {
        this.stationDetails = JSON.parse(stationData);
      }
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

  isReportsActive(): boolean {
    const activeRoutes = ['/add-case', '/station-cases'];
    return activeRoutes.some(route => this.router.url.includes(route));
  }
  

}
