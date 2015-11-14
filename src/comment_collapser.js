// ==UserScript==
// @name        HackerNews Comment Collapsing
// @namespace   https://github.com/PauliusLabanauskis
// @version     0.12
// @include     http://news.ycombinator.com/*
// @include     https://news.ycombinator.com/*
// @grant       none
// ==/UserScript==

var $hn_collapsing = {
    createCollapser: function (context) {
        var getCurrentNodeInfo = function (collapserNode) {
            var voteLinkNode = collapserNode.parentNode.parentNode;
            var fullCommentNode = voteLinkNode.nextSibling;
            var userNode = fullCommentNode.querySelector(".comhead").parentNode;
            var commentNode = fullCommentNode.querySelector(".comment");

            var indentationNode = voteLinkNode.previousSibling;
            var indentation = indentationNode.querySelector("img").width;

            var rootNode = voteLinkNode.parentNode.parentNode.parentNode.parentNode.parentNode;

            return {
                "rootNode": rootNode,
                "userNode": userNode,
                "commentNode": commentNode,
                "indentation": indentation
            };
        };

        var getChildren = function (rootCommentNode) {
            var children = new Array();

            var siblingCommentNode = rootCommentNode.rootNode;

            do {
                siblingCommentNode = siblingCommentNode.nextSibling;
                while (siblingCommentNode && siblingCommentNode.className != "athing")
                    siblingCommentNode = siblingCommentNode.nextSibling;

                if (siblingCommentNode) {
                    var indentationNode = siblingCommentNode.querySelector('.ind');
                    var indentation = indentationNode.querySelector("img").width;

                    if (indentation > rootCommentNode.indentation)
                        children.push(siblingCommentNode);
                }
            } while (indentation > rootCommentNode.indentation && siblingCommentNode);

            return children;
        };

        var expand = function (e) {
            var collapserNode = e.target;
            var currentNodeInfo = getCurrentNodeInfo(collapserNode);
            var childrenNodes = getChildren(currentNodeInfo);

            currentNodeInfo.commentNode.style.display = "";
            currentNodeInfo.userNode.style.marginBottom = "-10px";

            Array.prototype.forEach.call(childrenNodes, function (c) {
                c.style.display = "";
            });

            collapserNode.textContent = "[-]";
            collapserNode.onclick = collapse;

            return false;
        }

        var collapse = function (e) {
            var collapserNode = e.target;
            var currentNodeInfo = getCurrentNodeInfo(collapserNode);
            var childrenNodes = getChildren(currentNodeInfo);

            currentNodeInfo.commentNode.style.display = "none";
            currentNodeInfo.userNode.style.marginBottom = "10px";

            Array.prototype.forEach.call(childrenNodes, function (c) {
                c.style.display = "none";
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

    addCollapser: function (context, commentNode) {
        var collapser = context.createCollapser();
        
        var voteArrowNodes = commentNode.getElementsByClassName("votearrow");
        if (voteArrowNodes.length > 0)
            var voteAnchorNode =  voteArrowNodes[0].parentNode;
        else
            var voteAnchorNode = commentNode.querySelector('.votelinks').querySelector('img');
        voteAnchorNode.parentNode.insertBefore(collapser, voteAnchorNode);
    },

    init: function (context) {
        var comments = document.getElementsByClassName("athing");
        comments = Array.prototype.slice.call(comments, 0);
        comments.splice(0, 1);

        comments.forEach(function (c) {
            context.addCollapser(context, c);
        });
    }
};

(function () {
    try {
        $hn_collapsing.init($hn_collapsing);
    }
    catch (e) { console.log(e); }
})();