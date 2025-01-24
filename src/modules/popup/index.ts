import { fetchDataAndCopyToClipboard } from "./helpers/fetchDataAndCopyToClipboard";

function activateCopyButton() {
  if (document.getElementById("copyData")) {
    return ((document.getElementById("copyData") as HTMLInputElement).disabled =
      false);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const currentUrl = tabs[0].url;
    const allowedUrls = ["taiga"];

    if (!allowedUrls.some((url) => currentUrl.includes(url))) {
      document.getElementById("error").style.display = "block";
      document.getElementById("copyData").style.display = "none";
    } else {
      document.getElementById("copyData").style.display = "block";
      document.getElementById("error").style.display = "none";
    }
  });

  chrome.runtime.sendMessage(
    { action: "getData" },
    ({
      squadName,
      duration,
      totalHR,
      totalClosedHR,
      totalClosed,
      totalNew,
      remainingHours,
      totalPercent,
      aggregatedMembersInfo,
      totalNewHR,
      totalTasks,
      totalStories,
    }) => {
      (
        document.getElementById("copyData") as HTMLInputElement
      ).addEventListener("click", () => {
        fetchDataAndCopyToClipboard({
          squadName,
          duration,
          totalHR,
          totalClosedHR,
          totalClosed,
          totalNew,
          remainingHours,
          totalPercent,
          aggregatedMembersInfo,
          totalNewHR,
          totalTasks,
          totalStories,
        });
      });
      activateCopyButton();
    }
  );
});
