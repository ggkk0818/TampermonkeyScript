// ==UserScript==
// @name         cnbetaADMaskDetect
// @namespace    https://github.com/ggkk0818/TampermonkeyScript
// @version      0.4
// @updateURL    https://github.com/ggkk0818/TampermonkeyScript/raw/master/cnbetaADMaskDetect.user.js
// @description  remove cnbeta dialog
// @author       You
// @match        http://*.cnbeta.com/articles/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    (function clearMask(){
        var timer = null,
            lastRemoveTime = null;
        var tick = function(){
            var $div = $('div[style]').filter(function(){ return $(this).attr('style').indexOf('display:block !important') > -1; });
            if($div.length){
                $div.remove();
                lastRemoveTime = new Date().getTime();
            }
            if(new Date().getTime() - lastRemoveTime < 5000){
                timer = setTimeout(tick, 20);
            }
            //$('.body').parent().removeAttr('style');
        };
        timer = setTimeout(tick, 20);
    })();
})();
