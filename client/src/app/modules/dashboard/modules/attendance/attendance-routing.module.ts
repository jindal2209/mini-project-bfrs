import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AttendanceComponent } from "./attendance.component";

const attendanceRoutes: Routes = [
  { path: '', component: AttendanceComponent }
]

@NgModule({
  imports: [RouterModule.forChild(attendanceRoutes)],
  exports: [RouterModule]
})
export class AttendanceRoutingModule {

}