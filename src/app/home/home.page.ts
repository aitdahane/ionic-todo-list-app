import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, Route, ActivatedRoute } from '@angular/router';
import { ModalController, MenuController, PopoverController } from '@ionic/angular';
import { map, takeUntil, take } from 'rxjs/operators';
import { Observable, BehaviorSubject, Subject, combineLatest } from 'rxjs';
import { ProjectService } from 'src/app/topics/project/project.service';
import { IProject } from 'src/app/topics/project/project.model';
import { ProjectEditModalComponent } from 'src/app/shared/components/project-edit/project-edit.modal';
import { TaskEditModalComponent } from 'src/app/shared/components/task-edit/task-edit.modal';
import { PopoverComponent } from '../shared/components/popover/popover.component';
import { createUrlResolverWithoutPackagePrefix } from '@angular/compiler';

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
  private changeProject$: BehaviorSubject<number> = new BehaviorSubject(null);

  constructor(
    private modalController: ModalController,
    private popoverController: PopoverController,
    private menu: MenuController,
    private router: Router,
    private projectService: ProjectService,
    private activatedRoute: ActivatedRoute,
  ) {}

  ngOnInit() {
    this.projects$ = this.projectService.projects$;
    combineLatest([
      this.projectService.projects$,
      this.changeProject$,
    ]).pipe(
      takeUntil(this.destroy$),
      map(([projects, projectId]) => {
        if (!projectId) return projects[0]; // return null
        return projects.find(x => x.id === projectId);
      }),
    ).subscribe(project => {
      this.selectedProject$.next(project)
    });

    this.activatedRoute.params
    .pipe(takeUntil(this.destroy$))
    .subscribe((params) => {
      console.log('params', params)
      this.changeProject$.next(+params.projectId);
    });
  }

  public ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  public handleSelectedProject(project: IProject): void {
    this.changeProject$.next(project.id);
    this.menu.close();
  }

  public async addProject() {
    const modal = await this.modalController.create({
      component: ProjectEditModalComponent,
      cssClass: 'project-edit-modal',
    });

    modal.onDidDismiss().then((res) => {
      if (!res.data) return;
      this.handleSelectedProject(res.data.project);
    });
    return await modal.present();
  }

  public async editProject(project: IProject) {
    const modal = await this.modalController.create({
      component: ProjectEditModalComponent,
      componentProps: { project: this.selectedProject$.getValue() },
      cssClass: 'project-edit-modal',
    });
    modal.onDidDismiss().then((res) => {
      if (!res.data) return;
      this.changeProject$.next(project.id);
    });
    await modal.present();
  }

  public async addTask() {
    const modal = await this.modalController.create({
      component: TaskEditModalComponent,
      componentProps: {
        projectId: this.selectedProject$.getValue().id,
      }
    });
    modal.onDidDismiss().then(() => {
      this.changeProject$.next(this.selectedProject$.getValue().id);
    });
    await modal.present();
  }

  async presentProjectOptionsPopover(ev: any) {
    const popover = await this.popoverController.create({
      component: PopoverComponent,
      event: ev,
      showBackdrop: false,
      componentProps: {
        actions: [{ label: 'Delete', onClick: () => this.deleteProject() }],
      }
    });
    return await popover.present();
  }

  public deleteProject(): void {
    this.projectService.delete({ projectId: this.selectedProject$.getValue().id })
      .pipe(take(1))
      .subscribe(() => this.goToDashboard());
  }

  public goToDashboard(): void {
    this.menu.close();
    this.router.navigate(['/dashboard']);
  }
}
