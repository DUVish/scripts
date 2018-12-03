// ==UserScript==
// @name         chan embedded quote fixer
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Puts embedded quotes in end of post rather than beginning, can also click on checkboxes in posts to remove them, can tessellate inlined quotes in post, also works on 4channel boards, can tesselate whole thread
// @author       You
// @match        http://boards.4chan.org/*/thread/*
// @match        https://boards.4chan.org/*/thread/*
// @match        https://boards.4channel.org/*/thread/*
// @match        http://boards.4channel.org/*/thread/*
// @grant        none
// ==/UserScript==
//window.onload(function() {
    setTimeout(function() {
        let quotesList = Array.from(document.getElementsByClassName("quotelink")).filter(node => window.getComputedStyle(node).getPropertyValue("font-size") === "10.6667px");

        quotesList.forEach(node => {
          node.addEventListener("click", qEV);
        });

        Array.from(document.getElementsByTagName("span")).filter(el => {
            try {
              if (el.children.length > 0 && el.children[0].classList.contains("quotelink")) return true;
            } catch(error) {
              //console.log("custom error in span EL", el);
              return false;
            }
        }).forEach(el => el.addEventListener("click", qSpanClick));

        addRemoveCapability();
        addCollapseAndExpand();
        addTessellationQuotes();
        addQuotedPostsContainer();
        addTessellationThread();
    }, 3000);
//});

//tessellation feature - move element all the way to the right, try and move up - if interfering with getBoundingClientRect in two axes, then move left, then try and move up again - repeat until both up and left are exhausted
  //repeat for all posts - tesselation would not just add display: flex and flex-wrap:wrap to thread container, but also margin/-margin to each individual post - can either add some caching capability by storing data on
  //dome nodes themselves, or just store all of the HTML before, revert on option, and re-compute each time, possibly also add to barchive, also add for within posts themselves

//image size slider - a slider appears when hovering or clicking over new span in image data row in post - has a slider, and position on slider determines the size of the full image via %

function addTessellationThread() {
  let newSpan = document.createElement("span");
  newSpan.innerText = "[Tessellate Thread]";
  newSpan.classList.add("tessellateThread");
  newSpan.style.paddingLeft = "6px";
  newSpan.style.paddingRight = "1px";
  newSpan.style.fontSize = "11px";
  newSpan.style.color = "rgb(46, 54, 144)";
  document.querySelector(".opContainer").querySelector(".postInfo.desktop").insertBefore(newSpan, document.querySelector(".opContainer").querySelector(".postMenuBtn"));
  newSpan.addEventListener("click", tessellateThread);
}

function tessellateThread(e) {
  let node = e.target;
  let threadNode = document.querySelector(".thread");
  if (threadNode.style.display !== "flex") {
    threadNode.style.display = "flex";
    threadNode.style.flexWrap = "wrap";
    threadNode.style.maxWidth = "100%";
    node.style.opacity = "0.55";
  } else {
    threadNode.style.display = "";
    threadNode.style.flexWrap = "";
    threadNode.style.maxWidth = "";
    node.style.opacity = "1.0";
  }
}

function addTessellationQuotes() {
  Array.from(document.getElementsByClassName("postInfo")).forEach(el => {
    if (el.getElementsByClassName("tessellateQuotes").length === 0) {
      let btn = el.querySelector(".postMenuBtn");
      let tesSpan = document.createElement("span");
      tesSpan.innerText = "[Tessellate]";
      tesSpan.classList.add("tessellateQuotes");
      tesSpan.style.paddingLeft = "6px";
      tesSpan.style.paddingRight = "1px";
      tesSpan.style.fontSize = "11px";
      tesSpan.style.color = "rgb(46, 54, 144)";
      el.insertBefore(tesSpan, btn);
      tesSpan.removeEventListener("click", tessellateQuotes);
      tesSpan.addEventListener("click", tessellateQuotes);
    }
  });
}

