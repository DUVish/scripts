// ==UserScript==
// @name         chyoa story depaginator
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://chyoa.com/chapter/*
// @match        http://chyoa.com/chapter/*
// @match        https://chyoa.com/index.php/chapter/*
// @require      http://code.jquery.com/jquery-latest.js
// @grant        none
// ==/UserScript==

//turn off noscript for site
//first get requests gets same story chapter, so that is an edge case, not sure why

var more = true;
var nextLink = $(".controls-left > a:nth-child(1)").href;
var first = true;

function all() {
    $.ajax({
        type: "GET",
        url: nextLink,
        success: function(data) {
            text = $(data).find(".chapter-content");
            nextLink = $(data).find(".controls-left")[0].childNodes[1].href;
            if (first) {
                $(".chapter-content")[0].innerHTML = "";
                first = false;
            }

            if (!first) {
                $(".chapter-content").prepend("<div>"+text[0].innerHTML+"</div>");
            }

            if (nextLink.split("/")[3] == "story" || nextLink.split("/")[4] == "story") {
                more = false;
            }
            if (more) {
                all();
            }
        }
    })
}

all();

function removeCSS() {
    for (let i = 0; i < document.styleSheets.length; i++) {
        document.styleSheets[i].disabled = true;
    }
}

removeCSS();
