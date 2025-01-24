import { getDuration } from "./getDuration";

/**
 * Função para calcular a diferença em dias úteis entre a data de hoje e uma data limite.
 *
 * @param { string } duration O texto de duração do sprint nativo do Taiga
 * @return { number } O número de dias úteis entre hoje e a data limite.
 */
export function getDifferenceInDaysFromToday(duration) {
  const [startDateString, endDateString] = duration.split(" to ");
  const today = new Date();

  const startDate = new Date(startDateString);
  const endDate = new Date(endDateString);

  const limitDate = endDate < today ? endDate : today;

  let workingDays = 0;

  for (
    let date = new Date(startDate);
    date <= limitDate;
    date.setDate(date.getDate() + 1)
  ) {
    const dayOfWeek = date.getDay();
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      workingDays++;
    }
  }

  return workingDays;
}
