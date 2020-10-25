import { Component } from '@angular/core';
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
  public fg: FormGroup;

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
  }

  public dismiss(): void {
    this.modalController.dismiss();
  }

  public save(): void {
    const parmas = {
      title: this.fg.get('title').value,
    }
    this.projectService.create(parmas)
      .pipe(take(1))
      .subscribe((project: IProject) => {
        this.modalController.dismiss({ project });
      });
  }
}