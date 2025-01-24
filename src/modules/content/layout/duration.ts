export const createDurationWrapper = (summary: Element, duration: string) => {
    const durationWrapper = document.createElement("div");
    durationWrapper.className = "sprint-burndown__duration-wrapper summary-stats";
    const durationDescription = document.createElement("span");
    durationDescription.className = "description";
    durationDescription.textContent = duration;
    durationWrapper.appendChild(durationDescription);
    summary.insertBefore(durationWrapper, summary.childNodes[0]);
}