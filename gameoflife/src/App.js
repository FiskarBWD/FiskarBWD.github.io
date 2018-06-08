/**
 * @fileOverview React component for main application page.
 *
 * This component has no props.
 *
 * @exports App
 * @author Brian Denton
 * @version 1.0
 */

import React, { Component } from 'react';
import AppHeader from './AppHeader.js';
import GameBoard from './GameBoard.js';
import DlgLoadSave from './DlgLoadSave.js';
import DlgExport from './DlgExport.js';
import DlgImport from './DlgImport.js';
import './index.sass';
import CellDisplay from './CellDisplay.js';
import DlgSelectInsertPattern from './DlgSelectInsertPattern.js';

class App extends Component {
  static get LS_KEY_PREFIX() { return "GOL_Pattern_6071_"; };
  static get APP_MIN_WIDTH() { return 1200; };
  static get APP_MIN_HEIGHT() { return 680; };

  /**
  * @constructor
  */
  constructor() {
    super();

    this.THUMB_LEFT_MIN = -15;
    this.THUMB_LEFT_MAX = 158;
    this.THUMB_TOP_MIN = 18;
    this.THUMB_TOP_MAX = 124;

    this.intervalID = undefined;
    this.cursorIntervalID = undefined;

    this.state = {
      gameSpeed: 100,
      boardSize: AppHeader.BS_75x45,
      boardCursorVisible: false,
      boardCursorRow: 22,
      boardCursorCol: 37,
      simSpeed: AppHeader.SS_MEDIUM,
      toroidalBoard: AppHeader.TB_ON,
      rows: 45,
      cols: 75,
      cells: Array(45).fill().map(() => Array(75).fill(false)),
      cellSize: 7,
      innerWidth: window.innerWidth,
      innerHeight: window.innerHeight,
      simRunning: false,
      generation: 0,
      dlgLoadSaveState: DlgLoadSave.DS_HIDDEN,
      dlgExportState: DlgExport.DS_HIDDEN,
      dlgImportState: DlgImport.DS_HIDDEN,
      dlgSelInsPatState: DlgSelectInsertPattern.DS_HIDDEN,
      patternList: [],
      exportPatternStr: "",
      controllerThumbLeft: 73,
      controllerThumbTop: 73,
      lastMouseX: 0,
      lastMouseY: 0,
      insertPatternData: {
        rows: 1,
        cols: 1,
        cells: [ [ true ] ],
        cellSize: 27,
        dispRowCount: 7,
        dispColCount: 7,
        patternID: 0
      }
    };
  }

  /**
  * Called by React framework after this component did mount on the DOM.  Adds
  * event listener for browser resize event.  Also seeds and starts the simulation
  * by calling button handlers.
  */
  componentDidMount() {
    let oControllerThumb = document.getElementById("controllerThumb");

    oControllerThumb.addEventListener('touchstart', this.handleTouchStart, true);
    oControllerThumb.addEventListener('touchmove', this.handleTouchMove, true);
    oControllerThumb.addEventListener('touchend', this.handleTouchEnd, true);

    window.addEventListener("resize", this.updateDimensions);
    this.handleSeedBtnClick();
    this.handleRunBtnClick();
  }

  /**
  * Called by React framework when this component is being removed from the DOM.
  * Removes the event listener added for the browser resize event.
  */
  componentWillUnmount() {
    window.removeEventListener("resize", this.updateDimensions.bind(this));

    let oControllerThumb = document.getElementById("controllerThumb");

    oControllerThumb.removeEventListener('touchstart', this.handleTouchStart, true);
    oControllerThumb.removeEventListener('touchmove', this.handleTouchMove, true);
    oControllerThumb.removeEventListener('touchend', this.handleTouchEnd, true);
  }

  /**
  * Called when browser window is resized.  Event lister for browser resize
  * event added in componentDidMount, which calls this function.
  */
  updateDimensions = () => {
    this.setState({innerWidth: window.innerWidth,
                   innerHeight: window.innerHeight});
  }

  /**
  * Called from AppHeader when user selects a new board size.  Changes
  * rows, cols, cellSize, and cells 2D array in state.
  * @param {number} newSize New board size, equal to one of the
  *   'BS_' constants defined in AppHeader.
  */
  handleBoardSizeChange = (newSize) => {
    let rows, cols, cellSize, bcRow, bcCol;

    switch (newSize) {
      case AppHeader.BS_50x30:
        rows = 30;
        cols = 50;
        cellSize = 12;
        break;
      case AppHeader.BS_75x45:
        rows = 45;
        cols = 75;
        cellSize = 7;
        break;
      default:
        rows = 60;
        cols = 100;
        cellSize = 5;
        break;
    }

    let cells = new Array(rows).fill().map(() => Array(cols).fill(false));

    bcCol = Math.floor((cols - 1) * ((this.state.controllerThumbLeft - this.THUMB_LEFT_MIN) / (this.THUMB_LEFT_MAX - this.THUMB_LEFT_MIN)));
    bcRow = Math.floor((rows - 1) * ((this.state.controllerThumbTop - this.THUMB_TOP_MIN) / (this.THUMB_TOP_MAX - this.THUMB_TOP_MIN)));

    this.setState({ boardSize: newSize,
                    rows: rows,
                    cols: cols,
                    cells: cells,
                    cellSize: cellSize,
                    boardCursorRow: bcRow,
                    boardCursorCol: bcCol
                  });
  }

