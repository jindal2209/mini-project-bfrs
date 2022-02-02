import { Component, OnInit } from "@angular/core";
import { AuthenticationService } from "src/app/services/authentication/authentication.service";

@Component({
  selector: 'app-sahboard-attendance',
  templateUrl: './attendance.component.html',
  styleUrls: ['./attendance.component.css']
})
export class AttendanceComponent implements OnInit {
  constructor(private _authService: AuthenticationService) { }
  total_emp: String;
  present_emp: String;
  absent_emp: String;
  curr_date: Date;
  present_employee_list: any = [];
  absent_employee_list: any = [];
  can_go_next: boolean = false;

  ngOnInit(): void {
    this.curr_date = new Date(Date.now())
    this.curr_date.setHours(0, 0, 0, 0);
    this.getData();
  }

  getData() {
    this._authService.showLoader();
    this._authService.getAttendanceSummaryOnDate(this.curr_date)
      .subscribe((res) => {
        this.total_emp = res['total_emp'];
        this.present_emp = res['present_emp'];
        this.absent_emp = res['absent_emp'];
        this.present_employee_list = res['present_emp_list'];
        this.absent_employee_list = res['absent_emp_list'];
        this._authService.hideLoader();
      })
  }

  addDays(date: any, days: any) {
    date = new Date(date.valueOf())
    date.setDate(date.getDate() + days)
    return date
  }

  handlePrevious() {
    this.curr_date = this.addDays(this.curr_date, -1);
    this.can_go_next = true;
    this.getData();
  }

  handleNext() {
    this.curr_date = this.addDays(this.curr_date, 1);
    let today = new Date(Date.now());
    today.setHours(0, 0, 0, 0);
    this.can_go_next = this.curr_date < today;
    this.getData();
  }

  handleAttendance(value: boolean, emp_id: string) {
    this._authService.showLoader()
    this._authService.handleAttendance(value, emp_id, this.curr_date).subscribe(() => {
      this._authService.hideLoader()
      this.getData();
    })
  }
  handleAttendanceFile() {
    this._authService.showLoader()
    this._authService.handleAttendanceFile().subscribe(() => {
      this._authService.hideLoader()
      this.getData();
    })
  }

}