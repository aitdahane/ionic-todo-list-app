import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { Project } from '../../models/project.model';
import { ProjectService } from '../../services/project.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
})
export class MenuComponent implements OnInit {
  public projects$: Observable<Project[]>;
  public selectedProjectId: number;
  

  constructor(
    private menu: MenuController,
    private router: Router,
    private projectService: ProjectService
  ) {}

  public ngOnInit(): void {
    this.projects$ = this.projectService.projects$;
  }

  public goToDashboard(): void {
    this.menu.close();
    this.router.navigate(['/dashboard']);
  }

  public goToCalendar(): void {
    this.menu.close();
    this.router.navigate(['/calendar']);
  }

  public goToProject(project: Project): void {
    this.menu.close();
    this.router.navigate(['/project', project.id]);
  }
}
