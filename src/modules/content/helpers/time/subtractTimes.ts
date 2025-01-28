import { formatTime } from "./formatTime";
import { parseTime } from "./parseTime";

/**
 * Função para subtrair dois tempos no formato 'h.mm' e retornar a diferença.
 *
 * @param { string } time1 - O primeiro tempo a ser subtraído.
 * @param { string } time2 - O segundo tempo a ser subtraído.
 * @return { string } A diferença de tempo no formato 'h.mm'.
 */
export function subtractTimes(time1: string, time2: string): string {
  const minutes1 = parseTime(time1);
  const minutes2 = parseTime(time2);
  const resultMinutes = Math.max(0, minutes2 - minutes1);
  return formatTime(resultMinutes);
}
