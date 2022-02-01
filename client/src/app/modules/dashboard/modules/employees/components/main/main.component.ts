import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';

@Component({
  selector: 'app-employees-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit, OnDestroy {
  constructor(
    private _authService: AuthenticationService
  ) { }

  employee_list: any = [];
  employees_stats: any = {};
  employee_data_sub: Subscription;

  ngOnInit(): void {
    this.employee_data_sub = this._authService.employeeUpdated.subscribe(() => {
      this.getEmployees();
    })
    this.getEmployees();
  }

  getEmployees() {
    this._authService.showLoader()
    this._authService.getEmployees().subscribe((res) => {
      this.employee_list = res['data'];
      this.employees_stats = res['stats'];
      this._authService.hideLoader()
    })
  }

  handleAttendance(value: boolean, emp_id: string) {
    this._authService.showLoader()
    this._authService.handleAttendance(value, emp_id).subscribe(() => {
      this._authService.hideLoader()
    })
  }

  ngOnDestroy(): void {
    this.employee_data_sub.unsubscribe();
  }
}