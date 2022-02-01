import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';

@Component({
  selector: 'app-employees-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css']
})
export class EmployeeComponent implements OnInit {

  constructor(private route: ActivatedRoute, private _authService: AuthenticationService) { }
  id: string;
  emp_data: any = {};
  attendance_data: any = [];
  is_present: boolean = false;

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.id = params['id'];
    })
    this.getEmployee();
  }

  getEmployee() {
    this._authService.showLoader();
    this._authService.getEmployee(this.id).subscribe((res) => {
      this.emp_data = res['data'];
      this.is_present = res['present'];
      this.attendance_data = res['attendance_data']
      this._authService.hideLoader();
    })
  }

  handleAttendance(value: boolean, emp_id: string) {
    this._authService.showLoader()
    this._authService.handleAttendance(value, emp_id).subscribe(() => {
      this.getEmployee();
    })
  }
}
