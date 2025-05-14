import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { AccountService, IAccount, IPerson, ILocation } from '../account.service'; // Import the service
import { Router } from '@angular/router'; // Import Router for navigation
import moment from "moment";
import { resolve } from 'node:path';
import { PoliceAccountsService, IRank, ILocation, IAccount, IPolice, IPerson, UpgradeAccount, LocationUpgrade } from '../police-accounts.service';
import { IStation, JurisdictionService } from '../jurisdiction.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-station-police-accounts',
  templateUrl: './station-police-accounts.component.html',
  styleUrl: './station-police-accounts.component.css'
})
export class StationPoliceAccountsComponent implements OnInit {
    // addPoliceForm: FormGroup; // Form group for registration
    passwordStrength: string = ''; // To hold password strength
    passwordValid: boolean = false; // To check if password is valid
    passwordRequirements: string[] = []; // To hold password requirements
    progressBarWidth: string = '0%'; // To show password strength progress
    showPassword: boolean = false; // To toggle password visibility
    showConfirmPassword: boolean = false; // To toggle confirm password visibility
    passwordMatchMessage: string = ''; // Message for password match
    selectedPhoto: File | null = null; // Variable to hold the selected photo
    profilePic: string | ArrayBuffer | null = ''; // Variable to hold the photo preview
    errorMessage: string | null = null; // Variable to hold error messages
    successMessage: string | null = null;
    isLoading = false;


    upgraded: UpgradeAccount= {
        firstname: '',
        middlename: '',
        lastname: '',
        sex: '',
        birthdate: '',
        civilStatus: '',
        bioStatus: true,
        email: '',
        password: '',
        telNum: '',
        contactNum: '',
        homeAddressId: 0,
        workAddressId: 0,
        role: '',
        unit: '',
        badgeNum: '',
        debutDate: '',
        stationId: 0,
        rankId: '',
        createdBy: '',
        dateTimeCreated: '',
        personId: 0,
        profile_pic: null,
        profile_ext: '',
    
        homeAddress: {
          locationId: 0, province: '', municipality: '', street: '', region: '', barangay: '', block:'', zipCode: 0
        },
    
        workAddress: {
          locationId: 0, province: '', municipality: '', street: '', region: '', barangay: '', block:'', zipCode: 0
        }
    
      };
    



    ranks: IRank[] = [];
    stations: IStation[] = [];
    persons: IPerson[] = [];

    userHomeAddress: LocationUpgrade = {
        locationId: 0,
        province: '',
        municipality: '',
        street: '',
        region: '',
        barangay: '',
        block: '',
        zipCode: 0,
      };
      userWorkAddress: LocationUpgrade = {
        locationId: 0,
        province: '',
        municipality: '',
        street: '',
        region: '',
        barangay: '',
        block: '',
        zipCode: 0,
      };
    profilePicture: File | null = null;
    profileExt: string = '';
    previewUrl: string | ArrayBuffer | null = null;
    // Properties to hold retrieved IDs
    accountID: string | null = null; // To hold account ID
    locationID: string | null = null; // To hold location ID
    personID: string | null = null; // To hold person ID
    stationID: string | null = null;
    rank_id: string | null = null;
    policeID: string | null = null;
    isSameAddress: boolean = false; // Flag to check if home and work addresses are the same
    datetimeCreated: string = '';
    home_zip_code: string = '';
    work_zip_code: string = '';
    confirmPassword: string = '';
    certification: boolean = false;

