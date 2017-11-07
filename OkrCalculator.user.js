// ==UserScript==
// @name         OkrCalculator
// @namespace    https://github.com/ggkk0818/TampermonkeyScript
// @version      1.2
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
        $btnStatistic,
        $btnCloseStatistic,
        $statisticCtn,
        allKrList,
        orgList,
        personIndex,
        scrollTop,
        $score,
        krList,
        krCount,
        krScore,
        CLASS_DISABLED = "btn--disabled";
    var attachElement = function(){
        if(window.location.href.indexOf("http://192.168.200.181:8080/okr/?") === -1 || $(".btn--calc").length)
            return;
        var btnHtml = '<button type="button" class="btn btn--dark btn--outline btn--raised primary--text btn--calc" style="margin: 0px 0px 0px 10px;"><span class="btn__content">计算个人得分</span></button>',
            scoreHtml = '<span class="item-score-preview" style="line-height: 36px;">0</span>',
            btnStatisticHtml = '<button type="button" class="btn btn--dark btn--outline btn--raised primary--text btn--statistic" style="margin: 0px 0px 0px 10px;"><span class="btn__content">显示排行榜</span></button>';
        $btn = $(btnHtml);
        $btnStatistic = $(btnStatisticHtml);
        $score = $(scoreHtml).hide();
        $(".okr .okr-content .okr-all .layout > .flex-item").before($btnStatistic).before($btn).before($score);
        $btn.click(calcScore);
        $btnStatistic.click(showStatistic);
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
    var showStatistic = function(){
        allKrList = orgList = null;
        $statisticCtn = $('<div class="statistic-ctn" style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background-color: #fff; overflow: auto; z-index: 10;"></div>');
        $btnCloseStatistic = $('<button type="button" class="btn btn--dark btn--icon btn--raised statistic-ctn-btn" style="position: fixed; top: 0; right: 6px; z-index: 11;"><span class="btn__content"><i class="material-icons icon icon--dark">close</i></span></button>');
        $statisticCtn.append('<table class="table" style="position: relative;"><thead><tr><th style="text-align: left;">名称</th><th style="text-align: left;">部门</th><th style="text-align: left;">地区</th><th style="text-align: left;">得分</th></tr></thead><tbody></tbody></table>');
        $("body").append($statisticCtn).append($btnCloseStatistic);
        $btnCloseStatistic.click(hideStatistic);
        $.ajax({
            url: "/eversec/achievement/show",
            data: { size: 9999, page: 1 },
            success: function(data){
                if(data && data.data){
                    allKrList = data.data.achievement;
                }
                else{
                    allKrList = [];
                }
            },
            error: function(){
                allKrList = [];
            },
            complete: function(){
                if(allKrList && orgList){
                    calcStatistic();
                }
            }
        });
        $.ajax({
            url: "/dingtalk/org/getOrgTree",
            success: function(data){
                orgList = data || [];
                for(var i = orgList.length - 1; i >= 0; i--){
                    var person = orgList[i];
                    if(person.name.indexOf("-") > -1){
                        var arr = person.name.split("-");
                        person.displayName = arr[0];
                        person.depart = arr[1];
                        person.province = arr[2];
                        person.score = 0;
                    }
                    else{
                        orgList.splice(0, i + 1);
                        break;
                    }
                }
                for(var i = 0; i < orgList.length; i++){
                    var person = orgList[i];
                    $statisticCtn.find("table tbody").append(`<tr data-id="${person.id}"><td>${person.displayName}</td><td>${person.depart}</td><td>${person.province}</td><td>-</td></tr>`);
                }
            },
            error: function(){
                orgList = [];
            },
            complete: function(){
                if(allKrList && orgList){
                    calcStatistic();
                }
            }
        });
    };
    var hideStatistic = function(){
        $statisticCtn.remove();
        $btnCloseStatistic.remove();
    };
    var calcStatistic = function(){
        if(personIndex === undefined){
            personIndex = scrollTop = 0;
        }
        if(personIndex >= orgList.length){
            personIndex = scrollTop = undefined;
            return;
        }
        var person = orgList[personIndex];
        for(var i = 0; i < allKrList.length; i++){
            var kr = allKrList[i];
            if(kr.finalScore === 0)
                continue;
            for(var j = 0; j < kr.participants.length; j++){
                var p = kr.participants[j];
                if(p.userid == person.id){
                    person.score += kr.finalScore / 100 * p.percent;
                    break;
                }
            }
        }
        var $tr = $statisticCtn.find(`table tbody tr[data-id=${person.id}]`);
        $tr.children("td").last().text(person.score.toFixed(2));
        scrollTo($tr.position().top);
        personIndex++;
        requestAnimationFrame(calcStatistic);
    };
    var scrollTimer = null;
    var scrollTo = function(val){
        if(val > scrollTop){
            scrollTop = val;
            if(!scrollTimer){
                scrollTimer = setTimeout(function(){
                    $statisticCtn.scrollTop(scrollTop);
                    scrollTimer = null;
                }, 100);
            }
        }
    };
    setTimeout(function(){
      attachElement();
      window.addEventListener("popstate", function() {
          attachElement();
      });
    }, 1000);
})();
