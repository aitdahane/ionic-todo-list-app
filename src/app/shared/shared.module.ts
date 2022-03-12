import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TaskListComponent } from './components/task-list/task-list.component';
import { ProjectEditModalComponent } from './components/project-edit/project-edit.modal';
import { ProjectImagePickerModalComponent } from './components/project-image-picker/project-image-picker.modal';
import { TaskEditModalComponent } from './components/task-edit/task-edit.modal';
import { PopoverComponent } from './components/popover/popover.component';
import { IconPickerComponent } from './components/icon-picker/icon-picker.component';
import { ProjectImageComponent } from './components/project-image/project-image.component';
import { TaskHeightSizePipe, TaskIsDonePipe, TaskTopPositionPipe } from './pipes/task.pipe';
import { ProjectImageUrlPipe } from './pipes/project.pipe';
import { CheckboxComponent } from './components/checkbox/checkbox.component';
import { DateFormatPipe } from './pipes/date.pipe';
import { CalendarTaskComponent } from './components/calendar-task/calendar-task.component';
@NgModule({
  declarations: [
    CheckboxComponent,
    TaskListComponent,
    ProjectEditModalComponent,
    TaskEditModalComponent,
    PopoverComponent,
    IconPickerComponent,
    TaskIsDonePipe,
    ProjectImageUrlPipe,
    DateFormatPipe,
    TaskTopPositionPipe,
    TaskHeightSizePipe,
    ProjectImagePickerModalComponent,
    ProjectImageComponent,
    CalendarTaskComponent,
  ],
  entryComponents: [],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, IonicModule],
  exports: [
    TaskListComponent,
    ProjectEditModalComponent,
    TaskEditModalComponent,
    PopoverComponent,
    IconPickerComponent,
    ProjectImagePickerModalComponent,
    TaskIsDonePipe,
    TaskTopPositionPipe,
    DateFormatPipe,
    TaskHeightSizePipe,
    ProjectImageUrlPipe,
    ProjectImageComponent,
    CalendarTaskComponent,
  ],
})
export class SharedModule {}