  /**
  * Called from AppHeader when user selects a new simulation speed.
  * @param {number} newSpeed New sim speed, equal to one of the
  *   'SS_' constants defined in AppHeader.
  */
  handleSimSpeedChange = (newSpeed) => {
    if (this.state.simRunning) {
      clearInterval(this.intervalID);
      this.intervalID = setInterval(this.runSim, newSpeed);
    }

    this.setState({simSpeed: newSpeed});
  }

  /**
  * Called from AppHeader when user selects a new toroidal board
  * option (on or off).
  * @param {number} newToroidalOp New option for toroidal board (on
  *   or off), equal to one of the 'TB_' consts defined in AppHeader.
  */
  handleToroidalBoardChange = (newToroidalOp) => {
    this.setState({toroidalBoard: newToroidalOp});
  }

  /**
  * Handler for user click on cell.  Toggles cell's alive/dead
  * state.
  * @param {number} row Integer row of cell, base 0, increases
  *   from top to bottom.
  * @param {number} col Integer column of cell, base 0, increases
  *   from left to right.
  */
  handleCellClick = (row, col) => {
    var r;
    var newCells = new Array(this.state.rows);

    for (r = 0; r < this.state.rows; r++) {
      newCells[r] = this.state.cells[r].slice(0);
    }

    newCells[row][col] = !this.state.cells[row][col];
    this.setState({cells: newCells});
  }

  /**
  * Called from GameBoard when user clicks Run button.  Starts the
  * sim if it is currently puased.
  */
  handleRunBtnClick = () => {
    if (!this.state.simRunning) {
      this.intervalID = setInterval(this.runSim, this.state.simSpeed);
      this.setState({ simRunning: true });
    }
  }

  /**
  * Called when user clicks the Puase button in GameBoard, which pauses
  * the simulation if currently running.
  */
  handlePauseBtnClick = () => {
    if (this.state.simRunning) {
      clearInterval(this.intervalID);
      this.setState({ simRunning: false });
    }
  }

  /**
  * Called when user presses the Clear button in GameBoard.  Clears all cells.
  */
  handleClearBtnClick = () => {
    let newCells = new Array(this.state.rows).fill().map(() => Array(this.state.cols).fill(false));
    this.setState({
                    cells: newCells,
                    generation: 0
                  });
  }

  /**
  * Called when user presses the Seed button in GameBoard.  Ramdomly adds live
  * cells to existing pattern.
  */
  handleSeedBtnClick = () => {
    let r, c;
    let newCells = new Array(this.state.rows);

    for (r = 0; r < this.state.rows; r++) {
      newCells[r] = this.state.cells[r].splice(0);

      for (c = 0; c < this.state.cols; c++) {
        if ((Math.round(Math.random() * 100) % 3) > 1) {
          newCells[r][c] = true;
        }
      }
    }

    this.setState({ cells: newCells });
  }

  /**
  * Called when user presses Save button.  Pauses game and opens load/save
  * dialog in save mode.
  */
  handleShowSavePatternDlg = () => {
    this.handlePauseBtnClick();
    let patternList = this.readPatternListFromLocalStorage();
    this.setState({
      dlgLoadSaveState: DlgLoadSave.DS_SAVE,
      patternList: patternList
    });
  }

  /**
  * Called from load/save dialog when user presses Save button in this dialog.
  * Saves pattern to local storage.
  * @param {string} patternName Name of pattern, string containing 1 to 25
  *   alpha-numeric characters (0-9, a-z, A-Z).
  */
  handleLSDlgSave = (patternName) => {
    let patternData = this.gereratePatternSaveData(this.state.cells, this.state.rows,
                                                   this.state.cols);
    this.savePatternToLocalStorage(patternData, patternName);
    this.setState({dlgLoadSaveState: DlgLoadSave.DS_HIDDEN});
  }

  /**
  * Called when user presses Load button.  Pauses game and opens load/save
  * dialog in load mode.
  */
  handleShowLoadPatternDlg = () => {
    this.handlePauseBtnClick();
    let patternList = this.readPatternListFromLocalStorage();
    this.setState({
      dlgLoadSaveState: DlgLoadSave.DS_LOAD,
      patternList: patternList
    });
  }

  /**
  * Called from load/save dialog when user presses Cancel button in this dialog.
  */
  handleLSDlgCancel = () => {
    this.setState({dlgLoadSaveState: DlgLoadSave.DS_HIDDEN});
  }

  /**
  * Called from load/save dialog when user presses Load button in this dialog.
  * @param {string} patternName - Name of the pattern to load, string containing
  *    1 to 25 alpha-numeric characters (0-9, a-z, A-Z).
  */
  handleLSDlgLoad = (patternName) => {
    let topRow, leftCol, boardRows, boardCols, cells;
    let patternData = this.readPatternFromLocalStorage(patternName);

    if (patternData == null) {
      this.setState({dlgLoadSaveState: DlgLoadSave.DS_HIDDEN});
      return;
    }

    let minBoardSize = this.getMinBoardSize(patternData.rows, patternData.cols);
    if (minBoardSize > this.state.boardSize) {
      this.handleBoardSizeChange(minBoardSize);
    }

    switch (Math.max(minBoardSize, this.state.boardSize)) { //setState is not immediate
      case AppHeader.BS_50x30:
        boardRows = 30;
        boardCols = 50;
        break;
      case AppHeader.BS_75x45:
        boardRows = 45;
        boardCols = 75;
        break;
      default:
        boardRows = 60;
        boardCols = 100;
        break;
    }

    topRow = Math.floor((boardRows - patternData.rows) / 2);
    leftCol = Math.floor((boardCols - patternData.cols) / 2);
    cells = new Array(boardRows).fill().map(() => Array(boardCols).fill(false));
    this.generatePatternBools(topRow, leftCol,
                              patternData.rows, patternData.cols,
                              boardRows, boardCols,
                              patternData.cells, cells);
    this.setState({
      cells: cells,
      dlgLoadSaveState: DlgLoadSave.DS_HIDDEN,
      generation: 0
    });
  }

