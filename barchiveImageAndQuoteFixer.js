// ==UserScript==
// @name         barchive image and quote fixer
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  replaces thumbnails with full image or webm on click and inlines "quoted by" posts on click, can also remove posts, tessellate inlined posts, tessellate entire thread, and expand/collapse all 'quoted by' posts
// @author       You
// @match        https://thebarchive.com/b/thread/*
// @match        https://archived.moe/*/thread/*
// @grant        none
// ==/UserScript==

Array.from($(".post_data")).forEach(el => {
    el.innerHTML += `<span class="expandAllQuotes" style="font-size: 10px;position: relative;top: -2px;padding-left: 1px;color: #7fa5c6;opacity: 0.95;padding-right: 0px;" title="Expand all 'quoted by' posts">[↓]</span>`;
});

Array.from($(".post_data")).forEach(el => {
    el.innerHTML += `<span class="collapseAllQuotes" style="font-size: 10px;position: relative;top: -2px;padding-left: 3px;color: #7fa5c6;opacity: 0.95;padding-right: 6px;" title="Collapse all 'quoted by' posts">[↑]</span>`;
});

Array.from($(".post_data")).forEach(el => {
    el.innerHTML += '<span class="tessellatePost" style="font-size: 10px;position: relative;top: -2px;padding-left: 4px;color: #7fa5c6;opacity: 0.95;padding-right: 13px;">[Tessellate]</span>';
});

document.querySelector(".post_data").innerHTML += '<span class="tessellateThread" style="font-size: 10px;position: relative;top: -2px;padding-left: 2px;color: #7fa5c6;opacity: 0.95;padding-right: 11px;">[Tessellate Thread]</span>';

Array.from($(".post_data")).forEach(el => {
    el.children[8].children[0].style.paddingLeft = "0px";
    el.children[8].children[0].style.marginLeft = "-3px";
    el.innerHTML += '<span class="postRemove" style="font-size: 9.5px;position: relative;top: -1px;padding-left: 3px;color: darkgrey;opacity: 0.45;">Remove</span>';
});

Array.from(document.querySelectorAll(".text")).forEach(el => el.innerHTML += '<span class="inlinedQuotesContainer"></span>');


$(".postRemove").on("click", function(e) {
    postRemove(e, this);
});

$(".backlink").on("click", function(e) {
    inOnClickFunc(e, this);
});

function postRemove(e, node) {
    node.parentNode.parentNode.parentNode.remove();
}

function inOnClickFunc(e, node) {
    e.preventDefault();
    backlinkClick(e, node);
    backlinkReset(e, node);
}

document.querySelector("head").innerHTML += '<style>.clicked {opacity: 0.3;}</style>';

document.querySelector("title").innerText = "/b/ - " + document.querySelector(".text").innerText;

$(".tessellatePost").on("click", function(e) {
    tessellatePost(e, this);
});

$(".tessellateThread").on("click", function(e) {
    tessellateThread(e, this);
});

function tessellatePost(e, node) {
  let container = node.parentNode.parentNode.parentNode.parentNode.querySelector(".inlinedQuotesContainer");
  let tesSpan = node.parentNode.parentNode.parentNode.parentNode.querySelector(".tessellatePost");
  if (container.style.display !== "flex") {
    container.style.display = "flex";
    container.style.flexWrap = "wrap";
    tesSpan.style.opacity = "0.45";
    tesSpan.style.color = "darkgrey";
  } else {
    container.style.display = "";
    container.style.flexWrap = "";
    tesSpan.style.opacity = "0.95";
    tesSpan.style.color = "#7fa5c6";
  }
}

function tessellateThread(e, node) {
  let container = document.querySelector(".posts");
  let tesSpan = node;
  if (container.style.display !== "flex") {
    container.style.display = "flex";
    container.style.flexWrap = "wrap";
    tesSpan.style.opacity = "0.45";
    tesSpan.style.color = "darkgrey";
  } else {
    container.style.display = "";
    container.style.flexWrap = "";
    tesSpan.style.opacity = "0.95";
    tesSpan.style.color = "#7fa5c6";
  }
}

$(".expandAllQuotes").on("click", function(e) {
  expandAllQuotes(e, this);
});

$(".collapseAllQuotes").on("click", function(e) {
  collapseAllQuotes(e, this);
});

