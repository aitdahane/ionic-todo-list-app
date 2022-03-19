import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, switchMap, take, tap } from 'rxjs/operators';
import {
  Task,
  TaskCreateParams,
  TaskReorderParams,
  TaskStatusEnum,
  TaskUpdateParams,
  TaskUpdateStatusParams,
} from 'src/app/shared/models/task.model';
import { StorageService } from 'src/app/shared/services/storage.service';
import {
  reorderItems,
  sortByPosition,
} from 'src/app/shared/utils/collection.utils';
import { StorageKey } from 'src/app/shared/models/storage.model';
import { filterByProjectId } from 'src/app/shared/utils/task.utils';

@Injectable()
export class TaskService {
  private _tasks$: BehaviorSubject<Task[]> = new BehaviorSubject([]);

  public get tasks$(): Observable<Task[]> {
    return this._tasks$;
  }

  constructor(private storageService: StorageService) {
    this.reset();
  }

  private reset(): void {
    this.getAll()
      .pipe(take(1))
      .subscribe((tasks) => this._tasks$.next(tasks));
  }

  public getAll(): Observable<Task[]> {
    return this.storageService
      .getArray(StorageKey.TASK)
      .pipe(map(sortByPosition));
  }

  public getByProjectId(projectId: number): Observable<Task[]> {
    return this.getAll().pipe(
      map((tasks: Task[]) => filterByProjectId(tasks, projectId)),
      map(sortByPosition),
    );
  }

  public getByDate(date: string): Observable<Task[]> {
    const startOfDay = moment(date).startOf('day').toISOString();
    const endOfDay = moment(date).endOf('day').toISOString();
    return this.getAll().pipe(
      map((tasks) =>
        tasks.filter(
          ({ startDate }) =>
            !!startDate &&
            moment(startDate).isBetween(startOfDay, endOfDay, 'minutes', '[)')
        )
      ),
    );
  }

  public create(params: TaskCreateParams): Observable<Task> {
    return this.storageService
      .create(StorageKey.TASK, {
        ...params,
        status: TaskStatusEnum.TO_DO,
        position: Infinity,
      })
  }

  public updateStatus(params: TaskUpdateStatusParams): Observable<Task> {
    return this.storageService
      .update<Task>(StorageKey.TASK, params)
      .pipe(tap(() => this.reset()));
  }

  public update(params: TaskUpdateParams): Observable<Task> {
    return this.storageService
      .update<Task>(StorageKey.TASK, params)
      .pipe(tap(() => this.reset()));
  }

  public reorder(params: TaskReorderParams): Observable<Task[]> {
    const { projectId, fromPosition = 0, toPosition = 0 } = params;
    return this.getByProjectId(projectId).pipe(
      map((tasks: Task[]) =>
        tasks
          .map((task, index) => ({ ...task, position: task.position ?? index }))
          .sort((x, y) => x.position - y.position)
          .map((project, index) => ({ ...project, position: index }))
      ),
      map((tasks: Task[]) => {
        const newTasks = reorderItems<Task>(tasks, fromPosition, toPosition);
        for (let i = 0; i < newTasks.length; i++) {
          newTasks[i].position = i;
        }
        return newTasks;
      }),
      switchMap((tasks) =>
        this.storageService.updateWere(
          StorageKey.TASK,
          tasks,
          (task) => task.projectId === projectId
        )
      ),
      switchMap(() => this.getByProjectId(projectId)),
      tap(() => this.reset())
    );
  }

  public delete(id: number): Observable<number> {
    return this.storageService
      .delete(StorageKey.TASK, { id })
      .pipe(tap(() => this.reset()));
  }
}