  /**
  * Called from load/save dialog when user presses Delete button in this dialog.
  * @param {string} patternName Name of pattern, string containing 1 to 25
  *   alpha-numeric characters (0-9, a-z, A-Z).
  */
  handleLSDlgDelete = (patternName) => {
    this.deletePatternFromLocalStorage(patternName);
    this.setState({dlgLoadSaveState: DlgLoadSave.DS_HIDDEN});
  }

  /**
  * Called when user presses Export button.  Pauses game and opens export
  * dialog.
  */
  handleShowExportPatternDlg = () => {
    let i, patternHexStr = "";

    this.handlePauseBtnClick();

    let patternData = this.gereratePatternSaveData(this.state.cells, this.state.rows,
                                                   this.state.cols);
    for (i = 0; i < patternData.rows; i++) {
      patternHexStr += (patternData.cells[i] + "\r\n");
    }

    this.setState({
      dlgExportState: DlgExport.DS_VISIBLE,
      exportPatternStr: patternHexStr
    });
  }

  /**
  * Called from export dialog when Done button in this dialog is pressed.
  */
  handleExportDlgDone = () => {
    this.setState({dlgExportState: DlgExport.DS_HIDDEN});
  }

  /**
  * Called when user presses Import button.  Pauses game and opens import
  * dialog.
  */
  handleShowImportPatternDlg = () => {
    this.handlePauseBtnClick();
    this.setState({
      dlgImportState: DlgImport.DS_VISIBLE
    });
  }

  /**
  * Called from import dialog when user presses Import button in this dialog.
  * @param {string} patternStr String containing pattern data, each row is a series of
  *   hexadecimal digits, each of these separated by cr/lf chars.
  */
  handleImportDlgImport = (patternStr) => {
    let boardRows, boardCols, topRow, leftCol, cells;
    let patternData = this.convertPatternHexStrToObj(patternStr);
    let minBoardSize = this.getMinBoardSize(patternData.rows, patternData.cols);

    if (minBoardSize > this.state.boardSize) {
      this.handleBoardSizeChange(minBoardSize);
    }

    switch (Math.max(minBoardSize, this.state.boardSize)) { //setState is not immediate
      case AppHeader.BS_50x30:
        boardRows = 30;
        boardCols = 50;
        break;
      case AppHeader.BS_75x45:
        boardRows = 45;
        boardCols = 75;
        break;
      default:
        boardRows = 60;
        boardCols = 100;
        break;
    }

    topRow = Math.floor((boardRows - patternData.rows) / 2);
    leftCol = Math.floor((boardCols - patternData.cols) / 2);
    cells = new Array(boardRows).fill().map(() => Array(boardCols).fill(false));
    this.generatePatternBools(topRow, leftCol,
                              patternData.rows, patternData.cols,
                              boardRows, boardCols,
                              patternData.cells, cells);
    this.setState({
      cells: cells,
      dlgImportState: DlgImport.DS_HIDDEN,
      generation: 0
    });
  }

  /**
  * Called from import dialog when user presses Cancel button in this dialog.
  */
  handleImportDlgCancel = () => {
    this.setState({dlgImportState: DlgImport.DS_HIDDEN});
  }

  /**
  * Called when 'Select' button in the insert pattern selector is
  * pressed.  Makes the select insert pattern dialog visible.
  */
  handleShowSelectInsPatDlg = () => {
    this.setState({
      dlgSelInsPatState: DlgSelectInsertPattern.DS_VISIBLE
    });
  }

  /**
  * Called from select insert pattern dialog when 'Cancel' button in
  * this dialog is pressed.
  */
  handleSelInsPatDlgCancel = () => {
    this.setState({
      dlgSelInsPatState: DlgSelectInsertPattern.DS_HIDDEN
    });
  }

  /**
  * Called from select insert pattern dialog when 'Select' button in
  * this dislog is pressed.
  * @param {obj} patternData Object containing info about selected
  * pattern, contains the following fields:
  *   rows - Integer number of rows in pattern
  *   cols - Integer number of columns in pattern
  *   cells - 2D array of bools, each element is either true (cell
  *     is alive) or false (cell is dead).  Size: [rows][cols].
  *   cellSize - Size of a cell in pixels, set to fit pattern in 210 x
  *     210 space.
  *   dispRowCount - Number of rows in 210 x 210 area
  *   dispColCount - Number of columns in 210 x 210 area
  *   patternID - Integer ID assigned to selected pattern
  */
  handleSelInsPatDlgSelect = (patternData) => {
    let maxCol = this.state.cols - patternData.cols;
    let bcCol = (this.state.boardCursorCol > maxCol) ? maxCol : this.state.boardCursorCol;
    let maxRow = this.state.rows - patternData.rows;
    let bcRow = (this.state.boardCursorRow > maxRow) ? maxRow : this.state.boardCursorRow;

    this.setState({
      dlgSelInsPatState: DlgSelectInsertPattern.DS_HIDDEN,
      insertPatternData: patternData,
      boardCursorRow: bcRow,
      boardCursorCol: bcCol
    });
  }

