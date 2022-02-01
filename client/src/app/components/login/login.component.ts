import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(
    private _fb: FormBuilder,
    private _authService: AuthenticationService
  ) { }

  loginForm: FormGroup;

  ngOnInit(): void {
    this.loginForm = this._fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(5)]]
    })
  }

  handleLogin() {
    this._authService.showLoader();
    this._authService.login(this.loginForm.value)
      .subscribe((res) => {
        this._authService.setToken(res['token']);
        localStorage.setItem('name', res['name']);
        this._authService.hideLoader();
      }, (err) => {
        console.log(err)
      })
  }
}
