//***************************************************************************
// Class:       SimonModel
// Description: Model for Simon game.  Generates and holds info for the 
//              color/tone sequences and current game state/settings.
// Author:      Brian Denton
// Date:        10/20/2017
//***************************************************************************
var SimonModel = function () {
    //Private vars
    var m_nGameState = GS_OFF;
    var m_bOn = false;
    var m_bStrict = false;
    var m_nSeqCount = 0;
    var m_nSeqMaxLen = 20;      //Reduce for testing
    var m_oSequence = new Array(m_nSeqMaxLen);

    //Public Functions
    this.setGameState = function (nState) {
        m_nGameState = nState;
    };

    this.getGameState = function () {
        return m_nGameState;
    };

    this.toggleOnOffStatus = function () {
        m_bOn = !m_bOn;
    };

    this.isOn = function () {
        return m_bOn;
    };

    this.toggleStrict = function () {
        m_bStrict = !m_bStrict;
    };

    this.getStrict = function () {
        return m_bStrict;
    };

    this.newSequence = function () {
        m_nSeqCount = 1;
        m_oSequence[0] = (Math.floor(Math.random() * 100)) % 4;
    };

    this.addToSequence = function () {
        m_oSequence[m_nSeqCount] = (Math.floor(Math.random() * 100)) % 4;
        m_nSeqCount++;
    };

    this.getSequenceCount = function () {
        return m_nSeqCount;
    };

    this.getSequenceMaxLen = function () {
        return m_nSeqMaxLen;
    };

    this.getSequenceValue = function (iSeq) {
        return m_oSequence[iSeq];
    };

    this.checkSequenceValue = function (iSeq, nValue) {
        return (m_oSequence[iSeq] == nValue);
    };
};

