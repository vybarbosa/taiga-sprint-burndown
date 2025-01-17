import { MemberTaskInfo } from "../../interfaces";

export function fillMembersTable(
  table: HTMLTableElement,
  membersInfo: MemberTaskInfo[]
) {
  membersInfo.forEach((member) => {
    const row = document.createElement("tr");
    const memberImageCell = document.createElement("td");
    memberImageCell.innerHTML = `<img src="${member.img}"
    alt="${member.member}"
    title="${member.member}"/>`;
    row.appendChild(memberImageCell);
    const memberCell = document.createElement("td");
    memberCell.textContent = `${member.member}: `;
    row.appendChild(memberCell);
    const hoursCell = document.createElement("td");
    hoursCell.textContent = `${member.closedHours}H / ${member.assignedHours}H`;
    row.appendChild(hoursCell);
    const tasksCell = document.createElement("td");
    tasksCell.textContent = `(${member.closedTasks.toString()} / ${member.assignedTasks.toString()} tasks) | ${
      member.hoursPerDay
    }H Day`;
    row.appendChild(tasksCell);
    table.appendChild(row);
  });
}
