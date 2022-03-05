import _ from "lodash";
import { Component, OnInit, OnDestroy, Input, ViewChild, } from '@angular/core';
import { ModalController, MenuController, IonInput } from '@ionic/angular';
import { Observable, BehaviorSubject, Subject, combineLatest } from 'rxjs';
import { switchMap, filter, take, map } from 'rxjs/operators';
import { TaskService } from 'src/app/shared/services/task.service';
import { IProject } from 'src/app/shared/models/project.model';
import { ITask, TaskStatusEnum } from 'src/app/shared/models/task.model';
import { TaskEditModalComponent } from 'src/app/shared/components/task-edit/task-edit.modal';
import { ProjectEditModalComponent } from 'src/app/shared/components/project-edit/project-edit.modal';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss'],
})
export class TaskListComponent implements OnInit, OnDestroy {
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

  private destroy$: Subject<boolean> = new Subject();
  private changeProject$: BehaviorSubject<IProject> = new BehaviorSubject(null);

  constructor(
    private modalController: ModalController,
    private menu: MenuController,
    private taskService: TaskService,
  ) { }

  ngOnInit() {
    this.tasks$ = combineLatest([
      this.refresh$,
      this.changeProject$
    ]).pipe(
      filter(([, project]) => !!project),
      switchMap(([, project]) => this.taskService.getByProjectId({ projectId: project.id })),
      map((tasks) => _.sortBy(tasks, 'position')),
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
      },
    });
    modal.onDidDismiss().then(() => {
      this.refresh$.next(true);
    });
    await modal.present();
  }

  public async editTask(task: ITask) {
    const modal = await this.modalController.create({
      component: TaskEditModalComponent,
      componentProps: { task },
    });
    modal.onDidDismiss().then(() => {
      this.refresh$.next(true);
    });
    await modal.present();
  }

  public async editProject() {
    const modal = await this.modalController.create({
      component: ProjectEditModalComponent,
      componentProps: { project: this.project },
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

  public updateTaskStatus(task: ITask, completed: boolean): string {
    if (!task) {
      return;
    }
    this.taskService.updateStatus({
      taskId: task.id,
      status: completed ? TaskStatusEnum.DONE : TaskStatusEnum.TO_DO,
    }).pipe(take(1))
      .subscribe(() => {
        this.refresh$.next(true);
      });
  }

  public reorderItems(ev): void {
    this.taskService.reorderTasks({
      fromPosition: ev.detail.from,
      toPosition: ev.detail.to,
      projectId: this.project.id,
    }).pipe(take(1))
      .subscribe(() => {
        this.refresh$.next(true);
      });
    ev.detail.complete(true);
  }
}
