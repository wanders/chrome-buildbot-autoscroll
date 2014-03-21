/*
 * Author: Anders Waldenborg <anders@0x63.nu>
 * Copyright: Copyright (c) 2014, Anders Waldenborg
 *
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the
 * "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 *
 * Except as contained in this notice, the name(s) of the above copyright
 * holders shall not be used in advertising or otherwise to promote the
 * sale, use or other dealings in this Software without prior written
 * authorization.
 */

(function () {
    "use strict";

    var shouldAutoScroll = false;
    var helpElement;

    function key(k) {
        return '<div style="display: inline-block; box-shadow: inset 0 0 0.5em 0 rgba(0, 0, 0, 1); border-radius 0.2em;padding: 0.5em;border-radius: 0.3em;background: white;">' + k + '</div>';
    }

    function doScroll() {
        window.scrollTo(window.scrollX, document.body.scrollHeight);
    }

    function maybeScroll() {
        if (document.body && shouldAutoScroll) {
            setTimeout(doScroll, 0);
        }
    }

    function scrollToNextError(backwards) {
        var e = document.getElementsByClassName("header")[0];

        if (!e) {
            return;
        }

        if (backwards) {
            e = e.parentNode.lastChild;
        }

        while (e) {
            if (e.className == "stderr" &&
                ((!backwards && (e.offsetTop > window.scrollY + window.innerHeight))
                 ||
                 (backwards && (e.offsetTop + e.offsetHeight < window.scrollY)))) {

                e.style.transition = "";
                e.style.background = "#ff8";
                setTimeout(function () {
                    e.style.transition = "background-color .25s linear";
                    e.style.background = "white";
                }, 0);
                setTimeout(function () {
                    e.style.transition = "";
                    e.style.background = "";
                }, 300);
                e.scrollIntoViewIfNeeded();
                return;
            }
            if (backwards) {
                e = e.previousSibling;
            } else {
                e = e.nextSibling;
            }
        }


        document.body.style.transition = "";
        document.body.style.background = "#f88";
        setTimeout(function () {
            document.body.style.transition = "background-color .25s linear";
            document.body.style.background = "white";
        }, 0);
    }

    new MutationObserver(function (m) {
        if (!helpElement && document.body && document.body.firstChild) {

            helpElement = document.createElement("div");

            helpElement.style.border = "1px solid black";
            helpElement.innerHTML = ('<ul style="list-style: none; padding: 0">' +
                                     '<li>' + key('n') + ' Next error</li>' +
                                     '<li>' + key('N') + ' Prev error</li>' +
                                     '<li>' + key('g') + ' End of document</li>' +
                                     '<li>' + key('G') + ' Top of document</li>' +
                                     '<li>' + key('F') + ' Follow</li>' +
                                     '</ul>');
            helpElement.setAttribute("style", "font-size: 8pt; border: 1px solid black;position: fixed;right: 1em;top: 1em;background: #ffc;padding: 1em;opacity: 0.8;border-radius: 0.5em;");
            document.body.insertBefore(helpElement, document.body.firstChild);

            setTimeout(function () {
                helpElement.style.transition = "opacity .5s ease-in-out";
                helpElement.style.opacity = "0";
            }, 7000);
            setTimeout(function () {
                helpElement.style.display = "none";
            }, 7500);

        }
        maybeScroll();
    }).observe(document, {childList: true, subtree: true});

    document.addEventListener("scroll", function (evt) {
        if (window.scrollY + window.innerHeight < document.body.scrollHeight) {
            shouldAutoScroll = false;
        }
    });

    window.addEventListener("load", function (evt) {
        maybeScroll();
    });

    var keyHandlers = {};
    keyHandlers["n".charCodeAt(0)] = function () { scrollToNextError(false); };
    keyHandlers["N".charCodeAt(0)] = function () { scrollToNextError(true); };
    keyHandlers["g".charCodeAt(0)] = function () { doScroll(); };
    keyHandlers["G".charCodeAt(0)] = function () { window.scrollTo(window.scrollX, 0); };
    keyHandlers["F".charCodeAt(0)] = function () { shouldAutoScroll = true; doScroll(); };

    window.addEventListener("keypress", function (evt) {
        if (keyHandlers[evt.keyCode]) {
            keyHandlers[evt.keyCode]();
        }
    });

}());
