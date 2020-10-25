import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController, MenuController } from '@ionic/angular';
import { map, takeUntil } from 'rxjs/operators';
import { Observable, BehaviorSubject, Subject, combineLatest } from 'rxjs';
import { ProjectService } from 'src/app/topics/project/project.service';
import { IProject } from 'src/app/topics/project/project.model';
import { ProjectEditModalComponent } from 'src/app/shared/components/project-edit/project-edit.modal';
import { TaskEditModalComponent } from 'src/app/shared/components/task-edit/task-edit.modal';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit, OnDestroy {
  public project$: Observable<IProject>;
  public projects$: Observable<IProject[]>;
  public selectedProject$: BehaviorSubject<IProject> = new BehaviorSubject(null);
  public refreshProject$: BehaviorSubject<boolean> = new BehaviorSubject(true);

  private destroy$: Subject<boolean> = new Subject();
  private changeProject$: BehaviorSubject<IProject> = new BehaviorSubject(null);

  constructor(
    private modalController: ModalController,
    private menu: MenuController,
    private router: Router,
    private projectService: ProjectService,
  ) { }

  ngOnInit() {
    this.projects$ = this.projectService.projects$;
    combineLatest([
      this.projectService.projects$,
      this.changeProject$,
    ]).pipe(
      takeUntil(this.destroy$),
      map(([projects, project]) => {
        if (!project) return projects[0]; // return null
        return projects.find(x => x.id === project.id);
      }),
    ).subscribe(project => {
      this.selectedProject$.next(project)
    });


    this.changeProject$.next(null);
  }

  public handleNoteCategoryClick(noteCategoryId: number): void {
    this.router.navigate(['note', noteCategoryId]);
  }

  public ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  public handleSelectedProject(project: IProject): void {
    this.changeProject$.next(project);
    this.menu.close();
  }

  public openMenu(): void {
    this.menu.open('menu');
  }

  public async addProject() {
    const modal = await this.modalController.create({
      component: ProjectEditModalComponent,
      componentProps: {},
    });

    modal.onDidDismiss().then((res) => {
      if (!res) return;
      this.handleSelectedProject(res.data.project);
    });
    return await modal.present();
  }
}
