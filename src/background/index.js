/*global chrome*/

// If your extension doesn't need a background script, just leave this file empty

// messageInBackground();

// This needs to be an export due to typescript implementation limitation of needing '--isolatedModules' tsconfig
// export function messageInBackground() {
//   console.log("I can run your javascript like any other code in your project");
//   console.log("just do not forget, I cannot render anything !");
// }

console.log("backround is running");

const checkURL = (tab) => {
  let msg = {
    txt: "this is the tab from BKG",
    url: tab.url,
    function: "url",
  };

  chrome.tabs.sendMessage(tab.id, msg);
};

// chrome.browserAction.onClicked.addListener(buttonClicked);

chrome.tabs.onUpdated.addListener((tabID, changeInfo, tab) => {
  // console.log(changeInfo, "change info");

  chrome.tabs.get(tabID, (tab) => {
    if (tab.status === "complete") {
      console.log(tab, "TAB");
      console.log(tab.url, "URL");
      checkURL(tab);
    }
  });
});
