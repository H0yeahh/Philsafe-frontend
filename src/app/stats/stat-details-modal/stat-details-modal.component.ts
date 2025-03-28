import { Component, Input } from '@angular/core';
import { PoliceAccountsService } from '../../police-accounts.service';


@Component({
  selector: 'app-stat-details-modal',
  templateUrl: './stat-details-modal.component.html',
  styleUrls: ['./stat-details-modal.component.css']
})
export class StatDetailsModalComponent {
  @Input() isVisible = false;
  @Input() selectedReport: any = null;

  barangayName: string | null = null;

  constructor(private locationService: PoliceAccountsService) {}

  closeModal() {
    this.isVisible = false;
    this.selectedReport = null;
    this.barangayName = null;
  }

  openModal(report: any) {
    this.selectedReport = report;
    this.isVisible = true;

    if (this.selectedReport.locationId) {
      this.locationService.getLocation(this.selectedReport.locationId).subscribe(
        (locationData) => {
          this.barangayName = locationData.barangay;
        },
        (error) => {
          console.error('Error fetching location:', error);
          this.barangayName = 'Unknown';
        }
      );
    }
  }
}