import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { MainComponent } from "./components/main/main.component";

import { DashboardComponent } from "./dashboard.component";

const dashboardRoutes: Routes = [
  {
    path: '', component: DashboardComponent, children: [
      {
        path: '', component: MainComponent,
      },
      {
        path: 'employees', loadChildren: () => import('./modules/employees/employees.module').then(m => m.EmployeesModule),
      },
      {
        path: 'attendance', loadChildren: () => import('./modules/attendance/attendance.module').then(m => m.AttendanceModule),
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(dashboardRoutes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }