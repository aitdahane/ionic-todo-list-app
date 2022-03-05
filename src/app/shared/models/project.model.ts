import { Task } from 'src/app/shared/models/task.model';

export interface Project {
  id: number;
  title: string;
  iconName?: string;
  imageName?: string;
  color?: string;
  tasks: Task[];
  position?: number;
}
