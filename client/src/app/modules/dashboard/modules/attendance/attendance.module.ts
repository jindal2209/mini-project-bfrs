import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { AttendanceRoutingModule } from "./attendance-routing.module";
import { AttendanceComponent } from "./attendance.component";

@NgModule({
  declarations: [
    AttendanceComponent
  ],
  imports: [
    CommonModule,
    AttendanceRoutingModule
  ]
})
export class AttendanceModule {

}