/*global chrome*/
import "./App.css";

import { useState, useEffect } from "react";
const App = () => {
  //State variables
  const [searchTerm, setSearchTerm] = useState("");
  const [playBack, setPlayBack] = useState(null);
  const [searchData, setSearchData] = useState(null);
  const [videoTitle, setVideoTitle] = useState(null);
  const [videoChannel, setVideoChannel] = useState(null);

  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      let msg = {
        function: "status",
      };
      chrome.tabs.sendMessage(tabs[0].id, msg, function (response) {
        console.log(response, "statusss");
        if (response) {
          setVideoTitle(response.videoTitle);
          setVideoChannel(response.videoChannel);
          if (response.paused) {
            setPlayBack(true);
          } else {
            setPlayBack(false);
          }
        }
      });
    });
  }, []);

  ///////////////////////////////////////////////////////////////////////////////////////////////
  //  Function:       getVideoStatus
  //
  //  Description:    this function goes to get the current status of the video from the
  //                  content script
  //
  //  Parameters:     NA
  //
  //  Return:         NA
  ///////////////////////////////////////////////////////////////////////////////////////////////
  const getVideoStatus = () => {
    setPlayBack(!playBack);
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      let msg = {
        function: "playback",
      };
      chrome.tabs.sendMessage(tabs[0].id, msg);
    });
  };

  ///////////////////////////////////////////////////////////////////////////////////////////////
  //  Function:       media
  //
  //  Description:    This function sends the command to forward or backward the video to
  //                  the content script
  //
  //  Parameters:     status
  //
  //  Return:         NA
  ///////////////////////////////////////////////////////////////////////////////////////////////
  const media = (status) => {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      var msg = {
        function: "media",
        frontBack: status,
      };

      chrome.tabs.sendMessage(tabs[0].id, msg);
    });
  };

  ///////////////////////////////////////////////////////////////////////////////////////////////
  //  Function:       search
  //
  //  Description:    This function sends a search term to the content script
  //                  it then recieves a response the text and time stamps of the result
  //
  //  Parameters:     NA
  //
  //  Return:         TRUE
  ///////////////////////////////////////////////////////////////////////////////////////////////
  const search = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      var msg = {
        function: "search",
        term: searchTerm,
      };
      console.log("Search term in app.js", searchTerm);

      chrome.tabs.sendMessage(tabs[0].id, msg, function (response) {
        if (response) {
          setSearchData(response.data.search);
        } else {
          console.log("error", response);
        }
      });
    });
    return true;
  };

  return (
    <div className="App">
      <div className="info">
        <p>Maptube</p>
        {videoTitle ? <p>Title: {videoTitle}</p> : <p>video title not found</p>}
        {videoChannel ? <p>Channel: {videoChannel}</p> : ""}
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
          }}
        />
        <input
          type="button"
          value="Search"
          onClick={() => {
            search();
          }}
        />

        {searchData
          ? searchData.map((data) => (
              <div key={data.time} className="searchResult">
                <p>{data.text}</p>
                <p style={{ paddingLeft: "2rem" }}>{data.time}</p>
              </div>
            ))
          : " "}
      </div>

      <div className="media">
        <button
          id="forward"
          onClick={() => {
            media("backward");
          }}
        >
          <p>rewind</p>
        </button>
        <button
          id="playPause"
          onClick={() => {
            getVideoStatus();
          }}
        >
          <p>{playBack ? "play" : "pause"}</p>
        </button>
        <button
          id="rewind"
          onClick={() => {
            media("forward");
          }}
        >
          <p>forward</p>
        </button>
      </div>
    </div>
  );
};

export default App;