  /**
  * Called when '+/-' button is pressed inside the insert pattern selector.
  * Places the selected patern at the current cursor position.  Note that
  * only living cells are placed (empty cells in selected pattern will not
  * errase living cell in the board), though if a living cell is overwritten
  * with a living cell, the result is a dead cell.
  */
  handleInsertPattern = () => {
    let iRow = this.state.boardCursorRow;
    let iStartCol = this.state.boardCursorCol;
    let iCol, i, j;
    let newCells = new Array(this.state.rows);

    //Make copy of game board cells:
    for (i = 0; i < this.state.rows; i++)
      newCells[i] = this.state.cells[i].slice();

    //Place selected pattern at cursor location
    for (i = 0; i < this.state.insertPatternData.rows; i++, iRow++) {
      for (j = 0, iCol = iStartCol; j < this.state.insertPatternData.cols; j++, iCol++) {
        if (!this.state.insertPatternData.cells[i][j])
          continue;

        newCells[iRow][iCol] = !newCells[iRow][iCol];
      }
    }

    this.setState({
      cells: newCells
    });
  }

  /**
  * Called when when mouse down is detected over the controller thumb.
  * @param {obj} event Javascript event object for mouse down event.
  */
  handleMouseDownControllerThumb = (event) => {
    let x, y;

    document.addEventListener('mouseup', this.handleMouseUp, true);
    document.addEventListener('mousemove', this.handleMouseMove, true);

    if (event.hasOwnProperty('clientX')) {
      x = event.clientX + document.body.scrollLeft;
      y = event.clientY + document.body.scrollTop;
    } else {
      x = event.pageX;
      y = event.pageY;
    }

    if (typeof(this.cursorIntervalID) != undefined)
      clearInterval(this.cursorIntervalID);

    this.setState({
                    lastMouseX: x,
                    lastMouseY: y,
                    boardCursorVisible: true
                  });
  }

  /**
  * Called to handle mouse move event.  This handler is only active
  * after user has pressed a mouse button over the controller thumb,
  * and only remains active while this button is depressed.
  *
  * While moving the mouse, the position of the controller thumb is
  * moved to keep up, but is limited so the center dot does not leave
  * the rectangle.  The position of the board cursor is calculated from
  * the position of the controller thumb.
  * @param {obj} event Javascript event object for mouse down event.
  */
  handleMouseMove = (event) => {
    let x, y, dx, dy, newLeft, newTop, bcRow, bcCol, maxCol, maxRow;
    event.preventDefault();

    if (event.hasOwnProperty('clientX')) {
      x = event.clientX + document.body.scrollLeft;
      y = event.clientY + document.body.scrollTop;
    } else {
      x = event.pageX;
      y = event.pageY;
    }

    dx = x - this.state.lastMouseX;
    dy = y - this.state.lastMouseY;

    newLeft = (dx < 0) ? Math.max(this.state.controllerThumbLeft + dx, this.THUMB_LEFT_MIN) :
                         Math.min(this.state.controllerThumbLeft + dx, this.THUMB_LEFT_MAX);
    newTop = (dy < 0) ? Math.max(this.state.controllerThumbTop + dy, this.THUMB_TOP_MIN) :
                        Math.min(this.state.controllerThumbTop + dy, this.THUMB_TOP_MAX);
    bcCol = Math.floor((this.state.cols - 1) * ((newLeft - this.THUMB_LEFT_MIN) / (this.THUMB_LEFT_MAX - this.THUMB_LEFT_MIN)));
    maxCol = this.state.cols - this.state.insertPatternData.cols;
    bcCol = (bcCol > maxCol) ? maxCol : bcCol;
    bcRow = Math.floor((this.state.rows - 1) * ((newTop - this.THUMB_TOP_MIN) / (this.THUMB_TOP_MAX - this.THUMB_TOP_MIN)));
    maxRow = this.state.rows - this.state.insertPatternData.rows;
    bcRow = (bcRow > maxRow) ? maxRow : bcRow;

    this.setState({
                    lastMouseX: x,
                    lastMouseY: y,
                    controllerThumbLeft: newLeft,
                    controllerThumbTop: newTop,
                    boardCursorRow: bcRow,
                    boardCursorCol: bcCol
                  });
  }

  /**
  * Called when user releases a mouse button.  This handler is only active
  * after user has pressed a mouse button over the controller thumb,
  * and only remains active while this button is depressed.
  *
  * This handler removes the listeners for mouseUp and mouseMove, and hides
  * the board cursor.
  *
  * @param {obj} event Javascript event object for mouse down event.
  */
  handleMouseUp = (event) => {
    event.preventDefault();
    document.removeEventListener('mouseup', this.handleMouseUp, true);
    document.removeEventListener('mousemove', this.handleMouseMove, true);
    this.cursorIntervalID = setInterval(() => {
      clearInterval(this.cursorIntervalID);
      this.setState({ boardCursorVisible: false });
    }, 2000);
  }

