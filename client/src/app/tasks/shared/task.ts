import { Task as TaskRest } from '@aitheon/orchestrator';

export class Task extends TaskRest {
  // Temp Properties
  selected: boolean;
  expanded: boolean;
  taskchecked: boolean;
  subTasks: any[] = [];
  depth = 0;
  startTime: Date;
  finishTime: Date;
  recurringSettings: Array<RecurringSetting>;
}

export class RecurringSetting {
  type: string;
  every: {
    enabled: boolean;
    type: string;
    value: any;
    specificTime: {
      enabled: boolean;
      hour: number;
      minutes: number;
    }
    dayOfMonth: string;
  };
  between: {
    enabled: boolean;
    type: string;
    start: {
      date: Date;
      hour: number;
      minutes: number;
    }
    end: {
      date: Date;
      hour: number;
      minutes: number;
    }
    minutes: {
      enabled: boolean;
      value: number;
    }
  };
  summary: string;
}

export enum TaskState {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE',
}

export const TaskType = TaskRest.TypeEnum;