function tessellateQuotes(e) {
  let tesSpan = e.target;
  let quotesNode = e.target.parentNode.parentNode.querySelector(".quotedPostsContainer");
  if (quotesNode.style.display !== "flex") {
    quotesNode.style.display = "flex";
    quotesNode.style.flexWrap = "wrap";
    tesSpan.style.opacity = "0.55";
  } else {
    quotesNode.style.display = "";
    quotesNode.style.flexWrap = "";
    tesSpan.style.color = "rgb(46, 54, 144)";
    tesSpan.style.opacity = "1.0";
  }
}

function addQuotedPostsContainer() {
  Array.from(document.getElementsByClassName("postMessage")).forEach(el => {
    if (el.getElementsByClassName("quotedPostsContainer").length === 0) {
      let container = document.createElement("span");
      container.classList.add("quotedPostsContainer");
      el.appendChild(container);
    }
  });
}

function addCollapseAndExpand() {
  Array.from(document.querySelectorAll(".post.reply")).forEach(postNode => {
    if (Array.from(postNode.children[1].children).filter(node => node.classList.contains("expandSpan")).length === 0) {
      let expandSpan = document.createElement("span");
      expandSpan.classList.add("expandSpan");
      expandSpan.innerText = "[↓]";
      expandSpan.title = "expand all 'quoted by' posts";
      expandSpan.style.color = "#1019d2e6";
      expandSpan.style.fontSize = "11px";
      expandSpan.style.paddingLeft = "5px";
      expandSpan.style.paddingRight = "5px";
      expandSpan.style.whiteSpace = "nowrap";
      let collapseSpan = document.createElement("span");
      collapseSpan.classList.add("collapseSpan");
      collapseSpan.style.color = "#1019d2e6";
      collapseSpan.innerText = "[↑]";
      collapseSpan.title = "collapse all 'quoted by' posts";
      collapseSpan.style.fontSize = "11px";
      collapseSpan.style.paddingRight = "0px";
      collapseSpan.style.whiteSpace = "nowrap";
      postNode.children[1].insertBefore(expandSpan, postNode.querySelector(".postMenuBtn"));
      postNode.children[1].insertBefore(collapseSpan, postNode.querySelector(".postMenuBtn"));
    }
    let expand = postNode.querySelector(".expandSpan");
    let collapse = postNode.querySelector(".collapseSpan");
    expand.removeEventListener("click", expandSpanEL);
    expand.addEventListener("click", expandSpanEL);
    collapse.removeEventListener("click", collapseSpanEL);
    collapse.addEventListener("click", collapseSpanEL);
  });
}

function expandSpanEL(e) {
  Array.from(Array.from(e.target.parentNode.children).filter(node => node.classList.contains("backlink"))[0].children).forEach(node => {if (!node.children[0].classList.contains("linkfade")) node.children[0].click();});
}

function collapseSpanEL(e) {
  Array.from(Array.from(e.target.parentNode.children).filter(node => node.classList.contains("backlink"))[0].children).forEach(node => {if (node.children[0].classList.contains("linkfade")) node.children[0].click();});
}

function qSpanClick(e) {
  e.preventDefault();
}

function addRemoveCapability() {
  //turns all delete checkboxes to simply post removal buttons
  Array.from(document.getElementsByClassName("postInfo desktop")).forEach(el => el.children[0].addEventListener("click", postRemove));
}

function postRemove(e) {
  e.preventDefault();
  e.target.parentNode.parentNode.parentNode.remove();
}