  /**
  * Called when touch detected over controller thumb.  Starts mouse drag for
  * contoller thumb.
  * @param {obj} event Event object for touchstart event
  */
  handleTouchStart = (event) => {
    event.preventDefault();

    if (event.targetTouches.length == 1) {
      let touch = event.targetTouches[0];

      if (typeof(this.cursorIntervalID) != undefined)
        clearInterval(this.cursorIntervalID);

      this.setState({
                      lastMouseX: touch.pageX,
                      lastMouseY: touch.pageY,
                      boardCursorVisible: true
                    });
    }
  }

  /**
  * Called when touch move detected over controller thumb.  Moves controller
  * thumb, and board cursor also, but not past board edges.
  * @param {obj} event Event object for touchstart event
  */
  handleTouchMove = (event) => {
    event.preventDefault();

    if (event.targetTouches.length == 1) {
      let dx, dy, newLeft, newTop, bcRow, bcCol, maxCol, maxRow;
      let touch = event.targetTouches[0];

      dx = touch.pageX - this.state.lastMouseX;
      dy = touch.pageY - this.state.lastMouseY;

      newLeft = (dx < 0) ? Math.max(this.state.controllerThumbLeft + dx, this.THUMB_LEFT_MIN) :
                           Math.min(this.state.controllerThumbLeft + dx, this.THUMB_LEFT_MAX);
      newTop = (dy < 0) ? Math.max(this.state.controllerThumbTop + dy, this.THUMB_TOP_MIN) :
                          Math.min(this.state.controllerThumbTop + dy, this.THUMB_TOP_MAX);
      bcCol = Math.floor((this.state.cols - 1) * ((newLeft - this.THUMB_LEFT_MIN) / (this.THUMB_LEFT_MAX - this.THUMB_LEFT_MIN)));
      maxCol = this.state.cols - this.state.insertPatternData.cols;
      bcCol = (bcCol > maxCol) ? maxCol : bcCol;
      bcRow = Math.floor((this.state.rows - 1) * ((newTop - this.THUMB_TOP_MIN) / (this.THUMB_TOP_MAX - this.THUMB_TOP_MIN)));
      maxRow = this.state.rows - this.state.insertPatternData.rows;
      bcRow = (bcRow > maxRow) ? maxRow : bcRow;

      this.setState({
                      lastMouseX: touch.pageX,
                      lastMouseY: touch.pageY,
                      controllerThumbLeft: newLeft,
                      controllerThumbTop: newTop,
                      boardCursorRow: bcRow,
                      boardCursorCol: bcCol
                    });
    }
  }

  /**
  * Called when touch end detected over controller thumb.  Starts timer to hide
  * board cursor.
  * @param {obj} event Event object for touchstart event
  */
  handleTouchEnd = (event) => {
    event.preventDefault();

    this.cursorIntervalID = setInterval(() => {
      clearInterval(this.cursorIntervalID);
      this.setState({ boardCursorVisible: false });
    }, 2000);
  }

