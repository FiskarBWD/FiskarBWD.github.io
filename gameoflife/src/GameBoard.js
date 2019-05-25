/**
 * @fileOverview React component based object for rendering game of
 * life board.  Contains frame around grid of cells.  Each cell is a
 * colored square with black (dead) or non-black (alive) soiid
 * background.  Above cell grid is a row of buttons (run, pause,
 * clear, seed, save, load, export, and import).
 *
 * This component has the following props:
 *
 * cells - Required, 2D Array of booleans, each true if cell is alive,
 *   flase if not.
 * rows - Required, Number of rows of cells.
 * cols - Required, Number of columns of cells.
 * cellSize - Required, Cell width/height in pixels
 * simRunning - Required, boolean, true if sim is running (Run button
 *   lit) or false if not (Pause button lit).
 * generation - Required, currnet integer generation of the sim.
 * boardCursorVisible - True if board cursor is visible, falst if not
 * boardCursorRow - Cell row of board cursor
 * boardCursorCol - Cell column of board cursor
 * boardCursorRows - Number of rows high the cursor is
 * boardCursorCols - Number of columns wide the cursor is
 * handleCellClick - Required, handler for user click on any cell, has
 *   row and col parameters.
 * handleRunClick - Required, handler for user click of Run button
 * handlePauseClick - Required, handler for user click of Pause button
 * handleClearClick - Required, handler for user click of Clear button
 * handleSeedClick - Required, handler for user click of Seed button
 * handleSaveClick - Required, handler for user clock of Save button
 * handleLoadClick - Required, handler for user click of Load button
 * handleExportClick - Required, handler for user click of Export button
 * handleImportClick - Required, handler for user click of Import button
 *
 * @exports GameBoard
 * @author Brian Denton
 * @version 1.0
 */

import React, { Component } from 'react';
import App from './App.js';
import Cell from './Cell.js';
import './index.sass';

class GameBoard extends React.Component {
  /**
  * Called by React framework whenever this component is rendered.
  * @return Rendered React elements.
  */
  render() {
    let row, col, wBoard, hBoard;
    let cells = new Array();

    let runPauseBtnClasses = [
      (this.props.simRunning) ? "btn-lit" : "btn-unlit",
      (!this.props.simRunning) ? "btn-lit" : "btn-unlit"
    ];

    wBoard = (this.props.cols * (this.props.cellSize + 2)) + 2;
    hBoard = (this.props.rows * (this.props.cellSize + 2)) + 2;

    let boardStyle = {
      width: wBoard + "px",
      height: hBoard + "px"
    }

    let bcStyle = {
      left: (1 + (this.props.boardCursorCol * (this.props.cellSize + 2))) + "px",
      top: (1 + (this.props.boardCursorRow * (this.props.cellSize + 2))) + "px",
      width: ((this.props.cellSize + 2) * this.props.boardCursorCols) + "px",
      height: ((this.props.cellSize + 2) * this.props.boardCursorRows) + "px"
    }

    for (row = 0; row < this.props.rows % 61; row++) {
      for (col = 0; col < this.props.cols % 101; col++) {
        cells.push(<Cell
          row={row}
          col={col}
          x={2 + (col * (this.props.cellSize + 2))}
          y={2 + (row * (this.props.cellSize + 2))}
          cellSize={this.props.cellSize}
          cellID={"R" + row + "C" + col}
          alive={this.props.cells[row][col]}
          handleClick={this.props.handleCellClick}
        />);
      }
    }

    return (
      <div className="board-frame">
        <div className="boardBtnsRow">
          <input type="button" className={runPauseBtnClasses[0]}
            value="Run" onClick={this.props.handleRunClick} />
          <input type="button" className={runPauseBtnClasses[1]}
            value="Pause" onClick={this.props.handlePauseClick} />
          <input type="button" className="btn-unlit"
            value="Clear" onClick={this.props.handleClearClick} />
          <input type="button" className="btn-unlit"
            value="Seed" onClick={this.props.handleSeedClick} />
          <input type="button" className="btn-unlit"
            value="Save" onClick={this.props.handleSaveClick} />
          <input type="button" className="btn-unlit"
            value="Load" onClick={this.props.handleLoadClick} />
          <input type="button" className="btn-unlit"
            value="Export" onClick={this.props.handleExportClick} />
          <input type="button" className="btn-unlit" value="Import"
            onClick={this.props.handleImportClick} />
        </div>
        <div className="boardGenerationsRow">
          <h2>Generation: {this.props.generation}</h2>
        </div>
        <div className="board" style={boardStyle}>
          { this.props.boardCursorVisible &&
            <div className="board-cursor" style={bcStyle} />
          }
          {cells}
        </div>
      </div>
    );
  }
}

export default GameBoard;
