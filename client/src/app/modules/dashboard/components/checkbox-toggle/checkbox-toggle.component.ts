import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-checkbox-toggle',
  templateUrl: './checkbox-toggle.component.html',
  styleUrls: ['./checkbox-toggle.component.css']
})
export class CheckboxToggleComponent implements OnInit {
  @Input() id: string = '';
  @Input() check: boolean = true;
  constructor() { }

  ngOnInit(): void {
  }

}
