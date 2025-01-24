import { calculatePercentage } from "./helpers/percentage/calculatePercentage";
import { getDuration } from "./helpers/duration/getDuration";
import { parseTime } from "./helpers/time/parseTime";
import { subtractTimes } from "./helpers/time/subtractTimes";
import { storyService } from "./services/storyService";
import { memberService } from "./services/memberService";
import { squadService } from "./services/squadService";
import { layoutService } from "./services/layoutService";
import { taskService } from "./services/taskService";

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.action === "getData") {
    layoutService.clearElements();
    const squadName = squadService.getSquadName();
    const duration = getDuration();
    const stories = storyService.getStories();
    const {
      totalHR,
      totalTypes,
      totalClosed,
      totalNew,
      totalClosedHR,
      totalNewHR,
    } = storyService.sumStories(stories);
    const aggregatedMembersInfo = memberService.aggregateMembersInfo(stories);
    const totalPercent = calculatePercentage(
      parseTime(totalClosedHR),
      parseTime(totalHR)
    );
    layoutService.updateProgressBar(totalPercent);

    const remainingHours = subtractTimes(totalClosedHR, totalHR);

    const { countTotal } = storyService.fillStoriesInfo(stories);
    const totalStories = countTotal;

    const totalTasks = taskService.getTotalTasksByType(totalTypes);

    layoutService.renderSummary({
      totalClosedHR,
      totalHR,
      remainingHours,
      totalNewHR,
      totalNew,
      duration,
      totalClosed,
      aggregatedMembersInfo,
      totalTypes,
    });

    sendResponse({
      squadName,
      duration,
      totalHR,
      totalClosedHR,
      totalClosed,
      totalNew,
      remainingHours,
      totalPercent,
      aggregatedMembersInfo,
      totalNewHR,
      totalTasks,
      totalStories,
    });
  }
});