  /**
  * Called by React framework whenever this component is rendered.
  * @return Rendered React elements.
  */
  render() {
    let controllerStyle = {
      top: ((Math.max(this.state.innerHeight, App.APP_MIN_HEIGHT) - (230)) / 2) + "px"
    };

    let thumbStyle = {
      left: this.state.controllerThumbLeft + "px",
      top: this.state.controllerThumbTop + "px"
    };

    let thumbDotStyle = {
      left: (this.state.controllerThumbLeft + 32) + "px",
      top: (this.state.controllerThumbTop + 32) + "px"
    };

    let insSelStyle = {
      top: ((Math.max(this.state.innerHeight, App.APP_MIN_HEIGHT) - 364) / 2) + "px"
    };

    let cdPadding = Math.round((210 - (2 + (this.state.insertPatternData.dispRowCount *
                                            (this.state.insertPatternData.cellSize + 2)))) / 2);
    let insPatDispStyle = { "padding-top": cdPadding + "px", height: (210 - cdPadding) + "px" };

    return (
      <div className="app">
        <AppHeader boardSize={this.state.boardSize}
                   boardSizeChanged={this.handleBoardSizeChange}
                   simSpeed={this.state.simSpeed}
                   simSpeedChanged={this.handleSimSpeedChange}
                   toroidalBoard={this.state.toroidalBoard}
                   toroidalBoardChanged={this.handleToroidalBoardChange}/>
        <GameBoard cells={this.state.cells}
                  rows={this.state.rows}
                  cols={this.state.cols}
                  cellSize={this.state.cellSize}
                  innerWidth={this.state.innerWidth}
                  simRunning={this.state.simRunning}
                  generation={this.state.generation}
                  boardCursorVisible={this.state.boardCursorVisible}
                  boardCursorRow={this.state.boardCursorRow}
                  boardCursorCol={this.state.boardCursorCol}
                  boardCursorRows={this.state.insertPatternData.rows}
                  boardCursorCols={this.state.insertPatternData.cols}
                  handleCellClick={this.handleCellClick}
                  handleRunClick={this.handleRunBtnClick}
                  handlePauseClick={this.handlePauseBtnClick}
                  handleClearClick={this.handleClearBtnClick}
                  handleSeedClick={this.handleSeedBtnClick}
                  handleSaveClick={this.handleShowSavePatternDlg}
                  handleLoadClick={this.handleShowLoadPatternDlg}
                  handleExportClick={this.handleShowExportPatternDlg}
                  handleImportClick={this.handleShowImportPatternDlg}/>
        <div className="controllerOuter" style={controllerStyle}>
          <div className="controllerInner">
            <div style={{position:"absolute", top:"50px", left:"17px", width:"173px", height:"106px", border: "1px solid gray"}} />
            <div className="controllerThumbDot" style={thumbDotStyle} />
            <div className="controllerThumb" style={thumbStyle} onMouseDown={this.handleMouseDownControllerThumb} id="controllerThumb"/>
          </div>
        </div>
        <div className="insertSelectorOuter" style={insSelStyle}>
          <div className="insertPatternDisp" style={insPatDispStyle}>
            <CellDisplay rows={this.state.insertPatternData.rows}
                         cols={this.state.insertPatternData.cols}
                         cells={this.state.insertPatternData.cells}
                         cellSize={this.state.insertPatternData.cellSize}
                         dispRowCount={this.state.insertPatternData.dispRowCount}
                         dispColCount={this.state.insertPatternData.dispColCount}
                         idStr={"insPatDisp"}
            />
          </div>
          <div style={{ width: "100%", height: "45px", "text-align": "center",  "padding-top": "10px", "padding-bottom": "20px" }} >
            <input type="button" className="btn-unlit" style={{ float: "none" }} value="Select" onClick={this.handleShowSelectInsPatDlg} />
          </div>
          <div style={{ width: "100%", height: "45px", "text-align": "center" }} >
            <input type="button" className="btn-unlit" style={{ height: "80px", "font-size": "30px", "font-style": "bold", float: "none" }} value="+/-" onClick={this.handleInsertPattern} />
          </div>
        </div>
        <div className="app-footer">
          <p className="footer-text">&copy; Brian Denton</p>
        </div>
        <DlgLoadSave dlgState={this.state.dlgLoadSaveState}
          patternList={this.state.patternList}
          handleCancel={this.handleLSDlgCancel}
          handleSave={this.handleLSDlgSave}
          handleLoad={this.handleLSDlgLoad}
          handleDelete={this.handleLSDlgDelete} />
        <DlgExport dlgState={this.state.dlgExportState}
          patternHex={this.state.exportPatternStr}
          handleDone={this.handleExportDlgDone} />
        <DlgImport dlgState={this.state.dlgImportState}
          handleCancel={this.handleImportDlgCancel}
          handleImport={this.handleImportDlgImport} />
        <DlgSelectInsertPattern dlgState={this.state.dlgSelInsPatState}
          patternID={this.state.insertPatternData.patternID}
          handleCancel={this.handleSelInsPatDlgCancel}
          handleSelect={this.handleSelInsPatDlgSelect} />
      </div>
    );
  }

  /**
  * Creates the next patern in the simulation.  Saves new pattern
  * to state and increments generation counter in state.
  */
  runSim = () => {
    let r, c, aliveNeighbors;
    let liveCellCount = 0;
    let rows = this.state.rows;
    let cols = this.state.cols;
    let isToroidal = (this.state.toroidalBoard == AppHeader.TB_ON) ? true : false;
    let newCells = new Array(this.state.rows);

    for (r = 0; r < this.state.rows; r++) {
      newCells[r] = new Array(this.state.cols).fill(false);
      for (c = 0; c < this.state.cols; c++) {
        aliveNeighbors = 0;
        if (this.getNeighborStatus(r - 1, c - 1, rows, cols, isToroidal)) aliveNeighbors++;
        if (this.getNeighborStatus(r - 1, c, rows, cols, isToroidal)) aliveNeighbors++;
        if (this.getNeighborStatus(r - 1, c + 1, rows, cols, isToroidal)) aliveNeighbors++;
        if (this.getNeighborStatus(r, c - 1, rows, cols, isToroidal)) aliveNeighbors++;
        if (this.getNeighborStatus(r, c + 1, rows, cols, isToroidal)) aliveNeighbors++;
        if (this.getNeighborStatus(r + 1, c - 1, rows, cols, isToroidal)) aliveNeighbors++;
        if (this.getNeighborStatus(r + 1, c, rows, cols, isToroidal)) aliveNeighbors++;
        if (this.getNeighborStatus(r + 1, c + 1, rows, cols, isToroidal)) aliveNeighbors++;
        if (this.state.cells[r][c]) {
          newCells[r][c] = (aliveNeighbors < 2 || aliveNeighbors > 3) ? false : true;
        } else {
          newCells[r][c] = (aliveNeighbors == 3) ? true : false;
        }
        if (newCells[r][c])
          ++liveCellCount;
      }
    }

    this.setState({
      cells: newCells,
      generation: this.state.generation + 1
    });

    if (liveCellCount == 0)
      this.handlePauseBtnClick();
  }

  /**
  * Called to determine if a specific cell is alive or dead.
  * @param {number} row Integer row
  * @param {number} col Integer column
  * @param {number} rows Integer number of rows in board
  * @param {number} cols Integer number of columns in board
  * @param {boolean} isToroidal True if board is toroidal,
  *   false if not.  If not toroidal, and row/col are < 0 or
  *   row >= rows or col >= cols, then false is returned.  If
  *   toroidal, then row and col are adjusted so as to
  *   wrap from one side of the board to the oposite (row of
  *   -1 is reset to rows - 1, etc).
  * @return True if cell is alive, false if not.
  */
  getNeighborStatus = (row, col, rows, cols, isToroidal) => {
    if (isToroidal) {
      row = (row < 0) ? rows - 1 : (row >= rows) ? 0 : row;
      col = (col < 0) ? cols - 1 : (col >= cols) ? 0 : col;
    } else {
      if (row < 0 || row >= rows) return false;
      if (col < 0 || col >= cols) return false;
    }

    return this.state.cells[row][col];
  }

