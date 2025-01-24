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
    const storys = storyService.getStories();
    const {
      totalHR,
      totalTypes,
      totalClosed,
      totalNew,
      totalClosedHR,
      totalNewHR,
    } = storyService.sumStories(storys);
    const aggregatedMembersInfo = memberService.aggregateMembersInfo(storys);
    const totalPercent = calculatePercentage(
      parseTime(totalClosedHR),
      parseTime(totalHR)
    );
    layoutService.updateProgressBar(totalPercent);

    const remainingHours = subtractTimes(totalClosedHR, totalHR);

    const { countTotal } = storyService.fillStoriesInfo(storys);
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
      storys,
      totalHR,
      totalTypes,
      totalClosed,
      totalNew,
      totalClosedHR,
      totalPercent,
      remainingHours,
      aggregatedMembersInfo,
      totalNewHR,
      totalTasks,
      totalStories,
    });
  }
});
