import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-project-image',
  templateUrl: './project-image.component.html',
  styleUrls: ['./project-image.component.scss'],
})
export class ProjectImageComponent implements OnInit {
  @Input() public projectImage: string;

  constructor() {}

  ngOnInit() {}
}
