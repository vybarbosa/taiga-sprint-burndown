import { MemberTaskInfo } from "../../../interfaces/Member";

/**
 * Função para renderizar informações dos membros com base em suas tarefas.
 *
 * @param {MemberTaskInfo[]} membersInfos - Lista de informações dos membros, incluindo dados de horas e tarefas.
 * @return Uma string formatada com as informações de cada membro.
 */
export function renderMembersInfos(membersInfos: MemberTaskInfo[]) {
  return membersInfos.reduce((acc, curr) => {
    return (
      acc +
      `Membro: ${curr.member} | HRs: ${curr.closedHours} / ${curr.assignedHours} | Tasks: ${curr.closedTasks} / ${curr.assignedTasks}\n`
    );
  }, "");
}
