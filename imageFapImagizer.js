// ==UserScript==
// @name         IF picture fixer
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  changes thumbnail href to full images, fixing option for those that don't fit pattern
// @author       You
// @match        https://www.imagefap.com/pictures/*
// @grant        https://code.jquery.com/jquery-2.2.4.js
// ==/UserScript==

/*
let cache = {};
Array.from(document.querySelectorAll("font")).filter(el => el.color==="#000000" && el.face==="verdana").forEach((el, i) => cache[i] = el.parentNode.parentNode.parentNode.parentNode.children[0].children[0].children[0].children[0].href);
*/

let uploaderText;
Array.prototype.forEach.call(document.querySelectorAll("b"), function(el) {if (el.innerText.includes("Uploaded by ")) uploaderText = el.innerText.slice(12, el.innerText.length);});


Array.from(document.querySelectorAll("a")).forEach(function(el) {
  if (el.href.split("/")[3] === "photo" && el.parentNode.parentNode.parentNode.children[1].children[0].children[1].innerText.slice(-3) !== "...") {
    el.href = "https://x.imagefapusercontent.com/u/" + uploaderText + "/" + window.location.href.split("/")[4] + "/" + el.href.split("/")[4] + "/" + el.parentNode.parentNode.parentNode.children[1].children[0].innerText;
  }
});

Array.from(document.querySelectorAll("font")).filter(el => el.color==="#000000" && el.face==="verdana").forEach(el => el.innerHTML += `<br><span class='fixImg'>${el.parentNode.children[1].innerText.slice(-3) === "..." ? "Not fixed." : "Fixed!"}</span>`);

/*
Array.from(document.getElementsByClassName("fixImg")).forEach((el, i) => el.addEventListener("click", function(e) {
  el.innerText = "Fixing...";
  console.log("url", cache[i]);
  $.ajax({
    type: "GET",
    url: cache[i],
    success: function(data) {
      el.parentNode.parentNode.parentNode.parentNode.children[0].children[0].children[0].href = data.match(/https:\/\/x\.imagefapusercontent\.com\/u\/\w+\/\d+\/\d+\/^[.]+\.\w+/);
      el.innerText = "Fixed!";
    }
  });
}));
*/
