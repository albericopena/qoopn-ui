import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Observable, Subscription, catchError, of, throwError } from 'rxjs';
import { AbstractControl, FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, Validator, ValidatorFn, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { RegisterEndUserRequestDTO } from '../models/enduser-register-request.model';
import { ConfirmedValidator } from 'src/app/utils/confirmed.validator';


@Component({
  selector: 'app-user-register',
  templateUrl: './user-register.component.html',
  styleUrls: ['./user-register.component.css']
})
export class UserRegisterComponent implements OnInit, OnDestroy  {

  private registerUserSubscription?: Subscription;

  registerForm: FormGroup = new FormGroup({});

  constructor(private authService:AuthService, private formBuilder: FormBuilder) { }
  
  ngOnInit(): void {
    this.initForm();
  }

  initForm(){
    this.registerForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(8)]]
    } , { 
        validator: ConfirmedValidator('password', 'confirmPassword')
    });
  }

  onFormSubmit() {
    if (this.registerForm.valid) {
      
      //Create User
      const user: RegisterEndUserRequestDTO = {
        email: this.f['email'].value!,  
        password: this.f['password'].value!
      }

      this.registerUserSubscription = this.authService.registerUser(user).pipe(
        catchError(this.handleError)
      ).subscribe({ 
        error: e => console.log('HTTP Error', e)
    } );
      
    } 
  }

  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
    // A client-side or network error occurred. Handle it accordingly.
    //console.error('An error occurred:', error.error);
    this.registerForm.patchValue({
      email: "An error occurred. Try again later!"
    })
  } else {
    // The backend returned an unsuccessful response code.
    // The response body may contain clues as to what went wrong.
    console.error(`Backend returned code ${error.status}, body was: `, error.error);
    
      // this.model.email = 'ERRO';
  }
  // Return an observable with a user-facing error message.
  return throwError(() => new Error('Something bad happened; please try again later.'));
}

get f(){
  return this.registerForm.controls;
}

  ngOnDestroy(): void {
    this.registerUserSubscription?.unsubscribe();
  }


}
