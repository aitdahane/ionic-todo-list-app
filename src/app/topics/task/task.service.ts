import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, from } from 'rxjs';
import { ITask, TaskStatusEnum } from './task.model';
import { map, tap, switchMap } from 'rxjs/operators';
import { StorageService } from '../storage/storage.service';

@Injectable()
export class TaskService {
  public tasks$: BehaviorSubject<ITask[]> = new BehaviorSubject([]);

  constructor(private storageService: StorageService) {
  }

  public create(params: { title: string, note?: string, projectId: number }): Observable<ITask> {
    const { title, note, projectId } = params;
    const data = { title, note, projectId, status: TaskStatusEnum.TO_DO };
    let id;
    return from(this.storageService.append('tasks', data))
      .pipe(
        tap((x) => { id = x }),
        switchMap(() => this.storageService.getObject('tasks')),
        map((tasks) => {
          this.tasks$.next(tasks);
          return tasks.find(x => x.id === id);
        }),
      );
  }

  public updateStatus(params: { taskId: number, status: TaskStatusEnum }): Observable<ITask> {
    const { taskId, status } = params;
    return from(this.storageService.update('tasks', { id: taskId, status }))
      .pipe(
        switchMap(() => this.storageService.getObject('tasks')),
        map((tasks) => {
          this.tasks$.next(tasks);
          return tasks.find(x => x.id === taskId);
        }),
      );
  }

  public update(params: { id: number, title: string, note: string }): Observable<ITask> {
    const { id, title, note } = params;
    return from(this.storageService.update('tasks', { id, title, note }))
      .pipe(
        switchMap(() => this.storageService.getObject('tasks')),
        map((tasks) => {
          this.tasks$.next(tasks);
          return tasks.find(x => x.id === id);
        }),
      );
  }

  public delete(params: { taskId: number }): Observable<number> {
    const { taskId } = params;
    return from(this.storageService.delete('tasks', { id: taskId }))
      .pipe(
        switchMap(() => this.storageService.getObject('tasks')),
        map((tasks) => {
          this.tasks$.next(tasks);
          return taskId;
        }),
      );
  }

  public getByProjectId(params: { projectId: number }): Observable<ITask[]> {
    return from(this.storageService.getObject('tasks'))
      .pipe(
        tap(x => console.log('tasks', x)),
        map((tasks: ITask[]) => tasks.filter(x => x.projectId === params.projectId)
      ),
    );
  }
}