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
var timeVar;
var currentVideoID;
const playback = (request, sender, sendResponse) => {
  //GET VIDEO ELEMENT
  var video = document.querySelector("video");
  var title = document.querySelector("#container > h1 > yt-formatted-string")
    .textContent;
  var channel = document.querySelector("#text > a").textContent;

  if (video) {
    switch (request.function) {
      case "status":
        console.log("status ran");
        console.log(title);
        console.log(channel);
        if (video.paused) {
          sendResponse({
            videoChannel: channel,
            videoTitle: title,
            paused: true,
            tabID: request.tabID,
          });
        } else {
          sendResponse({
            videoChannel: channel,
            videoTitle: title,
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
        // var length = 0;
        // length = Math.floor(video.duration / 10);

        // // analyticalData.apply(null, Array(length)).map(Num)
        // analyticalData.length = length;
        // let i = 0;
        // while (i < length) {
        //   analyticalData[i] = 0;
        //   i++;
        // }
        // console.log("array", analyticalData);
        // console.log("sengment Length", length);
        // console.log("duration", video.duration);

        // console.log("request.videoID", request.videoID);
        console.log(
          `https://team-10-maptube.azurewebsites.net/get_sponsors?id=${request.videoID}`
        );

        axios
          .post(
            `https://team-10-maptube.azurewebsites.net/get_sponsors?id=${request.videoID}`
          )
          .then(function (response) {
            console.log(response.data, "response AXIOS");
            clearTime();
            timeVar = setInterval(() => checkTime(response, video), 1500);
            currentVideoID = request.videoID;
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
      case "search":
        console.log("search ran");
        clearTime();
        console.log("search term:", request.term);
        axios
          .post(
            `https://team-10-maptube.azurewebsites.net/get_search?id=${currentVideoID}&term=${request.term}`
          )
          .then(function (response) {
            if (response) {
              console.log("response we finna send", response.data);
              sendResponse({
                status: true,
                data: response.data,
                tabID: request.tabID,
              });
            }
          })
          .catch(function (error) {
            console.log(error);
            console.log(error, "error AXIOS");
          });
        return true;
      default:
        console.log("default");
    }
  } else {
    console.log("no video found");
  }
};

const checkTime = (response, video) => {
  try {
    for (let i = 0; i < response.data.videoAd.start.length; i++) {
      if (
        video.currentTime > response.data.videoAd.start[i] &&
        video.currentTime <
          response.data.videoAd.start[i] + response.data.videoAd.skip[i]
      ) {
        video.currentTime =
          response.data.videoAd.start[i] + response.data.videoAd.skip[i];
      }
    }
  } catch (err) {
    console.log(err);
  }
};

const clearTime = () => {
  clearInterval(timeVar);
};

chrome.runtime.onMessage.addListener(playback);
