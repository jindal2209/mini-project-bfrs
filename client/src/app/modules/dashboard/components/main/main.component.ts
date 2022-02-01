import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  constructor(private _authService: AuthenticationService) { }
  total_emp: String;
  present_emp: String;
  absent_emp: String;
  overall_data: any = [];

  ngOnInit(): void {
    this._authService.showLoader();
    this._authService.getOverallAttendanceData()
      .subscribe((res) => {
        this.overall_data = res['attendance_data'];
        this.total_emp = res['total_emp'];
        this.present_emp = res['present_emp'];
        this.absent_emp = res['absent_emp'];
        this._authService.hideLoader();
      })
  }
}
