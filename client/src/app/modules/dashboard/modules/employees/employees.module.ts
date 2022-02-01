import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmployeesComponent } from './employees.component';
import { EmployeesRoutingModule } from './employees-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { EmployeeComponent } from './components/employee/employee.component';
import { MainComponent } from './components/main/main.component';
import { CheckboxToggleComponent } from '../../components/checkbox-toggle/checkbox-toggle.component';

@NgModule({
  declarations: [
    EmployeesComponent,
    EmployeeComponent,
    MainComponent,
    CheckboxToggleComponent
  ],
  imports: [
    CommonModule,
    EmployeesRoutingModule,
    ReactiveFormsModule
  ],
})
export class EmployeesModule { }