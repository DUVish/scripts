// ==UserScript==
// @name         hyppics image fixer
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  changes thumbnails href to full image for hover add ons
// @author       You
// @match        https://hypnopics-collective.net/smf_forum/index.php?action=gallery*
// @grant        none
// ==/UserScript==

let scriptTag = document.createElement("script");
scriptTag.src = "https://code.jquery.com/jquery-2.2.4.js";
document.querySelector("head").appendChild(scriptTag);

newArr = Array.prototype.slice.call(document.getElementsByClassName("smalltext"), 0, document.getElementsByClassName("smalltext").length - 2);

newArr.forEach(el => el.innerHTML += el.innerText.slice(-5) === "Guest" ? "<br><span class='changeImg'>Change thumbnail href</span>" : "<span class='changeImg'>Change thumbnail href</span>");

Array.prototype.forEach.call(document.getElementsByClassName("changeImg"), function(el) {
    el.addEventListener("click", function(e) {
    el.innerText = "Changing...";
    $.ajax({
        type: "GET",
        url: el.parentNode.parentNode.children[window.location.href.match(/id=\d+/) || window.location.href.match(/u=\d+/) ? 1 : 0].href,
        success: function(data) {
            el.parentNode.parentNode.children[window.location.href.match(/id=\d+/) ||  window.location.href.match(/u=\d+/) ? 1 : 0].href = data.match(/https:\/\/hypnopics-collective\.net\/smf_forum\/gallery\/\d+\/\d+(-\d+)*\.\w+/)[0];
            el.innerText = "Changed!";
        },
        error: function(data) {
          console.log("error in ajax", error);
        }
    });
  });
});
