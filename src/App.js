/*global chrome*/
import "./App.css";
import axios from "axios";

import { useState, useEffect } from "react";
const App = () => {
  const [playBack, setPlayBack] = useState(null);
  const [data, setData] = useState(null);
  const [searchData, setSearchData] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // const [videoID, setVideoID] = useState("");

  useEffect(() => {
    axios
      .get(`https://team-10-maptube.azurewebsites.net/movies`)
      .then((res) => {
        const movies = res.data.movies;
        setData(movies);
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

      // localStorage.setItem();
      chrome.tabs.sendMessage(tabs[0].id, msg);
    });
  };

  const search = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      var msg = {
        function: "search",
        term: searchTerm,
      };
      console.log("Search term in app.js", searchTerm);

      chrome.tabs.sendMessage(tabs[0].id, msg, function (response) {
        if (response.data.search) {
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
        <p>Maptube: </p>
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
          ? searchData.preview.map((res) => <p key={res}>{res}</p>)
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
