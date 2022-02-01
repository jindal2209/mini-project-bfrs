import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.css']
})
export class LoaderComponent implements OnInit {
  display: boolean = false;
  constructor(private _authService: AuthenticationService) { }

  ngOnInit(): void {
    this._authService.displayLoader.subscribe((show: boolean) => {
      this.display = show
    })
  }

}
