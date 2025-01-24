import { Task, TotalTaskInfo } from "../../../interfaces/Task";
import { sumTimes } from "../helpers/time/sumTimes";

/**
 * Serviço para gerenciar e processar tasks.
 */
export const taskService = {

  /**
   * Extrai as informações de uma task a partir de um elemento HTML.
   *
   * @param { Element } item - O elemento HTML que representa uma task.
   * @return { Task } As informações da task extraídas.
   */
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

  /**
   * Recupera todas as tasks a partir de um documento HTML.
   *
   * @param { Element } document - O documento HTML contendo as tasks.
   * @return { Task[] } Um array de tasks.
   */
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


  /**
   * Calcula informações totais sobre uma lista de tasks.
   *
   * @param {Task[]} tasks - A lista de tasks a ser processada.
   * @return {TotalTaskInfo} As informações totais das tasks.
   */
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


  /**
   * Calcula o total de tasks agrupadas por tipo.
   *
   * @param {Record<string, number>} totalTypes - Um objeto contendo a quantidade de tasks por tipo.
   * @return A string com o total de tasks, incluindo o detalhamento por tipo.
   */
  getTotalTasksByType(totalTypes: Record<string, number>) {
    let totalTasks = '';
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
