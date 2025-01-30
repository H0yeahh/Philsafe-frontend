import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler } from '@angular/common/http';
import { AuthService } from './auth.service';
import { LoginService } from './login.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    // const token = this.authService.getAuthorizationToken();

    // if (token) {
      
    //   const clonedRequest = req.clone({
    //     setHeaders: {
    //       Authorization: `Bearer ${token}`,
    //     },
    //   });
    //   console.log('Auth', clonedRequest)
    //   return next.handle(clonedRequest);
    // }


    return next.handle(req);
  }
}
