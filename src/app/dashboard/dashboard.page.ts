import { Observable } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { PopoverController, ModalController, NavController } from '@ionic/angular';
import { Router } from '@angular/router';
import { ProjectService } from 'src/app/topics/project/project.service';
import { IProject } from 'src/app/topics/project/project.model';
import { PopoverComponent } from 'src/app/shared/components/popover/popover.component';
import { take } from 'rxjs/operators';
import { ProjectEditModalComponent } from 'src/app/shared/components/project-edit/project-edit.modal';

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
    private projectService: ProjectService,
  ) { }

  ngOnInit() {
    this.projects$ = this.projectService.projects$;
  }

  public async presentProjectOptionsPopover(ev: MouseEvent, project: IProject) {
    ev.stopPropagation();
    const popover = await this.popoverController.create({
      component: PopoverComponent,
      event: ev,
      showBackdrop: false,
      componentProps: {
        actions: [{ label: 'Delete', onClick: () => this.deleteProject(project) }],
      }
    });
    return await popover.present();
  }

  public deleteProject(project: IProject): void {
    this.projectService.delete({ projectId: project.id })
      .pipe(take(1))
      .subscribe()
  }

  public async addProject(): Promise<void> {
    const modal = await this.modalController.create({
      component: ProjectEditModalComponent,
      componentProps: {},
    });

    modal.onDidDismiss().then((res) => {
      if (!res.data) return;
    });
    await modal.present();
  }

  public goToProject(project: IProject): void {
    this.router.navigate(['/project', project.id]);
  }
}
