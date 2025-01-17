export function clearOldData(
  summary: HTMLDivElement
) {
  if (summary) {
    summary.classList.add('active');
    const iocaineWrapper = summary.querySelector(
      ".summary-stats.summary-iocaine"
    ) as HTMLDivElement;
    const openTasksWrapper = summary.querySelector(
      ".summary-stats.summary-open-tasks"
    ) as HTMLDivElement;
    const toggleAnalyticsWrapper = summary.querySelector(
      ".stats.toggle-analytics-visibility"
    ) as HTMLDivElement;
    const largeSummaryWrapper = summary.querySelector(
      ".large-summary-wrapper"
    ) as HTMLDivElement;
    largeSummaryWrapper.appendChild(toggleAnalyticsWrapper);
    if (iocaineWrapper && openTasksWrapper) {
      iocaineWrapper.remove();
      openTasksWrapper.remove();
    }
  }

  const pointsStats = summary.querySelector(".points-per-role-stats");
  if (pointsStats) {
    pointsStats.remove();
  }
}