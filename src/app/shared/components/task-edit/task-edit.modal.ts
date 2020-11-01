import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { take } from 'rxjs/operators';
import { TaskService } from 'src/app/topics/task/task.service';
import { ITask } from 'src/app/topics/task/task.model';

@Component({
  selector: 'app-task-edit',
  templateUrl: './task-edit.modal.html',
  styleUrls: ['./task-edit.modal.scss'],
})
export class TaskEditModalComponent implements OnInit {
  @Input() projectId: number;
  @Input() task: ITask;
  public fg: FormGroup;

  constructor(
    private modalController: ModalController,
    private taskService: TaskService,  
  ) { }

  ngOnInit() {
    this.initForm();
  }

  public initForm(): void {
    this.fg = new FormGroup({
      title: new FormControl(null, Validators.required),
      note: new FormControl(null),
    });
    const formData = this.task ? {
      title: this.task.title,
      note: this.task.note,
    } : null;
    if (formData) {
      this.fg.patchValue(formData);
    }
  }

  public dismiss(): void {
    this.modalController.dismiss({ dismissed: true });
  }

  public save(): void {
    if (this.task) {
      this.update();
    } else {
      this.create();
    }
  }

  public update(): void {
    const params = {
      id: this.task.id,
      title: this.fg.get('title').value,
      note: this.fg.get('note').value,
    }
    this.taskService.update(params)
    .pipe(take(1))
    .subscribe(() => {
      this.modalController.dismiss();
    });
  }

  public create(): void {
    if (!this.projectId) return;
    const params = {
      title: this.fg.get('title').value,
      note: this.fg.get('note').value,
      projectId: this.projectId,
    }
    this.taskService.create(params)
    .pipe(take(1))
    .subscribe(() => {
      this.modalController.dismiss();
    });
  }
}
