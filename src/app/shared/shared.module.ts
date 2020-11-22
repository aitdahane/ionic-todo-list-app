import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { UtilModule } from 'src/app/util/util.module';
import { ProjectComponent } from './components/project/project.component';
import { ProjectEditModalComponent } from './components/project-edit/project-edit.modal';
import { TaskEditModalComponent } from './components/task-edit/task-edit.modal';
import { PopoverComponent } from './components/popover/popover.component';
import { IconPickerComponent } from './components/icon-picker/icon-picker.component';
import { TaskIsDonePipe } from './pipes/task.pipe';

@NgModule({
  declarations: [
    ProjectComponent,
    ProjectEditModalComponent,
    TaskEditModalComponent,
    PopoverComponent,
    IconPickerComponent,
    TaskIsDonePipe,
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
    PopoverComponent,
    IconPickerComponent,
    TaskIsDonePipe,
  ],
})
export class SharedModule {}