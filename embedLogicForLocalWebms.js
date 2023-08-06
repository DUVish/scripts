// ==UserScript==
// @name         Embed logic for local Webms
// @namespace    file:///
// @version      1.0
// @description  Adds embed capability for webms in local listing (Browser can handle Webms better than Windows)
// @author       DUVish
// @match        file:///*webms/*
// @match        file:///*H/G/*
// @match        file:///*webm/*
// @match        file:///*vids/
// @match        file:///*capped/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=undefined.
// @grant        none
// ==/UserScript==

document.querySelector("head").innerHTML += `
  <style>
    .videoViewNode {
      background-color: black;
    }
  </style>
`

let topLevelTable = document.querySelector("table");

let currentEmbeddedRowIdx = null;

if (topLevelTable) {
  let topLevelHead = topLevelTable.querySelector("thead");
  let topLevelHeadRow = topLevelHead.querySelector("tr");
  let newTableHeadCell = document.createElement("th");
  newTableHeadCell.innerText = "Embed";
  topLevelHeadRow.appendChild(newTableHeadCell);

  let topLevelBody = topLevelTable.querySelector("tbody")
  let totalRows = topLevelBody.children.length;

  let videoViewNode = document.createElement("div");
  videoViewNode.style.width = "90vw";
  videoViewNode.style.height = "90vh";
  videoViewNode.style.display = "none";
  videoViewNode.style.top = "2.5vh";
  videoViewNode.style.left = "2.5vw";
  videoViewNode.style.position = "fixed";
  videoViewNode.classList.add("videoViewNode");
  document.querySelector("body").appendChild(videoViewNode);
  let videoTitleNode = document.createElement("div");
  videoTitleNode.style.width = "100%";
  videoTitleNode.style.textAlign = "center";
  videoTitleNode.innerHTML = `<span class="videoTitleNodeTitle">[${currentEmbeddedRowIdx}/${totalRows - 1}]</span> <span>Copy - <span class="videoTitleCopyTag">[videoTag]</span> | <span class="videoTitleCopyPath">[path]</span> | <span class="videoTitleCopyTitle">[title]</span></span>`;
  videoTitleNode.classList.add("videoTitleNode");
  videoViewNode.appendChild(videoTitleNode);
  document.querySelector("body").addEventListener("keydown", (e) => {
      if (e.key === "Backspace") {
        let currentLocation = window.location.href;
        let splitLength = currentLocation.split("/").length;
        let oneLevelUp = currentLocation.split("/").slice(0, splitLength - 2).join("/") + "/";
        window.location.href = oneLevelUp;
    }
  });
  videoViewNode.addEventListener("keydown", (e) => {
    let key = e.key;
    if (key === "q" || key === "Escape") {
      Array.from(videoViewNode.children).forEach(child => child.tagName === "VIDEO" && child.remove());
      videoViewNode.style.display = "none";
      currentEmbeddedRowIdx = null;
    }

    if (key === "ArrowDown" || key === "ArrowUp" || key === "Home" || key === "End" || key === "PageUp" || key === "PageDown" || key === "r" || key === "Media_Next" || key === "MediaTrackPrevious") {
      e.preventDefault();
      if (typeof currentEmbeddedRowIdx === "number") {
        let changedFlag = false;
        if ((key === "ArrowDown" || key === "PageDown" || key === "Media_Next") && currentEmbeddedRowIdx < totalRows - 1) {
            currentEmbeddedRowIdx++;
            changedFlag = true;
        }
        if ((key === "ArrowUp" || key === "PageUp" || key === "MediaTrackPrevious") && currentEmbeddedRowIdx > 0) {
            currentEmbeddedRowIdx--;
            changedFlag = true;
        }
        if (key === "Home") {
            currentEmbeddedRowIdx = 0;
            changedFlag = true;
        }
        if (key === "End") {
            currentEmbeddedRowIdx = totalRows - 1;
            changedFlag = true;
        }
        if (key === "r") {
            currentEmbeddedRowIdx = Math.floor(Math.random() * (totalRows - 1));
            changedFlag = true;
        }
        if (changedFlag) {
          let newVideoSrc = topLevelBody.children[currentEmbeddedRowIdx].querySelector("a").href;
          let currentVideoNode = document.querySelector(".videoNode");
          if (currentVideoNode) {
              currentVideoNode.src = newVideoSrc;
              currentVideoNode.type = "video/mp4";
              updateTitle(currentEmbeddedRowIdx);
          }
        }
      }
    }
  });

  function updateTitle(idx) {
    let videoTitleNode = document.querySelector(".videoTitleNode");
    let videoTitleNodeTitle = document.querySelector(".videoTitleNodeTitle");
    let topLevelBody = topLevelTable.querySelector("tbody");
    let fileName = topLevelBody?.children?.[currentEmbeddedRowIdx]?.children?.[0]?.innerText;
    videoTitleNodeTitle.innerText = `[${idx || currentEmbeddedRowIdx}/${totalRows - 1}] - ${fileName || "Title"}`;
    let videoTitleCopyTag = document.querySelector(".videoTitleCopyTag");
    let videoTitleCopyPath = document.querySelector(".videoTitleCopyPath");
    let videoTitleCopyTitle = document.querySelector(".videoTitleCopyTitle");
    videoTitleCopyTag?.removeEventListener("click", copyVideoTag);
    videoTitleCopyTag?.addEventListener("click", copyVideoTag);
    videoTitleCopyPath?.removeEventListener("click", copyVideoPath);
    videoTitleCopyPath?.addEventListener("click", copyVideoPath);
    videoTitleCopyTitle?.removeEventListener("click", copyVideoTitle);
    videoTitleCopyTitle?.addEventListener("click", copyVideoTitle);
  }

  function copyVideoTag() {
    let fileName = topLevelBody?.children?.[currentEmbeddedRowIdx]?.children?.[0]?.innerText;
    let location = window.location.href;
    let link = location + fileName;
    const videoNodeStr = `<video src="${link}" width="" controls="true" loop="true" data-volume="" autoplay="true"></video>`;
    setClipboard(videoNodeStr);
  }

  function copyVideoPath() {
    let fileName = topLevelBody?.children?.[currentEmbeddedRowIdx]?.children?.[0]?.innerText;
    let location = window.location.href;
    let path = location + fileName;
    setClipboard(path);
  }

  function copyVideoTitle() {
    let fileName = topLevelBody?.children?.[currentEmbeddedRowIdx]?.children?.[0]?.innerText;
    setClipboard(fileName);
  }

  function setClipboard(text) {
    navigator.clipboard.writeText(text).then(
        () => {
          console.log(`File ${text} successfully copied.`);
          flashTitle("green");
        },
        () => {
          console.log(`Error in copying ${text}`);
          flashTitle("red");
        }
    );
  }

  function flashTitle(color="red") {
    let videoTitleNode = document.querySelector(".videoTitleNode");
    videoTitleNode.style.color = color;
    setTimeout(resetTitleColor, 500);
  }

  function resetTitleColor() {
    let videoTitleNode = document.querySelector(".videoTitleNode");
    videoTitleNode.style.color = "unset";
  }

  Array.from(topLevelBody.children).forEach((row, idx) => {
    let newCell = document.createElement("td");
    newCell.innerText = "Embed media";
    newCell.addEventListener("click", (e) => embedMediaCellClickHandler(e, idx));
    row.appendChild(newCell);
  });
}

