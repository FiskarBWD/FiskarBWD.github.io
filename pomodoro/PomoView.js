//***************************************************************************
// Class:       PomoView
// Description: Handles Pomodoro Timer UI.  Sets up jquery event handlers for   
//              click events, and provides methods for updating UI.  When a 
//              item is clicked, the click handler extracts the 'clickID' 
//              attribute from the event target (all clickable HTML elements
//              must have this attribute assigned), and passes it as a param
//              to the m_fnBtnClickCallback function provided when the 
//              instance was created.
// Author:      Brian Denton
// Date:        8/17/2017
//***************************************************************************
var PomoView = function (fnBtnClickCallback) {
    //Private Vars
    var m_fnBtnClickCallback = fnBtnClickCallback;

    //Private methods
    function padLeft(sTarget, nMinLen, sPadChar) {
        var sStr = sTarget || "";

        while (sStr.length < nMinLen) {
            sStr = sPadChar + sStr;
        }

        return sStr;
    }

    //Public Methods
    this.init = function () {
        $(".controlGroupLeftBtn, .controlGroupRightBtn, #timerDiskClickTarget").click(function (event) {
            var sClickID = $(event.target).attr("clickID");
            event.preventDefault();
            m_fnBtnClickCallback(sClickID);
        });
    };

    this.setBreakLenDisplay = function (nBreakMins) {
        $("#breakLenLbl").html("" + nBreakMins);
    };

    this.setSessionLenDisplay = function (nSessionMins) {
        $("#sessionLenLbl").html("" + nSessionMins);
    };

    this.setTimerText = function (sText) {
        $("#timerDiskTextMedium").html(sText);
    };

    this.setTimerCount = function (nSeconds) {
        var nHours = Math.floor(nSeconds / 3600);
        var nMins = Math.floor(nSeconds / 60) % 60;
        var nSecs = nSeconds % 60;
        var sCount = nMins.toString(10) + ":" + padLeft(nSecs.toString(10), 2, '0');

        $("#timerDiskTextLarge").html((nHours > 0) ? nHours.toString(10) + ":" + padLeft(sCount, 5, '0') : sCount);
    };

    this.setTimerPercentFill = function (fPercent) {
        var nDivHeight = $("#timerDiskInner").height();
        var nTop = nDivHeight - Math.floor(nDivHeight * fPercent);

        $("#timerDiskFiller").css({ "top": nTop + "px" });
    };

    this.setPauseIndicatorVisibility = function (bVisible) {
        (bVisible) ? $("#timerDiskTextSmall").show() : $("#timerDiskTextSmall").hide();
    };
};

