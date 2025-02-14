import { MemberTaskInfo } from "../../../interfaces/Member";
import { SummaryData } from "../../../interfaces/SummaryData";
import { checkNaN } from "../helpers/checkNaN";

/**
 * Serviço responsável por manipular elementos do layout da interface.
 */
export const layoutService = {


  /**
   * Remove elementos específicos do DOM pelo ID para limpar os dados da extensão caso já estejam na tela.
   */
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


  /**
   * Limpa o conteúdo da div .large-summary nativa do Taiga e move elementos necessários para a área correspondente.
   * @param summary Elemento HTML que representa a div .large-summary.
   */
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
      ".tg-svg"
    ];

    const toggleTotalPoints = summary.querySelector(".summary-stats.toggle-points-per-role") as HTMLDivElement;
    if (toggleTotalPoints) {
      toggleTotalPoints.style.pointerEvents = "none";
    }

    classesToRemove.forEach((classToRemove) => {
      const element = document.querySelector(classToRemove);
      if (element) element.remove();
    });
  },


  /**
   * Atualiza a barra de progresso com a porcentagem fornecida.
   * @param percent Porcentagem a ser exibida na barra de progresso.
   */
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


  /**
   * Renderiza todas as informações da extensão da interface.
   * @param summaryData Objeto contendo os dados necessários para exibição das informações.
   */
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

    const membersAndTasksWrapper = layoutService.createMembersAndTasksWrapper(
      aggregatedMembersInfo,
      totalTypes
    );

    const taskboardInner = document.querySelector(".taskboard-inner");
    taskboardInner.insertBefore(
      membersAndTasksWrapper,
      taskboardInner.childNodes[5]
    );
  },


  /**
   * Cria um wrapper que agrupa informações de membros e tarefas.
   * @param aggregatedMembersInfo Informações agregadas sobre os membros.
   * @param totalTypes Total de tipos de tarefas agrupadas.
   * @returns { HTMLDivElement } Elemento HTML contendo o agrupamento de informações.
   */
  createMembersAndTasksWrapper: (
    aggregatedMembersInfo: MemberTaskInfo[],
    totalTypes: Record<string, number>
  ) => {
    const membersInfoWrapper = layoutService.createMembersInfoWrapper(
      aggregatedMembersInfo
    );

    const totalTasksWrapper = layoutService.createTotalTasksWrapper(totalTypes);

    const internalWrapper = document.createElement("div");
    internalWrapper.className = "sprint-burndown__members-internal-wrapper";

    internalWrapper.appendChild(membersInfoWrapper);
    internalWrapper.appendChild(totalTasksWrapper);

    const membersAndTasksWrapper = document.createElement("div");
    membersAndTasksWrapper.className =
      "sprint-burndown__members-external-wrapper";
    membersAndTasksWrapper.id = "members-info-wrapper";
    membersAndTasksWrapper.appendChild(internalWrapper);

    return membersAndTasksWrapper;
  },


  /**
   * Cria um wrapper contendo informações dos membros.
   * @param aggregatedMembersInfo Informações agregadas sobre os membros.
   * @returns { HTMLDivElement } Elemento HTML contendo os dados formatados.
   */
  createMembersInfoWrapper: (aggregatedMembersInfo: MemberTaskInfo[]) => {
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


  /**
   * Cria um wrapper contendo a lista de tarefas por tipo.
   * @param totalTypes Objeto com os tipos de tarefas e suas quantidades.
   * @returns { HTMLDivElement } Elemento HTML contendo a lista formatada.
   */
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


  /**
   * Cria e insere o wrapper que exibe o total de horas marcadas com new (totalNewHR).
   * @param mainSummaryStats Elemento do DOM onde o wrapper será inserido.
   * @param totalNewHR Total de horas new a serem exibidas.
   */
  createTotalNewHRWrapper(mainSummaryStats: Element, totalNewHR: string) {
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


  /**
   * Cria e insere o wrapper que exibe as horas totais (totalClosedHR / totalHR)
   * e as horas restantes (remainingHours).
   * @param mainSummaryStats Elemento do DOM onde o wrapper será inserido.
   * @param totalClosedHR Total de horas marcadas com closed.
   * @param totalHR Total de horas atribuídas.
   * @param remainingHours Total de horas restantes.
   */
  createTotalHrWrapper(
    mainSummaryStats: Element,
    totalClosedHR: string,
    totalHR: string,
    remainingHours: string
  ) {
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


  /**
   * Cria e insere o wrapper que exibe o número total de novas tarefas (totalNew).
   * @param mainSummaryStats Elemento do DOM onde o wrapper será inserido.
   * @param totalNew Total de horas marcadas com new.
   */
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


  /**
   * Cria e insere o wrapper que exibe a duração do sprint (duration).
   * @param summary Elemento do DOM onde o wrapper será inserido.
   * @param duration Duração do sprint.
   */
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


  /**
   * Atualiza o wrapper que exibe o número total de tarefas marcadas com closed.
   * @param totalClosed Total de tarefas marcadas com closed.
   */
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

      const memberImageCell = document.createElement("td");
      memberImageCell.innerHTML = `<img src="${member.img}" alt="${member.member}" title="${member.member}" />`;
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
  },
};
