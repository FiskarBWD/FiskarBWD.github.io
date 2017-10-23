//***************************************************************************
// Class:       TTTController
// Description: Instantiates TTTView and TTTModel.  Clicks in view are 
//              handled via handleBtnClick, which is called by the view and
//              is passed a string ID identifying the control clicked.  Any
//              clicks on the game board are handled by the function 
//              handleGameBoardClick, which places toads on the board if 
//              location is empty.
// Author:      Brian Denton
// Date:        9/6/2017
//***************************************************************************
var TTTController = function () {
    //Public Methods
    this.handleBtnClick = function (sClickID) {
        switch (sClickID) {
            case "OnePlayer":
                m_oModel.setPlayMode(PM_HUMAN_VRS_COMP);
                m_oModel.setGameState(GS_P1_SELECT_X_OR_O);
                m_oView.setViewState(GS_P1_SELECT_X_OR_O);
                console.log("Vrs Comp");
                break;

            case "TwoPlayers":
                m_oModel.setPlayMode(PM_HUMAN_VRS_HUMAN);
                m_oModel.setGameState(GS_P1_SELECT_X_OR_O);
                m_oView.setViewState(GS_P1_SELECT_X_OR_O);
                console.log("Vrs Humie");
                break;

            case "PlayX":
                m_oModel.setPlayer1Mark("X");
                m_oView.setPlayer1Mark("X");
                m_oModel.setGameState(GS_X_CONFIG_TOAD);
                m_oView.setViewState(GS_X_CONFIG_TOAD);
                break;

            case "PlayO":
                m_oModel.setPlayer1Mark("O");
                m_oView.setPlayer1Mark("O");
                m_oModel.setGameState(GS_O_CONFIG_TOAD);
                m_oView.setViewState(GS_O_CONFIG_TOAD);
                break;

            case "CustomizeDone":
                if (m_oModel.getPlayMode() == PM_HUMAN_VRS_HUMAN) {
                    if (m_oModel.getGameState() == GS_X_CONFIG_TOAD && m_oModel.getPlayerMark(0) == 'X') {
                        m_oModel.setGameState(GS_O_CONFIG_TOAD);
                        m_oView.setViewState(GS_O_CONFIG_TOAD);
                    } else if (m_oModel.getGameState() == GS_O_CONFIG_TOAD && m_oModel.getPlayerMark(0) == 'O') {
                        m_oModel.setGameState(GS_X_CONFIG_TOAD);
                        m_oView.setViewState(GS_X_CONFIG_TOAD);
                    } else {
                        m_oModel.setGameState(GS_PLAY_GAME);
                        m_oView.setViewState(GS_PLAY_GAME);
                        m_oView.setGameStatusMsg(m_oModel.getPlayerMark(m_oModel.getCurrentPlayer()) + "\'s Turn");
                    }
                } else {
                    m_oModel.setGameState(GS_PLAY_GAME);
                    m_oView.setViewState(GS_PLAY_GAME);
                    m_oView.setGameStatusMsg(m_oModel.getPlayerMark(m_oModel.getCurrentPlayer()) + "\'s Turn");
                }
                break;

            case "NextGame":
                m_oModel.toggleFirstPlayer();
                m_oModel.newGame();
                m_oModel.setGameState(GS_PLAY_GAME);
                m_oView.setViewState(GS_PLAY_GAME);

                if (m_oModel.getPlayMode() == PM_HUMAN_VRS_COMP && m_oModel.getCurrentPlayer() == 1) {
                    m_oModel.computerMove();
                    m_oView.drawToadsOnBoard(m_oModel.getBoard());
                    m_oModel.toggleCurrentPlayer();
                }

                m_oView.setGameStatusMsg(m_oModel.getPlayerMark(m_oModel.getCurrentPlayer()) + "\'s Turn");
                break;
        }
    };

    this.handleGameBoardClick = function (iRow, iCol) {
        var iPlayer;
        var nGameWinner = m_oModel.getGameWinner();

        if (nGameWinner == GW_UNDECIDED && m_oModel.boardSpotIsEmpty(iRow, iCol)) {
            m_oModel.move(iRow, iCol);
            m_oView.drawToadsOnBoard(m_oModel.getBoard());
            m_oModel.toggleCurrentPlayer();
            iPlayer = m_oModel.getCurrentPlayer();
            m_oView.setGameStatusMsg(m_oModel.getPlayerMark(iPlayer) + "\'s Turn");

            if (m_oModel.getGameWinner() == GW_UNDECIDED && m_oModel.getPlayMode() == PM_HUMAN_VRS_COMP && m_oModel.getCurrentPlayer() == 1) {
                m_oModel.computerMove();
                m_oView.drawToadsOnBoard(m_oModel.getBoard());
                m_oModel.toggleCurrentPlayer();
                m_oView.setGameStatusMsg(m_oModel.getPlayerMark(0) + "\'s Turn");
            }

            switch (m_oModel.getGameWinner()) {
                case GW_X:
                    m_oView.setGameStatusMsg("X Has Won!");
                    m_oModel.setGameState(GS_GAME_OVER);
                    m_oView.setViewState(GS_GAME_OVER);
                    break;

                case GW_O:
                    m_oView.setGameStatusMsg("O Has Won!");
                    m_oModel.setGameState(GS_GAME_OVER);
                    m_oView.setViewState(GS_GAME_OVER);
                    break;

                case GW_DRAW:
                    m_oView.setGameStatusMsg("Game Is A Draw!");
                    m_oModel.setGameState(GS_GAME_OVER);
                    m_oView.setViewState(GS_GAME_OVER);
                    break;
            }
        }
    };

    this.init = function () {
        m_oView.init();
        m_oModel.setGameState(GS_SELECT_PLAY_MODE);
        m_oView.setViewState(GS_SELECT_PLAY_MODE);
    };

    //Private Vars
    var m_oView = new TTTView(this.handleBtnClick, this.handleGameBoardClick);
    var m_oModel = new TTTModel();
};

