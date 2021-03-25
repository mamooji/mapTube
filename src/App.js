/*global chrome*/
import "./App.css";
import axios from "axios";

import { useState, useEffect } from "react";
const App = () => {
  const [playBack, setPlayBack] = useState(null);
  const [data, setData] = useState(null);
  // const [videoID, setVideoID] = useState("");

  useEffect(() => {
    axios
      .get(`https://team-10-maptube.azurewebsites.net/movies`)
      .then((res) => {
        const movies = res.data.movies;
        setData(movies);
        console.log(data);
      });
    // chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    //   let msg = {
    //     function: "id",
    //   };
    //   chrome.tabs.sendMessage(tabs[0].id, msg, function (response) {
    //     console.log(response, "respoonse");
    //     if (response) {
    //       setVideoID(response.id);
    //     } else {
    //       setVideoID("gang");
    //     }
    //   });
    // });
  }, []);

  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      let msg = {
        function: "status",
      };
      chrome.tabs.sendMessage(tabs[0].id, msg, function (response) {
        console.log(response, "statusss");
        if (response) {
          if (response.paused) {
            setPlayBack(true);
          } else {
            setPlayBack(false);
          }
        }
      });
    });
  }, []);

  const getVideoStatus = () => {
    setPlayBack(!playBack);
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      // query the active tab, which will be only one tab
      //and inject the script in i
      let msg = {
        function: "playback",
      };
      chrome.tabs.sendMessage(tabs[0].id, msg);
    });
  };
  const media = (status) => {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      var msg = {
        function: "media",
        frontBack: status,
      };
      chrome.tabs.sendMessage(tabs[0].id, msg);
    });
  };

  return (
    <div className="App">
      <div className="info">
        <p>Maptube: </p>
        {data ? (
          data.map((movie) => <p key={movie.title}>{movie.title}</p>)
        ) : (
          <p>loading</p>
        )}
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
