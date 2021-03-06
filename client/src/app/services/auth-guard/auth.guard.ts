import { Injectable } from '@angular/core';
import { CanActivate, Router, } from '@angular/router';
import { AuthenticationService } from '../authentication/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private _router: Router,
    private _authService: AuthenticationService
  ) { }

  canActivate(): boolean {
    if (!!this._authService.getToken()) {
      return true;
    }
    else {
      this._router.navigate(['/login'])
      return false;
    }
  }
}
