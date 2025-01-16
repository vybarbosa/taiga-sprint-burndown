import { MemberTaskInfo } from "../interfaces";

export function renderMembersInfos(membersInfos: MemberTaskInfo[]) {
  return membersInfos.reduce((acc, curr) => {
    return acc + `Membro: ${curr.member} | HRs: ${curr.closedHours} / ${curr.assignedHours} | Tasks: ${curr.closedTasks} / ${curr.assignedTasks}\n`;
  }, '')
}