  /**
  * Takes 2D array of cells and converts it to a series of hexadcimal
  * strings.  Dead zone around all living cells is determined, and
  * sub-pattern containing living cells is saved.  Object generated
  * includes size on this sub-pattern.
  * @param cells {obj} cells 2D array of booleans, each true for
  *   living cell, false for dead one.
  * @param rows {number} rows Integer number of rows in cells
  * @param cols {number} cols Integer number of columns in cells
  * @param Object containing array of strings, each containing
  *   a row of cells converted to hex string.  Also contains rows and
  *   cols elements containing number of rows and columns in pattern.
  *   Note: array of strings is omitted if pattern is empty (rows =
  *   cols = 0).
  */
  gereratePatternSaveData(cells, rows, cols) {
    let r, c, iBit, nible, iRow;
    let rTop = Number.MAX_SAFE_INTEGER;
    let rBtm = -1;
    let cLft = Number.MAX_SAFE_INTEGER;
    let cRht = -1;
    let bitPowers = [ 8, 4, 2, 1 ];
    let hexDigits = [ "0", "1", "2", "3", "4", "5", "6", "7",
                      "8", "9", "A", "B", "C", "D", "E", "F" ];

    for (r = 0; r < rows; r++) {
      for (c = 0; c < cols; c++) {
        if (cells[r][c]) {
          if (r < rTop) rTop = r;
          if (c < cLft) cLft = c;
        }
      }
    }

    if (rTop == Number.MAX_SAFE_INTEGER) { //No living cells found
      return ({
        rows: 0,
        cols: 0
      });
    }

    for (r = rows - 1; r >= 0; r--) {
      for (c = cols - 1; c >= 0; c--) {
        if (cells[r][c]) {
          if (r > rBtm) rBtm = r;
          if (c > cRht) cRht = c;
        }
      }
    }

    let cellStrs = new Array((rBtm - rTop) + 1).fill("");

    for (r = rTop, iRow = 0; r <= rBtm; r++, iRow++) {
      for (c = cLft, iBit = 0, nible = 0; c <= cRht; c++) {
        if (cells[r][c]) nible += bitPowers[iBit];
        iBit = (iBit + 1) % 4;
        if (iBit == 0) {
          cellStrs[iRow] += hexDigits[nible];
          nible = 0;
        }
      }

      if (iBit > 0) { //Save last few columns of cells if less then full nible
        cellStrs[iRow] += hexDigits[nible];
      }
    }

    return ({
      rows: (rBtm - rTop) + 1,
      cols: (cRht - cLft) + 1,
      cells: cellStrs
    });
  }

  /**
  * Determines minimum board size that can show a pattern given
  * pattern's row and column count.
  * @param {number} rows Number of rows in pattern
  * @param {number} cols Number of columns in pattern
  * @return AppHeader.BS_50x30, AppHeader.BS_75x45 or
  *   AppHeader.BS_100x60
  */
  getMinBoardSize(rows, cols) {
    if (rows <= 30 && cols <= 50)
      return AppHeader.BS_50x30;
    else if (rows <= 45 && cols <= 75)
      return AppHeader.BS_75x45;
    else
      return AppHeader.BS_100x60;
  }

  /**
  * Converts array of pattern strings containing hexadecimal chars into
  * bools and applies them to 2D array of booleans provided (elements
  * for live cells are true, dead cells are false).  Only living cells
  * are placed.  The pattern is placed in boardCellBools such that the
  * upper left corner of its bounding rectagle is at topRow, leftCol.
  * @param {number} topRow Integer row index (top row = 0) for top row
  *   of pattern cells.
  * @param {number} leftCol Integer column index (left col = 0) for
  *   leftmost column of pattern.
  * @param {number} patRows Integer number of rows in pattern
  * @param {number} patCols Integer number of columns in pattern
  * @param {number} boardRows Integer number of rows in board
  * @param {number} boardCols Integer number of columns in board
  * @param {obj} patCellStrs Array of string containing hex digits
  *   ('0'-'9', 'A'-'F').
  * @param {obj} boardCellBools 2D array of booleans, size =
  *   [boardRows][boardCols].  The pattern is applied to this array.
  */
  generatePatternBools(topRow, leftCol, patRows, patCols,
                       boardRows, boardCols,
                       patCellStrs, boardCellBools) {
    let r, c, ir, ic, iStrCol, nibble = 0;
    let hexDigits = "0123456789ABCDEF";

    if (patRows == 0 || patCols == 0)
      return;

    for (ir = topRow, r = 0; r < patRows && ir < boardRows; r++, ir++) {
      for (ic = leftCol, c = iStrCol = 0; c < patCols && ic < boardCols; c++, ic++) {
        if ((c % 4) == 0) {
          nibble = hexDigits.indexOf(patCellStrs[r].substring(iStrCol, iStrCol + 1));
          iStrCol++;
        }

        if ((nibble & 8) > 0 && ir >= 0 && ic >= 0) {
          boardCellBools[ir][ic] = true;
        }

        nibble = nibble << 1;
      }
    }
  }

