//***************************************************************************
// Class:       CalcModel
// Description: Handles numeric entry and editing, all calculations, and 
//              memory functions via the performOperation() method.  These 
//              operations all modifiy three basic values:
//
//              - Main numberic value displayed/being entered (can also show
//                'Error').
//              - Value currently in memory.
//              - Current operation, which includes the last number entered 
//                and the last mathmatical operation entered that takes two
//                values (+, -, *, or /).
//
//              Methods are provided to get the values of these three items.
// Author:      Brian Denton
// Date:        8/15/2017
//***************************************************************************
var CalcModel = function () {
    //Private vars
    const UC_PI = "\u03C0";
    const UC_MULTIPLY = "\u00D7";
    const UC_DIVISION = "\u00F7";
    const UC_BACK = "\u2190";
    const UC_SQRT = "\u221A";
    const UC_PLUS_MINUS = "\u00B1";

    var m_sNumericEntry = "0";
    var m_sCurrentOp = "";
    var m_fMemoryValue = 0.0;
    var m_bUserEnteringNumber = false;
    var m_fFirstVal = 0;
    var m_sOp = "";

    //Public Methods
    this.performOperation = function (sOp) {
        if (m_sNumericEntry == "Error") {
            m_sNumericEntry = "0";
            m_bUserEnteringNumber = false;
        }

        if (sOp.length == 1 && sOp >= "1" && sOp <= "9") {
            if (m_bUserEnteringNumber) {
                m_sNumericEntry += sOp;
            } else {
                m_sNumericEntry = sOp;
                m_bUserEnteringNumber = true;
            }
        } else {
            switch (sOp) {
                case "0":
                    if (m_sNumericEntry != '0') {
                        m_sNumericEntry += '0';
                    }
                    break;
                case ".":
                    if (m_sNumericEntry.indexOf(".") == -1) {
                        m_sNumericEntry += ".";
                        m_bUserEnteringNumber = true;
                    }
                    break;
                case UC_PLUS_MINUS:
                    var fVal = parseFloat(m_sNumericEntry);
                    if (fVal != 0.0) {
                        m_sNumericEntry = (fVal < 0.0) ? m_sNumericEntry.substr(1) : '-' + m_sNumericEntry;
                    }
                    break;
                case 'C':
                    m_sNumericEntry = "0";
                    m_sCurrentOp = "";
                    m_bUserEnteringNumber = false;
                    break;
                case 'CE':
                    m_sNumericEntry = "0";
                    m_bUserEnteringNumber = false;
                    break;
                case UC_BACK:
                    if (m_bUserEnteringNumber) {
                        m_sNumericEntry = m_sNumericEntry.substr(0, m_sNumericEntry.length - 1);
                        if (m_sNumericEntry == "" || m_sNumericEntry == "-") {
                            m_sNumericEntry = "0";
                            m_bUserEnteringNumber = false;
                        }
                    }
                    break;
                case "MC":
                    m_fMemoryValue = 0.0;
                    break;
                case "MS":
                    m_fMemoryValue = parseFloat(m_sNumericEntry);
                    break;
                case "MR":
                    m_sNumericEntry = "" + m_fMemoryValue;
                    m_bUserEnteringNumber = false;
                    break;
                case "M+":
                    m_fMemoryValue += parseFloat(m_sNumericEntry);
                    break;
                case "M-":
                    m_fMemoryValue -= parseFloat(m_sNumericEntry);
                    break;
                case UC_SQRT:
                    var fVal = parseFloat(m_sNumericEntry);

                    if (fVal < 0.0) {
                        m_sNumericEntry = "Error";
                        m_bUserEnteringNumber = false;
                    } else {
                        m_sNumericEntry = "" + Math.sqrt(fVal);
                        m_bUserEnteringNumber = false;
                    }
                    break;
                case "1/x":
                    var fVal = parseFloat(m_sNumericEntry);

                    if (fVal == 0.0) {
                        m_sNumericEntry = "Error";
                        m_bUserEnteringNumber = false;
                    } else {
                        m_sNumericEntry = "" + (1.0 / fVal);
                        m_bUserEnteringNumber = false;
                    }
                    break;
                case "log":
                    var fVal = parseFloat(m_sNumericEntry);

                    if (fVal < 0.0) {
                        m_sNumericEntry = "Error";
                        m_bUserEnteringNumber = false;
                    } else {
                        m_sNumericEntry = "" + Math.log10(fVal);
                        m_bUserEnteringNumber = false;
                    }
                    break;
                case UC_PI:
                    m_sNumericEntry = "" + Math.PI;
                    m_bUserEnteringNumber = false;
                    break;
                case "+":
                case "-":
                case UC_MULTIPLY:
                case UC_DIVISION:
                    if (m_sCurrentOp != "") {
                        this.performOperation("=");
                    }

                    m_fFirstVal = parseFloat(m_sNumericEntry);
                    m_sOp = sOp;
                    m_sCurrentOp = "" + m_fFirstVal + " " + m_sOp;
                    m_sNumericEntry = "0";
                    m_bUserEnteringNumber = false;
                    break;
                case "=":
                    if (m_sCurrentOp != "") {
                        var fSecondVal = parseFloat(m_sNumericEntry);

                        switch (m_sOp) {
                            case "+":
                                m_sNumericEntry = "" + (m_fFirstVal + fSecondVal);
                                break;
                            case "-":
                                m_sNumericEntry = "" + (m_fFirstVal - fSecondVal);
                                break;
                            case UC_MULTIPLY:
                                m_sNumericEntry = "" + (m_fFirstVal * fSecondVal);
                                break;
                            case UC_DIVISION:
                                m_sNumericEntry = "" + ((fSecondVal == 0.0) ? "Error" : (m_fFirstVal / fSecondVal));
                                break;
                        }

                        m_sOp = m_sCurrentOp = "";
                        m_bUserEnteringNumber = false;
                    }
                    break;
                case "%":
                    if (m_sCurrentOp == "") {
                        m_sNumericEntry = "" + (parseFloat(m_sNumericEntry) / 100.0);
                    } else {
                        var fSecondVal = (parseFloat(m_sNumericEntry) / 100.0) * m_fFirstVal;

                        switch (m_sOp) {
                            case "+":
                                m_sNumericEntry = "" + (m_fFirstVal + fSecondVal);
                                break;
                            case "-":
                                m_sNumericEntry = "" + (m_fFirstVal - fSecondVal);
                                break;
                            case UC_MULTIPLY:
                                m_sNumericEntry = "" + (m_fFirstVal * fSecondVal);
                                break;
                            case UC_DIVISION:
                                m_sNumericEntry = "" + ((fSecondVal == 0.0) ? "Error" : (m_fFirstVal / fSecondVal));
                                break;
                        }
                    }

                    m_sOp = m_sCurrentOp = "";
                    m_bUserEnteringNumber = false;
                    break;
            }
        }
    }

    this.getNumericEntry = function () {
        return m_sNumericEntry;
    }

    this.getCurrentOp = function () {
        return m_sCurrentOp;
    }

    this.getMemoryValue = function () {
        return m_fMemoryValue;
    }
};

