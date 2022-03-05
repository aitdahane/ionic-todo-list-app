import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'app-checkbox',
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.scss'],
})
export class CheckboxComponent {
  @Input() checked = false;
  @Output() checkedChange: EventEmitter<boolean> = new EventEmitter<boolean>(false);

  public changeChecked($event): void {
    $event.stopPropagation();
    this.checked = !this.checked;
    this.checkedChange.emit(this.checked);
  }

}
