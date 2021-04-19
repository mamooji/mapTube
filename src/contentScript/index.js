/*global chrome*/
import axios from "axios";
var timeVar;
var currentVideoID;
var prevID;
var data = [];
var videoLength;
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
          video.click();
        }
        break;
      case "id":
        console.log("id ran");  
        
        axios
          .post(
            `https://team-10-maptube.azurewebsites.net/get_sponsors?id=${request.videoID}`
          )
          .then(function (response) {
            clearTime();
            videoLength = video.duration;
            timeVar = setInterval(() => checkTime(response, video), 1500);
            currentVideoID = request.videoID;
          })
          .catch(function (error) {
            console.log(error);
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
        clearTime();
        
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

    if (currentVideoID !== prevID) {
      
      var tempTime = Math.floor(videoLength/10);
      try {
        axios.post(
          `https://team-10-maptube.azurewebsites.net/store_analytics?id=${prevID}&dataArray=${data}`
        )
      } catch (err) {
        console.log(err);
      }
      console.log(`https://team-10-maptube.azurewebsites.net/store_analytics?id=${prevID}&dataArray=${data}`);
      prevID = currentVideoID;
      
      data.length = 0;
      data.length = tempTime;
      for(var z = 0; z < data.length; z++) {  
        data[z] = 0;
      }
    }
    else if (currentVideoID === prevID) {
      var currentElement = Math.floor(video.currentTime/10);
      data[currentElement] = 1;
      
      
    }
  } catch (err) {
    console.log(err);
  }
};

const clearTime = () => {
  clearInterval(timeVar);
};

chrome.runtime.onMessage.addListener(playback);
