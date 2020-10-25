import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { UtilModule } from 'src/app/util/util.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { HomePageRoutingModule } from './home-routing.module';
import { HomePage } from './home.page';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    UtilModule,
    SharedModule,
    HomePageRoutingModule,
  ],
  declarations: [
    HomePage,
  ]
})
export class HomePageModule {}
