import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthenticationService } from '../authentication/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class RedirectGuard implements CanActivate {
  constructor(
    private _authService: AuthenticationService,
    private _router: Router
  ) { }

  canActivate(): boolean {
    if (!!this._authService.getToken()) {
      this._router.navigate(['/dashboard'])
      return false;
    }
    return true;
  }

}
