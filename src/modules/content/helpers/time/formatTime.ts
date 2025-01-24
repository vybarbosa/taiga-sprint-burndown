/**
 * Função para formatar um tempo em minutos para o formato 'h.mm', onde 'h' é hora e 'mm' são minutos.
 *
 * @param { number } minutes - O número de minutos a ser formatado.
 * @return { string } A string formatada no formato 'h.mm'.
 */
export function formatTime(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}.${mins.toFixed(0).toString().padStart(2, '0')}`; // ensure two-digit minute part
}
