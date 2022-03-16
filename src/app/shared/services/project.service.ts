import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, from } from 'rxjs';
import { map, tap, take, switchMap } from 'rxjs/operators';
import { Project, ProjectCreateParams, ProjectReorderParams, ProjectUpdateParams } from 'src/app/shared/models/project.model';
import { StorageService } from 'src/app/shared/services/storage.service';
import {
  reorderItems,
  sortByPosition,
} from 'src/app/shared/utils/collection.utils';
import { StorageKey } from 'src/app/shared//models/storage.model';

@Injectable()
export class ProjectService {
  private _projects$: BehaviorSubject<Project[]> = new BehaviorSubject([]);

  public get projects$(): Observable<Project[]> {
    return this._projects$.asObservable();
  }

  constructor(private storageService: StorageService) {
    this.reset();
  }

  private reset(): void {
    this.getAll()
      .pipe(take(1))
      .subscribe((projects) => this._projects$.next(projects));
  }

  public getAll(): Observable<Project[]> {
    return this.storageService
      .getArray(StorageKey.PROJECT)
      .pipe(map(sortByPosition));
  }

  public create(params: ProjectCreateParams): Observable<Project> {
    return this.storageService.create(StorageKey.PROJECT, params).pipe(
      map((project) => {
        this.reset();
        return project;
      })
    );
  }

  public update(params: ProjectUpdateParams): Observable<Project> {
    return this.storageService.update<Project>(StorageKey.PROJECT, params).pipe(
      map((project) => {
        this.reset();
        return project;
      })
    );
  }

  public delete(id: number): Observable<any> {
    return this.storageService
      .delete(StorageKey.PROJECT, { id })
      .pipe(
        switchMap(() =>
          this.storageService.deleteWhere(
            StorageKey.TASK,
            (task) => task.projectId === id
          )
        ),
        tap(() => this.reset())
      );
  }

  public reorder(params: ProjectReorderParams): Observable<Project[]> {
    const projects = this._projects$
      .getValue()
      .map((project, index) => ({
        ...project,
        position: project.position ?? index,
      }))
      .sort((x, y) => x.position - y.position)
      .map((project, index) => ({ ...project, position: index }));
    const { fromPosition, toPosition } = params;
    const orderedProjects = reorderItems<Project>(
      projects,
      fromPosition,
      toPosition
    );
    for (let i = 0; i < orderedProjects.length; i++) {
      orderedProjects[i].position = i;
    }
    return this.storageService
      .updateWere(StorageKey.PROJECT, orderedProjects)
      .pipe(tap(() => this.reset()));
  }
}
