import { Component, Input } from '@angular/core';
import { Task, TaskStatusEnum } from '../../models/task.model';
import { TaskService } from '../../services/task.service';

@Component({
  selector: 'app-calendar-task',
  templateUrl: './calendar-task.component.html',
  styleUrls: ['./calendar-task.component.scss'],
})
export class CalendarTaskComponent {
  @Input() task: Task;

  constructor(private taskService: TaskService) {}

  public updateStatus(completed: boolean): void {
    if (!this.task) {
      return;
    }
    this.taskService.updateStatus({
      id: this.task.id,
      status: completed ? TaskStatusEnum.DONE : TaskStatusEnum.TO_DO,
    });
  }
}
