import { Component, Input } from '@angular/core';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-popover',
  templateUrl: './popover.component.html',
})
export class PopoverComponent {
  @Input() actions: any[];

  constructor(private popoverController: PopoverController) {}

  public handleSelectedAction(action: any): void {
    action.onClick();
    this.popoverController.dismiss();
  }
}