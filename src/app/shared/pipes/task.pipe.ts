import { Pipe, PipeTransform } from '@angular/core';
import { Task, TaskStatusEnum } from 'src/app/shared/models/task.model';

@Pipe({
  name: 'taskIsDone',
})
export class TaskIsDonePipe implements PipeTransform {
  public transform(task: Task): boolean {
    return task?.status === TaskStatusEnum.DONE;
  }
}
