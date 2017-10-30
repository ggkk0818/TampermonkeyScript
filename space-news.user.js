// ==UserScript==
// @name         联众星际家园新闻页面跳转
// @namespace    https://github.com/ggkk0818/TampermonkeyScript
// @version      1.0
// @description  浏览联众星际家园新闻自动跳转到芬腾官网相应链接
// @author       ggkk0818
// @match        http://newsapce.ourgame.com/View.aspx?id=*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    var regex = /http:\/\/newsapce\.ourgame\.com\/View\.aspx\?id=(\d+)/,
        result = regex.exec(window.location.href);
    if(result && result.length){
        window.location.href = "http://newsapce.sxfenteng.com/View.aspx?id=" + result[1];
    }
})();
