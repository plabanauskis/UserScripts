// ==UserScript==
// @name        HackerNews Comment Filtering
// @namespace   https://github.com/PauliusLabanauskis
// @version     0.1
// @include     http://news.ycombinator.com/*
// @include     https://news.ycombinator.com/*
// @grant       none
// ==/UserScript==

(function() {
    'use strict';
    
    function Filter(currentDocument) {
        this.currentDocument = currentDocument;
        this.discoverNonMatchingComments = function(text) {
            var filtered = this.currentDocument.comments.filter(
                function(comment) {
                    var commentText = comment.getText();
                    return commentText == null ?
                        false : comment.getText().indexOf(text) === -1;
                });
            return filtered;
        };
        
        var prototype = Object.getPrototypeOf(this);        
        var onInput = function(value) {
            var nonMatchingComments = this.discoverNonMatchingComments(value);
            nonMatchingComments.forEach(function(comment) { comment.collapse() });
        }.bind(this);
        prototype.onInput = onInput;
    }
    
    function FilterInput(onInputCallback) {
        function createInputField() {
            var input = document.createElement('input');
            input.type = 'text';
            input.style.marginRight = '10px';
            input.addEventListener('input', function(ev) { onInputCallback(input.value) });
            return input;
        }
        
        this.inputField = createInputField();
        
        var prototype = Object.getPrototypeOf(this);
        prototype.getTextField = function() { return this.inputField };
    }
    
    function DOMComment(commentNodeDOM) {
        this.commentNodeDOM = commentNodeDOM;
        
        var prototype = Object.getPrototypeOf(this);
        prototype.collapse = function() { this.commentNodeDOM.style.display = 'none'; }
        prototype.expand = function() { this.commentNodeDOM.style.display = '' };
        prototype.getText = function() {
            var commentTextNode = this.commentNodeDOM.querySelector('.comment span');
            return commentTextNode == null ? null : commentTextNode.innerHTML;
        }
    }
    
    function CurrentDocument() {
        var commentNodes = document.querySelectorAll('.comment-tree .athing');
        this.comments = [];
        Array.prototype.forEach.call(commentNodes,
            function(node) { this.comments.push(new DOMComment(node)) }, this);
        
        var prototype = Object.getPrototypeOf(this);
        prototype.placeInputField = function(input) {
            var placement = document.querySelectorAll('td > .pagetop')[1];
            var anchor = placement.querySelector('a');
            placement.insertBefore(input, anchor);
        }
    }
    
    try {
        var currentDocument = new CurrentDocument();
        var filter = new Filter(currentDocument);
        var filterInput = new FilterInput(filter.onInput);
        
        currentDocument.placeInputField(filterInput.getTextField());
    } catch (e) {
        console.log(e);
    }
})();