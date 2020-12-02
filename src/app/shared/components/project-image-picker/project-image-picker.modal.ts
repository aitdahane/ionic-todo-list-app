import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { take } from 'rxjs/operators';
import { TaskService } from 'src/app/topics/task/task.service';
import { ITask, TaskStatusEnum } from 'src/app/topics/task/task.model';

@Component({
  selector: 'app-project-image-picker',
  templateUrl: './project-image-picker.modal.html',
  styleUrls: ['./project-image-picker.modal.scss'],
})
export class ProjectImagePickerModalComponent implements OnInit {
  public projectImages: string[];

  constructor(public modalController: ModalController) {}

  public ngOnInit(): void {
    this.projectImages = [
      'plane',
      'book',
      'shirt',
      'laptop',
      'list',
      'clapperboard',
      'shopping-cart',
      'wallet',
      'suitcase',
      'game-controller',
      'pin',
      'giftbox',
      'film',
    ];
  }
  
  public chooseImage(imageName: string): void {
    this.modalController.dismiss({ imageName });
  }

  public trackByName(index: number, itemName: string): string {
    return itemName;
  }

  public dismiss(): void {
    this.modalController.dismiss();
  }
}
