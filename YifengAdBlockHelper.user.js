// ==UserScript==
// @name         YifengAdBlockHelper
// @namespace    https://github.com/ggkk0818/TampermonkeyScript
// @version      0.1
// @updateURL    https://github.com/ggkk0818/TampermonkeyScript/raw/master/YifengAdBlockHelper.user.js
// @description  recover the hidden content.
// @author       You
// @match        http://www.ruanyifeng.com/blog/*.html
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    var htmlStr = document.querySelector('#main-content').innerHTML;
    var timer = setInterval(function () {
        if (document.querySelector('#main-content').innerHTML === '') {
            document.querySelector('#main-content').innerHTML = htmlStr;
            clearInterval(timer);
        }
    }, 100);
})();
