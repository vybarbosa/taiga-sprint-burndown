import { renderMembersInfos } from "./renderMembersInfos";

export function fetchDataAndCopyToClipboard({
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
}) {
  const allFields =
    `Data: ${new Date().toLocaleDateString("pt-br")}\n` +
    `SQUAD: ${squadName}\n` +
    `DURATION: ${duration}\n` +
    `TOTAL (HR): ${totalClosedHR} / ${totalHR} (${remainingHours} - ${totalPercent}%)\n` +
    `TOTAL NEW (HR): ${totalNewHR}\n` +
    `TOTAL (TASKS): ${totalTasks}\n` +
    `QTD. CLOSED: ${totalClosed}\n` +
    `QTD. NEW: ${totalNew}\n\n` +
    `STORIES:\n${totalStories}\n` +
    `PRODUTIVIDADE DA SQUAD: \n${renderMembersInfos(aggregatedMembersInfo)}`;
  navigator.clipboard.writeText(allFields);
}
