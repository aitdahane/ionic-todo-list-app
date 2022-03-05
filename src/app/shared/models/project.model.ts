import { ITask } from 'src/app/shared/models/task.model';

export interface IProject {
  id: number;
  title: string;
  iconName?: string;
  imageName?: string;
  color?: string;
  tasks: ITask[];
  position?: number;
}
