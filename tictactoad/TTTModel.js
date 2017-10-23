//***************************************************************************
// Class:       TTTModel
// Description: Model for tic-tac-toad game.  Contains board, current player,
//              and player mark selection ('X' or 'O').  Also contains the
//              implementation of game moves and determination of win/draw
//              status of game.  Contains implementation of algorithm for 
//              computer moves during game.
// Author:      Brian Denton
// Date:        9/6/2017
//***************************************************************************
var TTTModel = function () {
    //Private vars
    var m_nGameState = GS_SELECT_PLAY_MODE;
    var m_nPlayMode = PM_HUMAN_VRS_HUMAN;
    var m_iFirstPlayer = 0;
    var m_iCurrentPlayer = 0;
    var m_oPlayerMarks = ["X", "O"];
    var m_oBoard = [[-1, -1, -1],
                    [-1, -1, -1],
                    [-1, -1, -1]];
    var m_nGameWinner = GW_UNDECIDED;

    //Private Functions

    //***************************************************************************
    // Description: Generates a list of free locations on the board.
    // Params:      oBoard - Ref to 3x3 array, each elm is 0 for player 1, 1 for
    //                       player 2 (or comp), or -1 for empty.
    // Returns:     Array of objects, each containing an integer 'row' and 'col'
    //              element, each contains a value from 0 to 2.
    //***************************************************************************
    function getPossibleMoves(oBoard) {
        var oMoves = new Array();
        var iRow, iCol;

        for (iRow = 0; iRow < 3; iRow++) {
            for (iCol = 0; iCol < 3; iCol++) {
                if (oBoard[iRow][iCol] == -1) {
                    oMoves.push({ "row": iRow, "col": iCol });
                }
            }
        }

        return oMoves;
    }

    //***************************************************************************
    // Description: Checks if a player has won or the game is a draw.
    // Params:      oBoard - Ref to 3x3 array, each elm is 0 for player 1, 1 for
    //                       player 2 (or comp), or -1 for empty.
    // Returns:     GW_O, GW_X, GW_DRAW, or GW_UNDECIDED.
    //***************************************************************************
    function checkForWinner(oBoard) {
        var nWinner = -1;

        for (var i = 0; i < 2; i++) {
            //Rows
            if ((oBoard[0][0] == i && oBoard[0][1] == i && oBoard[0][2] == i) ||
                (oBoard[1][0] == i && oBoard[1][1] == i && oBoard[1][2] == i) ||
                (oBoard[2][0] == i && oBoard[2][1] == i && oBoard[2][2] == i)) {
                nWinner = i;
                break;
            }

            //Cols
            if ((oBoard[0][0] == i && oBoard[1][0] == i && oBoard[2][0] == i) ||
                (oBoard[0][1] == i && oBoard[1][1] == i && oBoard[2][1] == i) ||
                (oBoard[0][2] == i && oBoard[1][2] == i && oBoard[2][2] == i)) {
                nWinner = i;
                break;
            }

            //Diagonal
            if (oBoard[1][1] == i) {
                if ((oBoard[0][0] == i && oBoard[2][2] == i) ||
                    (oBoard[0][2] == i && oBoard[2][0] == i)) {
                    nWinner = i;
                    break;
                }
            }
        }

        if (nWinner != -1) {
            return (m_oPlayerMarks[nWinner] == "X") ? GW_X : GW_O;
        }

        return (getPossibleMoves(oBoard).length == 0) ? GW_DRAW : GW_UNDECIDED;
    }

    //***************************************************************************
    // Description: Recursive min-max algorithm, which finds the best more for
    //              the player indicated on the board provided.
    // Params:      oBoard - Ref to 3x3 array, each elm is 0 for human player, 0
    //                       for comp player, or -1 for empty.
    //              iPlayer - 0 = human player, 1 = computer player
    // Returns:     Object containing row/col for best move (each 0 to 2), and
    //              and 'score' field for the score associated with this move
    //              (positive values favor the computer player, negative values 
    //              favor the human player.
    //***************************************************************************
    function getBestMove(oBoard, iPlayer) {
        var nWinner = checkForWinner(oBoard);

        if (nWinner == GW_X)
            return (m_oPlayerMarks[0] == "X") ? { "score": -10 } : { "score": 10 };
        else if (nWinner == GW_O)
            return (m_oPlayerMarks[0] == "O") ? { "score": -10 } : { "score": 10 };
        else if (nWinner == GW_DRAW)
            return { "score": 0 };

        //Do recursive calls, adding score to each possible move
        var i, oPossibleMoves = getPossibleMoves(oBoard);
        for (i = 0; i < oPossibleMoves.length; i++) {
            oBoard[oPossibleMoves[i].row][oPossibleMoves[i].col] = iPlayer;
            oPossibleMoves[i].score = getBestMove(oBoard, (iPlayer == 1) ? 0 : 1).score;
            oBoard[oPossibleMoves[i].row][oPossibleMoves[i].col] = -1;  //empty
        }

        //Find move with best score for current player
        var iBestMove = 0;
        if (iPlayer == 0) { //Human player
            var nBestScore = Number.MAX_SAFE_INTEGER;
            for (i = 0; i < oPossibleMoves.length; i++) {
                if (oPossibleMoves[i].score < nBestScore) {
                    nBestScore = oPossibleMoves[i].score;
                    iBestScore = i;
                }
            }
        } else {            //Comp player
            var nBestScore = Number.MIN_SAFE_INTEGER;
            for (i = 0; i < oPossibleMoves.length; i++) {
                if (oPossibleMoves[i].score > nBestScore) {
                    nBestScore = oPossibleMoves[i].score;
                    iBestScore = i;
                }
            }
        }

        //Return best move (with score).
        return oPossibleMoves[iBestScore];
    }

    //Public Functions
    this.setGameState = function (nState) {
        m_nGameState = nState;
    };

    this.getGameState = function () {
        return m_nGameState;
    };

    this.setPlayMode = function (nPlayMode) {
        m_nPlayMode = nPlayMode;
        console.log("Play mode set to " + m_nPlayMode);
    };

    this.getPlayMode = function () {
        console.log("Play mode is " + m_nPlayMode);
        return m_nPlayMode;
    };

    this.setPlayer1Mark = function (sMark) {
        if (sMark === "X") {
            m_oPlayerMarks[0] = "X";
            m_oPlayerMarks[1] = "O";
        } else {
            m_oPlayerMarks[0] = "O";
            m_oPlayerMarks[1] = "X";
        }
    };

    this.getPlayerMark = function (iPlayer) {
        return m_oPlayerMarks[iPlayer % 2];
    };

    this.getFirstPlayer = function () {
        return m_iFirstPlayer;
    };

    this.toggleFirstPlayer = function () {
        m_iFirstPlayer = (m_iFirstPlayer == 0) ? 1 : 0;
        m_iCurrentPlayer = m_iFirstPlayer;
    };

    this.getCurrentPlayer = function () {
        return m_iCurrentPlayer;
    };

    this.toggleCurrentPlayer = function () {
        m_iCurrentPlayer = (m_iCurrentPlayer == 0) ? 1 : 0;
    };

    this.boardSpotIsEmpty = function (iRow, iCol) {
        return (m_oBoard[iRow][iCol] == -1);
    };

    this.move = function (iRow, iCol) {
        m_oBoard[iRow][iCol] = m_iCurrentPlayer;
        m_nGameWinner = checkForWinner(m_oBoard);
    };

    this.computerMove = function () {
        var oPossibleMoves = getPossibleMoves(m_oBoard);
        var n = oPossibleMoves.length;

        if (n == 9) {   //If first move on empty board, then select random spot
            var i = Math.floor((Math.random() * 100)) % n;
            this.move(oPossibleMoves[i].row, oPossibleMoves[i].col);
        } else {        //Otherwise find best move for computer player
            var iRow, iCol, oBoardCopy = new Array(3);

            for (iRow = 0; iRow < 3; iRow++) {
                oBoardCopy[iRow] = new Array(3);
                for (iCol = 0; iCol < 3; iCol++) {
                    oBoardCopy[iRow][iCol] = m_oBoard[iRow][iCol];
                }
            }

            var oMove = getBestMove(oBoardCopy, 1);
            this.move(oMove.row, oMove.col);
        }
    };

    this.getBoard = function () {
        return m_oBoard;
    };

    this.getGameWinner = function () {
        return m_nGameWinner;
    };

    this.newGame = function () {
        var iRow, iCol;

        for (iRow = 0; iRow < 3; iRow++) {
            for (iCol = 0; iCol < 3; iCol++) {
                m_oBoard[iRow][iCol] = -1;
            }
        }

        m_nGameWinner = GW_UNDECIDED;
    };
};
