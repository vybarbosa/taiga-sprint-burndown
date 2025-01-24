import { MemberTaskInfo } from "./Member";

export interface SummaryData {
  totalClosedHR: string;
  totalHR: string;
  remainingHours: string;
  totalNewHR: string;
  totalNew: number;
  duration: string;
  totalClosed: number;
  aggregatedMembersInfo: MemberTaskInfo[];
  totalTypes: Record<string, number>;
}
