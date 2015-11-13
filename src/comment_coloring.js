// ==UserScript==
// @name        HackerNews Comment Coloring
// @namespace   https://github.com/PauliusLabanauskis
// @version     0.1
// @include     http://news.ycombinator.com/*
// @include     https://news.ycombinator.com/*
// @grant       none
// ==/UserScript==

var $hn_coloring = {
    colors: ["f6f6ef", "fdfdfc"],

    init: function () {
        var elements = document.getElementsByClassName("default");

        for (var i = 0; i < elements.length; i++) {
            var color = this.colors[i % 2];
            elements[i].style.backgroundColor = color;
        }
    }
};

(function () {
    try {
        $hn_coloring.init();
    }
    catch (e) { console.log(e); }
})();