function expandAllQuotes(e, node) {
  Array.from(node.parentNode.parentNode.parentNode.querySelector(".backlink_list").children[0].children).filter(el => !el.classList.contains("clicked")).forEach(el => $(el).trigger("click"));
}

function collapseAllQuotes(e, node) {
  Array.from(node.parentNode.parentNode.parentNode.querySelector(".backlink_list").children[0].children).filter(el => el.classList.contains("clicked")).forEach(el => $(el).trigger("click"));
}

function backlinkClick(e, node) {
    e.preventDefault();
    let targetID = node.innerHTML.slice(8);
    if (!node.classList.contains("clicked")) {
        node.classList.add("clicked");
        //console.log("targetID is", targetID, $("#"+targetID));
        let newPost = $("#"+targetID)[0].cloneNode(true);
        newPost.style.border = "1px solid #0b0e1580";
        newPost.style.borderRadius = "6px";
        newPost.style.marginTop = "13px";
        setTimeout(function(){newPost.classList.remove("highlight");}, 10);
        node.parentNode.parentNode.parentNode.children[node.parentNode.parentNode.parentNode.children[0].classList.contains("post_file") ? 4 : 2].getElementsByClassName("inlinedQuotesContainer")[0].appendChild(newPost);
    } else {
        node.classList.remove("clicked");
        Array.from(node.parentNode.parentNode.parentNode.children[node.parentNode.parentNode.parentNode.children[0].classList.contains("post_file") ? 4 : 2].getElementsByClassName("inlinedQuotesContainer")[0].children)
            .filter(el => el.id === targetID).forEach(el => el.remove());
    }
}

function backlinkReset(e, node) {
    $(".backlink").off();
    $(".backlink").on("click", function(e) {
        inOnClickFunc(e, this);
    });
    $(".post_image").off();
    $(".post_image").on("click", function(e) {
        settingClickHandler(e, this);
    });
    $(".tessellatePost").off();
    $(".tessellatePost").on("click", function(e) {
        tessellatePost(e, this);
    });
    //$(".postRemove").off();
    //$(".postRemove").on("click", function(e) {
    //    postRemove(e, node);
    //});
    $(".expandAllQuotes").off();
    $(".expandAllQuotes").on("click", function(e) {
      expandAllQuotes(e, this);
    });
    $(".collapseAllQuotes").off();
    $(".collapseAllQuotes").on("click", function(e) {
      collapseAllQuotes(e, this);
    });
}

$(".post_image").on("click", function(e) {
    settingClickHandler(e, this);
});

function settingClickHandler(e, node) {
    e.preventDefault();
    if (node === document.getElementsByClassName("post_image")[0]) {
        node.src = node.parentNode.href;
        node.attributes.removeNamedItem("height");
        node.attributes.removeNamedItem("width");
    } else {
        if (node.src.split("/")[5] === "thumb") {
            if (node.parentNode.parentNode.parentNode.children[0].children[1].href.slice(-4) === "webm") {
                let newVideoNode = document.createElement("video");
                newVideoNode.src = node.parentNode.parentNode.parentNode.children[0].children[1].href;
                newVideoNode.controls = true;
                newVideoNode.autoplay = true;
                newVideoNode.loop = true;
                node.parentNode.parentNode.parentNode.appendChild(newVideoNode);
                node.style.display = "none";
                let newSpan = document.createElement("span");
                newSpan.style.paddingLeft = "5px";
                newSpan.style.color = "#81a2be";
                newSpan.innerText = "[close webm]";
                node.parentNode.parentNode.parentNode.children[0].appendChild(newSpan);
                newSpan.addEventListener("click", function(e) {
                  newVideoNode.remove();
                  node.style.display = "";
                  newSpan.remove();
                });
                return;
            }
            let widthHeightArr = node.parentNode.parentNode.parentNode.children[0].children[2].innerText.split(", ")[1].split("x");
            let fileExt = node.parentNode.parentNode.parentNode.children[0].children[1].href.split(".")[2];
            node.src = node.src.replace("thumb", "image").replace("s.jpg", "." + fileExt);
            node.style.width = widthHeightArr[0] + "px";
            node.style.height = widthHeightArr[1] + "px";
        } else {
            node.src = node.src.replace(/(\d+)(\.)(\w+)/, "$1s$2jpg").replace("image", "thumb");
            node.style.width = "";
            node.style.height = "";
        }
    }
}

Array.from(document.querySelectorAll(".backlink.op")).forEach(el => el.innerText += "  (OP)");
