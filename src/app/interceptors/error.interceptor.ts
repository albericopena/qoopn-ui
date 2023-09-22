import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, catchError } from 'rxjs';
import { NavigationExtras, Router } from '@angular/router';
import { SnackBarService } from '../core/services/snack-bar.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(private router: Router, private snackBar:SnackBarService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error){
          switch (error.status) {
              case 400: //HTTP 400 Bad Request
                if(error.error.errors) {
                  const modelStatesErrors = [];
                  for (const key in error.error.errors) {
                    if (error.error.errors[key]){
                      modelStatesErrors.push(error.error.errors[key]);
                    }
                  }
                  throw modelStatesErrors.flat();
                } else {
                  this.snackBar.openSnackBar(error.error,'Close'); 
                }
                break;
              case 401: //HTTP 401 Unauthorized
                this.snackBar.openSnackBar("Unauthorized", 'Close');
                break;
              case 404: //HTTP 404 Not Found
                this.router.navigateByUrl('not-found');
                break;
              case 500: //HTTP 500 Internal Server Error
                const navigationExtras: NavigationExtras = {state: {error:error}};
                this.router.navigateByUrl('/server-error', navigationExtras);
                break;
              default: //None of above
                this.snackBar.openSnackBar("Something unexpected went wrong", "Close");
                console.log(error);
                break;
          }
        }
        throw error;
      })
    );
  }
}
