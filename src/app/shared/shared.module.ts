import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { UtilModule } from 'src/app/util/util.module';
import { ProjectComponent } from './components/project/project.component';
import { ProjectEditModalComponent } from './components/project-edit/project-edit.modal';
import { TaskEditModalComponent } from './components/task-edit/task-edit.modal';

@NgModule({
  declarations: [
    ProjectComponent,
    ProjectEditModalComponent,
    TaskEditModalComponent,
  ],
  entryComponents: [],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    UtilModule,
  ],
  exports: [
    ProjectComponent,
    ProjectEditModalComponent,
    TaskEditModalComponent,
  ],
})
export class SharedModule {}