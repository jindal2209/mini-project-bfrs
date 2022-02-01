import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';

@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styles: ['']
})
export class EmployeesComponent implements OnInit {
  constructor(
    private fb: FormBuilder,
    private _authService: AuthenticationService,
  ) { }

  employeeRegisterForm: FormGroup;

  ngOnInit(): void {
    this.employeeRegisterForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      employee_type: ['Regular', [Validators.required]]
    })
  }

  handleEmployeeRegister() {
    this._authService.showLoader();
    this._authService.registerEmployee(this.employeeRegisterForm.value)
      .subscribe((res) => {
        this._authService.hideLoader();
        alert("Employee added");
        this.employeeRegisterForm.reset();
      }, (err) => {
        console.log('error', err);
      })
  }

  handleReset() {
    this.employeeRegisterForm.reset();
  }
}