import { MemberTaskInfo } from "./Member";

export interface GetDataResponse {
  squadName: string;
  duration: string;
  totalHR: string;
  totalClosedHR: string;
  totalClosed: number;
  totalNew: number;
  remainingHours: string;
  totalPercent: string;
  aggregatedMembersInfo: MemberTaskInfo[];
  totalNewHR: string;
  totalTasks: string;
  totalStories: string;
}
