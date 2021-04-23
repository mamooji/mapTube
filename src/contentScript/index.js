/*global chrome*/
import axios from "axios";
var timeVar;
var currentVideoID;
var prevID;
var data = [];
var videoLength;

///////////////////////////////////////////////////////////////////////////////////////////////
//  Function:       playback
//
//  Description:    This function filters through chrome extension responses
//
//  Parameters:     request
//                  sender
//                  sendResponse
//
//  Return:         NA
///////////////////////////////////////////////////////////////////////////////////////////////
const playback = (request, sender, sendResponse) => {
  //GET VIDEO ELEMENT
  var video = document.querySelector("video");
  var title = document.querySelector("#container > h1 > yt-formatted-string")
    .textContent;

  if (video) {
    switch (request.function) {
      case "status":
        status(request, video, sendResponse, title);
        // console.log("status ran");
        // if (video.paused) {
        //   sendResponse({
        //     videoChannel: channel,
        //     videoTitle: title,
        //     paused: true,
        //     tabID: request.tabID,
        //   });
        // } else {
        //   sendResponse({
        //     videoChannel: channel,
        //     videoTitle: title,
        //     paused: false,
        //     tabID: request.tabID,
        //   });
        // }
        break;
      case "playback":
        playBack(video);
        // console.log("playback ran");
        // if (video.duration) {
        //   video.click()
        // }
        break;
      case "id":
        console.log("id ran");
        axios
          .post(
            `https://team-10-maptube.azurewebsites.net/get_sponsors?id=${request.videoID}`
          )
          .then(function (response) {
            console.log(response.data, "response AXIOS");
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
        media(request, video);
        // console.log("media ran");
        // if (request.frontBack === "forward") {
        //   video.currentTime = video.currentTime + 10;
        // } else {
        //   video.currentTime = video.currentTime - 10;
        // }
        break;
      case "search":
        console.log("search ran");
        clearTime();
        console.log("search term:", request.term);
        console.log("video ID:", currentVideoID);
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

///////////////////////////////////////////////////////////////////////////////////////////////
//  Function:      status
//
//  Description:    This function checks if the video is paused or  not, and sends the
//                  appropriate response back to the chrome extension front end
//
//  Parameters:     request
//                  video
//                  sendResponse
//                  title
//                  channel
//
//  Return:         NA
///////////////////////////////////////////////////////////////////////////////////////////////
const status = (request, video, sendResponse, title) => {
  console.log("status ran");
  if (video.paused) {
    sendResponse({
      videoTitle: title,
      paused: true,
      tabID: request.tabID,
    });
  } else {
    sendResponse({
      videoTitle: title,
      paused: false,
      tabID: request.tabID,
    });
  }
};

///////////////////////////////////////////////////////////////////////////////////////////////
//  Function:       media
//
//  Description:    This function checks the request to see if the video should be skipped
//                  or backwards
//
//  Parameters:     request
//                  video
//
//  Return:         NA
///////////////////////////////////////////////////////////////////////////////////////////////
const media = (request, video) => {
  console.log("media ran");
  console.log(request);
  if (request.frontBack === "forward") {
    video.currentTime = video.currentTime + 10;
  } else if (request.frontBack === "backward") {
    video.currentTime = video.currentTime - 10;
  } else {
    video.currentTime = request.time;
  }
};

///////////////////////////////////////////////////////////////////////////////////////////////
//  Function:       playback
//
//  Description:    This function in responsible for playing and pausing the video
//
//  Parameters:     video
//
//  Return:         NA
///////////////////////////////////////////////////////////////////////////////////////////////
const playBack = (video) => {
  console.log("playback ran");
  if (video.duration) {
    video.click();
  }
};

///////////////////////////////////////////////////////////////////////////////////////////////
//  Function:       checkTime
//
//  Description:    This function is responsible for skipping the video when the ad starts
//                  This function also collents analytical data
//
//  Parameters:     response
//                  video
//
//  Return:         NA
///////////////////////////////////////////////////////////////////////////////////////////////
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
      prevID = currentVideoID;
      var tempTime = Math.floor(videoLength / 10);
      try {
        axios.post(
          `https://team-10-maptube.azurewebsites.net/store_analytics?id=${currentVideoID}&dataArray=${data}`
        );
      } catch (err) {
        console.log(err);
      }
      console.log("Video Length: ", tempTime);
      data.length = 0;
      data.length = tempTime;
      for (var z = 0; z < data.length; z++) {
        data[z] = 0;
      }
    } else if (currentVideoID === prevID) {
      var currentElement = Math.floor(video.currentTime / 10);
      data[currentElement] = 1;
    }
  } catch (err) {
    console.log(err);
  }
};

///////////////////////////////////////////////////////////////////////////////////////////////
//  Function:       clearTIme
//
//  Description:    This function clears the timeVar
//
//  Parameters:     NA
//
//  Return:         NA
///////////////////////////////////////////////////////////////////////////////////////////////
const clearTime = () => {
  clearInterval(timeVar);
};

chrome.runtime.onMessage.addListener(playback);
