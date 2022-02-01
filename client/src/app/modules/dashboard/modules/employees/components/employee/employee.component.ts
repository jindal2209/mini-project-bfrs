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
  is_present: boolean = false;
  calendar_attendance_data: {} = {};

  // calendar
  fulldate: Date;
  year: number;
  month: number;
  date: Number;
  days: number[] = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  months: string[] = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  dayn: number;
  arr: any[] = [];

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.id = params['id'];
    })
    // calendar
    this.fulldate = new Date(Date.now());
    this.year = this.fulldate.getFullYear();
    this.month = this.fulldate.getMonth();
    this.date = this.fulldate.getDate();
    this.refreshData();
  }

  refreshData() {
    this.getEmployee();
  }

  getEmployee() {
    this._authService.showLoader();
    this._authService.getEmployee(this.id).subscribe((res) => {
      this.emp_data = res['data'];
      this.is_present = res['present'];

      for (let data of res['attendance_data']) {
        let da = new Date(data.date);
        let [tempDate, tempMonth, tempYear] = [da.getDate(), da.getMonth(), da.getFullYear()]
        if (!(tempYear in this.calendar_attendance_data)) {
          this.calendar_attendance_data[tempYear] = {};
        }
        if (!(tempMonth in this.calendar_attendance_data[tempYear])) {
          this.calendar_attendance_data[tempYear][tempMonth] = {};
        }
        this.calendar_attendance_data[tempYear][tempMonth][tempDate] = data['is_present'] ? 'text-success bg-green' : 'text-danger bg-red'
      }

      this.renderCalendar();
      this._authService.hideLoader();
    })
  }

  handleAttendance(value: boolean, emp_id: string) {
    this._authService.showLoader()
    this._authService.handleAttendance(value, emp_id).subscribe(() => {
      this.getEmployee();
    })
  }

  // calendar
  renderCalendar() {
    this.arr = [];

    this.dayn = this.dayNumber(1, this.month + 1, this.year) - 1;
    if (this.dayn == -1) {
      this.dayn = 6;
    }
    for (let i = 1; i <= this.dayn; i++) {
      this.arr.push({ 'date': '', 'background': '' });
    }
    let total_days = this.days[this.month];
    if (this.month == 1) {
      if (this.isLeapYear(this.year)) {
        total_days = 29;
      }
    }
    for (let i = 1; i <= total_days; i++) {
      let bg = this.calendar_attendance_data[this.year]
      if (bg !== undefined) {
        bg = bg[this.month];
      }
      this.arr.push({ 'date': i, 'background': bg === undefined ? 'bg-blue' : bg[i] === undefined ? 'bg-blue' : bg[i] });
    }
  }

  dayNumber(day: number, month: number, year: number): number {
    let t: number[] = [0, 3, 2, 5, 0, 3, 5, 1, 4, 6, 2, 4];
    if (month < 3)
      year = year - 1;
    return (year + year / 4 - year / 100 + year / 400 + t[month - 1] + day) % 7;
  }

  isLeapYear(year: number): boolean {
    return (((year % 4 == 0) && (year % 100) != 0) || (year % 400 == 0));
  }

  handleMonth(action: number) {
    this.month += action;
    if (this.month === -1) {
      // previous year
      this.year -= 1;
      this.month = 11;
    }
    else if (this.month === 12) {
      // next year
      this.year += 1;
      this.month = 0;
    }
    this.renderCalendar();
  }
}
