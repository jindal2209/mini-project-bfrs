import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { tap } from 'rxjs/operators'

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  isAuthenticated = new Subject<boolean>();
  employeeUpdated = new Subject<void>();
  displayLoader = new Subject<boolean>();

  constructor(
    private _http: HttpClient,
    private _router: Router
  ) { }

  showLoader() {
    this.displayLoader.next(true);
  }

  hideLoader() {
    this.displayLoader.next(false);
  }

  login(data: any) {
    return this._http.post<any>('http://localhost:3000/login', data)
  }

  register(data: any) {
    return this._http.post<any>('http://localhost:3000/register-user', data)
  }

  registerAdmin(data: any) {
    return this._http.post<any>('http://localhost:3000/register-admin', data)
  }

  registerEmployee(data: any) {
    return this._http.post<any>('http://localhost:3000/register-employee', data)
      .pipe(tap(() => {
        this.employeeUpdated.next();
      }))
  }

  getEmployees() {
    return this._http.get("http://localhost:3000/get-employees")
  }

  getEmployee(id: string) {
    return this._http.get(`http://localhost:3000/get-employee/${id}`)
  }

  getDashboardData() {
    // return this._http.get('http://localhost:3000/employee-attendance-list')
    return this._http.get('http://localhost:3000/get-dashboard-data')
  }

  getAttendanceSummaryOnDate(date: Date) {
    return this._http.get(`http://localhost:3000/attendance-summary?date=${date}`)
  }

  getOverallAttendanceData() {
    return this._http.get('http://localhost:3000/get-overall-data')
  }

  handleAttendance(action: boolean, emp_id: string, date?: Date) {
    if (date === undefined)
      date = null;
    return this._http.get(`http://localhost:3000/change-employee-attendance?emp_id=${emp_id}&action=${action}&date=${date}`)
      .pipe(tap(() => {
        this.employeeUpdated.next();
      }))
  }
  handleAttendanceFile() {
    return this._http.get(`http://localhost:3000/upload-employee-attendance`)
      .pipe(tap(() => {
        this.employeeUpdated.next();
      }))
  }

  setToken(token: string) {
    localStorage.setItem('token', token);
    this._router.navigate(['dashboard']);
  }

  getToken(): string {
    if (localStorage.getItem('token')) {
      this.isAuthenticated.next(true);
      return localStorage.getItem('token');
    }
    else {
      this.isAuthenticated.next(false);
      return null;
    }
  }

  clearStorage() {
    localStorage.clear();
    this.isAuthenticated.next(false);
    this._router.navigate(['/login']);
  }
}
