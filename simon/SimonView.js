//***************************************************************************
// Class:       SimonView
// Description: Handles rendering of game in canvas, button presses, and
//              clicks in game area.  Sets up jquery event handlers for   
//              click events, and provides methods for updating UI. 
//
//              The on/off button, start button, and stict button are all
//              html anchor tags positioned absolutely over the canvas.  The
//              on/off button is drawn in the canvas, but has a transparent
//              anchor tag positioned over it for detecting clicks.  When 
//              one of these buttons is clicked, the click handler extracts  
//              the 'clickID' attribute from the event target (all clickable 
//              HTML elements have this attribute assigned), and passes it as 
//              a param to the fnBtnClickCallback function provided when the 
//              instance was created.
//
//              When the user clicks on the canvas during game play, the 
//              click is converted into an integer for the sequence button 
//              clicked (see BT_ constants) if any.  If click was over a
//              sequence button, then its associated BT_ constant is sent
//              as a parameter to the fnSequenceBtnPressCallback function.
// Author:      Brian Denton
// Date:        10/20/2017
//***************************************************************************
var SimonView = function (fnBtnClickCallback, fnSequenceBtnPressCallback) {
    // Private constants
    const A = 10000;    //arc
    const AT = 10001;   //arcTo
    const BCT = 10002;  //bezierCurveTo
    const BP = 10003;   //beginPath
    const CP = 10004;   //closePath
    const F = 10005;    //fill
    const FS = 10006;   //fillStyle
    const LC = 10007;   //lineCap
    const LT = 10008;   //lineTo
    const LW = 10009;   //lineWidth
    const MT = 10010;   //moveTo
    const S = 10011;    //stroke
    const SS = 10012;   //strokeStyle

    // Button States
    const BS_NOT_LIT = 0;
    const BS_LIT = 1;

    // Data for drawing different parts of game using canvas
    var m_oBaseData = [
        SS, 0, FS, 0, LW, 1, LC, "round",   //Black Base
        BP, A, 185, 185, 185, 0, 360, 0,
        F, S,
        SS, 1, FS, 1,                       //White center
        BP, A, 185, 185, 82, 0, 360, 0,
        F, S
    ];

    var m_oRedBtnData = [
        SS, 1, FS, 0, LW, 4, LC, "round",
        BP, MT, 195, 20,
        BCT, 276, 20, 350, 94, 350, 175,
        LT, 280, 175,
        BCT, 277, 132.5, 237.5, 93, 195, 90,
        CP, S, F
    ];

    var m_oYellowBtnData = [
        SS, 1, FS, 0, LW, 4, LC, "round",
        BP, MT, 175, 350,
        BCT, 94, 350, 20, 269, 20, 195,
        LT, 90, 195,
        BCT, 93, 237.5, 132.5, 277, 175, 280,
        CP, S, F
    ];

    var m_oGreenBtnData = [
        SS, 1, FS, 0, LW, 4, LC, "round",
        BP, MT, 175, 20,
        BCT, 94, 20, 20, 94, 20, 175,
        LT, 90, 175,
        BCT, 93, 132.5, 132.5, 93, 175, 90,
        CP, S, F
    ];

    var m_oBlueBtnData = [
        SS, 1, FS, 0, LW, 4, LC, "round",
        BP, MT, 195, 350,
        BCT, 276, 350, 350, 269, 350, 195,
        LT, 280, 195,
        BCT, 277, 237.5, 237.5, 277, 195, 280,
        CP, S, F
    ];

    var m_oLedDisplayBack = [
        SS, 0, FS, 0, LW, 1,
        BP, MT, 135, 185,
        LT, 160, 185,
        BCT, 170, 185, 170, 185, 170, 195,
        LT, 170, 205,
        BCT, 170, 215, 170, 215, 160, 215,
        LT, 135, 215,
        BCT, 125, 215, 125, 215, 125, 205,
        LT, 125, 195,
        BCT, 125, 185, 125, 185, 135, 185,
        S, F
    ];

    // Private Vars
    var m_fnBtnClickCallback = fnBtnClickCallback;
    var m_fnSequenceBtnPressCallback = fnSequenceBtnPressCallback;
    var m_bButtonsClickable = false;
    var m_bOn = false;
    var m_bStrict = false;
    var m_nSequenceBtnDown = -1;
    var m_nViewState;
    var m_oBaseColors = ["black", "White"];
    var m_oBtnColors = [[["#9c121c", "#76060d"], ["#e50a19", "#76060d"]],
                        [["#cba60c", "#9b7d05"], ["#f4c50b", "#9b7d05"]],
                        [["#05a54b", "#07803d"], ["#03e166", "#07803d"]],
                        [["#1d8cff", "#0e6bcb"], ["#4caaff", "#0e6bcb"]]];
    var m_oBtnStates = [BS_NOT_LIT, BS_NOT_LIT, BS_NOT_LIT, BS_NOT_LIT];
    var m_oSounds = new Array(4);
    var m_oUnliteTimer = null;

    var m_sMsgLCD = "18";
    var m_sBlinkMsg = "";
    var m_oLCDTimer = null;
    var m_oLCDTimerCount = 0;

    //Private Functions

    //***************************************************************************
    // Description: Draws in canvas using context functions including arc(),
    //              lineTo(), bezierCurveTo(), ect.  Uses array of data which
    //              contains integer idetifying what function to call followed
    //              by its parameters.
    // Params:      x, y  - Offset from canvas upper left corner in pixels, where
    //                      item drawn is centered.
    //              oCtx  - 2d context for canvas.
    //              oData - Array of data containing context commands to call and
    //                      their parameters (if any).  Any color parameters are
    //                      0 based indices into oColor array.
    //              oColor - Array of color values (strings like "#303030" or 
    //                      "black").
    // Returns:     None.
    //***************************************************************************
    function drawFromData(x, y, oCtx, oData, oColors) {
        var i = 0;

        while (i < oData.length) {
            switch (oData[i]) {
                case A:
                    oCtx.arc(x + oData[++i], y + oData[++i], oData[++i], oData[++i], oData[++i], (oData[++i] == 1) ? true : false);
                    break;
                case AT:
                    oCtx.arcTo(x + oData[++i], y + oData[++i], x + oData[++i], y + oData[++i], oData[++i]);
                    break;
                case BCT:
                    oCtx.bezierCurveTo(x + oData[++i], y + oData[++i], x + oData[++i], y + oData[++i], x + oData[++i], y + oData[++i]);
                    break;
                case BP:
                    oCtx.beginPath();
                    break;
                case CP:
                    oCtx.closePath();
                    break;
                case F:
                    oCtx.fill();
                    break;
                case FS:
                    oCtx.fillStyle = oColors[oData[++i]];
                    break;
                case LC:
                    oCtx.lineCap = oData[++i];
                    break;
                case LT:
                    oCtx.lineTo(x + oData[++i], y + oData[++i]);
                    break;
                case LW:
                    oCtx.lineWidth = oData[++i];
                    break;
                case MT:
                    oCtx.moveTo(x + oData[++i], y + oData[++i]);
                    break;
                case S:
                    oCtx.stroke();
                    break;
                case SS:
                    oCtx.strokeStyle = oColors[oData[++i]];
                    break;
            }
            i++;
        }
    }

    //***************************************************************************
    // Description: Draws the black base of the simon game, the white center, and
    //              all text labels.
    // Params:      oCtx - 2d context for canvas. 
    // Returns:     None.
    //***************************************************************************
    function drawBase(oCtx) {
        drawFromData(0, 0, oCtx, m_oBaseData, m_oBaseColors);

        oCtx.strokeStyle = "black";
        oCtx.fillStyle = "black";
        oCtx.font = "900 40px Impact";
        oCtx.fillText("Simon", 123, 165);
        oCtx.font = "bold 14px Arial";
        oCtx.fillText(String.fromCharCode(0xAE), 232, 143);

        oCtx.save();
        oCtx.scale(0.6, 1);
        oCtx.font = "bold 11px Arial";
        oCtx.fillText("COUNT", 225, 227);
        oCtx.fillText("START", 300, 227);
        oCtx.fillText("STRICT", 367, 227);
        oCtx.fillText("OFF", 256, 250);
        oCtx.fillText("ON", 342, 250);
        oCtx.restore();
    }

    //***************************************************************************
    // Description: Draws the on/off slider in the position indicated by m_bOn.
    // Params:      oCtx - 2d context for canvas. 
    // Returns:     None.
    //***************************************************************************
    function drawOnOffSlider(oCtx) {
        oCtx.lineWidth = 1;
        oCtx.strokeStyle = "black";
        oCtx.fillStyle = "black";
        oCtx.beginPath();
        oCtx.rect(171, 240, 30, 14);
        oCtx.stroke();
        oCtx.fill();

        oCtx.strokeStyle = "#1d8cff";
        oCtx.fillStyle = "#1d8cff";
        oCtx.beginPath();

        if (m_bOn) {
            oCtx.rect(187, 241, 12, 12);
        } else {
            oCtx.rect(173, 241, 12, 12);
        }

        oCtx.stroke();
        oCtx.fill();
    }

    //***************************************************************************
    // Description: Draws the two-digit LCD display, which shows the current 
    //              sequence count and other messages.
    // Params:      oCtx - 2d context for canvas. 
    // Returns:     None.
    //***************************************************************************
    function drawLCD(oCtx) {
        drawFromData(0, 0, oCtx, m_oLedDisplayBack, ["black"]);

        if (m_bOn) {
            oCtx.lineWidth = 1;
            oCtx.storkeStyle = "#680a19";
            oCtx.fillStyle = "#680a19";
            oCtx.font = "bold 16px Courier New";
            var oSize = oCtx.measureText(m_sMsgLCD);
            oCtx.fillText(m_sMsgLCD, 124 + ((45 - oSize.width) / 2), 205);
            oCtx.fillText(m_sMsgLCD, 126 + ((45 - oSize.width) / 2), 205);
            oCtx.fillText(m_sMsgLCD, 124 + ((45 - oSize.width) / 2), 207);
            oCtx.fillText(m_sMsgLCD, 126 + ((45 - oSize.width) / 2), 207);
            oCtx.storkeStyle = "#ce132e";
            oCtx.fillStyle = "#ce132e";
            oCtx.fillText(m_sMsgLCD, 125 + ((45 - oSize.width) / 2), 206);
        }
    }

    //***************************************************************************
    // Description: Draws the led which indicates if strict mode is on (lit) or
    //              not (unlit).
    // Params:      oCtx - 2d context for canvas. 
    // Returns:     None.
    //***************************************************************************
    function drawStictLED(oCtx) {
        oCtx.lineWidth = 1;
        oCtx.strokeStyle = "#680a19";
        oCtx.fillStyle = "#680a19";
        oCtx.beginPath();
        oCtx.arc(233, 180, 5, 0, 360);
        oCtx.fill();
        oCtx.stroke();

        oCtx.strokeStyle = (m_bStrict) ? "#ff0000" : "#b11f37";
        oCtx.fillStyle = (m_bStrict) ? "#ff8888" : "#b11f37";
        oCtx.beginPath();
        oCtx.arc(233, 180, 4, 0, 360);
        oCtx.fill();
        oCtx.stroke();
    }

    //***************************************************************************
    // Description: Blinks the LCD the indicated number of times with the indi-
    //              cated string.
    // Params:      sBlinkStr - Two char string to show in LCD
    //              nBlinkCount - Number of times to blink.
    // Returns:     None.
    //***************************************************************************
    function startLCDBlink(sBlinkStr, nBlinkCount) {
        if (m_oLCDTimer != null) {
            clearTimeout(m_oLCDTimer);
        }

        m_oLCDTimerCount = nBlinkCount * 2;
        m_sBlinkMsg = sBlinkStr;
        m_sMsgLCD = sBlinkStr;
        var oCtx = $("#mainCanvas")[0].getContext("2d");
        drawLCD(oCtx);

        m_oLCDTimer = setInterval(function () {
            m_oLCDTimerCount -= 1;

            if (m_oLCDTimerCount % 2) {
                m_sMsgLCD = "";
            } else {
                m_sMsgLCD = m_sBlinkMsg;

                if (m_oLCDTimerCount <= 0) {
                    clearTimeout(m_oLCDTimer);
                    m_oLCDTimer = null;
                }
            }

            var oCtx = $("#mainCanvas")[0].getContext("2d");
            drawLCD(oCtx);
        }, 500);
    }

    //***************************************************************************
    // Description: Draws the four color/tone sequence buttons in their current
    //              lit state.
    // Params:      oCtx - 2d context for canvas. 
    // Returns:     None.
    //***************************************************************************
    function drawSequenceButtons(oCtx) {
        drawFromData(0, 0, oCtx, m_oRedBtnData, m_oBtnColors[BT_RED][m_oBtnStates[BT_RED]]);
        drawFromData(0, 0, oCtx, m_oYellowBtnData, m_oBtnColors[BT_YELLOW][m_oBtnStates[BT_YELLOW]]);
        drawFromData(0, 0, oCtx, m_oGreenBtnData, m_oBtnColors[BT_GREEN][m_oBtnStates[BT_GREEN]]);
        drawFromData(0, 0, oCtx, m_oBlueBtnData, m_oBtnColors[BT_BLUE][m_oBtnStates[BT_BLUE]]);
    }

    //***************************************************************************
    // Description: Sets the lit flag for all sequence buttons to 'not lit' and
    //              redraws the sequence buttons in the canvas.
    // Params:      None. 
    // Returns:     None.
    //***************************************************************************
    function unliteAllSequenceButtons() {
        for (var i = 0; i < 4; i++)
            m_oBtnStates[i] = BS_NOT_LIT;
        var oCtx = $("#mainCanvas")[0].getContext("2d");
        drawSequenceButtons(oCtx);
    }

    //***************************************************************************
    // Description: Given coordinates on the canvas, determines which sequence 
    //              button is under these coodinates.
    // Params:      x, y - Offset from upper left corner of canvas. 
    // Returns:     BT_GREEN, BT_RED, BT_YELLOW, BT_BLUE if coordinate is 
    //              a sequence button, else BT_MISS.
    //***************************************************************************
    function coordinateToSequenceButton(x, y) {
        var fDist = Math.sqrt(((x - 185) * (x - 185)) + ((y - 185) * (y - 185)));

        if (fDist >= 95.0 && fDist <= 165.0) {
            if (y >= 20 && y < 175) {
                if (x >= 20 && x <= 175) {
                    return BT_GREEN;
                }
                else if (x >= 185 && x <= 350) {
                    return BT_RED;
                }
            } else if (y >= 195 && y <= 350) {
                if (x >= 20 && x <= 175) {
                    return BT_YELLOW;
                }
                else if (x >= 185 && x <= 350) {
                    return BT_BLUE;
                }
            }
        }

        return BT_MISS;
    }

    //***************************************************************************
    // Description: Draws view in canvas.  Contents match current view state.
    // Params:      None.
    // Returns:     None.
    //***************************************************************************
    function drawView() {
        var oCtx = $("#mainCanvas")[0].getContext("2d");

        switch (m_nViewState) {
            case GS_OFF:
                m_sMsgLCD = "";
                m_bOn = false;

                if (m_oUnliteTimer != null) {
                    clearTimeout(m_oUnliteTimer);
                    m_oUnliteTimer = null;
                    unliteAllSequenceButtons();
                }

                if (m_oLCDTimer != null) {
                    clearTimeout(m_oLCDTimer);
                }
                break;

            case GS_TURNED_ON:
                m_sMsgLCD = "--";
                m_bOn = true;
                break;

            case GS_STARTING:
                startLCDBlink("--", 2);
                break;

            case GS_ENTERING_SEQUENCE:
                break;

            case GS_ENTRY_FAIL:
                startLCDBlink("!!", 2);
                break;

            case GS_WIN:
                startLCDBlink("**", 2);
                break;
        }

        if (m_nViewState != GS_ENTERING_SEQUENCE) {
            $("#mainCanvas").css('cursor', 'default');
        }

        drawBase(oCtx);
        drawSequenceButtons(oCtx);
        drawOnOffSlider(oCtx);
        drawLCD(oCtx);
        drawStictLED(oCtx);
    }

    //Public Functions

    //***************************************************************************
    // Description: Sets up jquery click handlers for all buttons.  Also loads 
    //              sounds for sequence buttons.
    // Params:      None.
    // Returns:     None.
    //***************************************************************************
    this.init = function () {
        m_nViewState = GS_OFF;
        m_oUnliteTimer = null;
        m_oSounds[0] = new Audio('./sounds/simonSound1.mp3');
        m_oSounds[1] = new Audio('./sounds/simonSound2.mp3');
        m_oSounds[2] = new Audio('./sounds/simonSound3.mp3');
        m_oSounds[3] = new Audio('./sounds/simonSound4.mp3');

        $("#ancOnOffSwitch").click(function (event) {
            var sClickID = $(event.target).attr("clickID");
            event.preventDefault();
            m_fnBtnClickCallback(sClickID);
        });

        $("#btnStart, #btnStrict").on("mousedown", function (event) {
            event.preventDefault();
            $(this).css({ 'top': '188px', 'box-shadow': 'none' });
        }).on("mouseup", function (event) {
            event.preventDefault();
            $(this).css({ 'top': '187px', 'box-shadow': '0px 2px 5px black' });
            var sClickID = $(event.target).attr("clickID");
            m_fnBtnClickCallback(sClickID);
        }).on("mouseleave", function (event) {
            event.preventDefault();
            $(this).css({ 'top': '187px', 'box-shadow': '0px 2px 5px black' });
        }).on("mouseenter", function (event) {
            event.preventDefault();
            if (event.buttons > 0) {
                $(this).css({ 'top': '188px', 'box-shadow': 'none' });
            }
        });

        $("#mainCanvas").on("mousedown", function (event) {
            if (m_nViewState == GS_ENTERING_SEQUENCE) {
                var oRect = $(this)[0].getBoundingClientRect();
                var x = event.pageX - oRect.left;
                var y = event.pageY - oRect.top;
                var nBtn = coordinateToSequenceButton(x, y);

                if (nBtn != BT_MISS) {
                    m_nSequenceBtnDown = nBtn;
                    m_oBtnStates[nBtn] = BS_LIT;
                    var oCtx = $("#mainCanvas")[0].getContext("2d");
                    drawSequenceButtons(oCtx);
                    m_fnSequenceBtnPressCallback(nBtn);
                }
            }
        }).on("mousemove", function (event) {
            var oRect = $(this)[0].getBoundingClientRect();
            var x = event.pageX - oRect.left;
            var y = event.pageY - oRect.top;
            var nBtn = coordinateToSequenceButton(x, y);

            if (m_nSequenceBtnDown != -1 && nBtn != m_nSequenceBtnDown) {
                m_nSequenceBtnDown = -1;
                unliteAllSequenceButtons();
            }

            if (nBtn == BT_MISS || m_nViewState != GS_ENTERING_SEQUENCE) {
                $(this).css('cursor', 'default');
            } else if (m_nViewState == GS_ENTERING_SEQUENCE) {
                $(this).css('cursor', 'pointer');
            }
        }).on("mouseup", function (event) {
            if (m_nSequenceBtnDown != -1) {
                m_nSequenceBtnDown = -1;
                unliteAllSequenceButtons();
            }
        }).on("mouseleave", function (event) {
            if (m_nSequenceBtnDown != -1) {
                m_nSequenceBtnDown = -1;
                unliteAllSequenceButtons();
            }
        });
    };

    //***************************************************************************
    // Description: Sets view state and draws the view in canvas.
    // Params:      nViewState - New view state (see GS_ constants).
    // Returns:     None.
    //***************************************************************************
    this.setViewState = function (nViewState) {
        m_nViewState = nViewState;
        drawView();
    };

    //***************************************************************************
    // Description: Plays a tone for the indicated button, or a error tone if the
    //              use made a mistake (wrong button in sequence).
    // Params:      nSound - BT_RED, BT_YELLOW, BT_GREEN, BT_BLUE, BT_MISS
    // Returns:     None.
    //***************************************************************************
    this.playSound = function (nSound) {
        try {
            switch (nSound) {
                case BT_RED:
                    m_oSounds[0].play();
                    break;

                case BT_YELLOW:
                    m_oSounds[1].play();
                    break;

                case BT_GREEN:
                    m_oSounds[2].play();
                    break;

                case BT_BLUE:
                    m_oSounds[3].play();
                    break;

                case BT_MISS:
                    m_oSounds[0].play();
                    m_oSounds[1].play();
                    m_oSounds[2].play();
                    m_oSounds[3].play();
                    break;
            }
        } catch (err) {
            console.log("Failed to play sound: " + err.message);
        }
    }

    //***************************************************************************
    // Description: Lites a sequence button for indicated amount of time, then
    //              unlites it.
    // Params:      nBtn - BT_RED, BT_YELLOW, BT_GREEN, or BT_BLUE.
    //              nMilllisecs - Number of miliseconds to keep button lit.
    // Returns:     None.
    //***************************************************************************
    this.liteButton = function (nBtn, nMillisecs) {
        m_oBtnStates[nBtn] = BS_LIT;
        var oCtx = $("#mainCanvas")[0].getContext("2d");
        drawSequenceButtons(oCtx);

        m_oUnliteTimer = setTimeout(function () {
            unliteAllSequenceButtons();
            m_oUnliteTimer = null;
        }, nMillisecs);
    }

    //***************************************************************************
    // Description: Sets the message displayed in the LCD to the sequence count
    //              indicated (number of colors/tones in current sequence being
    //              played).
    // Params:      nCount - Integer from 1 to 20.
    // Returns:     None.
    //***************************************************************************
    this.setSequenceCount = function (nCount) {
        m_sMsgLCD = (nCount < 10) ? "0" + nCount : "" + nCount;
        var oCtx = $("#mainCanvas")[0].getContext("2d");
        drawLCD(oCtx);
    }

    //***************************************************************************
    // Description: Sets the strict indicator in the view.
    // Params:      bStrict - If true, strict is set (LED is on), else strict is
    //                        cleared (LED is off).
    // Returns:     None.
    //***************************************************************************
    this.setStrict = function (bStrict) {
        m_bStrict = bStrict;
        var oCtx = $("#mainCanvas")[0].getContext("2d");
        drawStictLED(oCtx);
    }
};
