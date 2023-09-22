import { Injectable } from '@angular/core';
import { RegisterEndUserRequestDTO } from '../models/enduser-register-request.model';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http:HttpClient) { }

  registerUser (model: RegisterEndUserRequestDTO): Observable<void> {
    return this.http.post<void>(`${environment.apiBaseUrl}/auth/register/`, model);
  }
}
