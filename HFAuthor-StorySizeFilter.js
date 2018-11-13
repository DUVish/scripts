// ==UserScript==
// @name         HFAuthor story size filter
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @include      https://www.hentai-foundry.com/stories/user/*
// @exclude      https://www.hentai-foundry.com/stories/user/*/*
// @include      http://www.hentai-foundry.com/stories/user/*
// @exclude      http://www.hentai-foundry.com/stories/user/*/*
// @grant        none
// ==/UserScript==

$(".galleryHeader").prepend(`<input class='filterSize' placeholder='Filter stories smaller than this size in kb' size='40px'></input>
<span class='storyCount'>${$(".storyRow").length} stories on this page.</span>
<button class='futaFilter'>Filter out Futa content</button>`);
$(".filterSize").css("padding-right", "15px");
$(".storyCount").css("padding-right", "20px");

$(".filterSize").on("keydown", function(e) {
    if (e.key === "Enter") {
        let filteredSize = Number($(".filterSize").val());
        $(".filterSize").val("");
        Array.prototype.forEach.call($(".col3"), function(el) {
            if (Number(el.innerText.match(/Size: (\d+)k/)[1]) < filteredSize)
                el.parentNode.parentNode.parentNode.parentNode.parentNode.remove();
        });
        $(".storyCount")[0].innerText = $(".storyRow").length + " stories on this page.";
    }
});

$(".futaFilter").on("click", function(e) {
    Array.prototype.forEach.call($(".storyRow").find(".lvl2"), function(el) {
        if (el.title.match(/Futanari/)) {
            el.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.remove();
        }
    });
    $(".storyCount")[0].innerText = $(".storyRow").length + " stories on this page.";
});




