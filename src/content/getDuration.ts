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
  const [startDateString, endDateString] = duration.split(" to ");
  const today = new Date();

  const startDate = new Date(startDateString);
  const endDate = new Date(endDateString);

  const limitDate = endDate < today ? endDate : today;

  let workingDays = 0;

  for (let date = new Date(startDate); date <= limitDate; date.setDate(date.getDate() + 1)) {
    const dayOfWeek = date.getDay();
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      workingDays++;
    }
  }

  return workingDays;
}
