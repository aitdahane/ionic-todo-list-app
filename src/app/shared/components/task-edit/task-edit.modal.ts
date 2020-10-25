import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { take } from 'rxjs/operators';
import { TaskService } from 'src/app/topics/task/task.service';

@Component({
  selector: 'app-task-edit',
  templateUrl: './task-edit.modal.html',
  styleUrls: ['./task-edit.modal.scss'],
})
export class TaskEditModalComponent implements OnInit {
  @Input() projectId: number;
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
  }

  public dismiss(): void {
    this.modalController.dismiss({ dismissed: true });
  }

  public save(): void {
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
