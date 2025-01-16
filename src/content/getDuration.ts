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

export function getDifferenceInDaysFromToday() {
  const duration = getDuration();
  const [startDateString] = duration.split(" to ");
  const today = new Date();

  // Converte as strings de data para objetos Date
  const startDate = new Date(startDateString);

  // Variável para contar os dias úteis
  let workingDays = 0;

  // Itera pelos dias entre a data de início e hoje
  for (let date = new Date(startDate); date <= today; date.setDate(date.getDate() + 1)) {
    const dayOfWeek = date.getDay();
    // Apenas conta os dias úteis (segunda a sexta-feira)
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      workingDays++;
    }
  }

  return workingDays;
}
