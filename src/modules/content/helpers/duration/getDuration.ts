/**
 * Função para obter a duração de uma sprint.
 *
 * @return { string } A duração no formato "startDate to endDate", ou "NOT FOUND" em caso de erro.
 */
export function getDuration() {
  try {
    const duration = (
      document.querySelector(".taskboard-header h1 .date") as HTMLElement
    ).innerText;
    return duration;
  } catch (error) {
    return "NOT FOUND";
  }
}