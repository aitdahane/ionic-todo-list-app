import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { UtilModule } from 'src/app/util/util.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { ProjectPageRoutingModule } from './project-routing.module';
import { ProjectPage } from './project.page';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    UtilModule,
    SharedModule,
    ProjectPageRoutingModule,
  ],
  declarations: [
    ProjectPage,
  ]
})
export class ProjectPageModule {}
