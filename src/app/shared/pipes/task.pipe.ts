import { Pipe, PipeTransform } from '@angular/core';
import { ITask, TaskStatusEnum } from 'src/app/shared/models/task.model';

@Pipe({
  name: 'taskIsDone',
})
export class TaskIsDonePipe implements PipeTransform {
  public transform(task: ITask): boolean {
    return task && task.status === TaskStatusEnum.DONE;
  }
}
