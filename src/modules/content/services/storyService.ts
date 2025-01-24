import { Story, SumStories } from "../../../interfaces/Story";
import { checkNaN } from "../helpers/checkNaN";
import { calculatePercentage } from "../helpers/percentage/calculatePercentage";
import { parseTime } from "../helpers/time/parseTime";
import { subtractTimes } from "../helpers/time/subtractTimes";
import { sumTimes } from "../helpers/time/sumTimes";
import { taskService } from "./taskService";

/**
 * Serviço responsável por gerenciar informações relacionadas às stories.
 */
export const storyService = {
  /**
   * Preenche as informações das stories no taskboard.
   *
   * Esta função localiza as stories no DOM, associa-as aos dados fornecidos e adiciona
   * informações detalhadas sobre cada story diretamente no elemento do título da story.
   *
   * @param { Story[] } stories - Lista de stories contendo informações detalhadas (como horas e tarefas).
   * @return Um objeto contendo o resumo textual de todas as stories.
   */
  fillStoriesInfo(stories: Story[]) {
    let totalStories = "";
    const taskboardCards = document.querySelectorAll(".taskboard-us");
    taskboardCards.forEach((taskboardCard: HTMLDivElement) => {
      const title = taskboardCard.querySelector(".us-title") as HTMLElement;
      const story = stories.find(
        (story: Story) => story.name === title.innerText
      );
      const storyData = document.createElement("ul");
      storyData.className = "sprint-burndown__stories-info";
      storyData.id = "stories";
      storyData.innerHTML = `
        <li>TOTAL (HR): ${checkNaN(story?.totalHR)} (${checkNaN(
        story?.remainingHours
      )} - ${checkNaN(story?.totalPercent)}%)</li>
        <li>CLOSED (HR): ${checkNaN(story?.totalClosedHR)}</li>
        <li>NEW CLOSED (HR): ${checkNaN(story?.totalNewHR)}</li>
        <li>TASKS (QTD): ${story?.tasks.length} (CLOSED: ${
        story?.totalClosed
      } / NEW: ${story?.totalNew})</li>`;
      title.appendChild(storyData);
      totalStories +=
        story?.name.replace("\n", " ") + "\n" + storyData.innerText + "\n\n";
    });

    return {
      countTotal: totalStories,
    };
  },

  /**
   * Obtém a lista de stories do taskboard.
   *
   * Esta função extrai os dados das stories a partir do DOM, calcula métricas e
   * retorna uma lista com os detalhes de cada story.
   *
   * @return { Story[] } Uma lista de objetos representando as stories do taskboard.
   */
  getStories(): Story[] {
    try {
      const stories: Story[] = [];
      document.querySelectorAll(".taskboard-row").forEach((item) => {
        const tasks = taskService.getTasks(item);
        const {
          totalHR,
          totalTypes,
          totalClosed,
          totalNew,
          totalClosedHR,
          totalNewHR,
          totalClosedNewHR,
        } = taskService.getTotalTasksInfos(tasks);

        const totalPercent = calculatePercentage(
          parseTime(totalClosedHR),
          parseTime(totalHR)
        );
        const remainingHours = subtractTimes(totalClosedHR, totalHR);

        stories.push({
          name:
            (item.querySelector(".us-title") as HTMLElement)?.innerText ||
            "NOT FOUND",
          tasks,
          totalHR,
          totalTypes,
          totalClosed,
          totalClosedHR,
          totalNewHR,
          totalNew,
          totalPercent,
          remainingHours,
          totalClosedNewHR,
        });
      });

      return stories;
    } catch (error) {
      console.error(error);
      return [];
    }
  },


  /**
   * Soma as métricas de várias stories.
   * 
   * Esta função calcula os totais de horas, tarefas e tipos de tarefas 
   * a partir de uma lista de stories.
   * 
   * @param { Story[] } stories - Lista de stories para cálculo de métricas totais.
   * @return { SumStories } Um objeto contendo os totais agregados das stories.
   */
  sumStories(stories: Story[]): SumStories {
    let totalHR = "0.00";
    let totalClosedHR = "0.00";
    let totalClosed = 0;
    let totalNew = 0;
    let totalNewHR = "0.00";
    const totalTypes: Record<string, number> = {};

    stories.forEach((story) => {
      totalHR = sumTimes(totalHR, story.totalHR);
      totalClosedHR = sumTimes(totalClosedHR, story.totalClosedHR);
      totalClosed += story.totalClosed;
      totalNew += story.totalNew;
      totalNewHR = sumTimes(totalNewHR, story.totalNewHR);
      Object.keys(story.totalTypes).forEach((type) => {
        totalTypes[type] = (totalTypes[type] || 0) + Number(story.totalTypes[type]);
      });
    });

    return {
      totalHR,
      totalTypes,
      totalClosed,
      totalNew,
      totalClosedHR,
      totalNewHR,
    };
  },
};
