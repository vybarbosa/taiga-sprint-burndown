import { Task } from "./Task";

export interface Story {
  name: string;
  tasks: Task[];
  totalHR: string;
  totalTypes: { [key: string]: string };
  totalClosed: number;
  totalClosedHR: string;
  totalNew: number;
  totalPercent: string;
  remainingHours: string;
  totalNewHR: string;
  totalClosedNewHR: string;
}

export interface SumStories {
  totalHR: string;
  totalTypes: Record<string, number>;
  totalClosed: number;
  totalNew: number;
  totalClosedHR: string;
  totalNewHR: string;
}
