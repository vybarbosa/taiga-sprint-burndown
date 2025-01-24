/**
 * Função para verificar se um valor de horas contém 'NaN' e, em caso afirmativo, retornar 'NOT FOUND'.
 *
 * @param { string } hr - O valor de horas a ser verificado.
 * @return { string } Retorna 'NOT FOUND' se o valor contiver 'NaN', caso contrário retorna o valor original.
 */
export function checkNaN(hr: string) {
  return hr.includes("NaN") ? "NOT FOUND" : hr;
}
