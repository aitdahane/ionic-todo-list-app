import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'mo-checkbox',
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.scss'],
})
export class CheckboxComponent implements OnInit {
  @Input() checked: boolean = false;
  @Output() checkedChange: EventEmitter<boolean> = new EventEmitter<boolean>(false);

  constructor() { }

  ngOnInit() {}

  public changeChecked(): void {
    this.checked = !this.checked;
    this.checkedChange.emit(this.checked);
  }

}
