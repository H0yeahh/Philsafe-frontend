import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AccountService, IAccount, IPerson, ILocation } from '../account.service'; // Import the service
import { Router } from '@angular/router'; // Import Router for navigation
import moment from "moment";
import { resolve } from 'node:path';

@Component({
    selector: 'app-create-account',
    templateUrl: './create-account.component.html',
    styleUrls: ['./create-account.component.css']
})
export class CreateAccountComponent implements OnInit {
    registrationForm: FormGroup; // Form group for registration
    passwordStrength: string = ''; // To hold password strength
    passwordValid: boolean = false; // To check if password is valid
    passwordRequirements: string[] = []; // To hold password requirements
    progressBarWidth: string = '0%'; // To show password strength progress
    showPassword: boolean = false; // To toggle password visibility
    showConfirmPassword: boolean = false; // To toggle confirm password visibility
    passwordMatchMessage: string = ''; // Message for password match
    selectedPhoto: File | null = null; // Variable to hold the selected photo
    profilePic: string | ArrayBuffer | null = ''; // Variable to hold the photo preview
    errorMessage: string = ''; // Variable to hold error messages

    // Properties to hold retrieved IDs
    accountID: string | null = null; // To hold account ID
    locationID: string | null = null; // To hold location ID
    personID: string | null = null; // To hold person ID
    isSameAddress: boolean = false; // Flag to check if home and work addresses are the same
    userWorkAddress: any = {}; // Placeholder for user work address data