function qEV(e, node=e.target) {
  //console.log("quote clicked.");
  e.preventDefault();

  if (!node.classList.contains("linkfade")) {
    //if not grayed out, first time clicking, adding node
    node.classList.add("linkfade");

    //finding post and constructing new post
    let postsArr = Array.from(document.getElementsByClassName("postNum desktop")).filter(el => el.children[1].innerText === node.innerText.slice(2));
    //console.log("postsAArr", postsArr);
    let post = postsArr[0].parentNode.parentNode.parentNode;
    //console.log("particular post from postArr", post.outerHTML);
    let newPost = post.cloneNode(true);
    //newPost.outerHTML = post.outerHTML;
    newPost.classList.add("inlined");
    newPost.children[1].classList.remove("highlight");
    newPost.style.display = "";
    newPost.style.marginTop = "10px";
    newPost.children[1].style.border = "1px solid #a1b7c899";
    newPost.children[0].style.display = "none";
    //console.log("newPost before adding", newPost.outerHTML, "oldPost", post.outerHTML, "boolean", newPost.outerHTML === post.outerHTML);

    //adding to parent post
    if (node.parentNode.parentNode.parentNode.parentNode.children[2].classList.contains("file")) {
        Array.from(node.parentNode.parentNode.parentNode.parentNode.children[3].children).filter(el => el.classList.contains("quotedPostsContainer"))[0].appendChild(newPost);
        if (JSON.parse(localStorage.getItem("4chan-settings")).inlineQuotes) setTimeout(function() {node.parentNode.parentNode.parentNode.parentNode.children[3].children[0].remove();});
    } else {
        Array.from(node.parentNode.parentNode.parentNode.parentNode.children[2].children).filter(el => el.classList.contains("quotedPostsContainer"))[0].appendChild(newPost);
        if (JSON.parse(localStorage.getItem("4chan-settings")).inlineQuotes) setTimeout(function() {node.parentNode.parentNode.parentNode.parentNode.children[2].children[0].remove();});
    }
    //console.log("node just added", newPost);
    setTimeout(function(){newPost.style.display = "";}, 10);

    //resetting event listeners
    resetQLEV();
  } else {
    //grayed out, second time clicking, removing node
    node.classList.remove("linkfade");
    let idx = node.parentNode.parentNode.parentNode.parentNode.children[2].classList.contains("file") ? 3 : 2;
    Array.from(node.parentNode.parentNode.parentNode.parentNode.children[idx].children).forEach(innerNode => {
      if (innerNode.classList.contains("quotedPostsContainer")) {
        Array.from(innerNode.children).forEach(el => {
          if (el.classList.contains("inlined") && node.innerText.slice(2) === el.children[1].children[1].children[3].children[1].innerText) el.remove();
        });
      }
    });
  }
}

function resetQLEV() {
  let newQuotesList = Array.from(document.getElementsByClassName("quotelink")).filter(node => window.getComputedStyle(node).getPropertyValue("font-size") === "10.6667px");
  newQuotesList.forEach(node => node.removeEventListener("click", qEV));
  newQuotesList.forEach(node => node.addEventListener("click", qEV));
  let newSpanList = Array.from(document.getElementsByTagName("span")).filter(el => {
        try {
          if (el.children.length > 0 && el.children[0].classList.contains("quotelink")) return true;
        } catch(error) {
          //console.log("custom error in span EL", el);
          return false;
        }
    });
  newSpanList.forEach(el => el.removeEventListener("click", qSpanClick));
  newSpanList.forEach(el => el.addEventListener("click", qSpanClick));
  Array.from(document.getElementsByClassName("postInfo desktop")).forEach(el => el.children[0].removeEventListener("click", postRemove));
  addRemoveCapability();
  addCollapseAndExpand();
  let tesQuoteSpans = Array.from(document.getElementsByClassName("tessellateQuotes"));
  tesQuoteSpans.forEach(el => el.removeEventListener("click", tessellateQuotes));
  tesQuoteSpans.forEach(el => el.addEventListener("click", tessellateQuotes));
  addTessellationQuotes();
  addQuotedPostsContainer();
}

let observer = new MutationObserver(resetQLEV);
observer.observe(document.getElementsByClassName("thread")[0], {childList: true});
