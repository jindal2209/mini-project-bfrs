import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { EmployeeComponent } from "./components/employee/employee.component";
import { MainComponent } from "./components/main/main.component";
import { EmployeesComponent } from "./employees.component";

const employeesRoutes: Routes = [
  {
    path: '', component: EmployeesComponent, children: [
      { path: '', component: MainComponent },
      { path: ':id', component: EmployeeComponent }
    ]
  },

];

@NgModule({
  imports: [RouterModule.forChild(employeesRoutes)],
  exports: [RouterModule]
})
export class EmployeesRoutingModule { }