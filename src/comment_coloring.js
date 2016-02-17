// ==UserScript==
// @name        HackerNews Comment Coloring
// @namespace   https://github.com/PauliusLabanauskis
// @version     0.21
// @include     http://news.ycombinator.com/*
// @include     https://news.ycombinator.com/*
// @grant       none
// ==/UserScript==

(function () {
    'use strict';
    
    const HIGHLIGHT_COLOR = 'fdfdfc';
    const BASE_INDENT_PX = 40;
    
    function getCommentIndentations() {
        var things = Array.prototype.slice.call(document.querySelectorAll('.athing'), 1);
        var indentations = Array.prototype.map.call(things, function(currentValue) {
            var indentation = currentValue.querySelector('.ind > img').width / BASE_INDENT_PX;
            return {
                indentation: indentation,
                comment: currentValue
            }
        });
        return indentations;
    }
    
    function init() {
        var comments = getCommentIndentations();
        var coloredComments = comments.filter(function(value) {
            return value.indentation % 2 != 0;
        });
        coloredComments.forEach(function(value) {
            var commentNode = value.comment.querySelector('.default');
            commentNode.style.backgroundColor = HIGHLIGHT_COLOR;
        });
    }
    
    try {
        init();
    }
    catch (e) { console.log(e); }
})();