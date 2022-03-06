export interface Task {
  id: number;
  title: string;
  status: TaskStatusEnum;
  note?: string;
  position?: number;
  projectId: number;
  startDate?: string;
  endDate?: string;
}

export enum TaskStatusEnum {
  TO_DO = 'to_do',
  DONE = 'complete',
}

export enum TaskStatusFilterEnum {
  ALL = 'ALL',
  COMPLETED = 'COMPLETED',
  UNCOMPLETED = 'UNCOMPLETED',
}
