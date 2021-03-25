/*global chrome*/

// If your extension doesn't need a background script, just leave this file empty

// messageInBackground();

// This needs to be an export due to typescript implementation limitation of needing '--isolatedModules' tsconfig
// export function messageInBackground() {
//   console.log("I can run your javascript like any other code in your project");
//   console.log("just do not forget, I cannot render anything !");
// }

console.log("backround is running");

const checkURL = (tab, id) => {
  let msg = {
    txt: "this is the tab from BKG",
    videoID: id,
    function: "id",
  };

  chrome.tabs.sendMessage(tab.id, msg);
};

// chrome.browserAction.onClicked.addListener(buttonClicked);

chrome.tabs.onUpdated.addListener((tabID, changeInfo, tab) => {
  // console.log(changeInfo, "change info");

  chrome.tabs.get(tabID, (tab) => {
    if (tab.status === "complete") {
      // console.log(tab, "TAB");
      // console.log(tab.url, "URL");

      let videoID = urlToID(tab.url);
      console.log(videoID);
      checkURL(tab, videoID);
    }
  });
});

const urlToID = (url) => {
  var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
  var match = url.match(regExp);
  return match && match[7].length === 11 ? match[7] : false;
};
