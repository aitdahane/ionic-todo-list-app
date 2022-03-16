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
  TO_DO = 'TO_DO',
  DONE = 'DONE',
}

export enum TaskStatusFilterEnum {
  ALL = 'ALL',
  COMPLETED = 'COMPLETED',
  UNCOMPLETED = 'UNCOMPLETED',
}

export interface TaskCreateParams {
  title: string;
  note?: string;
  position?: number;
  projectId: number;
  startDate?: string;
  endDate?: string;
}

export interface TaskUpdateParams {
  id: number;
  title?: string;
  note?: string;
  startDate?: string;
  endDate?: string;
}

export interface TaskUpdateStatusParams {
  id: number;
  status: TaskStatusEnum;
}

export interface TaskDeleteParams {
  id: number;
  status: TaskStatusEnum;
}

export interface TaskReorderParams {
  projectId: number;
  fromPosition?: number;
  toPosition?: number;
}
