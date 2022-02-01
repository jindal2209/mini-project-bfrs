import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../authentication/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class TokenInterceptorService implements HttpInterceptor {
  // tsa = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyIkX18iOnsiYWN0aXZlUGF0aHMiOnsicGF0aHMiOnsiZGF0ZSI6ImluaXQiLCJfaWQiOiJpbml0IiwibmFtZSI6ImluaXQiLCJlbWFpbCI6ImluaXQiLCJwYXNzd29yZCI6ImluaXQiLCJzdXBlclVzZXIiOiJpbml0IiwiX192IjoiaW5pdCJ9LCJzdGF0ZXMiOnsiaWdub3JlIjp7fSwiZGVmYXVsdCI6e30sImluaXQiOnsiX2lkIjp0cnVlLCJuYW1lIjp0cnVlLCJlbWFpbCI6dHJ1ZSwiZGF0ZSI6dHJ1ZSwicGFzc3dvcmQiOnRydWUsInN1cGVyVXNlciI6dHJ1ZSwiX192Ijp0cnVlfSwibW9kaWZ5Ijp7fSwicmVxdWlyZSI6e319LCJzdGF0ZU5hbWVzIjpbInJlcXVpcmUiLCJtb2RpZnkiLCJpbml0IiwiZGVmYXVsdCIsImlnbm9yZSJdfSwic3RyaWN0TW9kZSI6dHJ1ZSwic2tpcElkIjp0cnVlLCJzZWxlY3RlZCI6e30sImZpZWxkcyI6e30sImV4Y2x1ZGUiOm51bGwsIl9pZCI6IjYxZTcxNTFiMzQ2ZTVlZDczYTg5NzIwNiJ9LCIkaXNOZXciOmZhbHNlLCJfZG9jIjp7Il9pZCI6IjYxZTcxNTFiMzQ2ZTVlZDczYTg5NzIwNiIsIm5hbWUiOiJUZXN0IiwiZW1haWwiOiJhQGEuY29tIiwiZGF0ZSI6IjIwMjItMDEtMThUMTk6Mjk6MjIuNzM5WiIsInBhc3N3b3JkIjoiMTIzNDUiLCJzdXBlclVzZXIiOnRydWUsIl9fdiI6MH0sImlhdCI6MTY0MjU5NzUxN30.ZWHT5BxNasDfpit-120bXT5GiejpGApudIcNNtRy4eQ"
  constructor(private _injector: Injector) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let _authService = this._injector.get(AuthenticationService)
    let tokenizedReq = req.clone({
      setHeaders: {
        // Authorization: `Bearer ${this.tsa}`
        Authorization: `Bearer ${_authService.getToken()}`
      }
    })
    return next.handle(tokenizedReq);
  }
}
