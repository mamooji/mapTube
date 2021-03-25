/*global chrome*/
import axios from "axios";
// If your extension doesn't need a content script, just leave this file empty

// This is an example of a script that will run on every page. This can alter pages
// Don't forget to change `matches` in manifest.json if you want to only change specific webpages
// printAllPageLinks();

// This needs to be an export due to typescript implementation limitation of needing '--isolatedModules' tsconfig

// export function printAllPageLinks() {
//   const allLinks = Array.from(document.querySelectorAll('a')).map(
//     link => link.href
//   );

//   console.log('-'.repeat(30));
//   console.log(
//     `These are all ${allLinks.length} links on the current page that have been printed by the Sample Create React Extension`
//   );
//   console.log(allLinks);
//   console.log('-'.repeat(30));
// }

// console.log("content scripts");

// const getMessage = (request, sender, sendResponse) => {
//   console.log(request);

// const getURL = (request, sender, sendResponse) => {
//   console.log(request, "FROM BKG");
// };

// chrome.runtime.onMesage.addListener(getMessage);

// const getURL = (request, sender, sendResponse) => {
//   console.log(request, "FROM BKG");
//   console.log("getURL function ran");
// };
// chrome.runtime.onMessage.addListener(getURL);

const playback = (request, sender, sendResponse) => {
  //GET VIDEO ELEMENT
  var video = document.querySelector("video");
  if (video) {
    switch (request.function) {
      case "status":
        console.log("status ran");
        if (video.paused) {
          sendResponse({
            paused: true,
            tabID: request.tabID,
          });
        } else {
          sendResponse({
            paused: false,
            tabID: request.tabID,
          });
        }
        break;
      case "playback":
        console.log("playback ran");
        if (video.duration) {
          console.log(video.duration);
          // video.currentTime = "100";
          video.click();
        }
        break;
      case "id":
        console.log("id ran");
        console.log(request.videoID);
        axios
          .post(
            `https://team-10-maptube.azurewebsites.net/get_ads?id=${request.videoID}`
          )
          .then(function (response) {
            console.log(response, "response AXIOS");
          })
          .catch(function (error) {
            console.log(error);
            console.log(error, "error AXIOS");
          });
        break;
      case "media":
        console.log("media ran");
        if (request.frontBack === "forward") {
          video.currentTime = video.currentTime + 10;
        } else {
          video.currentTime = video.currentTime - 10;
        }
        break;
      default:
        console.log("default");
    }
  } else {
    console.log("no video found");
  }
};

chrome.runtime.onMessage.addListener(playback);
