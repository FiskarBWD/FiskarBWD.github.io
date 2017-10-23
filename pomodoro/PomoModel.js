//***************************************************************************
// Class:       PomoModel
// Description: Handles javascript timer, break and session durations, timer
//              mode (session or break), percent of break/session done, and 
//              pause status of timer.  Contains javascript timer.  The timer
//              duration is 1 second, and the timer function calls the
//              fnTimerUpdate callback provided while timer is active.
// Author:      Brian Denton
// Date:        8/17/2017
//***************************************************************************
var PomoModel = function (fnTimerUpdate) {
    //Private vars
    const TM_SESSION = 0;
    const TM_BREAK = 1;

    var m_nTimerMode = TM_SESSION;
    var m_nSeconds = 0;
    var m_nSessionLen = 1500;
    var m_nBreakLen = 300;
    var m_fPercentDone = 0.0;
    var m_oTimer = null;
    var m_bTimerPaused = true;
    var m_fnTimerUpdate = fnTimerUpdate;

    //Private methods
    function timerFunc() {
        m_nSeconds++;

        if (m_nTimerMode == TM_SESSION) {
            m_fPercentDone = m_nSeconds / m_nSessionLen;

            if (m_nSeconds > m_nSessionLen) {
                m_nSeconds = 0;
                m_nTimerMode = TM_BREAK;
                m_fPercentDone = 0.0;
            }
        } else if (m_nTimerMode == TM_BREAK) {
            m_fPercentDone = m_nSeconds / m_nBreakLen;

            if (m_nSeconds > m_nBreakLen) {
                m_nSeconds = 0;
                m_nTimerMode = TM_SESSION;
                m_fPercentDone = 0.0;
            }
        }

        m_fPercentDone = (m_fPercentDone > 1.0) ? 1.0 : m_fPercentDone;
        m_fnTimerUpdate();
    }

    //Public Methods
    this.toggleTimerOnOff = function () {
        if (m_bTimerPaused) {
            m_oTimer = setInterval(timerFunc, 1000);
        } else {
            clearInterval(m_oTimer);
        }

        m_bTimerPaused = !m_bTimerPaused;
    };

    this.getSeconds = function () {
        return m_nSeconds;
    };

    this.getPercentDone = function () {
        return m_fPercentDone;
    };

    this.inSessionMode = function () {
        return (m_nTimerMode == TM_SESSION);
    };

    this.getSessionLenMins = function () {
        return Math.floor(m_nSessionLen / 60);
    };

    this.setSessionLenMins = function (nSessionLen) {
        if (!m_bTimerPaused)
            return;

        m_nSessionLen = Math.max(1, nSessionLen) * 60;

        if (m_nTimerMode == TM_SESSION) {
            m_nSeconds = Math.min(m_nSessionLen, m_nSeconds);
            m_fPercentDone = m_nSeconds / m_nSessionLen;
        }
    };

    this.getBreakLenMins = function () {
        return Math.floor(m_nBreakLen / 60);
    };

    this.setBreakLenMins = function (nBreakLen) {
        if (!m_bTimerPaused)
            return;

        m_nBreakLen = Math.max(1, nBreakLen) * 60;

        if (m_nTimerMode == TM_BREAK) {
            m_nSeconds = Math.min(m_nBreakLen, m_nSeconds);
            m_fPercentDone = m_nSeconds / m_nBreakLen;
        }
    };

    this.isPaused = function () {
        return m_bTimerPaused;
    };
};

