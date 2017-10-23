//***************************************************************************
// Class:       CalcView
// Description: Handles calculator UI.  Sets up button click event handler
//              for all buttons, and provides methods for updating UI.  If a
//              button on the calculator is pressed, that button's label 
//              is passed as a parameter to the m_fnBtnClickCallback method.
// Author:      Brian Denton
// Date:        8/15/2017
//***************************************************************************
var CalcView = function (fnBtnClickCallback) {
    //Private Vars
    var m_fnBtnClickCallback = fnBtnClickCallback;

    //Setup jquery 
    $(function () {
        $(".largeButtonLink").click(function (event) {
            var sBtnLabel = $(event.target).html();
            event.preventDefault();
            m_fnBtnClickCallback(sBtnLabel);
        });
    });

    //Public Methods
    this.setNumericEntry = function (sEntryVal) {
        $("#numericEntry").html(sEntryVal);
    };

    this.setMemoryDisplay = function (fMemoryVal) {
        $("#memoryContents").html("M:" + fMemoryVal);
    };

    this.setCurrentOpDisplay = function (sCurrentOp) {
        $("#currentOp").html(sCurrentOp);
    }
};
