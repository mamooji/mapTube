/*global chrome*/
import "./App.css";
import logo from "./assets/logo-red.png";

import { useState, useEffect } from "react";
const App = () => {
  //State variables
  const [searchTerm, setSearchTerm] = useState("");
  const [playBack, setPlayBack] = useState(null);
  const [searchData, setSearchData] = useState(null);
  const [videoTitle, setVideoTitle] = useState(null);

  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      let msg = {
        function: "status",
      };
      chrome.tabs.sendMessage(tabs[0].id, msg, function (response) {
        console.log(response, "statusss");
        if (response) {
          setVideoTitle(response.videoTitle);
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
  //  Function:      secondsToHMS
  //
  //  Description:    this function converts the time in seconds to minutes, hrs, etc
  //
  //
  //  Parameters:     seconds
  //
  //  Return:         time
  ///////////////////////////////////////////////////////////////////////////////////////////////

  const secondsToHms = (seconds) => {
    if (!seconds) return "";

    let duration = seconds;
    let hours = duration / 3600;
    duration = duration % 3600;

    let min = parseInt(duration / 60);
    duration = duration % 60;

    let sec = parseInt(duration);

    if (sec < 10) {
      sec = `0${sec}`;
    }
    if (min < 10) {
      min = `0${min}`;
    }

    if (parseInt(hours, 10) > 0) {
      return `${parseInt(hours, 10)}:${min}:${sec}`;
    } else if (min === 0) {
      return `${sec}`;
    } else {
      return `${min}:${sec}`;
    }
  };

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
  const media = (status = "null", seconds = 0) => {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      var msg = {
        function: "media",
        frontBack: status,
        time: seconds,
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
          setSearchData([
            {
              text: "this video does not have captions",
              time: "",
              display: "none",
            },
          ]);
        }
      });
      return true;
    });
  };

  return (
    <div className="App">
      <div className="info">
        <img src={logo} alt="logo" className="Logo" />
        {videoTitle ? <p>Title: {videoTitle}</p> : <p>Video title not found</p>}
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
                <button
                  style={{
                    maxWidth: "50px",
                    maxHeight: "20px",
                    boxSizing: "border-box",
                    display: data.display ? data.display : "",
                  }}
                  onClick={() => {
                    media("null", data.time);
                  }}
                >
                  {secondsToHms(data.time)}
                </button>
              </div>
            ))
          : ""}
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
