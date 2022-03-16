import * as moment from 'moment';
import {
  Task,
  TaskStatusEnum,
  TaskStatusFilterEnum,
} from '../models/task.model';

export const filterTasksByStatus = (
  tasks: Task[],
  filterStatus: TaskStatusFilterEnum
) => {
  if (filterStatus === TaskStatusFilterEnum.ALL) {
    return tasks;
  }
  return tasks.filter(({ status }) => {
    const isCompleted = status === TaskStatusEnum.DONE;
    if (filterStatus === TaskStatusFilterEnum.COMPLETED) {
      return isCompleted;
    }
    return !isCompleted;
  });
};

export const computeTopPosition = (task: Task): number => {
  const { startDate } = task;
  if (!startDate) {
    return 0;
  }
  return (moment(startDate).minutes() / 60) * 100;
};

export const computeHeightSize = (task: Task): number => {
  const { startDate, endDate } = task;
  if (!startDate) {
    return 0;
  }
  return (moment(endDate).diff(startDate, 'minutes') / 60) * 100;
};

export const filterByProjectId = (tasks: Task[], projectId: number): Task[] =>
  tasks?.filter((task) => task.projectId === projectId);
