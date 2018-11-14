// ==UserScript==
// @name         barchive image and quote fixer
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  replaces thumbnails with full image on click and inlines "quoted by" posts on click
// @author       You
// @match        https://thebarchive.com/b/thread/*
// @match        https://archived.moe/*/thread/*
// @grant        none
// ==/UserScript==

Array.from($(".post_data")).forEach(el => {
  el.children[8].children[0].style.paddingLeft = "0px";
  el.children[8].children[0].style.marginLeft = "-3px";
  el.innerHTML += '<span class="postRemove" style="font-size: 9.5px;position: relative;top: -1px;padding-left: 5px;color: darkgrey;opacity: 0.45;">Remove</span>';
});

$(".postRemove").on("click", function(e) {
  this.parentNode.parentNode.parentNode.parentNode.remove();
});

$(".backlink").on("click", function(e) {
  inOnClickFunc(e, this);
});

function inOnClickFunc(e, node) {
  backlinkClick(e, node);
  backlinkReset(e, node);
}

document.querySelector("head").innerHTML += '<style>.clicked {opacity: 0.3;}</style>';

document.querySelector("title").innerText = "/b/ - " + document.querySelector(".text").innerText;

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
    node.parentNode.parentNode.parentNode.children[node.parentNode.parentNode.parentNode.children[0].classList.contains("post_file") ? 4 : 2].appendChild(newPost);
  } else {
    node.classList.remove("clicked");
    Array.from(node.parentNode.parentNode.parentNode.children[node.parentNode.parentNode.parentNode.children[0].classList.contains("post_file") ? 4 : 2].children)
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
