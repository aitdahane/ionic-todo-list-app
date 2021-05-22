import { Injectable } from '@angular/core';
import { BehaviorSubject, of, Observable, from } from "rxjs";
import { IProject } from './project.model';
import { StorageService } from 'src/app/topics/storage/storage.service';
import { switchMap, map, tap } from 'rxjs/operators';
import { ITask, TaskStatusEnum } from '../task/task.model';

@Injectable()
export class ProjectService {
  public projects$: BehaviorSubject<IProject[]> = new BehaviorSubject([]);

  constructor(private storageService: StorageService) {
    this.storageService.getObject('projects')
      .then(projects => this.projects$.next(projects));

  }

  public refresh(): void {
    this.storageService.getObject('projects')
      .then(projects => this.projects$.next(projects));
  }

  public create(params: { title: string; iconName: string; imageName: string; }): Observable<IProject> {
    const { title, iconName, imageName } = params;
    let id;
    return from(this.storageService.append('projects', { title, iconName, imageName }))
    .pipe(
      tap((x) => { id = x }),
      switchMap(() => this.storageService.getObject('projects')),
      map((projects) => {
        this.projects$.next(projects);
        return projects.find(x => x.id === id);
      })
    );
  }

  public update(params: { id: number; title: string; iconName: string; imageName: string; }): Observable<IProject> {
    const { id, title, iconName, imageName } = params;
    return from(this.storageService.update('projects', { id, title, iconName, imageName }))
    .pipe(
      switchMap(() => this.storageService.getObject('projects')),
      map((projects) => {
        this.projects$.next(projects);
        return projects.find(x => x.id === id);
      })
    );
  }

  public delete(params: { projectId: number }): Observable<any> {
    const { projectId } = params;
    return from(
      this.storageService.delete('projects', { id: projectId })
        .then(() => this.storageService.deleteBy('tasks', task => task.projectId === projectId)
        .then(() => this.refresh())),
      );
  }

  public addTask(params: { title: string, note?: string, projectId: number }): Observable<ITask> {
    const { title, note, projectId } = params;
    const data = { title, note, projectId, status: TaskStatusEnum.TO_DO };
    let id;
    return this.getProjectById(projectId)
      .pipe(switchMap(project => {
        const { tasks } = project;
        const ids = tasks.map(x => x.id).sort((x, y) => y - x);
        id = (ids[0] || 0) + 1;
        const newTasks = [...tasks, { ...data, id }];
        return this.storageService.update('projects', {
          ...project,
          tasks: newTasks,
        });
      }));
  }

  public getProjectById(projectId: number): Observable<IProject> {
    return from(this.storageService.getObject('projects'))
      .pipe(
        map(projects => projects.find((x) => x.id === projectId))
      );
  }
}