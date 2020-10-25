import { Injectable } from '@angular/core';
import { BehaviorSubject, of, Observable, from } from "rxjs";
import { IProject } from './project.model';
import { StorageService } from 'src/app/topics/storage/storage.service';
import { switchMap, map, tap } from 'rxjs/operators';

@Injectable()
export class ProjectService {
  public projects$: BehaviorSubject<IProject[]> = new BehaviorSubject([]);

  constructor(private storageService: StorageService) {
    this.storageService.getObject('projects')
      .then(projects => this.projects$.next(projects));

  }

  public create(params: { title: string }): Observable<IProject> {
    const { title } = params;
    let id;
    return from(this.storageService.append('projects', { title }))
    .pipe(
      tap((x) => { id = x }),
      switchMap(() => this.storageService.getObject('projects')),
      map((projects) => {
        this.projects$.next(projects);
        return projects.find(x => x.id === id);
      })
    );
  }

  public delete(params: { projectId: number }): void {
    const { projectId } = params;
    const projects = this.projects$.getValue();
    this.projects$.next(projects.filter(x => x.id !== projectId));
  }
}