// ==UserScript==
// @name        HackerNews Comment Collapsing
// @namespace   https://github.com/PauliusLabanauskis
// @version     0.2
// @include     http://news.ycombinator.com/*
// @include     https://news.ycombinator.com/*
// @grant       none
// ==/UserScript==

var $hn_collapsing = {
    createCollapser: function (commentNode, childrenNodes) {
        var expand = function (e) {
            var collapserNode = e.target;
            
            commentNode.commentTextNode.style.display = "";
            commentNode.userNode.style.marginBottom = "-10px";
            
            childrenNodes.forEach(function(c) {
                c.commentNode.style.display = "";
            });

            collapserNode.textContent = "[-]";
            collapserNode.onclick = collapse;

            return false;
        }

        var collapse = function (e) {
            var collapserNode = e.target;
            
            commentNode.commentTextNode.style.display = "none";
            commentNode.userNode.style.marginBottom = "10px";
            
            childrenNodes.forEach(function(c) {
                c.commentNode.style.display = "none";
            });

            collapserNode.textContent = "[+]";
            collapserNode.onclick = expand;

            return false;
        }

        var collapserAnchor = document.createElement("a");
        collapserAnchor.class = "collapser";
        collapserAnchor.onclick = collapse;
        collapserAnchor.setAttribute("href", "#");
        collapserAnchor.style.color = "black";

        var anchorText = document.createTextNode("[-]");
        collapserAnchor.textContent = "[-]";

        return collapserAnchor;
    },

    addCollapser: function (context, comment, children) {
        var collapser = context.createCollapser(comment, children);
        
        var voteArrowNodes = comment.commentNode.getElementsByClassName("votearrow");
        if (voteArrowNodes.length > 0)
            var voteAnchorNode =  voteArrowNodes[0].parentNode;
        else
            var voteAnchorNode = comment.commentNode.querySelector('.votelinks').querySelector('img');
        voteAnchorNode.parentNode.insertBefore(collapser, voteAnchorNode);
    },
    
    getComments: function() {
        var comments = document.getElementsByClassName("athing");
        comments = Array.prototype.slice.call(comments, 0);
        comments.splice(0, 1);
        return comments;
    },
    
    gatherChildren: function(comments) {
        var getCurrentNodeInfo = function (commentNode, index) {
            var userNode = commentNode.querySelector(".comhead").parentNode;
            var commentTextNode = commentNode.querySelector(".comment");

            var indentationNode = commentNode.querySelector(".ind");
            var indentation = indentationNode.querySelector("img").width;

            var nodeInfo = {
                "index": index,
                "commentNode": commentNode,
                "userNode": userNode,
                "commentTextNode": commentTextNode,
                "indentation": indentation
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
                "comment": commentInfo,
                "children": new Array()
            };
            
            while (currentBranch.length > 0 && getLastElementIndentation(currentBranch) >= commentInfo.indentation)
                currentBranch = currentBranch.slice(0, currentBranch.length-1);
            
            currentBranch.forEach(function(c) {
                commentsWithChildren[c.index].children.push(commentInfo);
            });
            
            currentBranch.push(commentInfo);
        }
        
        return commentsWithChildren;
    },

    init: function (context) {
        var comments = context.getComments();
        comments = context.gatherChildren(comments);
        
        for (var key in comments) {
            context.addCollapser(context, comments[key].comment, comments[key].children);
        }
    }
};

(function () {
    try {
        $hn_collapsing.init($hn_collapsing);
    }
    catch (e) { console.log(e); }
})();