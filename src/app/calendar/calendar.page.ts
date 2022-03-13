import { Component, OnDestroy, OnInit } from '@angular/core';
import * as moment from 'moment';
import * as _ from 'lodash';
import { BehaviorSubject, Observable } from 'rxjs';
import { distinctUntilChanged, filter, share, switchMap, takeUntil } from 'rxjs/operators';
import { Task } from '../shared/models/task.model';
import { TaskService } from '../shared/services/task.service';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.page.html',
  styleUrls: ['./calendar.page.scss'],
})
export class CalendarPage implements OnInit, OnDestroy {
  public date$: BehaviorSubject<string> = new BehaviorSubject(
    moment().startOf('day').toISOString()
  );
  public tasks$: Observable<Task[]>;
  public hours: string[] = _.range(24).map((hours) => moment().startOf('day').add({ hours }).format('HH:mm'));
  public tasksByHour: Task[][] = _.range(24).map(() => []);

  private destroy$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(
    private taskService: TaskService,
  ) {}

  public ngOnInit(): void {
    this.date$
      .pipe(
        switchMap((date) => this.taskService.getByDate(date)),
        distinctUntilChanged(),
        takeUntil(this.destroy$.pipe(filter((x) => !!x))),
        share(),
      ).subscribe((tasks) => {
        this.tasksByHour = this.tasksByHour.map(() => []).map((tasksList, index) => {
          const startOfHour = moment().startOf('day').add({ hours: index }).toISOString();
          const endOfHour = moment(startOfHour).endOf('hour').toISOString();
          const tasksInHour = tasks.filter((task) => moment(task.startDate).isBetween(startOfHour, endOfHour, null, '[)'));
          return tasksInHour;
        });
      });
  }

  public ngOnDestroy(): void {
    this.destroy$.next(true);
  }

  public goToPreviousDay(): void {
    this.date$.next(moment(this.date$.getValue()).subtract({ days: 1 }).toISOString());
  }

  public goToNextDay(): void {
    this.date$.next(moment(this.date$.getValue()).add({ days: 1 }).toISOString());
  }
}
