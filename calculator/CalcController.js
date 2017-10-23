//***************************************************************************
// Class:       CalcController
// Description: Instantiates CalcView and CalcModel.  When button is pressed,
//              sends label of this button to model, then updates view with
//              new values generated in model.
// Author:      Brian Denton
// Date:        8/15/2017
//***************************************************************************
var CalcController = function () {
    //Public Methods
    this.handleButtonClick = function (sBtnLabel) {
        m_oModel.performOperation(sBtnLabel);
        m_oView.setNumericEntry(m_oModel.getNumericEntry());
        m_oView.setMemoryDisplay(m_oModel.getMemoryValue());
        m_oView.setCurrentOpDisplay(m_oModel.getCurrentOp());
    };

    //Private Vars
    var m_oView = new CalcView(this.handleButtonClick);
    var m_oModel = new CalcModel();
};

