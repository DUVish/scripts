// ==UserScript==
// @name         sxImage Fixer
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  changes href of thumbnails for image hover add ons
// @author       You
// @match        https://www.sex.com/*
// @match        http://www.sex.com/*
// @grant        none
// ==/UserScript==

Array.prototype.forEach.call($(".image_wrapper"), function(el) {
  let newHref = el.children[0].dataset.src.split("/");
  newHref[newHref.length - 2] = "620";
  el.href = newHref.join("/");
});
