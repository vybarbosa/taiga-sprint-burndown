import { MemberTaskInfo } from "../../../interfaces/Member";
import { checkNaN } from "../helpers/checkNaN";

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
  clearElements() {
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
  },

  clearSummary(summary: HTMLDivElement) {
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

    layoutService.clearSummary(summary);

    const mainSummaryStats = summary.querySelector(".main-summary-stats");

    // Adiciona informações de resumo ao DOM
    layoutService.createTotalHrWrapper(
      mainSummaryStats,
      totalClosedHR,
      totalHR,
      remainingHours
    );
    layoutService.updateTotalClosedWrapper(totalClosed);
    layoutService.createTotalNewHRWrapper(mainSummaryStats, totalNewHR);
    layoutService.createQtdNewWrapper(mainSummaryStats, totalNew);
    layoutService.createDurationWrapper(summary, duration);

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
    membersAndTasksWrapper.id = "members-info-wrapper";
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
    wrapper.id = "qtd-total";
    const totalOfTotalTypes = Object.values(totalTypes).reduce(
      (acc, curr) => acc + curr,
      0
    );

    title.textContent = `Tasks (${totalOfTotalTypes})`;
    wrapper.appendChild(title);
    wrapper.appendChild(list);

    return wrapper;
  },

  createTotalNewHRWrapper(mainSummaryStats: Element, totalNewHR: string) {
    // =-=-=-=-= total New Hr =-=-=-=-=
    const newHrWrapper = document.createElement("div");
    newHrWrapper.className = "summary-stats";
    newHrWrapper.id = "qtd-new-hr";
    const newHrNumber = document.createElement("span");
    newHrNumber.className = "number";
    const newHrDescription = document.createElement("span");
    newHrDescription.className = "description";
    newHrNumber.textContent = totalNewHR;
    newHrDescription.innerHTML = "total new<br/>(hrs)";
    newHrWrapper.appendChild(newHrNumber);
    newHrWrapper.appendChild(newHrDescription);
    mainSummaryStats.insertBefore(newHrWrapper, mainSummaryStats.childNodes[7]);
  },

  createTotalHrWrapper(
    mainSummaryStats: Element,
    totalClosedHR: string,
    totalHR: string,
    remainingHours: string
  ) {
    // =-=-=-=-= Total Hr =-=-=-=-=
    const totalHrWrapper = document.createElement("div");
    totalHrWrapper.className = "summary-stats";
    const totalHrNumber = document.createElement("span");
    totalHrNumber.id = "total-hr";
    totalHrWrapper.id = "total-hr-wrapper";
    totalHrNumber.className = "number";
    const totalHrDescription = document.createElement("span");
    totalHrDescription.className = "description";
    totalHrNumber.textContent = `${checkNaN(totalClosedHR)} / ${checkNaN(
      totalHR
    )}`;
    totalHrDescription.innerHTML = `total hrs <br/>(${remainingHours} hrs remaining)`;
    totalHrWrapper.appendChild(totalHrNumber);
    totalHrWrapper.appendChild(totalHrDescription);
    mainSummaryStats.insertBefore(
      totalHrWrapper,
      mainSummaryStats.childNodes[0]
    );
  },

  createQtdNewWrapper(mainSummaryStats: Element, totalNew: number) {
    const qtdNewWrapper = document.createElement("div");
    qtdNewWrapper.className = "summary-stats";
    const qtdNewNumber = document.createElement("span");
    qtdNewWrapper.id = "qtd-new";
    qtdNewNumber.className = "number";
    const qtdNewDescription = document.createElement("span");
    qtdNewDescription.className = "description";
    qtdNewNumber.textContent = `${totalNew}`;
    qtdNewDescription.innerHTML = "new<br/> tasks";
    qtdNewWrapper.appendChild(qtdNewNumber);
    qtdNewWrapper.appendChild(qtdNewDescription);
    mainSummaryStats.insertBefore(
      qtdNewWrapper,
      mainSummaryStats.childNodes[7]
    );
  },

  createDurationWrapper(summary: Element, duration: string) {
    const durationWrapper = document.createElement("div");
    durationWrapper.className =
      "sprint-burndown__duration-wrapper summary-stats";
    durationWrapper.id = "duration";
    const durationDescription = document.createElement("span");
    durationDescription.className = "description";
    durationDescription.textContent = duration;
    durationWrapper.appendChild(durationDescription);
    summary.insertBefore(durationWrapper, summary.childNodes[0]);
  },

  updateTotalClosedWrapper(totalClosed: number) {
    const totalClosedWrapper = document.querySelector(".summary-closed-tasks");
    const totalClosedNumber = totalClosedWrapper.childNodes[0] as HTMLElement;
    totalClosedNumber.innerText = `${totalClosed}`;
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
