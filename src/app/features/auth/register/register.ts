import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { RegisterCredentials } from '../../../shared/models/RegisterCredentials';
import { RegisterHttp } from '../../../shared/services/register-http';
import { AuthService } from '../../../shared/services/auth-service';
import { HttpStatusCode } from '@angular/common/http';
import * as jwt_decode from 'jwt-decode';
import { IJwtCustomPayload } from '../../../shared/models/IJwtCustomPayload';

@Component({
  selector: 'app-register',
  imports: [CommonModule, FormsModule, RouterLink, ReactiveFormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  showPassword = false;

  registerForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    surname: new FormControl('', [Validators.required]),
    middlename: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
    phone: new FormControl('', [Validators.required]),
  });

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  constructor(private http: RegisterHttp, private auth: AuthService, private router: Router) {}

  registerBackend() {

    const name = this.registerForm.value.name!;
    const surname = this.registerForm.value.surname!;
    const middlename = this.registerForm.value.middlename!;
    const email = this.registerForm.value.email!;
    const password = this.registerForm.value.password!;
    const phone = this.registerForm.value.phone!;

    this.http.HttpPostRegister({ name, surname, middlename, email, password, phone }).subscribe({
      next: (response) => {
        switch (response.status) {
          case HttpStatusCode.Ok:
            // console.log('Register successful, proceded to Login');
            const token = response.body?.token;

            const payload = jwt_decode.jwtDecode<IJwtCustomPayload>(token);
            this.auth.SetJwtInfo(true, token, payload.email);

            // Stampo i claims nel console
            // console.log('Decoded JWT payload:', payload);
            // console.log('Customer ID from token:', payload.CustomId);
            // console.log('Email from token:', payload.email);
            // console.log('Role from token:', payload.role);
            // console.log('Expiration from token:', payload.exp);
            // console.log('Issuer from token:', payload.iss);
            // console.log('Audience from token:', payload.aud);

            this.router.navigate(['/profile']);
            break;

          case HttpStatusCode.Conflict:
            alert('Email is already registered');
            break;

          default:
            console.error('Registration failed:', response.status);
            break;
        }
      },
      error: (err) => {
        console.error('Registration failed:', err);
      },
    });
  }
}
