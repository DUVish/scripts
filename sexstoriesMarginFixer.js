// ==UserScript==
// @name         sxstorymarginFixer
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Fixes margins, disabled css, fixes title
// @author       You
// @match        https://www.sexstories.com/story/*
// @grant        none
// ==/UserScript==


document.querySelector("head").innerHTML += `<style>#story_center_panel {
  width: inherit;
  margin: 10px auto;
  border-style: solid;
  border-width: 2px;
  }</style>`;

document.querySelector("title").innerText = document.querySelector("h2").innerText;

