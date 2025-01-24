import { formatTime } from "./formatTime";
import { parseTime } from "./parseTime";

/**
 * Função para somar vários tempos no formato 'h.mm' e retornar o total.
 *
 * @param {string[]} times - Lista de tempos a serem somados.
 * @return { string } O total de tempo somado no formato 'h.mm'.
 */
export function sumTimes(...times: string[]): string {
  
  const totalMinutes = times.reduce((sum, time) => sum + parseTime(time), 0);
  return formatTime(totalMinutes);
}