    constructor(private fb: FormBuilder, private accountService: AccountService, private router: Router) {
        // Initialize the registration form with validation
        this.registrationForm = this.fb.group({

            firstName: ['', Validators.required],
            middleName: ['', Validators.required],
            lastName: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(6)]],
            confirmPassword: ['', Validators.required],
            certification: [false, Validators.requiredTrue],
            dateOfBirth: ['', Validators.required], // New field
            gender: ['', Validators.required], // New field
            civilStatus: ['', Validators.required], // New field
            region: ['', Validators.required], // New field
            province: ['', Validators.required], // New field
            municipality: ['', Validators.required], // New field
            barangay: ['', Validators.required], // New field
            street: ['', Validators.required], // New field
            blockLotUnit: ['', Validators.required], // New field
            zipCode: ['', Validators.required], // New field
            workRegion: [''], // New field
            workProvince: [''], // New field
            workMunicipality: [''], // New field
            workBarangay: [''], // New field
            workStreet: [''], // New field
            workBlockLotUnit: [''], // New field
            workZipCode: [''], // New field
            contactNum: ['', Validators.required], // New field
            isSameAddress: [false],
        });
    }

    ngOnInit(): void {
        console.log('Create Account Component Initialized'); // Debugging log
    }

    // Method to handle photo selection
    onPhotoSelected(event: Event) {
        const input = event.target as HTMLInputElement;
        if (input.files && input.files.length > 0) {
            this.selectedPhoto = input.files[0]; // Store the selected file
            const reader = new FileReader();
            reader.onload = (e: ProgressEvent<FileReader>) => {
                if (e.target) {
                    this.profilePic = e.target.result; // Set the profile picture preview
                }
            };
            reader.readAsDataURL(this.selectedPhoto);
        }
    }

    // Method to handle password changes
    onPasswordChange() {
        const password = this.registrationForm.get('password')?.value;
        const confirmPassword = this.registrationForm.get('confirmPassword')?.value;

        this.passwordStrength = this.checkPasswordStrength(password); // Check password strength
        this.passwordValid = this.isPasswordValid(password); // Validate password
        this.passwordRequirements = this.getPasswordRequirements(password); // Get password requirements
        this.progressBarWidth = this.getProgressBarWidth(password); // Update progress bar width

        // Check if passwords match
        if (password && confirmPassword) {
            this.passwordMatchMessage = password === confirmPassword ? "Password match!" : "Password doesn't match!";
        } else {
            this.passwordMatchMessage = ''; // Clear message if fields are empty
        }
    }

    submitLocation(locationData: ILocation) {
        const { zipCode } = locationData
        return new Promise((resolve, reject) => {
            this.accountService.postLocation(zipCode, locationData).subscribe(data => {
                console.log(data)
                resolve(data)
            });
        })
    }

    submitPerson(personData: IPerson) {
        return new Promise((resolve, reject) => {
            this.accountService.postPerson(personData).subscribe(data => {
                console.log(data)
                resolve(data)
            });
        })
    }

    submitAccount(accountData: IAccount) {
        return new Promise((resolve, reject) => {
            this.accountService.postAccount(accountData).subscribe(data => {
                console.log(data)
                resolve(data)
            });
        })
    }
    // Method to handle form submission
    async onSubmit() {
        this.errorMessage = ''; // Clear previous error message
        // // Log the validity of each form control
        Object.keys(this.registrationForm.controls).forEach(key => {
            const controlErrors = this.registrationForm.get(key)?.errors;
            if (controlErrors != null) {
                console.log('Key control: ' + key + ', errors: ', controlErrors);
            }
        });

        if (this.registrationForm.valid && this.passwordValid) {
            const accountData = this.registrationForm.value; // Get account data from the form
            // Ensure role is always set to "User (Uncertified)"
            accountData.role = 'Admin';
            const ids = {   
                homeAddressId: 0,
                workAddressId: 0,
                personId: 0
            }

            const homeLocationData: ILocation = {
                zipCode: accountData.zipCode,
                region: accountData.region,
                province: accountData.province,
                municipality: accountData.municipality,
                barangay: accountData.barangay,
                street: accountData.street,
                blockLotUnit: accountData.blockLotUnit,
            };
            // Submit home address 
            const homeLocationRequest: any = await this.submitLocation(homeLocationData)
            // assigning homeaddress ID
            ids.homeAddressId = homeLocationRequest.id
            ids.workAddressId = homeLocationRequest.id;

            if (!accountData.isSameAddress) {
                const { workRegion, workProvince, workMunicipality, workBarangay, workStreet, workBlockLotUnit, workZipCode } = accountData

                // submit work address if not the same address with home address
                const workLocationRequest: any = await this.submitLocation({
                    zipCode: workZipCode,
                    region: workRegion,
                    province: workProvince,
                    municipality: workMunicipality,
                    barangay: workBarangay,
                    street: workStreet,
                    blockLotUnit: workBlockLotUnit,
                })
                ids.workAddressId = workLocationRequest.id
            }

            const personData: IPerson = {
                firstname: accountData.firstName,
                middlename: accountData.middleName,
                lastname: accountData.lastName,
                sex: accountData.gender,
                birthdate: accountData.dateOfBirth,
                bioStatus: true,
                civilStatus: accountData.civilStatus,
            }
            //   submit person data request
            const personRequest: any = await this.submitPerson(personData);
            ids.personId = personRequest.id

            const accountReqData: IAccount = {
                ...personData,
                email: accountData.email,
                password: accountData.password,
                contactNum: accountData.contactNum,
                ...ids,
                role: 'Admin',
            }
            // submit to account
            const accountRequest: any = await this.submitAccount(accountReqData);
            if (accountRequest.code === 200) {
                this.router.navigate(['/login'])
            }
        } else {
            this.errorMessage = 'Please fill in all required fields correctly.'; // Set error message
            console.log('Form is invalid', this.registrationForm.errors); // Log form errors
        }
    }

    // Method to check password strength
    checkPasswordStrength(password: string): string {
        if (!password) return '';
        const strongRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        const mediumRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{6,}$/;

        if (strongRegex.test(password)) {
            return 'Very strong password';
        } else if (mediumRegex.test(password)) {
            return 'Medium password';
        } else {
            return 'Weak password';
        }
    }

    // Method to validate if the password is strong
    isPasswordValid(password: string): boolean {
        return this.checkPasswordStrength(password) === 'Very strong password';
    }

    // Method to get password requirements
    getPasswordRequirements(password: string): string[] {
        const requirements = [];
        if (!/(?=.*[a-z])/.test(password)) requirements.push('Ensure that password contains both upper and lowercase letters.');
        if (!/(?=.*[A-Z])/.test(password)) requirements.push('Ensure that password contains both upper and lowercase letters.');
        if (!/(?=.*\d)/.test(password)) requirements.push('Include numbers.');
        if (!/(?=.*[@$!%*?&])/.test(password)) requirements.push('Include symbols like @, _, #, *, and/or numbers.');
        return requirements;
    }

    // Method to get progress bar width based on password strength
    getProgressBarWidth(password: string): string {
        if (!password) return '0%';
        const strength = this.checkPasswordStrength(password);
        if (strength === 'Very strong password') return '100%';
        if (strength === 'Medium password') return '50%';
        return '25%';
    }

    // Method to toggle password visibility
    togglePasswordVisibility() {
        this.showPassword = !this.showPassword;
    }

    // Method to toggle confirm password visibilitys
    toggleConfirmPasswordVisibility() {
        this.showConfirmPassword = !this.showConfirmPassword;
    }
}