    constructor(
      private fb: FormBuilder, 
      private policeaccountsService: PoliceAccountsService,
      private router: Router,
      private jurisdiction: JurisdictionService,
      private AuthService: AuthService
    ) {
        // Initialize the registration form with validation
        // this.addPoliceForm = this.fb.group({

        //     firstName: ['', Validators.required],
        //     middleName: ['', Validators.required],
        //     lastName: ['', Validators.required],
        //     email: ['', [Validators.required, Validators.email]],
        //     password: ['', [Validators.required, Validators.minLength(6)]],
        //     confirmPassword: ['', Validators.required],
        //     bioStatus:[true, Validators.required],
        //     certification: [false, Validators.requiredTrue],
        //     dateOfBirth: ['', Validators.required], // New field
        //     gender: ['', Validators.required], // New field
        //     civilStatus: ['', Validators.required], // New field
        //     region: ['', Validators.required], // New field
        //     province: ['', Validators.required], // New field
        //     municipality: ['', Validators.required], // New field
        //     barangay: ['', Validators.required], // New field
        //     street: ['', Validators.required], // New field
        //     blockLotUnit: ['', Validators.required], // New field
        //     zipCode: ['', Validators.required], // New field
        //     workRegion: [''], // New field
        //     workProvince: [''], // New field
        //     workMunicipality: [''], // New field
        //     workBarangay: [''], // New field
        //     workStreet: [''], // New field
        //     workBlockLotUnit: [''], // New field
        //     workZipCode: [''], // New field
        //     contactNum: ['', Validators.required], // New field
        //     isSameAddress: [false],


        //     unit: ['', Validators.required],
        //     role: ['', Validators.required],
        //     // officer: ['', Validators.required], // Ensure this matches formControlName in the HTML
        //     badgeNumber: ['', Validators.required],
        //     debutDate: ['', Validators.required],
        //     createdBy: ['Admin', Validators.required], // Default value
        //     stationId: ['', Validators.required],
        //     rank_id: ['', Validators.required],
        //     datetimeCreated: ['', Validators.required],
        //     // personID: ['', Validators.required],
        // });
    }

    ngOnInit(): void {
        console.log('Create Account Component Initialized'); // Debugging log
        this.fetchRanks();
        // this.fetchStations();
    }
    // fetchStations(): void {
    //   this.jurisdiction.getAll().subscribe(
    //     (response: IStation[]) => {
    //       this.stations = response; 
    //     },
    //     (error) => {
    //       console.error('Error fetching stations:', error);
    //       alert('Failed to load stations. Please try again.');
    //     }
    //   );
    // }
  
    fetchRanks(): void {
      this.policeaccountsService.getRanks().subscribe(
        (response: IRank[]) => {
          this.ranks = response;
        },
        (error) => {
          console.error('Error fetching ranks:', error);
          alert('Failed to load ranks. Please try again.');
        }
      );
    }
    // Method to handle photo selection
    onPhotoSelected(event: Event) {
        const input = event.target as HTMLInputElement;
        if (input.files && input.files.length > 0) {
            
            this.selectedPhoto = input.files[0]; // Store the selected file
            const reader = new FileReader();
            const byteArray = new Uint8Array(reader.result as ArrayBuffer);
            this.profilePic = byteArray;
            this.profileExt = this.selectedPhoto.name.split('.').pop() || 'jpg';

            console.log('Profile Picture Metadata:', {
                profile_pic: this.profilePic,
                extension: this.profileExt
              });
              reader.readAsArrayBuffer(this.selectedPhoto);
            };
            
        
    }

