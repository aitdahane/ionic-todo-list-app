import { Component, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ProjectService } from 'src/app/topics/project/project.service';
import { ModalController } from '@ionic/angular';
import { take } from 'rxjs/operators';
import { IProject } from 'src/app/topics/project/project.model';

@Component({
  selector: 'app-project-edit-modal',
  templateUrl: './project-edit.modal.html',
  styleUrls: ['./project-edit.modal.scss'],
})
export class ProjectEditModalComponent {
  @Input() project: IProject;
  public fg: FormGroup;
  public iconName: string;

  constructor(
    private modalController: ModalController,
    private projectService: ProjectService,  
  ) { }

  ngOnInit() {
    this.initForm();
  }

  public initForm(): void {
    this.fg = new FormGroup({
      title: new FormControl(null, Validators.required),
    });

    if (this.project) {
      this.fg.patchValue({
        title: this.project.title,
      })
    }
  }

  public dismiss(): void {
    this.modalController.dismiss();
  }

  public save(): void {
    if (this.project) {
      this.updateProject();
    } else {
      this.createProject();
    }
  }

  public createProject(): void {
    const params = {
      title: this.fg.get('title').value,
      iconName: this.iconName,
    };
    this.projectService.create(params)
      .pipe(take(1))
      .subscribe((project: IProject) => {
        this.modalController.dismiss({ project });
      });
  }

  public updateProject(): void {
    const params = {
      id: this.project.id,
      title: this.fg.get('title').value,
      iconName: this.iconName,
    }
    this.projectService.update(params)
      .pipe(take(1))
      .subscribe((project: IProject) => {
        this.modalController.dismiss({ project });
      });
  }
}