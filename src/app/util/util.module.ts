import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { CheckboxComponent } from './checkbox/checkbox.component';



@NgModule({
  declarations: [
    CheckboxComponent,
  ],
  imports: [
    CommonModule,
    IonicModule,
  ],
  exports: [
    CheckboxComponent,
  ]
})
export class UtilModule { }
