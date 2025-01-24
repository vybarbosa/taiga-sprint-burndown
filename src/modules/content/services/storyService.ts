import { Story, SumStorys } from "../../../interfaces/Story";
import { calculatePercentage } from "../helpers/percentage/calculatePercentage";
import { parseTime } from "../helpers/time/parseTime";
import { subtractTimes } from "../helpers/time/subtractTimes";
import { sumTimes } from "../helpers/time/sumTimes";
import { taskService } from "./taskService";

function checkNaN(hr: string) {
  return hr?.includes("NaN") ? "NOT FOUND" : hr;
}

export const storyService = {
  /**
   * Fills the stories information in the DOM and calculates total story details.
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
   * Retrieves all stories from the DOM and calculates their information.
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
   * Sums up all the story information for aggregated reporting.
   */
  sumStories(stories: Story[]): SumStorys {
    let totalHR = "0.00";
    let totalClosedHR = "0.00";
    let totalClosed = 0;
    let totalNew = 0;
    let totalNewHR = "0.00";
    const totalTypes: Record<string, string> = {};

    stories.forEach((story) => {
      totalHR = sumTimes(totalHR, story.totalHR);
      totalClosedHR = sumTimes(totalClosedHR, story.totalClosedHR);
      totalClosed += story.totalClosed;
      totalNew += story.totalNew;
      totalNewHR = sumTimes(totalNewHR, story.totalNewHR);
      Object.keys(story.totalTypes).forEach((type) => {
        totalTypes[type] = (totalTypes[type] || 0) + story.totalTypes[type];
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
  }
};
