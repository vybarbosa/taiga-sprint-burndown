/**
 * Serviço responsável por buscar infomações das squads.
 */
export const squadService = {

  /**
   * Extrai o nome do squad do cabeçalho do taskboard.
   * 
   * @return { string } O nome do squad, ou "NOT FOUND" se ocorrer um erro.
   */
  getSquadName(): string {
    try {
      const squadName = (
        document.querySelector(".taskboard-header h1 span") as HTMLElement
      ).innerText
        .split("-")[0]
        .trim()
        .substring(3);

      return squadName;
    } catch (error) {
      return "NOT FOUND";
    }
  },
};
