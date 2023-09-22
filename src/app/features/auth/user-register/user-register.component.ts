import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Observable, Subscription, catchError, of, throwError } from 'rxjs';
import { AbstractControl, FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, Validator, ValidatorFn, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { RegisterEndUserRequestDTO } from '../models/enduser-register-request.model';
import { ConfirmedValidator } from 'src/app/utils/confirmed.validator';
import { Router } from '@angular/router';


@Component({
  selector: 'app-user-register',
  templateUrl: './user-register.component.html',
  styleUrls: ['./user-register.component.css']
})
export class UserRegisterComponent implements OnInit, OnDestroy  {

  private registerUserSubscription?: Subscription;

  registerForm: FormGroup = new FormGroup({});
  validationErrors: string[] = [];

  constructor(private authService:AuthService, private formBuilder: FormBuilder, private router:Router) { }
  
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

      this.registerUserSubscription = this.authService.registerUser(user).subscribe({ 
        next: () => this.router.navigateByUrl('/'),
        error: error => {
          this.validationErrors = error;
        } 
    } );

    
      
    } 
  }

 

get f(){
  return this.registerForm.controls;
}

  ngOnDestroy(): void {
    this.registerUserSubscription?.unsubscribe();
  }


}
