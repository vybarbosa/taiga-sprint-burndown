import { calculatePercentage } from "./calculatePercentage";
import { getDuration } from "./getDuration";
import { aggregateMembersInfo } from "./member/aggregateMembersInfo";
import { getStorys } from "./story/getStorys";
import { sumStorys } from "./story/sumStorys";
import { parseTime } from "./time/parseTime";
import { subtractTimes } from "./time/subtractTimes";
import { getSquadName } from "./squad/getSquadName";
import { fillMembersTable } from "./member/fillMembersTable";
import { clearOldData } from "./clearOldData";
import { fillStoriesInfo } from "./story/fillStoriesInfo";
import { createTotalHrWrapper } from "./layout/totalHr";
import { createTotalNewHRWrapper } from "./layout/totalNewHr";
import { createQtdNewWrapper } from "./layout/qtdNew";
import { createDurationWrapper } from "./layout/duration";
import { updateTotalClosedWrapper } from "./layout/totalClosed";

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  function checkNaN(hr: string) {
    return hr.includes("NaN") ? "NOT FOUND" : hr;
  }
  function conditionalRemoveElement(id: string) {
    const element = document.querySelector(id);
    if (element) {
      element.remove();
    }
  }

  function clearElements() {
    conditionalRemoveElement('#duration');
    conditionalRemoveElement('#total-hr-wrapper');
    conditionalRemoveElement('#qtd-new-hr-wrapper');
    conditionalRemoveElement('#qtd-total');
    conditionalRemoveElement('#qtd-new');
    conditionalRemoveElement('#qtd-new-hr');
    conditionalRemoveElement('#members-info-wrapper');
    const stories = Array.from(document.querySelectorAll('#stories'));
    stories.forEach((element) => {
      element.remove();
    });
  }

  if (message.action === "getData") {
    clearElements();
    const squadName = getSquadName();
    const duration = getDuration();
    const storys = getStorys();
    const {
      totalHR,
      totalTypes,
      totalClosed,
      totalNew,
      totalClosedHR,
      totalNewHR,
    } = sumStorys(storys);
    const aggregatedMembersInfo = aggregateMembersInfo(storys);
    const totalPercent = calculatePercentage(
      parseTime(totalClosedHR),
      parseTime(totalHR)
    );
    const remainingHours = subtractTimes(totalClosedHR, totalHR);

    const mainTaskboard = document.querySelector(
      ".main.taskboard"
    ) as HTMLDivElement;
    const summary = mainTaskboard.querySelector(
      ".large-summary"
    ) as HTMLDivElement;

    let totalTasks = "";
    let totalStories = "";
    let membersInfoText = "";
    if (mainTaskboard && summary) {
      clearOldData(mainTaskboard, summary);

      const mainSummaryStats = summary.querySelector(".main-summary-stats");

      const progressBarWrapper = document.querySelector(
        ".summary-progress-wrapper"
      );
      const progressBar = (
        progressBarWrapper.childNodes[1] as HTMLElement
      ).querySelector(".current-progress") as HTMLElement;
      const progressBarDataNumber = (
        progressBarWrapper.childNodes[3] as HTMLElement
      ).querySelector(".number") as HTMLElement;
      progressBar.style.width = `${checkNaN(totalPercent)}%`;
      progressBarDataNumber.innerText = `${checkNaN(totalPercent)}%`;

      updateTotalClosedWrapper(totalClosed);

      createTotalHrWrapper(
        mainSummaryStats,
        totalClosedHR,
        totalHR,
        remainingHours
      );

      createTotalNewHRWrapper(mainSummaryStats, totalNewHR);

      createQtdNewWrapper(mainSummaryStats, totalNew);

      createDurationWrapper(summary, duration);

      // =-=-=-=-= Stories =-=-=-=-=
      const { countTotal } = fillStoriesInfo(storys);
      totalStories = countTotal;
      // =-=-=-=-= Members info =-=-=-=-=

      // Título da tabela de membros
      const membersInfoTitle = document.createElement(
        "h3"
      ) as HTMLHeadingElement;
      membersInfoTitle.className = "sprint-burndown__title";
      membersInfoTitle.textContent = "Membros";

      // Tabela da tabela de membros
      const membersInfoTable = document.createElement("table");
      membersInfoTable.className = "sprint-burndown__members";
      fillMembersTable(membersInfoTable, aggregatedMembersInfo);

      // Div interna que contém o título e a tabela da tabela de membros
      const membersInfoWrapper = document.createElement(
        "div"
      ) as HTMLDivElement;
      membersInfoWrapper.appendChild(membersInfoTitle);
      membersInfoWrapper.appendChild(membersInfoTable);

      // =-=-=-=-= Total Tasks =-=-=-=-=
      const totalTasksTitle = document.createElement(
        "h3"
      ) as HTMLHeadingElement;
      totalTasksTitle.className = "sprint-burndown__title";

      const totalTasksWrapper = document.createElement("div");
      const totalTasksList = document.createElement("ul");
      totalTasksList.className = "sprint-burndown__total-tasks--list";

      totalTasksList.style.flexDirection = "column";
      totalTasksList.style.gap = "1rem";
      totalTasksList.style.flexWrap = "wrap";
      totalTasksList.style.color = "#4c566a";

      const totalOfTotalTypes = Object.values(totalTypes).reduce(
        (acc: number, curr: number) => acc + curr,
        0
      );
      totalTasksTitle.textContent = `Tasks (${totalOfTotalTypes})`;
      totalTasksList.innerHTML = `${Object.entries(totalTypes)
        .map(([key, value]) => `<li>${key}: ${value}</li>`)
        .join(" ")}`;

      totalTasksWrapper.appendChild(totalTasksTitle);
      totalTasksWrapper.appendChild(totalTasksList);

      // Preenche a variável p ficar disponível para cópia
      totalTasks += `${totalOfTotalTypes} (${Object.entries(totalTypes)
        .map(([key, value]) => `${key}: ${value}`)
        .join(", ")})`;

      // Div interna que contém a tabela de membros e tasks
      const membersAndTasksInternalWrapper = document.createElement("div");
      membersAndTasksInternalWrapper.className = 'sprint-burndown__members-internal-wrapper'
      membersAndTasksInternalWrapper.appendChild(membersInfoWrapper);

      membersAndTasksInternalWrapper.style.padding = "1rem";
      membersAndTasksInternalWrapper.style.display = "flex";
      membersAndTasksInternalWrapper.style.gap = "5rem";
      membersAndTasksInternalWrapper.appendChild(totalTasksWrapper);

      // Div externa que contém a tabela de membros e tasks
      const membersAndTasksExternalWrapper = document.createElement("div");
      membersAndTasksExternalWrapper.className = 'sprint-burndown__members-external-wrapper';
      membersAndTasksExternalWrapper.appendChild(
        membersAndTasksInternalWrapper
      );

      // Taskboard
      const taskboardInner = document.querySelector(".taskboard-inner");
      taskboardInner.insertBefore(
        membersAndTasksExternalWrapper,
        taskboardInner.childNodes[5]
      );
    }

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
      membersInfoText,
    });
  }
});
