// ==UserScript==
// @name         sxstories profile stories searcher
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Adds searching for all stories in author profile page
// @author       You
// @match        https://www.sexstories.com/profile*
// @grant        none
// ==/UserScript==


//adding jQuery manually because grant isn't working
let scriptTag = document.createElement("script");
scriptTag.src = "https://code.jquery.com/jquery-3.3.1.min.js";
document.querySelector("head").appendChild(scriptTag);

setTimeout(function() {
    //changing title of page
    document.querySelector("title").innerText = document.querySelector("h3").children[0].innerText + "'s profile on sexstories.com";

    //adding button for asyncStatus and search input itself
    let asyncStatus = true;
    document.getElementsByTagName("h3")[1].innerHTML += "<input class='searchStories' placeholder='Search stories'></input><button class='syncButton' title='Switch synchronicity status'>Asynchronous</button><button class='reset'>Reset</button>";
    document.querySelector("head").innerHTML += `<style>
      .searchStories {
        margin-left: 10px;
      }
      .syncButton {
        margin-left: 10px;
      }
      .tableDataRow {
        font-size: 11px;
        margin-left: 5px;
        margin-right: 5px;
      }
    </style>`;

    $(".syncButton").on("click", function(e) {
      console.log("async status", asyncStatus);
      asyncStatus = !asyncStatus;
      let status = asyncStatus ? "Asynchronous" : "Synchronous";
      $(".syncButton")[0].innerText = status;
    });

    $(".reset").on("click", function(e) {
      Array.from($(".tableDataRow")).forEach(el => el.remove());
    });

    $(".searchStories").on("keydown", function(e) {
      if (e.key === "Enter") {
        let searchTerm = $(".searchStories").val();
        console.log("starting event with search term and asyncStatus", searchTerm, asyncStatus);
        Array.prototype.forEach.call(document.getElementsByTagName("tr"), function(node, i) {
          if (i === 0) return;
          let link = node.children[0].children[0].href;
          $.ajax({
            type: "GET",
            async: asyncStatus,
            url: link,
            success: function(data) {
              //console.log("success in ajax call");
              let reg = new RegExp(searchTerm, "gi");
              let idx = $(data).find(".block_panel").length === 2 ? 0 : 1;
              let wordCount = $(data).find(".block_panel")[idx].innerText.match(/\S\s\S/g).length;
              let searchCount = $(data).find(".block_panel")[idx].innerText.match(reg).length;
              //console.log("reg, wordCount, and searchCount", reg, wordCount, searchCount);
              if (node.children.length === 5) node.innerHTML += `<td class='tableDataRow'>${wordCount} words</td>`;
              node.children[0].innerHTML += `<span class='tableDataRow'>(${searchCount} results for ${searchTerm})</span>`;
            },
            error: function(error) {
              console.log("error in ajax call", error);
            }
          });
        });
      }
    });
}, 1500);

