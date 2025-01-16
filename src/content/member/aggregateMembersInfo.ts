import { MemberTaskInfo, Story } from "../../interfaces";
import { getDifferenceInDaysFromToday } from "../getDuration";
import { formatTime } from "../time/formatTime";
import { parseTime } from "../time/parseTime";

export function aggregateMembersInfo(storys: Story[]): MemberTaskInfo[] {
  const memberMap: {
    [member: string]: {
      member: string;
      img: string;
      assignedHours: number;
      closedHours: number;
      assignedTasks: number;
      closedTasks: number;
    };
  } = {};
  const differenceInDaysFromToday = getDifferenceInDaysFromToday();

  storys.forEach((story) => {
    story.tasks.forEach((task) => {
      const { assignedTo, hours, isClosed, memberImageUrl } = task;
      if (assignedTo !== "Not assigned") {
        if (!memberMap[assignedTo]) {
          memberMap[assignedTo] = {
            member: assignedTo,
            img: memberImageUrl,
            assignedHours: 0,
            closedHours: 0,
            assignedTasks: 0,
            closedTasks: 0,
          };
        }
        memberMap[assignedTo].assignedHours += parseTime(hours);
        memberMap[assignedTo].assignedTasks += 1;
        if (isClosed) {
          memberMap[assignedTo].closedHours += parseTime(hours);
          memberMap[assignedTo].closedTasks += 1;
        }
      }
    });
  });

  return Object.values(memberMap)
    .sort((a, b) => {
      const hoursDifference = b.closedHours - a.closedHours;
      if (hoursDifference !== 0) {
        return hoursDifference;
      }
      return b.closedTasks - a.closedTasks;
    })
    .map(({ member, img, closedHours, assignedHours, assignedTasks, closedTasks }) => {
      const hoursPerDay = closedHours / differenceInDaysFromToday;
      return {
        member,
        img,
        assignedHours: formatTime(assignedHours),
        closedHours: formatTime(closedHours),
        hoursPerDay: formatTime(hoursPerDay),
        assignedTasks,
        closedTasks,
      };
    });
}
