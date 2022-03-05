import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PopoverController, ModalController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { ProjectService } from 'src/app/shared/services/project.service';
import { IProject } from 'src/app/shared/models/project.model';
import { PopoverComponent } from 'src/app/shared/components/popover/popover.component';
import { ProjectEditModalComponent } from 'src/app/shared/components/project-edit/project-edit.modal';
import { sortByPosition } from '../shared/utils/collection.utils';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {
  public projects$: Observable<IProject[]>;

  constructor(
    private router: Router,
    private popoverController: PopoverController,
    private modalController: ModalController,
    private projectService: ProjectService
  ) {}

  ngOnInit() {
    this.projects$ = this.projectService.projects$.pipe(
      map((projects) => sortByPosition(projects))
    );
  }

  public async presentProjectOptionsPopover(ev: MouseEvent, project: IProject) {
    ev.stopPropagation();
    const popover = await this.popoverController.create({
      component: PopoverComponent,
      event: ev,
      showBackdrop: false,
      componentProps: {
        actions: [
          { label: 'Delete', onClick: () => this.deleteProject(project) },
        ],
      },
    });
    await popover.present();
  }

  public deleteProject(project: IProject): void {
    this.projectService
      .delete({ projectId: project.id })
      .pipe(take(1))
      .subscribe();
  }

  public async addProject(): Promise<void> {
    const modal = await this.modalController.create({
      component: ProjectEditModalComponent,
    });
    await modal.present();
  }

  public goToProject(project: IProject): void {
    this.router.navigate(['/project', project.id]);
  }

  public reorderProjects(ev): void {
    console.log('mo3', 'ev', ev);
    this.projectService
      .reorderProjects({
        fromPosition: ev.detail.from,
        toPosition: ev.detail.to,
      })
      .pipe(take(1))
      .subscribe();
    ev.detail.complete();
  }
}
