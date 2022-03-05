import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { SharedModule } from 'src/app/shared/shared.module';
import { ProjectPageRoutingModule } from './project-routing.module';
import { ProjectPage } from './project.page';

@NgModule({
  imports: [CommonModule, IonicModule, SharedModule, ProjectPageRoutingModule],
  declarations: [ProjectPage],
})
export class ProjectPageModule {}
