import { Component, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ProjectService } from 'src/app/shared/services/project.service';
import { ModalController } from '@ionic/angular';
import { take } from 'rxjs/operators';
import { Project } from 'src/app/shared/models/project.model';
import { ProjectImagePickerModalComponent } from '../project-image-picker/project-image-picker.modal';

@Component({
  selector: 'app-project-edit-modal',
  templateUrl: './project-edit.modal.html',
  styleUrls: ['./project-edit.modal.scss'],
})
export class ProjectEditModalComponent {
  @Input() project: Project;
  public fg: FormGroup;
  public iconName: string;
  public imageName: string;

  constructor(
    private modalController: ModalController,
    private projectService: ProjectService
  ) {}

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
      });
      this.iconName = this.project.iconName;
      this.imageName = this.project.imageName;
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
      imageName: this.imageName,
    };
    this.projectService
      .create(params)
      .pipe(take(1))
      .subscribe((project: Project) => {
        this.modalController.dismiss({ project });
      });
  }

  public updateProject(): void {
    const params = {
      id: this.project.id,
      title: this.fg.get('title').value,
      iconName: this.iconName,
      imageName: this.imageName,
    };
    this.projectService
      .update(params)
      .pipe(take(1))
      .subscribe((project: Project) => {
        this.modalController.dismiss({ project });
      });
  }

  public async pickImage(): Promise<void> {
    const modal = await this.modalController.create({
      component: ProjectImagePickerModalComponent,
    });
    modal.onDidDismiss().then((result) => {
      if (!result.data) return;
      this.imageName = result.data.imageName;
    });
    await modal.present();
  }
}
