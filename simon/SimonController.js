//***************************************************************************
// Class:       SimonController
// Description: Instantiates SimonView and SimonModel.  When a button is 
//              pressed in the view, the controller is notified via callbacks
//              (handleBtnClick and handleSequenceBtnPress) which it uses to
//              update the current state of the model and the view.  A timer
//              which calls the timerFunc function is used to control game
//              and view transitions that happen over time.
// Author:      Brian Denton
// Date:        10/20/2017
//***************************************************************************
var SimonController = function () {
    function timerFunc() {
        switch (m_oModel.getGameState()) {
            case GS_OFF:
            case GS_TURNED_ON:
                break;

            case GS_STARTING:
                m_oModel.newSequence();
                m_iSequence = 0;
                m_oModel.setGameState(GS_PLAYING_SEQUENCE);
                m_oView.setViewState(GS_PLAYING_SEQUENCE);
                clearInterval(m_oStateTimer);
                m_oStateTimer = setInterval(timerFunc, 1000);
                break;

            case GS_PLAYING_SEQUENCE:
                var nBtn = m_oModel.getSequenceValue(m_iSequence);
                m_oView.liteButton(nBtn, 750);
                m_oView.playSound(nBtn);
                m_oView.setSequenceCount(m_oModel.getSequenceCount());
                m_iSequence++;

                if (m_iSequence >= m_oModel.getSequenceCount()) {
                    m_iSequence = 0;
                    m_oModel.setGameState(GS_ENTERING_SEQUENCE);
                    m_oView.setViewState(GS_ENTERING_SEQUENCE);
                    clearInterval(m_oStateTimer);
                    m_oStateTimer = setInterval(timerFunc, 8000);
                }
                break;

            case GS_ENTERING_SEQUENCE:
                m_oView.playSound(BT_MISS);
                m_oModel.setGameState(GS_ENTRY_FAIL);
                m_oView.setViewState(GS_ENTRY_FAIL);
                clearInterval(m_oStateTimer);
                m_oStateTimer = setInterval(timerFunc, 2000);
                break;

            case GS_ENTRY_FAIL:
                if (m_oModel.getStrict() == true) {
                    m_oModel.newSequence();
                }

                m_iSequence = 0;
                m_oModel.setGameState(GS_PLAYING_SEQUENCE);
                m_oView.setViewState(GS_PLAYING_SEQUENCE);
                clearInterval(m_oStateTimer);
                m_oStateTimer = setInterval(timerFunc, 1000);
                break;

            case GS_WIN:
                m_oModel.setGameState(GS_TURNED_ON);
                m_oView.setViewState(GS_TURNED_ON);
                clearInterval(m_oStateTimer);
                break;
        }
    }

    this.handleBtnClick = function (sClickID) {
        switch (sClickID) {
            case "OnOffSwitch":
                m_oModel.toggleOnOffStatus();

                if (m_oModel.isOn() == false) {
                    if (m_oStateTimer != null) clearInterval(m_oStateTimer);
                    m_oStateTimer = null;
                    m_oModel.setGameState(GS_OFF);
                    m_oView.setViewState(GS_OFF);

                    if (m_oModel.getStrict()) {
                        m_oModel.toggleStrict();
                        m_oView.setStrict(false);
                    }
                } else {
                    m_oModel.setGameState(GS_TURNED_ON);
                    m_oView.setViewState(GS_TURNED_ON);
                }
                break;

            case "BtnStart":
                if (m_oStateTimer != null) clearInterval(m_oStateTimer);
                m_oModel.setGameState(GS_STARTING);
                m_oView.setViewState(GS_STARTING);
                m_oStateTimer = setInterval(timerFunc, 3000);
                break;

            case "BtnStrict":
                if (m_oModel.getGameState() == GS_TURNED_ON) {
                    m_oModel.toggleStrict();
                    m_oView.setStrict(m_oModel.getStrict());
                }
                break;
        }
    };

    this.handleSequenceBtnPress = function (nBtn) {
        if (m_oStateTimer != null) clearTimeout(m_oStateTimer);

        if (m_oModel.checkSequenceValue(m_iSequence, nBtn)) {
            m_oView.playSound(nBtn);
            m_iSequence++;

            if (m_iSequence >= m_oModel.getSequenceCount()) {
                if (m_iSequence >= m_oModel.getSequenceMaxLen()) {
                    m_oModel.setGameState(GS_WIN);
                    m_oView.setViewState(GS_WIN);
                    m_oStateTimer = setInterval(timerFunc, 3000);
                } else {
                    m_oModel.addToSequence();
                    m_iSequence = 0;
                    m_oModel.setGameState(GS_PLAYING_SEQUENCE);
                    m_oView.setViewState(GS_PLAYING_SEQUENCE);
                    m_oStateTimer = setInterval(timerFunc, 1000);
                }
            } else {
                m_oStateTimer = setInterval(timerFunc, 8000);
            }
        } else {
            m_oView.playSound(BT_MISS);
            m_oModel.setGameState(GS_ENTRY_FAIL);
            m_oView.setViewState(GS_ENTRY_FAIL);
            m_oStateTimer = setInterval(timerFunc, 2000);
        }
    };

    //Public Functions

    this.init = function () {
        m_oView.init();
        m_oModel.setGameState(GS_OFF);
        m_oView.setViewState(GS_OFF);
    };

    //Private Vars
    var m_oStateTimer = null;
    var m_iSequence = 0;
    var m_oView = new SimonView(this.handleBtnClick, this.handleSequenceBtnPress);
    var m_oModel = new SimonModel();
};

