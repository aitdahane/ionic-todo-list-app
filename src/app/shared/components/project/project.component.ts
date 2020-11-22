import { Component, OnInit, HostBinding, OnDestroy, Input, OnChanges, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController, MenuController, IonInput } from '@ionic/angular';
import { Observable, BehaviorSubject, Subject, combineLatest } from 'rxjs';
import { map, switchMap, takeUntil, skip, tap, filter, take } from 'rxjs/operators';
import { ProjectService } from 'src/app/topics/project/project.service';
import { TaskService } from 'src/app/topics/task/task.service';
import { IProject } from 'src/app/topics/project/project.model';
import { ITask } from 'src/app/topics/task/task.model';
import { TaskEditModalComponent } from 'src/app/shared/components/task-edit/task-edit.modal';
import { ProjectEditModalComponent } from 'src/app/shared/components/project-edit/project-edit.modal';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss'],
})
export class ProjectComponent implements OnInit, OnDestroy {
  @Input() set project(project: IProject) {
    this.selectedProject = project;
    this.changeProject$.next(project);
  }

  get project() {
    return this.selectedProject;
  }

  @ViewChild('newTaskNameInput') public newTaskNameInput: IonInput;
  public refresh$: BehaviorSubject<boolean> = new BehaviorSubject(true);
  public newTaskName: string;
  public selectedProject: IProject;
  public tasks$: Observable<ITask[]>;
  public project$: Observable<IProject>;
  public selectedProject$: BehaviorSubject<IProject> = new BehaviorSubject(null);

  private destroy$: Subject<boolean> = new Subject();
  private changeProject$: BehaviorSubject<IProject> = new BehaviorSubject(null);

  constructor(
    private modalController: ModalController,
    private menu: MenuController,
    private router: Router,
    private projectService: ProjectService,
    private taskService: TaskService,
  ) { }

  ngOnInit() {
    this.tasks$ = combineLatest([
      this.refresh$,
      this.changeProject$
    ]).pipe(
      filter(([,x]) => !!x),
      switchMap(([,x]) => this.taskService.getByProjectId({ projectId: x.id }))
    );
    this.refresh$.next(true);
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

  public async addTask() {
    const modal = await this.modalController.create({
      component: TaskEditModalComponent,
      componentProps: {
        projectId: this.project.id,
      }
    });
    modal.onDidDismiss().then(() => {
      this.refresh$.next(true);
    });
    await modal.present();
  }

  public async editTask(task: ITask) {
    const modal = await this.modalController.create({
      component: TaskEditModalComponent,
      componentProps: { task }
    });
    modal.onDidDismiss().then(() => {
      this.refresh$.next(true);
    });
    await modal.present();
  }

  public async editProject() {
    const modal = await this.modalController.create({
      component: ProjectEditModalComponent,
      componentProps: { project: this.project }
    });
    modal.onDidDismiss().then(() => {
      this.refresh$.next(true);
    });
    await modal.present();
  }
  
  public async deleteTask(task: ITask) {
    this.taskService.delete({ taskId: task.id });
    this.refresh$.next(true);
  }

  public trackByFn(index, item) {
    return item.id;
  }

  public createTask(): string {
    if (!this.newTaskName) {
      return;
    }
    this.taskService.create({
      title: this.newTaskName,
      projectId: this.project.id,
    }).pipe(take(1))
      .subscribe(() => {
        this.refresh$.next(true);
        this.newTaskName = null;
        this.newTaskNameInput.setFocus();
      });
  }
}
