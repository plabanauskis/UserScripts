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
        this.filterComments = function(text) {
            var matchingComments = [];
            var nonMatchingComments = [];
            
            this.currentDocument.comments.forEach(function(comment) {
                var commentText = comment.getText();
                if (commentText == null || commentText.indexOf(text) === -1)
                    nonMatchingComments.push(comment);
                else
                    matchingComments.push(comment);
            });
            return {
                matching: matchingComments,
                nonMatching: nonMatchingComments
                };
        };
        this.style = createFilterStyle();
        this.currentDocument.appendElement(this.style);
        
        function createFilterStyle() {
            var styleElement = document.createElement('style');
            styleElement.type = 'text/css';
            styleElement.innerHTML = '.filtered-out { display: none; }';
            return styleElement;
        }
        
        var prototype = Object.getPrototypeOf(this);        
        var onInput = function(searchText) {
            var filteredComments = this.filterComments(searchText);
            filteredComments.nonMatching.forEach(function(comment) { comment.hide(); });
            filteredComments.matching.forEach(function(comment) { comment.display(); });
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
        
        function applyClass(element, className) {
            if (!element.classList.contains(className))
                element.classList.toggle(className);
        }
        
        function removeClass(element, className) {
            if (element.classList.contains(className))
                element.classList.toggle(className);
        }
        
        var prototype = Object.getPrototypeOf(this);
        prototype.hide = function() { applyClass(this.commentNodeDOM, 'filtered-out'); }
        prototype.display = function() { removeClass(this.commentNodeDOM, 'filtered-out'); };
        prototype.getText = function() {
            var commentTextNode = this.commentNodeDOM.querySelector('.comment span');
            return commentTextNode == null ? null : commentTextNode.innerHTML;
        };
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
        };
        prototype.appendElement = function(element) {
            document.body.appendChild(element);
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