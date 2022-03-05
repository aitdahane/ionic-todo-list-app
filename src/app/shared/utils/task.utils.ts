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
