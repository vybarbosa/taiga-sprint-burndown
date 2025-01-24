/**
 * Função para calcular a porcentagem de horas gastas em relação ao total de horas.
 *
 * @param { number } hoursSpent - O número de horas gastas.
 * @param { number } totalHours - O total de horas.
 * @return { string } A porcentagem de horas gastas em relação ao total, formatada com duas casas decimais.
 */
export function calculatePercentage(hoursSpent: number, totalHours: number): string {
  const percentage = (hoursSpent / totalHours) * 100;
  return percentage.toFixed(2); // Limitando a duas casas decimais
}
