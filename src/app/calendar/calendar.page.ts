import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { IonContent, ModalController } from '@ionic/angular';
import * as moment from 'moment';
import * as _ from 'lodash';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { filter, share, switchMap, takeUntil } from 'rxjs/operators';
import { Task } from '../shared/models/task.model';
import { TaskService } from '../shared/services/task.service';
import { TaskEditModalComponent } from '../shared/components/task-edit/task-edit.modal';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.page.html',
  styleUrls: ['./calendar.page.scss'],
})
export class CalendarPage implements OnInit, OnDestroy {
  @ViewChild(IonContent) content: IonContent;

  public refresh$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  public date$: BehaviorSubject<string> = new BehaviorSubject(
    moment().startOf('day').toISOString()
  );
  public tasks$: Observable<Task[]>;
  public hours: string[] = _.range(24).map((hours) =>
    moment().startOf('day').add({ hours }).format('HH:mm')
  );
  public tasksByHour: Task[][] = _.range(24).map(() => []);

  private destroy$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(
    private taskService: TaskService,
    private modalController: ModalController
  ) {}

  public ngOnInit(): void {
    combineLatest([this.date$, this.taskService.tasks$, this.refresh$])
      .pipe(
        switchMap(([date]) => this.taskService.getByDate(date)),
        takeUntil(this.destroy$.pipe(filter((x) => !!x)))
      )
      .subscribe((tasks) => {
        this.tasksByHour = this.tasksByHour
          .map(() => [])
          .map((tasksList, index) => {
            const startOfHour = moment()
              .startOf('day')
              .add({ hours: index })
              .toISOString();
            const endOfHour = moment(startOfHour).endOf('hour').toISOString();
            const tasksInHour = tasks.filter((task) =>
              moment(task.startDate).isBetween(
                startOfHour,
                endOfHour,
                null,
                '[)'
              )
            );
            return tasksInHour;
          });
        this.scrollToCurrentHour();
      });
  }

  public ngOnDestroy(): void {
    this.destroy$.next(true);
  }

  public goToPreviousDay(): void {
    this.date$.next(
      moment(this.date$.getValue()).subtract({ days: 1 }).toISOString()
    );
  }

  public goToNextDay(): void {
    this.date$.next(
      moment(this.date$.getValue()).add({ days: 1 }).toISOString()
    );
  }

  public scrollToCurrentHour(): void {
    setTimeout(() => {
      const currentHour = moment().hours();
      const slotHeight = 120;
      this.content?.scrollToPoint(0, currentHour * slotHeight);
    }, 100);
  }

  public async editTask(task: Task) {
    const modal = await this.modalController.create({
      component: TaskEditModalComponent,
      componentProps: { task },
    });
    modal.onDidDismiss().then(() => {
      this.refresh$.next(true);
    });
    await modal.present();
  }
}
