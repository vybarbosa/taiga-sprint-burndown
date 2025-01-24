import { Task, TotalTaskInfo } from "../../../interfaces/Task";
import { sumTimes } from "../helpers/time/sumTimes";

export const taskService = {
  getTaskInfo(item: Element): Task {
    const str = item.querySelector<HTMLElement>(".card-title").innerText || "";
    const isClosed = !!item.querySelector(".card-tag[title=closed]");
    const isNew = !!item.querySelector(".card-tag[title=new]");
    const assignedTo = item.querySelector<HTMLImageElement>(
      ".card-user-avatar img"
    ).title;
    const memberImageUrl = item.querySelector<HTMLImageElement>(
      ".card-user-avatar img"
    ).src;

    const regex = /#\d+\[([^\]]+)\]\s*([^\(]+)\s*\(([^)]+)\)/;
    const matches = str.match(regex);

    let type = "";
    let title = "";
    let hours = "";

    if (matches) {
      type = matches[1].trim();
      title = matches[2].trim();
      hours = matches[3].trim().replace("H", "");
    }

    return {
      type,
      title,
      hours,
      isClosed,
      isNew,
      assignedTo,
      memberImageUrl,
    };
  },

  getTasks(document: Element): Task[] {
    try {
      const tasks: Task[] = [];
      document.querySelectorAll(".card-inner").forEach((item) => {
        tasks.push(this.getTaskInfo(item));
      });

      return tasks;
    } catch (error) {
      return [];
    }
  },

  getTotalTasksInfos(tasks: Task[]): TotalTaskInfo {
    let totalHR = "0.00";
    let totalClosedHR = "0.00";
    let totalClosed = 0;
    let totalNew = 0;
    let totalNewHR = "0.00";
    let totalClosedNewHR = "0.00";
    const totalTypes = {};

    tasks.forEach((task) => {
      totalHR = sumTimes(totalHR, task.hours);
      totalTypes[task.type] = (totalTypes[task.type] || 0) + 1;
      totalClosed += task.isClosed ? 1 : 0;
      totalNew += task.isNew ? 1 : 0;

      totalNewHR = task.isNew ? sumTimes(totalNewHR, task.hours) : totalNewHR;
      totalClosedHR = task.isClosed
        ? sumTimes(totalClosedHR, task.hours)
        : totalClosedHR;
      totalClosedNewHR =
        task.isNew && task.isClosed
          ? sumTimes(totalClosedNewHR, task.hours)
          : totalClosedNewHR;
    });

    return {
      totalHR,
      totalTypes,
      totalClosed,
      totalClosedHR,
      totalNew,
      totalNewHR,
      totalClosedNewHR,
    };
  },

  getTotalTasksByType(totalTypes: Record<string, number>) {
    let totalTasks;
    const totalOfTotalTypes = Object.values(totalTypes).reduce(
      (acc, curr) => acc + curr,
      0
    );
    totalTasks += `${totalOfTotalTypes} (${Object.entries(totalTypes)
      .map(([key, value]) => `${key}: ${value}`)
      .join(", ")})`;

    return totalTasks;
  },
};
