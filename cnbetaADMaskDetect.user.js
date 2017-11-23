// ==UserScript==
// @name cnbetaADMaskDetect
// @namespace http://tampermonkey.net/
// @version 0.1
// @description remove cnbeta dialog
// @author You
// @match http://*.cnbeta.com/articles/*
// @grant none
// ==/UserScript==

(function() {
    'use strict';

    (function clearMask(){
        var timer = null;
        var tick = function(){
            var $div = $('div[style]').filter(function(){ return $(this).attr('style').indexOf('display:block !important') > -1; });
            if($div.length){
                $div.remove();
            }
            else{
                timer = setTimeout(tick, 20);
            }
            //$('.body').parent().removeAttr('style');
        };
        timer = setTimeout(tick, 20);
    })();
})();
