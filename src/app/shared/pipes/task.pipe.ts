import { Pipe, PipeTransform } from '@angular/core';
import { Task, TaskStatusEnum } from 'src/app/shared/models/task.model';
import { computeHeightSize, computeTopPosition } from '../utils/task.utils';

@Pipe({
  name: 'taskIsDone',
})
export class TaskIsDonePipe implements PipeTransform {
  public transform(task: Task): boolean {
    return task?.status === TaskStatusEnum.DONE;
  }
}

@Pipe({
  name: 'taskTopPosition',
})
export class TaskTopPositionPipe implements PipeTransform {
  public transform(task: Task): number {
    return computeTopPosition(task);
  }
}

@Pipe({
  name: 'taskHeightSize',
})
export class TaskHeightSizePipe implements PipeTransform {
  public transform(task: Task): number {
    return computeHeightSize(task);
  }
}
