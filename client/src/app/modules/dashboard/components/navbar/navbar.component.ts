import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  isAuthenticated: boolean = false;
  name: string;
  constructor(private _authService: AuthenticationService) { }

  ngOnInit(): void {
    // this._authService.isAuthenticated.subscribe((status) => {
    //   this.isAuthenticated = status;
    // })
    // this.isAuthenticated = !!this._authService.getToken();
    this.name = localStorage.getItem('name')
  }

  handleLogout() {
    this._authService.clearStorage();
  }
}
