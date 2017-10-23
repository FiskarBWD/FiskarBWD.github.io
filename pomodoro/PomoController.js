//***************************************************************************
// Class:       PomoController
// Description: Instantiates PomoView and PomoModel.  Clicks in view are 
//              handled via handleBtnClick, which is called by the view and
//              is passed a string ID identifying the control clicked.
//              Timer updates occur every second (when timer is active) via
//              handleTimerUpdate, which is called by the model object, which
//              also contains the javascript timer.
// Author:      Brian Denton
// Date:        8/17/2017
//***************************************************************************
var PomoController = function () {
    //Public Methods
    this.handleBtnClick = function (sClickID) {
        switch (sClickID) {
            case "breakLen-":
                m_oModel.setBreakLenMins(m_oModel.getBreakLenMins() - 1);
                m_oView.setBreakLenDisplay(m_oModel.getBreakLenMins());
                m_oView.setTimerCount(m_oModel.getSeconds());
                m_oView.setTimerPercentFill(m_oModel.getPercentDone());
                break;

            case "breakLen+":
                m_oModel.setBreakLenMins(m_oModel.getBreakLenMins() + 1);
                m_oView.setBreakLenDisplay(m_oModel.getBreakLenMins());
                m_oView.setTimerPercentFill(m_oModel.getPercentDone());
                break;

            case "sessionLen-":
                m_oModel.setSessionLenMins(m_oModel.getSessionLenMins() - 1);
                m_oView.setSessionLenDisplay(m_oModel.getSessionLenMins());
                m_oView.setTimerCount(m_oModel.getSeconds());
                m_oView.setTimerPercentFill(m_oModel.getPercentDone());
                break;

            case "sessionLen+":
                m_oModel.setSessionLenMins(m_oModel.getSessionLenMins() + 1);
                m_oView.setSessionLenDisplay(m_oModel.getSessionLenMins());
                m_oView.setTimerPercentFill(m_oModel.getPercentDone());
                break;

            case "timerDisk":
                m_oModel.toggleTimerOnOff();
                m_oView.setPauseIndicatorVisibility(m_oModel.isPaused());
                break;
        }
    };

    this.handleTimerUpdate = function () {
        m_oView.setTimerText(m_oModel.inSessionMode() ? "Session" : "Break");
        m_oView.setTimerCount(m_oModel.getSeconds());
        m_oView.setTimerPercentFill(m_oModel.getPercentDone());
    };

    this.init = function () {
        m_oView.init();
    }

    //Private Vars
    var m_oView = new PomoView(this.handleBtnClick);
    var m_oModel = new PomoModel(this.handleTimerUpdate);
};

