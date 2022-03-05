import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-icon-picker',
  templateUrl: './icon-picker.component.html',
  styleUrls: ['./icon-picker.component.scss'],
})
export class IconPickerComponent implements OnInit {
  @Input() public selectedIconName: string;
  @Output() public selectedIconNameChange: EventEmitter<string> =
    new EventEmitter<string>();
  public iconNames: string[];

  constructor() {}

  ngOnInit() {
    this.iconNames = [
      'shirt-outline',
      'airplane-outline',
      'game-controller-outline',
      'pizza-outline',
      'cart-outline',
      'logo-javascript',
      'calendar-outline',
      'book-outline',
      'laptop-outline',
      'film-outline',
      'barbell-outline',
      'library-outline',
      'wallet-outline',
      'briefcase-outline',
      'trending-up-outline',
      'clipboard-outline',
      'checkbox-outline',
    ];
  }

  public onSelectIcon(iconName: string) {
    this.selectedIconName = iconName;
    this.selectedIconNameChange.emit(iconName);
  }
}
