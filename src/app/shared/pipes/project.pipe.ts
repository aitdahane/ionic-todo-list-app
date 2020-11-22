import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'projectImageUrl',
})
export class ProjectImageUrlPipe implements PipeTransform {
  public transform(imageName: string, defaultName: string = 'list'): string {
    return `url(assets/img/${imageName || defaultName}.png)`;
  }
}