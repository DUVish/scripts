// ==UserScript==
// @name         storiesonline depaginator
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  De-paginates stories on storiesonline.net
// @author       You
// @match        https://storiesonline.net/s/*/*
// @grant        none
// ==/UserScript==

let scr = document.createElement("script");

scr.src = "https://code.jquery.com/jquery-3.3.1.min.js";

scr.onload = function() {
    Array.from($(".tolink")).forEach(el => $(el).load(el.children[0].href + " article"));

    setTimeout(function() {
        Array.from($(".end")).forEach(el => el.remove());
        Array.from($(".date")).forEach(el => el.remove());
    }, chapters * 1000);
};

document.querySelector("head").appendChild(scr);

let chapters = document.getElementsByClassName("tolink").length;

for (let sheet of document.styleSheets) {
    sheet.disabled = true;
}
