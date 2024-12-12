import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-email',
  templateUrl: './email.component.html',  
  styleUrl: './email.component.css'
})
export class EmailComponent {
  incidentForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.incidentForm = this.fb.group({
      from: ['ps02@pnp.gov.ph', [Validators.required, Validators.email]],
      to: ['', [Validators.required, Validators.email]],
      subject: ['Incident Record Transaction Receipt', Validators.required],
      reportingPerson: ['', Validators.required],
      address: ['', Validators.required],
      typeOfIncident: ['', Validators.required],
      dateTimeOfIncident: ['', Validators.required],
      placeOfIncident: ['', Validators.required],
      dateTimeOfReport: ['', Validators.required],
      transactionId: ['', Validators.required],
      recordedBy: ['', Validators.required],
      acknowledgedBy: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.incidentForm.valid) {
      console.log('Form Submitted:', this.incidentForm.value);
    } else {
      console.log('Form is invalid');
    }
  }

}
 


