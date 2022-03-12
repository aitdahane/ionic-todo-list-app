import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';
import { Task, TaskStatusEnum } from 'src/app/shared/models/task.model';

@Pipe({
  name: 'dateFormat',
})
export class DateFormatPipe implements PipeTransform {
  public transform(date: string, format: string): string {
    return moment(date).format(format);
  }
}
