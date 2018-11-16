// ==UserScript==
// @name         chan embedded quote fixer
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Puts embedded quotes in end of post rather than beginning, can also click on checkboxes in posts to remove them, allows for expand all/collapse all via arrows in post header
// @author       You
// @match        http://boards.4chan.org/*/thread/*
// @match        https://boards.4chan.org/*/thread/*
// @grant        none
// ==/UserScript==
//window.onload(function() {
    setTimeout(function() {
        let quotesList = Array.from(document.getElementsByClassName("quotelink")).filter(node => window.getComputedStyle(node).getPropertyValue("font-size") === "10.6667px");

    //add preview inlined to class of embedded quote, wrap whole thing in mutation observer
    //on click, add html, gray out link (add linkfade to classlist)
    //on another click, find embedded post 1 layer deep, remove(), and then change link back to normal

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
    }, 4000);
//});


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
        node.parentNode.parentNode.parentNode.parentNode.children[3].appendChild(newPost);
        setTimeout(function() {node.parentNode.parentNode.parentNode.parentNode.children[3].children[0].remove();});
    } else {
        node.parentNode.parentNode.parentNode.parentNode.children[2].appendChild(newPost);
        setTimeout(function() {node.parentNode.parentNode.parentNode.parentNode.children[2].children[0].remove();});
    }
    //console.log("node just added", newPost);
    setTimeout(function(){newPost.style.display = "";}, 50);

    //resetting event listeners
    resetQLEV();
  } else {
    //grayed out, second time clicking, removing node
    node.classList.remove("linkfade");
    let idx = node.parentNode.parentNode.parentNode.parentNode.children[2].classList.contains("file") ? 3 : 2;
    Array.from(node.parentNode.parentNode.parentNode.parentNode.children[idx].children).forEach(el => {if (el.classList.contains("inlined")
                                                                                                          && node.innerText.slice(2) === el.children[1].children[1].children[3].children[1].innerText) el.remove();});
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
  setTimeout(function() {addCollapseAndExpand();}, 100);
}

let observer = new MutationObserver(resetQLEV);
observer.observe(document.getElementsByClassName("thread")[0], {childList: true});
