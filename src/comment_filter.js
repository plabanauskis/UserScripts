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
        var prototype = Object.getPrototypeOf(this);
        
        prototype.onInput = (value) => console.log(value);
    }
    
    function FilterInput(onInputCallback) {
        function createInputField() {
            var input = document.createElement('input');
            input.type = 'text';
            input.style.marginRight = '10px';
            input.addEventListener('input', ev => onInputCallback(input.value));
            return input;
        }
        
        this.inputField = createInputField();
        
        var prototype = Object.getPrototypeOf(this);
        prototype.getTextField = () => this.inputField;
    }
    
    function CurrentDocument() {
        var prototype = Object.getPrototypeOf(this);
        prototype.placeInputField = function(input) {
            var placement = document.querySelectorAll('td > .pagetop')[1];
            var anchor = placement.querySelector('a');
            placement.insertBefore(input, anchor);
        }
    }
    
    var currentDocument = new CurrentDocument();
    var filter = new Filter(currentDocument);
    var filterInput = new FilterInput(filter.onInput);
    
    currentDocument.placeInputField(filterInput.getTextField());
})();