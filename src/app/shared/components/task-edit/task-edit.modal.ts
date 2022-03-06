import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { take } from 'rxjs/operators';
import { TaskService } from 'src/app/shared/services/task.service';
import { Task, TaskStatusEnum } from 'src/app/shared/models/task.model';
import * as moment from 'moment';

@Component({
  selector: 'app-task-edit',
  templateUrl: './task-edit.modal.html',
  styleUrls: ['./task-edit.modal.scss'],
})
export class TaskEditModalComponent implements OnInit {
  @Input() projectId: number;
  @Input() task: Task;
  public fg: FormGroup;

  constructor(
    private modalController: ModalController,
    private taskService: TaskService
  ) {}

  ngOnInit() {
    this.initForm();
  }

  public initForm(): void {
    this.fg = new FormGroup({
      title: new FormControl(null, Validators.required),
      hasDate: new FormControl(false),
      startDate: new FormControl(moment()),
    });
    const hasDate = !!this.task?.startDate;
    const formData = this.task
      ? {
          title: this.task.title,
          hasDate,
          startDate: this.task.startDate,
        }
      : null;
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
      ...this.buildPayload(),
      id: this.task.id,
    };
    this.taskService
      .update(params)
      .pipe(take(1))
      .subscribe(() => {
        this.modalController.dismiss();
      });
  }

  public create(): void {
    if (!this.projectId) return;
    const params = {
      ...this.buildPayload(),
      projectId: this.projectId,
    };
    this.taskService
      .create(params)
      .pipe(take(1))
      .subscribe(() => {
        this.modalController.dismiss();
      });
  }

  private buildPayload(): Omit<Task, 'id' | 'projectId' | 'status'> {
    const hasDate = this.fg.get('hasDate').value;
    const startDate = this.fg.get('startDate').value;
    const shouldAddDate = hasDate && startDate;
    return {
      title: this.fg.get('title').value,
      ...shouldAddDate ? { startDate } : { startDate: null },
    };
  }

  public updateStatus(completed: true, close?: boolean): void {
    if (!this.task) return;
    this.taskService
      .updateStatus({ taskId: this.task.id, status: completed ? TaskStatusEnum.DONE : TaskStatusEnum.TO_DO })
      .pipe(take(1))
      .subscribe(() => {
        if (close) {
          this.modalController.dismiss();
        }
      });
  }

  public deleteTask(): void {
    if (!this.task) return;
    this.taskService
      .delete({ taskId: this.task.id })
      .pipe(take(1))
      .subscribe(() => {
        this.modalController.dismiss();
      });
  }
}
