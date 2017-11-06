// ==UserScript==
// @name         OkrCalculator
// @namespace    https://github.com/ggkk0818/TampermonkeyScript
// @version      1.1
// @updateURL    https://github.com/ggkk0818/TampermonkeyScript/raw/master/OkrCalculator.user.js
// @description  OkrCalculator
// @author       You
// @match        http://192.168.200.181:8080/okr/*
// @grant        none
// @require      http://ajax.aspnetcdn.com/ajax/jQuery/jquery-3.2.1.min.js
// ==/UserScript==

(function() {
    'use strict';
    var params,
        $btn,
        $score,
        krList,
        krCount,
        krScore,
        CLASS_DISABLED = "btn--disabled";
    var attachElement = function(){
        if(window.location.href.indexOf("http://192.168.200.181:8080/okr/?") === -1 || $(".btn--calc").length)
            return;
        var btnHtml = '<button type="button" class="btn btn--dark btn--outline btn--raised primary--text btn--calc" style="margin: 0px 0px 0px 10px;"><span class="btn__content">计算个人得分</span></button>',
            scoreHtml = '<span class="item-score-preview" style="line-height: 36px;">0</span>';
        $btn = $(btnHtml);
        $score = $(scoreHtml).hide();
        $(".okr .okr-content .okr-all .layout > .flex-item").before($btn).before($score);
        $btn.click(calcScore);
    };
    var calcScore = function(){
        var paramStr = window.location.search.substring(1),
            paramArr = paramStr.split("&");
        params = {};
        for(var i = 0; i < paramArr.length; i++){
            var arr = paramArr[i].split("=");
            params[arr[0]] = decodeURI(arr[1]);
        }
        params.size = 200;
        $btn.addClass(CLASS_DISABLED);
        $.ajax({
            url: "/eversec/achievement/show",
            data: params,
            success: function(data){
                if(data && data.data){
                    krList = data.data.achievement;
                    krCount = krList.length;
                    krScore = 0;
                    $score.text(krScore).show();
                    queryScore();
                }
                else{
                    $btn.removeClass(CLASS_DISABLED);
                }
            },
            error: function(){
                $btn.removeClass(CLASS_DISABLED);
            }
        });
    };
    var queryScore = function(){
        if(!krList || krList.length === 0){
            $btn.removeClass(CLASS_DISABLED).children().text("计算个人得分");
            return;
        }
        $btn.children().text(Math.ceil((krCount - krList.length) / krCount * 100) + "%");
        var kr = krList.shift();
        $.ajax({
            url: "/eversec/achievement/showBasic",
            data: {id: kr.id},
            success: function(data){
                if(data && data.data){
                    var finalScore = data.data.finalScore || 0,
                        participants = data.data.participants || [];
                    for(var i = 0; i < participants.length; i++){
                        var p = participants[i];
                        if(p.name.indexOf(params.search) === 0){
                            krScore += finalScore / 100 * p.percent;
                            $score.text(krScore.toFixed(2));
                            break;
                        }
                    }
                }
            },
            complete: function(){
                queryScore();
            }
        });
    };
    setTimeout(function(){
      attachElement();
      window.addEventListener("popstate", function() {
          attachElement();
      });
    }, 1000);
})();