    // Method to handle password changes
    onPasswordChange() {
        const password = this.upgraded.password;
        const confirmPassword = this.confirmPassword;

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


    onAddressCheckboxChange(event: any) {
        this.isSameAddress = event.target.checked;
    
        if (this.isSameAddress) {
          this.copyAddress(this.userHomeAddress, this.userWorkAddress);
          console.log('User work address:', this.userWorkAddress)
      } else  {
          this.resetAddress(this.userWorkAddress);
          console.log("Work Address Resetted",this.userWorkAddress)
      }
      
    }
    
    copyAddress(source: LocationUpgrade, target: LocationUpgrade) {
      target.region = source.region;
      target.province = source.province;
      target.municipality = source.municipality;
      target.barangay = source.barangay;
      target.street = source.street; 
      target.block = source.block;   
      target.zipCode = source.zipCode;  
    
      

    
      console.log(`Address copied:`);
      console.log(`Region: ${target.region}`);
      console.log(`Province: ${target.province}`);
      console.log(`Municipality: ${target.municipality}`);
      console.log(`Barangay: ${target.barangay}`);
    }
    
    resetAddress(address: LocationUpgrade) {
      address.region = '';
      address.province = '';
      address.municipality = '';
      address.barangay = '';
      address.street = '';
      address.block = '';
      address.zipCode = 0;
    }



    submitLocation(locationData: ILocation) {
        const { zipCode } = locationData
        return new Promise((resolve, reject) => {
            this.policeaccountsService.postLocation(zipCode, locationData).subscribe(data => {
                console.log(data)
                resolve(data)
            });
        })
    }

    submitPerson(personData: IPerson) {
        return new Promise((resolve, reject) => {
            this.policeaccountsService.postPerson(personData).subscribe(data => {
                console.log(data)
                resolve(data)
            });
        })
    }

    // submitAccount(accountData: IAccount) {
    //     return new Promise((resolve, reject) => {
    //         this.policeaccountsService.postAccount(accountData).subscribe(data => {
    //             console.log(data)
    //             resolve(data)
    //         });
    //     })
    // }

    submitAccount(accountData: any) {
        return new Promise((resolve, reject) => {
            this.policeaccountsService.postAccount(accountData).subscribe(data => {
                console.log(data)
                resolve(data)
            });
        })
    }

    // submitPoliceForm(param: IPolice): void {
    //     this.policeaccountsService.savePoliceData(param).subscribe(
    //       (response: any) => {
    //         this.isLoading = false;
    //         this.successMessage = 'Registration successful!';
    //         this.errorMessage = null;
    //         this.addPoliceForm.reset(); // Clear the form after successful submission
    //         this.router.navigate(['/station-case-queue']); // Redirect after successful registration
    //       },
    //       (error) => {
    //         this.isLoading = false;
    //         console.error('Error during police registration:', error);
    //         this.errorMessage = 'Registration failed. Please try again.';
    //       }
    //     );
    //   }

    createPolice(data: IPolice) {
      console.log('Creating police with data:', data); // Log the data being sent
      console.log('Role being sent to the server:', data.role); // Log the rank being sent to the server
      this.policeaccountsService.create(data).subscribe(
        (response) => {
          this.isLoading = false;
          console.log('Jurisdiction created successfully:', response);
          this.successMessage = 'Station registered successfully!';
          this.router.navigate(['/manage-station']); // Redirect after successful registration
        },
        (error) => {
          this.isLoading = false;
          console.error('Error during jurisdiction creation:', error);
          this.errorMessage = 'Registration failed. Please try again.';
          alert(this.errorMessage);
        }
      );
    }

    onRoleChange(event: any) {
        const selectedRole = event.target.value;
        console.log('Selected Role:', selectedRole);
        this.upgraded.role = selectedRole;
    }


    onPoliceRoleChange(event: any) {
        const selectedRole = event.target.value;
        console.log('Selected Role:', selectedRole);
        this.upgraded.policeRole = selectedRole;
    }


    onProfilePicSelected(event: any) {
        const fileInput = event.target as HTMLInputElement;
        const file = fileInput.files?.[0];
      
        if (file) {
          const reader = new FileReader();
          reader.onload = () => {
            const byteArray = new Uint8Array(reader.result as ArrayBuffer);
            this.upgraded.profile_pic = byteArray;
            this.upgraded.profile_ext = file.name.split('.').pop() || 'jpg';
      
            console.log('Profile Picture Metadata:', {
              byteArray,
              extension: this.upgraded.profile_ext
            });
      
     
            fileInput.value = '';
          };
          reader.readAsArrayBuffer(file);
        } else {
          console.error('No file selected');
        }
      }


      processProfilePic(): File | null {
   

        if (this.upgraded.profile_pic == null) {
          console.error('Profile picture is required');
          return null;
        }
      
        let byteArray: Uint8Array;
      
        if (this.upgraded.profile_pic instanceof Uint8Array) {
          byteArray = this.upgraded.profile_pic;
        } else if (typeof this.upgraded.profile_pic === 'string') {
          try {
            // Multiple strategies for base64 conversion
            const base64Patterns = [
              /^data:image\/\w+;base64,/,
              /^base64,/,
              /^\s*data:([a-z]+\/[a-z0-9-+.]+(;[a-z-]+=[a-z0-9-]+)?)?(;base64)?,/i
            ];
      
            let cleanBase64: string = this.upgraded.profile_pic;
            for (const pattern of base64Patterns) {
              cleanBase64 = cleanBase64.replace(pattern, '');
            }
      
            // Remove whitespace and newline characters
            cleanBase64 = cleanBase64.replace(/[\n\r\s]/g, '');
      
            // Validate base64 string length and characters
            if (!/^[A-Za-z0-9+/=]+$/.test(cleanBase64)) {
              throw new Error('Invalid base64 string');
            }
      
            byteArray = new Uint8Array(
              window.atob(cleanBase64)
              .split('')
              .map(char => char.charCodeAt(0))
            );
          } catch (error) {
            console.error('Failed to convert base64', error);
            return null;
          }
        } else {
          console.error('Invalid profile picture format');
          return null;
        }
          // Use the stored extension or default to jpg
          const fileExtension = this.upgraded.profile_ext || 'jpg';
        
          // Create File from Uint8Array
          const profilePicFile = new File(
            [byteArray], 
            `profile_pic.${fileExtension}`, 
            { type: `image/${fileExtension}` }
          );
        
          return profilePicFile;
        }
       


    async onSubmit(){
        
 

        if (!this.upgraded.firstname ||
            !this.upgraded.middlename ||
            !this.upgraded.lastname || 
            !this.upgraded.birthdate ||
            !this.upgraded.sex ||
            !this.upgraded.civilStatus ||    
            !this.upgraded.email || 
            !this.upgraded.password || 
            !this.confirmPassword || 
            !this.upgraded.contactNum) {
            console.error('Please fill out all required fields');
            return;
        }
    
        if (!this.isValidEmail(this.upgraded.email)) {
            console.error('Invalid email address');
            return;
        }

        if (this.confirmPassword !== this.upgraded.password) {
            console.error('Passwords do not match');
            return;
        }
    
        if (this.upgraded.password.length < 8) {
            console.error('Password must be at least 8 characters');
            return;
        }
    
     
        if (!this.upgraded.contactNum.startsWith('09')) {
            console.error('Contact number must start with 09');
            return;
        }
    
        // Prepare address data
        this.userHomeAddress.zipCode = Number(this.home_zip_code);
        this.userWorkAddress.zipCode = Number(this.work_zip_code);
      
    
        let profilePicFile: File | null = null;
        let profilePicExt: string = '';
      
        if (this.upgraded.profile_pic) {
          const processedProfilePic = this.processProfilePic();
          if (processedProfilePic) {
            profilePicFile = processedProfilePic;
            profilePicExt = this.upgraded.profile_ext || 'jpg';
          } else {
            console.error('Failed to process profile picture');
            return;
          }
        } else {
          console.error('Profile picture is required');
          return;
        }
      
      
       
        try {
            const homeAddressPromise = this.policeaccountsService.postLocation( this.userHomeAddress.zipCode, this.userHomeAddress,)
                .toPromise()
                .then((homeResponse) => {
                    if (homeResponse.locationFound) {
                        this.upgraded.homeAddressId = homeResponse.id;
                        console.log('Home address exists with ID:', homeResponse.id);
                        
                    } else {
                        this.upgraded.homeAddressId = homeResponse.id;
                        console.log('New home address created with ID:', homeResponse.id);
                    }
                });
    
            const workAddressPromise = 
            this.policeaccountsService.postLocation( this.userHomeAddress.zipCode, this.userHomeAddress,)
                    .toPromise()
                    .then((workResponse) => {
                        if (workResponse.locationFound) {
                            this.upgraded.workAddressId = workResponse.id;
                            console.log('Work address exists with ID:', workResponse.id);
                            
                        } else {
                            this.upgraded.workAddressId = workResponse.id;
                            console.log('New work address created with ID:', workResponse.id);
                        }
                    })
                // : Promise.resolve();
    
       
    
    
            await Promise.all([homeAddressPromise, workAddressPromise]);
    
            const formDataUpgraded = new FormData();
            formDataUpgraded.append('Firstname', this.upgraded.firstname);
            formDataUpgraded.append('Middlename', this.upgraded.middlename);
            formDataUpgraded.append('Lastname', this.upgraded.lastname);
            formDataUpgraded.append('Password', this.upgraded.password);
            formDataUpgraded.append('Sex', this.upgraded.sex);
            formDataUpgraded.append('Birthdate', this.upgraded.birthdate);
            formDataUpgraded.append('CivilStatus', this.upgraded.civilStatus || '');
            formDataUpgraded.append('BioStatus', this.upgraded.bioStatus.toString());
            formDataUpgraded.append('Email', this.upgraded.email);
            formDataUpgraded.append('TelNum', this.upgraded.telNum?.toString() || '');
            formDataUpgraded.append('ContactNum', this.upgraded.contactNum);
            formDataUpgraded.append('HomeAddressId', this.upgraded.homeAddressId ? this.upgraded.homeAddressId.toString() : '');
            formDataUpgraded.append('WorkAddressId', this.upgraded.workAddressId ? this.upgraded.workAddressId.toString() : '');
            formDataUpgraded.append('Role', this.upgraded.role); 
            formDataUpgraded.append('PoliceRole', this.upgraded.policeRole); 
            formDataUpgraded.append('Unit', this.upgraded.unit);
            formDataUpgraded.append('BadgeNumber', this.upgraded.badgeNum); 
            formDataUpgraded.append('DebutDate', this.upgraded.debutDate); 
            formDataUpgraded.append('StationId', this.upgraded.stationId.toString()); 
            formDataUpgraded.append('RankId', this.upgraded.rankId); 
            formDataUpgraded.append('CreatedBy', this.upgraded.createdBy); 
            formDataUpgraded.append('DateTimeCreated', this.upgraded.dateTimeCreated); 
            if (this.upgraded.profile_pic) {
              formDataUpgraded.append('ProfilePic', profilePicFile);
              formDataUpgraded.append('ProfileExt', profilePicExt);
            } else {
              
              console.log("No profile picture to upload.");
            }
    
            console.log('Final Home Address ID:', this.upgraded.homeAddressId);
            console.log('Final Work Address ID:', this.upgraded.workAddressId);
    
            const response = await this.policeaccountsService.postAccountUpgrade(formDataUpgraded).subscribe(
              () => {
                alert('Registration successful');
                setTimeout(() => {
                  window.location.reload();
                  this.router.navigate(['/login']);
                }, 3000)
                
               
              });
            
      
    
        } catch (error: any) {
            if (error.status === 0) {
                alert('Network error: Unable to reach the server. Please check your connection.');
                console.log('Error Status:', error.status);
            } else {
                alert(`Error Code: ${error.status}\nMessage: ${error.message}`);
                console.log('Error Message:', error);
            }
          
        } finally {
          console.log('Hiding loading indicator');
            // this.loading = false; 
        }

    }

    // async onSubmit() {

   
    //     this.errorMessage = ''; 
    //     Object.keys(this.addPoliceForm.controls).forEach(key => {
    //         const controlErrors = this.addPoliceForm.get(key)?.errors;
    //         if (controlErrors != null) {
    //             console.log('Key control: ' + key + ', errors: ', controlErrors);
    //         }
    //     });

    //     if (this.addPoliceForm.valid && this.passwordValid) {
    //         const accountData = this.addPoliceForm.value; 
    //         const ids = {   
    //             homeAddressId: 0,
    //             workAddressId: 0,
    //             personId: 0,
    //             policeId: 0,
    //             stationID: 0,
    //             rankId: 0,
    //             pfpId: 0,          }

    //         const homeLocationData: ILocation = {
    //             zipCode: accountData.zipCode,
    //             region: accountData.region,
    //             province: accountData.province,
    //             municipality: accountData.municipality,
    //             barangay: accountData.barangay,
    //             street: accountData.street,
    //             blockLotUnit: accountData.blockLotUnit,
    //         };
    //         // Submit home address 
    //         const homeLocationRequest: any = await this.submitLocation(homeLocationData)
    //         // assigning homeaddress ID
    //         ids.homeAddressId = homeLocationRequest.id
    //         ids.workAddressId = homeLocationRequest.id;

    //         if (!accountData.isSameAddress) {
    //             const { workRegion, workProvince, workMunicipality, workBarangay, workStreet, workBlockLotUnit, workZipCode } = accountData

    //             // submit work address if not the same address with home address
    //             const workLocationRequest: any = await this.submitLocation({
    //                 zipCode: workZipCode,
    //                 region: workRegion,
    //                 province: workProvince,
    //                 municipality: workMunicipality,
    //                 barangay: workBarangay,
    //                 street: workStreet,
    //                 blockLotUnit: workBlockLotUnit,
    //             })
    //             ids.workAddressId = workLocationRequest.id
    //         }

    //         const personData: IPerson = {
    //             firstname: accountData.firstName,
    //             middlename: accountData.middleName,
    //             lastname: accountData.lastName,
    //             sex: accountData.gender,
    //             birthdate: accountData.dateOfBirth,
    //             bioStatus: true,
    //             civilStatus: accountData.civilStatus,
    //         }
    //         //   submit person data request
    //         const personRequest: any = await this.submitPerson(personData);
    //         ids.personId = personRequest.id

    //         const accountReqData: IAccount = {
    //             ...personData,
    //             email: accountData.email,
    //             password: accountData.password,
    //             contactNum: accountData.contactNum,
    //             ...ids,
    //             // role: 'Admin',
    //             role: accountData.role,
    //             unit: accountData.unit,
    //             rankID: accountData.rank_id,          // Include rank_id
    //             stationID: accountData.stationId,      // Include stationId
    //             badgeNumber: accountData.badgeNumber,  // Include badgeNumber
    //             debutDate: accountData.debutDate,      // Include debutDate
    //             createdBy: accountData.createdBy,
    //             datetimeCreated: accountData.datetimeCreated,
    //             // profilePic: accountData.pro
                
    //         }

    //         const policeReqData: IPolice = {
    //             // ...personData,
    //             // email: accountData.email,
    //             // password: accountData.password,
    //             // contactNum: accountData.contactNum,
    //             // ...ids,
    //             // role: 'Police',
    //             role: 'Admin',
    //             unit: accountData.unit,
    //             rankID: accountData.rank_id,          // Include rank_id
    //             stationID: accountData.stationId,      // Include stationId
    //             badgeNumber: accountData.badgeNumber,  // Include badgeNumber
    //             debutDate: accountData.debutDate,      // Include debutDate
    //             createdBy: accountData.createdBy, 
    //             // datetimeCreated: this.datetimeCreated,
    //             datetimeCreated: accountData.datetimeCreated,
    //             // pfpId: accountData.pfpId,
                
    //         }


    //         const formData = new FormData();
    //         formData.append('firstName', accountData.firstName);
    //         formData.append('middleName', accountData.middleName);
    //         formData.append('lastName', accountData.lastName);
    //         formData.append('email', accountData.email);
    //         formData.append('password', accountData.password);
    //         formData.append('contactNum', accountData.contactNum);
    //         formData.append('civilStatus', accountData.civilStatus);
    //         formData.append('sex', accountData.gender);
    //         formData.append ('role', accountData.role); 
    //         formData.append('homeAddressId', ids.homeAddressId.toString());
    //         formData.append('workAddressId', ids.workAddressId.toString());
    //         formData.append('personId', ids.personId.toString());
    //         formData.append('unit', policeReqData.unit.toString());
    //         formData.append('badgeNumber', policeReqData.badgeNumber.toString());
    //         formData.append ('PoliceRole', policeReqData.role);
    //         formData.append('debutDate',policeReqData.debutDate);
    //         formData.append('stationId', accountData.stationId);
    //         formData.append('rankId', accountData.rank_id);
    //         formData.append('createdBy', policeReqData.createdBy.toString());
    //         formData.append('datetimeCreated', policeReqData.datetimeCreated);
    //         formData.append('personId', ids.personId.toString());

    //         if (this.profilePic) {
         
    //             if (typeof this.profilePic === 'string') {
    //                 formData.append('profile_pic', this.profilePic);
    //             }
               
    //             else if (this.profilePic instanceof ArrayBuffer) {
    //                 const blob = new Blob([this.profilePic]);
    //                 formData.append('profile_pic', blob, 'assets/ccpo_logo.jpg');
    //             }
    //         }

        

    //         const accountRequest: any = await this.submitAccount(formData);
    //                 if (accountRequest.code === 200) {
    //                     this.router.navigate(['/login']);
    //                 }
    //     } else {
    //         this.errorMessage = 'Please fill in all required fields correctly.'; // Set error message
    //         console.log('Form is invalid', this.addPoliceForm.errors); // Log form errors
    //     }
    // }

    // processProfilePic(): File | null {
   

    //     if (this.upgraded.profile_pic == null) {
    //       console.error('Profile picture is required');
        
    //     }
    // }

    isValidEmail(email: string): boolean {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailPattern.test(email);
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