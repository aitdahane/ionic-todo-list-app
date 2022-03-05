import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, from, of } from 'rxjs';
import { ITask, TaskStatusEnum } from '../models/task.model';
import { map, tap, switchMap } from 'rxjs/operators';
import { StorageService } from './storage.service';
import { reorderItems, sortByPosition } from '../utils/collection.utils';

@Injectable()
export class TaskService {
  public tasks$: BehaviorSubject<ITask[]> = new BehaviorSubject([]);

  constructor(private storageService: StorageService) {}

  public create(params: {
    title: string;
    note?: string;
    projectId: number;
  }): Observable<ITask> {
    const { title, note, projectId } = params;
    const data = { title, note, projectId, status: TaskStatusEnum.TO_DO };
    let id;
    return from(this.getByProjectId({ projectId })).pipe(
      switchMap((tasks) =>
        this.storageService.append('tasks', {
          ...data,
          position: tasks ? tasks.length : 0,
        })
      ),
      tap((x) => {
        id = x;
      }),
      switchMap(() => this.storageService.getObject('tasks')),
      map((tasks) => {
        this.tasks$.next(tasks);
        return tasks.find((x) => x.id === id);
      })
    );
  }

  public updateStatus(params: {
    taskId: number;
    status: TaskStatusEnum;
  }): Observable<ITask> {
    const { taskId, status } = params;
    return from(
      this.storageService.update('tasks', { id: taskId, status })
    ).pipe(
      switchMap(() => this.storageService.getObject('tasks')),
      map((tasks) => {
        this.tasks$.next(tasks);
        return tasks.find((x) => x.id === taskId);
      })
    );
  }

  public update(params: {
    id: number;
    title: string;
    note: string;
  }): Observable<ITask> {
    const { id, title, note } = params;
    return from(this.storageService.update('tasks', { id, title, note })).pipe(
      switchMap(() => this.storageService.getObject('tasks')),
      map((tasks) => {
        this.tasks$.next(tasks);
        return tasks.find((x) => x.id === id);
      })
    );
  }

  public delete(params: { taskId: number }): Observable<number> {
    const { taskId } = params;
    return from(this.storageService.delete('tasks', { id: taskId })).pipe(
      switchMap(() => this.storageService.getObject('tasks')),
      map((tasks) => {
        this.tasks$.next(tasks);
        return taskId;
      })
    );
  }

  public getByProjectId(params: { projectId: number }): Observable<ITask[]> {
    return from(this.storageService.getObject('tasks')).pipe(
      map((tasks: ITask[]) =>
        tasks.filter((x) => x.projectId === params.projectId)
      ),
      map((tasks: ITask[]) => sortByPosition(tasks))
    );
  }

  public reorderTasks(params: {
    projectId: number;
    fromPosition?: number;
    toPosition?: number;
  }): Observable<ITask[]> {
    const { projectId, fromPosition = 0, toPosition = 0 } = params;
    return this.getByProjectId({ projectId }).pipe(
      map((tasks: ITask[]) =>
        tasks
          .map((task, index) => ({ ...task, position: task.position ?? index }))
          .sort((x, y) => x.position - y.position)
          .map((project, index) => ({ ...project, position: index }))
      ),
      map((tasks: ITask[]) => {
        const newTasks = reorderItems<ITask>(tasks, fromPosition, toPosition);
        for (let i = 0; i < newTasks.length; i++) {
          newTasks[i].position = i;
        }
        return newTasks;
      }),
      switchMap((tasks) =>
        from(
          this.storageService.bulkUpdateWere(
            'tasks',
            tasks,
            (task) => task.projectId === projectId
          )
        )
      ),
      switchMap(() => this.getByProjectId({ projectId }))
    );
  }
}