  /**
  * Given single string of pattern hex info, converts it into a
  * pattern data object with number or rows, columns, and an
  * array of strings, one for each row.
  * @param {string} patternHexStr String containing the pattern
  *   hexadecimal strings, one for each row, separated by cr/lf.
  * @return  Object containing array of strings, each containing
  *   a row of cells converted to hex string.  Also contains rows and
  *   cols elements containing number of rows and columns in pattern.
  *   Note: array of strings is omitted if pattern is empty (rows =
  *   cols = 0).
  */
  convertPatternHexStrToObj(patternHexStr) {
    let i, j, c, n, iStart, rows, colCount, rowStrs = [];
    let hexDigits = "0123456789ABCDEF";

    //Extract row strings, discard blank lines
    for (i = 0, iStart = -1; i < patternHexStr.length; i++) {
      c = patternHexStr.charAt(i);
      if ((c >= '0' && c <= '9') || (c >= 'A' && c <= 'F')) {
        iStart = (iStart == -1) ? i : iStart;
      } else if (iStart > -1) {
        rowStrs.push(patternHexStr.substring(iStart, i));
        iStart = -1;
      }
    }

    if (iStart > -1)
      rowStrs.push(patternHexStr.substring(iStart));

    rows = rowStrs.length;
    if (rows == 0) {
      return ({
        rows: 0,
        cols: 0
      });
    }

    let patternData = {
      rows: rows,
      cols: 0,
      cells: new Array(rows)
    };

    for (i = rows - 1; i >= 0; i--) {
      patternData.cells[i] = rowStrs.pop();
    }

    //Find number of cols
    for (i = 0; i < rows; i++) {
      for (j = patternData.cells[i].length - 1, colCount = 0; j >= 0 && colCount == 0; j--) {
        n = hexDigits.indexOf(patternData.cells[i].substring(j, j + 1));

        if (n & 1)
          colCount = (j * 4) + 4;
        else if (n & 2)
          colCount = (j * 4) + 3;
        else if (n & 4)
          colCount = (j * 4) + 2;
        else if (n & 8)
          colCount = (j * 4) + 1;
      }

      if (colCount > patternData.cols)
        patternData.cols = colCount;
    }

    return patternData;
  }

  /**
  * Deletes a pattern from local storage.
  * @param {string} patternName Name of pattern to be deleted.
  */
  deletePatternFromLocalStorage(patternName) {
    if (typeof(Storage) !== "undefined") {
      localStorage.removeItem(App.LS_KEY_PREFIX + patternName);
    }
  }

  /**
  * Saves pattern to local storage by stringifying the patternData
  * object.  The key it is saved with is a union of a prefix
  * (same for all patterns) and the pattern name.
  * @param {obj} patternData Object containing the pattern data.
  * @param {string} patternName Name of the pattern, alpha-numeric
  *   characters only.
  */
  savePatternToLocalStorage(patternData, patternName) {
    if (typeof(Storage) !== "undefined") {
      let sStrData = JSON.stringify(patternData);
      let sKey = App.LS_KEY_PREFIX + patternName;
      localStorage.setItem(sKey, sStrData);
    }
  }

  /**
  * If local storage is supported, generates a list of all patterns
  * stored there.  Searches for all key/value pairs with specific
  * sequence in start of key name, followed by pattern name.
  * @return Array of objects, each with the following elements
  *   name - String containing name of pattern, extracted from key
  *   rows - Number of rows in the pattern
  *   cols - Number of columns in the pattern
  *   cells - Array of strings, one for each row in pattern, encoded
  *     in hexadecimal.   Not present if rows = cols = 0.
  */
  readPatternListFromLocalStorage() {
    let i, sKey, sValue, len, regexPatternName, patternObj, patternName;
    let patternList = [];

    if (typeof(Storage) !== "undefined") {
      len = localStorage.length;
      regexPatternName = new RegExp("^(" + App.LS_KEY_PREFIX + ")([a-zA-Z0-9]+)$");

      for (i = 0; i < len; ++i) {
        sKey = localStorage.key(i);

        if (regexPatternName.test(sKey)) {
          patternName = sKey.substring(App.LS_KEY_PREFIX.length);
          if ((patternObj = this.readPatternFromLocalStorage(patternName)) != null) {
            patternObj.name = patternName;
            patternList.push(patternObj);
          }
        }
      }
    }

    return patternList;
  }

  /**
  * Reads a pattern from local storage.
  * @param {string} patternName Name of the pattern, which is
  *   appended onto App.LS_KEY_PREFIX to create the local
  *   storage key for the pattern.
  * @return Object with the following elements:
  *   rows - Number of rows in the pattern
  *   cols - Number of columns in the pattern
  *   cells - Array of strings, one for each row in pattern, encoded
  *     in hexadecimal.   Not present if rows = cols = 0.
  */
  readPatternFromLocalStorage(patternName) {
    let sKey, sValue, patternObj = null;

    if (typeof(Storage) === "undefined") {
      return null;
    }

    sKey = App.LS_KEY_PREFIX + patternName;
    if ((sValue = localStorage.getItem(sKey)) == null) {
      return null;
    }

    try {
      patternObj = JSON.parse(sValue);
      if (!(patternObj.hasOwnProperty("rows") &&
            patternObj.hasOwnProperty("cols"))) {
        patternObj = null;
      }
    } catch (err) {
      patternObj = null;
    }

    return patternObj;
  }
}

export default App;
