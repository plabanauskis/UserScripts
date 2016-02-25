// ==UserScript==
// @name        HackerNews Comment Collapsing
// @namespace   https://github.com/PauliusLabanauskis
// @version     0.31
// @include     http://news.ycombinator.com/item*
// @include     https://news.ycombinator.com/item*
// @grant       none
// ==/UserScript==

(function () {
    'use strict';
    
    const COLLAPSER_COLLAPSED = '[+]';
    const COLLAPSER_EXPANDED = '[-]';
    
    function addCollapser(comment, children) {
        var collapser = createCollapser(comment, children);
        
        var voteArrowNodes = comment.commentNode.getElementsByClassName('votearrow');
        if (voteArrowNodes.length > 0)
            var voteAnchorNode =  voteArrowNodes[0].parentNode;
        else
            voteAnchorNode = comment.commentNode.querySelector('.votelinks').querySelector('img');
        voteAnchorNode.parentNode.insertBefore(collapser, voteAnchorNode);
    }
    
    function getComments() {
        var comments = document.querySelectorAll('.athing');
        return Array.prototype.slice.call(comments, 1);
    }
    
    function gatherChildren(comments) {
        function getCurrentNodeInfo(commentNode, index) {
            var userNode = commentNode.querySelector('.comhead').parentNode;
            var commentTextNode = commentNode.querySelector('.comment');

            var indentationNode = commentNode.querySelector('.ind');
            var indentation = indentationNode.querySelector('img').width;

            var nodeInfo = {
                index: index,
                commentNode: commentNode,
                userNode: userNode,
                commentTextNode: commentTextNode,
                indentation: indentation
            };
            
            return nodeInfo;
        };
        
        var getLastElementIndentation = function(branch) {
                return branch[branch.length-1].indentation;
            };
            
        var commentsWithChildren = new Array();
        var currentBranch = new Array();
        
        for (var i = 0; i < comments.length; i++) {
            var commentInfo = getCurrentNodeInfo(comments[i], i);
            
            commentsWithChildren[i] = {
                comment: commentInfo,
                children: new Array()
            };
            
            while (currentBranch.length > 0 && getLastElementIndentation(currentBranch) >= commentInfo.indentation)
                currentBranch = currentBranch.slice(0, currentBranch.length-1);
            
            currentBranch.forEach(function(c) {
                commentsWithChildren[c.index].children.push(commentInfo);
            });
            
            currentBranch.push(commentInfo);
        }
        
        return commentsWithChildren;
    }

    function createCollapser(commentNode, childrenNodes) {
        var expand = function (e) {
            var collapserNode = e.target;
            
            commentNode.commentTextNode.style.display = '';
            commentNode.userNode.style.marginBottom = '-10px';
            
            childrenNodes.forEach(function(c) {
                if (c.collapsedBy === commentNode)
                    c.commentNode.style.display = '';
            });

            collapserNode.textContent = COLLAPSER_EXPANDED;
            collapserNode.onclick = collapse;

            return false;
        }

        var collapse = function (e) {
            var collapserNode = e.target;
            
            commentNode.commentTextNode.style.display = 'none';
            commentNode.userNode.style.marginBottom = '10px';
            
            childrenNodes.forEach(function(c) {
                if (c.commentNode.style.display !== 'none') {
                    c.commentNode.style.display = 'none';
                    c.collapsedBy = commentNode;
                }
            });

            collapserNode.textContent = COLLAPSER_COLLAPSED;
            collapserNode.onclick = expand;

            return false;
        }

        var collapserAnchor = document.createElement('a');
        collapserAnchor.class = 'collapser';
        collapserAnchor.onclick = collapse;
        collapserAnchor.setAttribute('href', '#');
        collapserAnchor.style.color = 'black';
        
        collapserAnchor.textContent = COLLAPSER_EXPANDED;

        return collapserAnchor;
    }
    
    function init () {
        var comments = getComments();
        var childComments = gatherChildren(comments);
        
        for (var key in childComments) {
            addCollapser(childComments[key].comment, childComments[key].children);
        }
    }
    
    try {
        init();
    }
    catch (e) { console.log(e); }
})();