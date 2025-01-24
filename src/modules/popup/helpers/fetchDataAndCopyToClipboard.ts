import { GetDataResponse } from "../../../interfaces/GetDataResponse";
import { renderMembersInfos } from "./renderMembersInfos";

/**
 * Função para buscar dados e copiá-los para a área de transferência.
 *
 * @param squadName - Nome do squad.
 * @param duration - Duração do período.
 * @param totalHR - Total de horas.
 * @param totalClosedHR - Total de horas fechadas.
 * @param totalClosed - Quantidade de tarefas fechadas.
 * @param totalNew - Quantidade de tarefas novas.
 * @param remainingHours - Horas restantes.
 * @param totalPercent - Percentual de conclusão.
 * @param aggregatedMembersInfo - Informações agregadas dos membros.
 * @param totalNewHR - Total de horas novas.
 * @param totalTasks - Total de tarefas.
 * @param totalStories - Todas as stories.
 */

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
}: GetDataResponse) {
  const allFields =
    `Data: ${new Date().toLocaleDateString("pt-br")}\n` +
    `SQUAD: ${squadName}\n` +
    `DURATION: ${duration}\n` +
    `TOTAL (HR): ${totalClosedHR} / ${totalHR} (${remainingHours} - ${totalPercent}%)\n` +
    `TOTAL NEW (HR): ${totalNewHR}\n` +
    `TOTAL (TASKS): ${totalTasks}\n` +
    `QTD. CLOSED: ${totalClosed}\n` +
    `QTD. NEW: ${totalNew}\n\n` +
    `STORIES:\n${totalStories}\n\n` +
    `PRODUTIVIDADE DA SQUAD: \n${renderMembersInfos(aggregatedMembersInfo)}`;
  navigator.clipboard.writeText(allFields);
}
