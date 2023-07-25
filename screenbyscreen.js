
  Array.from(document.querySelectorAll(".volumeTen")).forEach(vid => vid.volume = 0.10);

  Array.from(document.querySelectorAll("video")).forEach(vid => vid.muted = true);

  document.querySelector("body").addEventListener("keydown", arrowKeyHandler);

  let currentCursor = 0;

  function arrowKeyHandler(e) {
    const key = e.key;
    switch (key) {
      case "ArrowRight":
        if (!determineHasVideo()) screenSwitcher("next");
        return;
      case "ArrowDown":
        if (determineHasVideo()) screenSwitcher("next");
        return;
      case "PageDown":
        screenSwitcher("next");
        return;
      case "ArrowLeft":
        if (!determineHasVideo()) screenSwitcher("prev");
        return;
      case "ArrowUp":
        if (determineHasVideo()) screenSwitcher("prev");
        return;
      case "PageUp":
        screenSwitcher("prev");
        return;
      case "Home":
        screenSwitcher("beginning");
        return;
      case "End":
        screenSwitcher("end");
        return;
      case "r":
        screenSwitcher("random");
        return;
      case "t":
        tagsShowingHandler();
        return;
    }
  }

  function determineHasVideo() {
    let screen = getCurrentScreenNode();
    if (Array.from(screen.querySelectorAll("video")).length > 0) return true;
    else return false;
  }

  function screenSwitcher(direction) {
    changeCurrentCursor(direction);
    updateScreenDisplay();
    updateScreenNumberDisplay();
    safeSelectFirstVideo();
  }

  function changeCurrentCursor(direction) {
    const allScreens = Array.from(document.querySelectorAll(".screen"));
    const totalScreens = allScreens.length;
    const lastScreen = totalScreens - 1;
    const tagsSelected = selectedTags.size;
    if (tagsSelected) {
      tagsSelectedCurrentCursorChange(direction);
      return;
    }
    if (currentCursor === 0 && direction === "prev") {
      //do nothing
    } else if (currentCursor === lastScreen && direction === "next") {
      //do nothing
    } else if (direction === "beginning") {
      currentCursor = 0;
    } else if (direction === "end") {
      currentCursor = lastScreen;
    } else if (direction === "random") {
      currentCursor = Math.floor(Math.random() * totalScreens);
    } else {
      currentCursor = direction === "next" ? currentCursor + 1 : currentCursor - 1;
    }
  }

  function tagsSelectedCurrentCursorChange(direction) {
    const allScreens = Array.from(document.querySelectorAll(".screen"));
    const totalScreens = allScreens.length;
    const lastScreen = totalScreens - 1;
    let allNodesSelected = [];
    Array.from(selectedTags).forEach(tag => allNodesSelected = allNodesSelected.concat(tagsNormalization[tag]));
    allNodesSelected.sort((a, b) => a.idx > b.idx ? 1 : -1);
    if (currentCursor === 0 && direction === "prev") {
      //do nothing
    } else if (currentCursor === lastScreen && direction === "next") {
      //do nothing
    } else if (direction === "beginning") {
      currentCursor = allNodesSelected[0].idx;
    } else if (direction === "end") {
      currentCursor = allNodesSelected[allNodesSelected.length - 1].idx;
    } else if (direction === "random") {
      currentCursor = allNodesSelected[Math.floor(Math.random() * allNodesSelected.length)];
    } else {
      currentCursor = direction === "next" ? allNodesSelected.find(node => node.idx > currentCursor).idx : allNodesSelected.slice().reverse().find(node => node.idx < currentCursor).idx;
    }
  }

  function getCurrentScreenNode() {
    return Array.from(document.querySelectorAll(".screen"))[currentCursor];
  }

  function updateScreenDisplay() {
    const allScreens = Array.from(document.querySelectorAll(".screen"));
    const totalScreens = allScreens.length;
    allScreens.forEach((screen, idx) => {
      if (idx === currentCursor) {
        screen.style.display = "flex";
        unEncodePathsForScreen(screen);
      } else {
        screen.style.display = "none";
      }
    })
  }

  function updateScreenNumberDisplay() {
    //update the counter in top right - can also add tags, might also want filters at some point
  }

  function encodePaths() {
    Array.from(document.querySelectorAll("video,img")).forEach(mediaNode => {
      mediaNode.dataset.unloadedSrc = mediaNode.src;
      mediaNode.src = "";
    })
  }

  encodePaths();

  function unEncodePathsForScreen(screen) {
    Array.from(screen.querySelectorAll("video,img")).forEach(mediaNodeOnScreen => {
      mediaNodeOnScreen.src = mediaNodeOnScreen.dataset.unloadedSrc;
    })
  }

  unEncodePathsForScreen(document.querySelector(".screen"));

  function safeSelectFirstVideo() {
    let currentScreen = getCurrentScreenNode();
    let firstVideo = currentScreen.querySelector("video");
    if (firstVideo) firstVideo.focus();
  }

  let tagsNormalization = {};
  let selectedTags = new Set([]);

  function tagParsing() {
    Array.from(document.querySelectorAll(".screen")).forEach((node, idx) => {
      let tag = node.dataset.tags;
      if (tag) {
        let tagObj = { node, idx };
        tagsNormalization[tag] = tagsNormalization[tag] ? tagsNormalization[tag].concat(tagObj) : [tagObj];
        console.log("tagpasrinsg", tagObj, tag);
      }
    });    
  }

  function tagParsingAndUISetting() {
    tagParsing();
    for (let tagKey in tagsNormalization) {
      createTagKeyInUI(tagKey);
    }
    Array.from(document.querySelectorAll(".tagRow")).forEach(tagRow => tagRow.addEventListener("click", tagRowClickHandler));
  }

  function createTagKeyInUI(tagKey) {
    let tagContainer = document.querySelector(".tagsContainer");
    let tagRow = `<div class="tagRow"><input type="checkbox" value="${tagKey}"><label> ${tagKey}</label></div>`;
    tagContainer.innerHTML += tagRow;
  }

  function tagRowClickHandler(e) {
    const checked = e.target.checked;
    if (checked) {
      selectedTags.add(e.target.value);
    } else {
      selectedTags.add(e.target.value);
    }
  }

  setTimeout(tagParsingAndUISetting, 1000);

  function tagsShowingHandler() {
    let tagContainer = document.querySelector(".tagsContainer");
    if (tagContainer.style.opacity === '0') tagContainer.style.opacity = '100';
    else tagContainer.style.opacity = '0';
  }
