// ==UserScript==
// @name         bdlib author page mm remover
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http://www.bdsmlibrary.com/stories/author.php?authorid=*
// @grant        none
// ==/UserScript==

document.querySelector("h3").innerHTML += `<button class='myButton' style="margin-left: 10px;">Filter Out MM</button>`;

document.getElementsByClassName("myButton")[0].addEventListener("click", function(e) {
  cleanUp();
});

var cleanUp = function() {
    console.log("happeninbg now");
    Array.prototype.slice.call(document.querySelectorAll("table"), 8).forEach(el => {
        if (el.children[0].children[2].children[1].innerText.includes("/m")) el.remove();
    });
};