function embedMediaCellClickHandler(e, idx) {
     let clickedCell = e.target;
     let fileName = clickedCell.parentNode.children[0].querySelector("a").href;
     let accurateIdx = Array.from(document.querySelectorAll('a.file')).findIndex(rowFile => rowFile.href === fileName);
     let videoNode = document.createElement("video");
     videoNode.src = fileName;
     videoNode.type = "video/mp4";
     videoNode.controls = "true";
     videoNode.loop = "true";
     videoNode.autoplay = "true";
     videoNode.style.width = "95vw";
     videoNode.style.height = "95vh";
     videoNode.style.backgroundColor = "black";
     videoNode.classList.add("videoNode");
     let videoViewNode = document.querySelector(".videoViewNode");
     videoViewNode.style.display = "flex";
     videoViewNode.style.flexDirection = "column";
     videoViewNode.appendChild(videoNode);
     updateTitle(accurateIdx);
     currentEmbeddedRowIdx = accurateIdx;
     //videoNode.addEventListener('timeupdate', videoTimeUpdate, false);
}

function videoTimeUpdate(e) {
    document.querySelector(".videoNode").setAttribute("controls","controls");
}

/*
NOTES
 - Can add 'Open File Dialogue' for manual deletion, moving, etc. in Windows Explorer. Can just kick it over to the OS. Can possibly have a 'Save As' interaction triggered with a button (will have to see if I can have it pre-selected in Windows Explorer. Possible that I can't. But could have filename pre-inserted in the Input, possibly. Need to explore.



*/
