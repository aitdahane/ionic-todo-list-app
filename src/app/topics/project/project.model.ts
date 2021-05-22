import { ITask } from 'src/app/topics/task/task.model';

export interface IProject {
  id: number;
  title: string;
  iconName?: string;
  imageName?: string;
  color?: string;
  tasks: ITask[];
}