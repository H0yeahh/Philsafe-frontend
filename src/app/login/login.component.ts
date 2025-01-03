import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth.service'; // Import the service
import { Router } from '@angular/router';
import {Account} from '../../data/Account/Account';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string = '';
  accountData: any;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private authService: AuthService
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

//   submitLogin(loginData: {email: string, password: string}) :Promise<Account> {
//     return new Promise((resolve, reject) => {
//         this.authService.login({...loginData, SignInType:"Email"}).subscribe(data => {
//             console.log(data)
//             resolve(data)
//         });
//     })
// }
submitLogin(loginData: { email: string; password: string }): Promise<Account> {
  return new Promise((resolve, reject) => {
    this.authService.login({ ...loginData, SignInType: "Email" }).subscribe(
      (data) => {
        console.log(data);

      //   if (data && data.role) {
      //     console.log('Role before storing:', data.role); // Debug log

      //     // Check the role
      //     if (data.role === 'Police') {
      //       localStorage.setItem('userData', JSON.stringify(data));
      //       localStorage.setItem('role', data.role);
      //       console.log('Role stored in login:', localStorage.getItem('role')); 
      //       console.log('Data stored as userData:', localStorage.getItem('userData'));

      //       alert('Login successful');
      //       resolve(data);
      //       this.accountData = data;
         
      //     } else if (data.role === 'Admin') {
      //       localStorage.setItem('userData', JSON.stringify(data));
      //       localStorage.setItem('role', data.role);
      //       console.log('Role stored in login:', localStorage.getItem('role')); 
      //       console.log('Data stored as userData:', localStorage.getItem('userData'));

      //       alert('Login successful');
      //       resolve(data);
      //       this.accountData = data;
      //     }
            
      //   } else {
      //     console.error('Unauthorized: Role is not Police');
      //     alert('Login data is invalid');
      //     reject(new Error('Login data is invalid'));
      //   }
      // },
      if (data && data.role) {
        const validRoles = ['Police', 'Admin'];
        if (validRoles.includes(data.role)) {
          localStorage.setItem('userData', JSON.stringify(data));
          localStorage.setItem('role', data.role);
          console.log('Role stored in login:', localStorage.getItem('role')); 
          console.log('Data stored as userData:', localStorage.getItem('userData'));
      
          alert('Login successful');
          resolve(data);
          this.accountData = data;
        } else {
          console.error(`Unauthorized: Role is not valid (${data.role})`);
          alert('Invalid role detected. Login failed.');
          reject(new Error('Invalid role'));
        }
      } else {
        console.error('Unauthorized: Role is not provided');
        alert('Login data is invalid');
        reject(new Error('Login data is invalid'));
      }
    },      
      (error) => {
        console.error('Login failed:', error);
        reject(error);
      }
    );
  });
}


//adding this new function for reggex part of logging in
identifySignInType(input: string): string {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const contactNumberRegex = /^(09|\+639|639)\d{9}$/;

  if (emailRegex.test(input)) {
    return 'Email';
  } else if (contactNumberRegex.test(input)) {
    return 'Contact_Number';
  } else {
    return 'Invalid';
  }
}

// original code for async onSubmit
//   async onSubmit() {
//     if (this.loginForm.valid) {
//       const{username,password}=this.loginForm.value
//       const loginReq = await this.submitLogin({email:username, password})
//       console.log(loginReq)
//       this.authService.setAuthentication({token:'zdfdfzfdf', role:'admin'})
//     }
//   }
// }

// new code for async onSubmit
// async onSubmit() {
//   if (this.loginForm.valid) {
//     const { username, password } = this.loginForm.value;
//     const signInType = this.identifySignInType(username); // Identify sign-in type
//     const loginReq: Account = await this.submitLogin({ email: username, password });
//     console.log(loginReq);
//     this.authService.setAuthentication({ token: 'zdfdfzfd', role: 'admin' });
//     if(loginReq.role==='Admin'){
//       this.router.navigate(['/manage-station'])
//     }
//   }
// }
// }


async onSubmit() {
  if (this.loginForm.valid) {
    const { username, password } = this.loginForm.value;
    const signInType = this.identifySignInType(username); // Identify sign-in type
    // const loginReq: Account = await this.submitLogin({ email: username, password });
    // console.log(loginReq);
    await this.submitLogin({ email: username, password });
    // this.authService.setAuthentication({ token: 'zdfdfzfdf', role: 'admin' });
    this.authService.setAuthentication({ token: 'zdfdfzfdf', role: 'Admin' });
    // if(loginReq.role==='Admin'){
    //   this.router.navigate(['/manage-station'])
    // } else if(loginReq.role==='Chief'){
    //   this.router.navigate(['/station-case-queue'])
    // }
    if (this.accountData.role === 'Admin') {
      this.router.navigate(['/dashboard']);
      console.log("Admin logs in");
    } else if (this.accountData.role === 'Chief') {
      this.router.navigate(['/station-case-queue']);
    } else if (this.accountData
      .role === 'Police') {
      this.router.navigate(['/station-dashboard']);
      console.log("Police logs in")
    }
    
  }
}
}
