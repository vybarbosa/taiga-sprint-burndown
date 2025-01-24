import { MemberTaskInfo } from "../../../interfaces/Member";
import { createDurationWrapper } from "../layout/duration";
import { createQtdNewWrapper } from "../layout/qtdNew";
import { createTotalHrWrapper } from "../layout/totalHr";
import { createTotalNewHRWrapper } from "../layout/totalNewHr";

interface SummaryData {
  totalClosedHR: string;
  totalHR: string;
  remainingHours: string;
  totalNewHR: string;
  totalNew: number;
  duration: string;
  totalClosed: number;
  aggregatedMembersInfo: MemberTaskInfo[];
  totalTypes: any;
}

export const layoutService = {
  clearElements(summary: HTMLDivElement) {
    const idsToRemove = [
      "#duration",
      "#total-hr-wrapper",
      "#qtd-new-hr-wrapper",
      "#qtd-total",
      "#qtd-new",
      "#qtd-new-hr",
      "#members-info-wrapper",
    ];
    idsToRemove.forEach((id) => {
      const element = document.querySelector(id);
      if (element) element.remove();
    });

    document
      .querySelectorAll("#stories")
      .forEach((element) => element.remove());

    if (summary) {
      summary.classList.add("active");
      const toggleAnalyticsWrapper = summary.querySelector(
        ".stats.toggle-analytics-visibility"
      ) as HTMLDivElement;
      const largeSummaryWrapper = summary.querySelector(
        ".large-summary-wrapper"
      ) as HTMLDivElement;
      largeSummaryWrapper.appendChild(toggleAnalyticsWrapper);
      const classesToRemove = [
        ".summary-stats.summary-iocaine",
        ".summary-stats.summary-open-tasks",
        ".points-per-role-stats",
      ];

      classesToRemove.forEach((classToRemove) => {
        const element = document.querySelector(classToRemove);
        if (element) element.remove();
      });
    }
  },

  updateProgressBar(percent: string) {
    const progressBarWrapper = document.querySelector(
      ".summary-progress-wrapper"
    );
    const progressBar = progressBarWrapper?.querySelector(
      ".current-progress"
    ) as HTMLElement;
    const progressBarDataNumber = progressBarWrapper?.querySelector(
      ".number"
    ) as HTMLElement;

    if (progressBar && progressBarDataNumber) {
      progressBar.style.width = `${percent}%`;
      progressBarDataNumber.innerText = `${percent}%`;
    }
  },

  renderSummary({
    totalClosedHR,
    totalHR,
    remainingHours,
    totalNewHR,
    totalNew,
    duration,
    totalClosed,
    aggregatedMembersInfo,
    totalTypes,
  }: SummaryData) {
    const mainTaskboard = document.querySelector(
      ".main.taskboard"
    ) as HTMLDivElement;
    const summary = mainTaskboard.querySelector(
      ".large-summary"
    ) as HTMLDivElement;

    if (!summary) return;

    this.clearElements(summary);

    const mainSummaryStats = summary.querySelector(".main-summary-stats");

    // Adiciona informações de resumo ao DOM
    createTotalHrWrapper(
      mainSummaryStats,
      totalClosedHR,
      totalHR,
      remainingHours
    );
    createTotalNewHRWrapper(mainSummaryStats, totalNewHR);
    createQtdNewWrapper(mainSummaryStats, totalNew);
    createDurationWrapper(summary, duration);

    // Preenche informações de tasks e membros
    const membersAndTasksWrapper = layoutService.createMembersAndTasksWrapper(
      aggregatedMembersInfo,
      totalTypes
    );

    // Insere o wrapper na taskboard
    const taskboardInner = document.querySelector(".taskboard-inner");
    taskboardInner.insertBefore(
      membersAndTasksWrapper,
      taskboardInner.childNodes[5]
    );
  },

  createMembersAndTasksWrapper: (
    aggregatedMembersInfo: any,
    totalTypes: Record<string, number>
  ) => {
    // Cria o título e tabela de membros
    const membersInfoWrapper = layoutService.createMembersInfoWrapper(
      aggregatedMembersInfo
    );

    // Cria o título e lista de tarefas
    const totalTasksWrapper = layoutService.createTotalTasksWrapper(totalTypes);

    // Wrapper interno que agrupa membros e tarefas
    const internalWrapper = document.createElement("div");
    internalWrapper.className = "sprint-burndown__members-internal-wrapper";

    internalWrapper.appendChild(membersInfoWrapper);
    internalWrapper.appendChild(totalTasksWrapper);

    // Wrapper externo
    const membersAndTasksWrapper = document.createElement("div");
    membersAndTasksWrapper.className =
      "sprint-burndown__members-external-wrapper";
    membersAndTasksWrapper.appendChild(internalWrapper);

    return membersAndTasksWrapper;
  },

  createMembersInfoWrapper: (aggregatedMembersInfo: any) => {
    const title = document.createElement("h3");
    title.className = "sprint-burndown__title";
    title.textContent = "Membros";

    const table = document.createElement("table");
    table.className = "sprint-burndown__members";
    layoutService.fillMembersTable(table, aggregatedMembersInfo);

    const wrapper = document.createElement("div");
    wrapper.appendChild(title);
    wrapper.appendChild(table);

    return wrapper;
  },

  createTotalTasksWrapper: (totalTypes: Record<string, number>) => {
    const title = document.createElement("h3");
    title.className = "sprint-burndown__title";

    const list = document.createElement("ul");
    list.className = "sprint-burndown__total-tasks--list";
    list.innerHTML = Object.entries(totalTypes)
      .map(([key, value]) => `<li>${key}: ${value}</li>`)
      .join("");

    const wrapper = document.createElement("div");
    const totalOfTotalTypes = Object.values(totalTypes).reduce(
      (acc, curr) => acc + curr,
      0
    );

    title.textContent = `Tasks (${totalOfTotalTypes})`;
    wrapper.appendChild(title);
    wrapper.appendChild(list);

    return wrapper;
  },

  /**
   * Preenche uma tabela HTML com informações dos membros.
   * @param table Tabela HTML onde os dados serão inseridos.
   * @param membersInfo Informações dos membros a serem preenchidas.
   */
  fillMembersTable(
    table: HTMLTableElement,
    membersInfo: MemberTaskInfo[]
  ): void {
    membersInfo.forEach((member) => {
      const row = document.createElement("tr");

      // Celula com a imagem do membro
      const memberImageCell = document.createElement("td");
      memberImageCell.innerHTML = `<img src="${member.img}" alt="${member.member}" title="${member.member}" />`;
      row.appendChild(memberImageCell);

      // Celula com o nome do membro
      const memberCell = document.createElement("td");
      memberCell.textContent = `${member.member}: `;
      row.appendChild(memberCell);

      // Celula com as horas fechadas / atribuídas
      const hoursCell = document.createElement("td");
      hoursCell.textContent = `${member.closedHours}H / ${member.assignedHours}H`;
      row.appendChild(hoursCell);

      // Celula com as tarefas e horas por dia
      const tasksCell = document.createElement("td");
      tasksCell.textContent = `(${member.closedTasks.toString()} / ${member.assignedTasks.toString()} tasks) | ${
        member.hoursPerDay
      }H Day`;
      row.appendChild(tasksCell);

      // Adiciona a linha na tabela
      table.appendChild(row);
    });
  },
};
