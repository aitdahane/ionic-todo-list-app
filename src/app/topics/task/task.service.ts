import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, from, of } from 'rxjs';
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
    return from(this.getByProjectId({ projectId }))
      .pipe(
        switchMap((tasks) => this.storageService.append('tasks', {
          ...data, position: tasks ? tasks.length : 0,
        })),        
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
        map((tasks: ITask[]) => tasks.filter(x => x.projectId === params.projectId)
      ),
    );
  }

  public reorderTasks(params: { projectId: number; fromPosition?: number; toPosition?: number }): Observable<ITask[]> {
    const { projectId, fromPosition = 0, toPosition = 0 } = params;
    return from(this.getByProjectId({ projectId }))
      .pipe(
        map(tasks => tasks
          .sort((x, y) => x.position - y.position)
          .map((task, index) => ({
            ...task,
            position: index,
          })
        )),
        map(tasks => {
          if (fromPosition === toPosition) return tasks;
          const _from = Math.max(fromPosition, 0);
          const _to = Math.min(toPosition, tasks.length - 1);
          const newTasks = [
            ...tasks.filter(({}, index) => index < _to && index !== _from),
            tasks[Math.max(_from, _to)],
            tasks[Math.min(_from, _to)],
            ...tasks.filter(({}, index) => index > _to && index !== _from),
          ]
          for(let i = 0; i < newTasks.length; i++) {
            newTasks[i].position = i;
          }
          return newTasks;
        }),
        switchMap(tasks => from(this.storageService.bulkUpdateWere('tasks', tasks, (task) => task.projectId === projectId))),
        switchMap(() => this.getByProjectId({ projectId })),
      );
  }
}