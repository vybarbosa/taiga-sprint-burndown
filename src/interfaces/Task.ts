export interface Task {
  type: string;
  title: string;
  hours: string;
  isClosed: boolean;
  isNew: boolean;
  assignedTo: string;
  memberImageUrl: string;
}

export interface TotalTaskInfo {
  totalHR: string;
  totalTypes: { [key: string]: string };
  totalClosed: number;
  totalClosedHR: string;
  totalNew: number;
  totalNewHR: string;
  totalClosedNewHR: string;
}
