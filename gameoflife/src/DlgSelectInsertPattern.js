/**
 * @fileOverview React component for selecting a pattern to place
 * in the game board.
 *
 * This component has the following props:
 *
 * dlgState - Required, Indicates current mode of dialog box:
 *   DS_HIDDEN - Not Visible (nothing rendered)
 *   DS_VISIBLE - Save pattern dialog box rendered
 * patternID - Required, ID assigned to the pattern
 * handleCancel - Required, Function called when Cancel button
 *   in dlalog pressed (save or load mode).
 * handleSelect - Required, function called when Insert button
 *   in dialog pressed, contains one parameter which returns an
 *   object with the following fields for selected pattern:
 *
 *   rows - Integer number of rows in pattern
 *   cols - Integer number of columns in pattern
 *   cells - 2D array of bools, each element is either true (cell
 *     is alive) or false (cell is dead).  Size: [rows][cols].
 *   cellSize - Size of a cell in pixels, set to fit patter in 210 x 210
 *     space.
 *   dispRowCount - Number of rows in 210 x 210 area
 *   dispColCount - Number of columns in 210 x 210 area
 *   patternID - ID assigned to selected pattern
 *
 * @exports DlgLoadSave
 * @author Brian Denton
 * @version 1.0
 */

import React, { Component } from 'react';
import PatternListBox from './PatternListBox.js';
import CellDisplay from './CellDisplay.js';
import './index.sass';

class DlgSelectInsertPattern extends React.Component {
  //Static constants for dialog state
  static get DS_HIDDEN() { return 0; };
  static get DS_VISIBLE() { return 1; };

  /**
  * @constructor
  */
  constructor() {
    super();

    this.patternInfo = [
      { //Single cell
        rows: 1,
        cols: 1,
        cells: [ [true] ],
        cellSize: 27,
        dispRowCount: 7,
        dispColCount: 7
      },
      { //Block
        rows: 2,
        cols: 2,
        cells: [ [true, true],
                 [true, true] ],
        cellSize: 24,
        dispRowCount: 8,
        dispColCount: 8
      },
      { //Blinker 1
        rows: 1,
        cols: 3,
        cells: [ [true, true, true] ],
        cellSize: 27,
        dispRowCount: 7,
        dispColCount: 7
      },
      { //Blinker 2
        rows: 3,
        cols: 1,
        cells: [ [true],
                 [true],
                 [true] ],
        cellSize: 27,
        dispRowCount: 7,
        dispColCount: 7
      },
      { //Tub
        rows: 3,
        cols: 3,
        cells: [ [false, true,  false],
                 [true,  false, true ],
                 [false, true,  false] ],
        cellSize: 27,
        dispRowCount: 7,
        dispColCount: 7
      },
      { //Boat 1
        rows: 3,
        cols: 3,
        cells: [ [true,  true,  false],
                 [true,  false, true ],
                 [false, true,  false] ],
        cellSize: 27,
        dispRowCount: 7,
        dispColCount: 7
      },
      { //Boat 2
        rows: 3,
        cols: 3,
        cells: [ [false, true,  false],
                 [true,  false, true ],
                 [false, true,  true ] ],
        cellSize: 27,
        dispRowCount: 7,
        dispColCount: 7
      },
      { //Glider 1
        rows: 3,
        cols: 3,
        cells: [ [false, true,  false],
                 [false, false, true ],
                 [true,  true,  true ] ],
        cellSize: 27,
        dispRowCount: 7,
        dispColCount: 7
      },
      { //Glider 2
        rows: 3,
        cols: 3,
        cells: [ [true,  false, false],
                 [true,  false, true ],
                 [true,  true,  false] ],
        cellSize: 27,
        dispRowCount: 7,
        dispColCount: 7
      },
      { //Glider 3
        rows: 3,
        cols: 3,
        cells: [ [true,  true,  true ],
                 [true,  false, false],
                 [false, true , false] ],
        cellSize: 27,
        dispRowCount: 7,
        dispColCount: 7
      },
      { //Glider 4
        rows: 3,
        cols: 3,
        cells: [ [false, true,  true ],
                 [true,  false, true ],
                 [false, false ,true ] ],
        cellSize: 27,
        dispRowCount: 7,
        dispColCount: 7
      },
      { //Beehive 1
        rows: 3,
        cols: 4,
        cells: [ [false, true,  true,  false],
                 [true,  false, false, true ],
                 [false, true,  true,  false] ],
        cellSize: 24,
        dispRowCount: 7,
        dispColCount: 8
      },
      { //Beehive 2
        rows: 4,
        cols: 3,
        cells: [ [false, true,  false],
                 [true,  false, true ],
                 [true,  false, true ],
                 [false, true,  false] ],
        cellSize: 24,
        dispRowCount: 8,
        dispColCount: 7
      },
      { //Loaf 1
        rows: 4,
        cols: 4,
        cells: [ [false, true,  true,  false ],
                 [true,  false, false, true  ],
                 [true,  false, true,  false ],
                 [false, true,  false, false ] ],
        cellSize: 24,
        dispRowCount: 8,
        dispColCount: 8
      },
      { //Loaf 2
        rows: 4,
        cols: 4,
        cells: [ [false, false,  true, false ],
                 [false, true,  false, true  ],
                 [true,  false, false, true  ],
                 [false, true,  true,  false ] ],
        cellSize: 24,
        dispRowCount: 8,
        dispColCount: 8
      },
      { //Toad 1
        rows: 4,
        cols: 4,
        cells: [ [false, false, true,  false ],
                 [true,  false, false, true  ],
                 [true,  false, false, true  ],
                 [false, true,  false, false ] ],
        cellSize: 24,
        dispRowCount: 8,
        dispColCount: 8
      },
      { //Toad 2
        rows: 4,
        cols: 4,
        cells: [ [false, true,  true,  false ],
                 [false, false, false, true  ],
                 [true,  false, false, false ],
                 [false, true,  true,  false ] ],
        cellSize: 24,
        dispRowCount: 8,
        dispColCount: 8
      },
      { //Beacon 1
        rows: 4,
        cols: 4,
        cells: [ [true,  true,  false, false ],
                 [true,  false, false, false ],
                 [false, false, false, true  ],
                 [false, false, true,  true  ] ],
        cellSize: 24,
        dispRowCount: 8,
        dispColCount: 8
      },
      { //Beacon 2
        rows: 4,
        cols: 4,
        cells: [ [false, false, true,  true  ],
                 [false, false, false, true  ],
                 [true,  false, false, false ],
                 [true,  true,  false, false ] ],
        cellSize: 24,
        dispRowCount: 8,
        dispColCount: 8
      },
      { //Lightweidht Spaceshp 1
        rows: 4,
        cols: 5,
        cells: [ [false, true,  true,  true,  true  ],
                 [true,  false, false, false, true  ],
                 [false, false, false, false, true  ],
                 [true,  false, false, true,  false ] ],
        cellSize: 21,
        dispRowCount: 8,
        dispColCount: 9
      },
      { //Lightweidht Spaceshp 2
        rows: 5,
        cols: 4,
        cells: [ [true,  false, true,  false ],
                 [false, false, false, true  ],
                 [false, false, false, true  ],
                 [true,  false, false, true  ],
                 [false, true,  true,  true  ] ],
        cellSize: 21,
        dispRowCount: 9,
        dispColCount: 8
      },
      { //Lightweidht Spaceshp 3
        rows: 4,
        cols: 5,
        cells: [ [false, true,  false, false, true  ],
                 [true,  false, false, false, false ],
                 [true,  false, false, false, true  ],
                 [true,  true,  true,  true,  false ] ],
        cellSize: 21,
        dispRowCount: 8,
        dispColCount: 9
      },
      { //Lightweidht Spaceshp 4
        rows: 5,
        cols: 4,
        cells: [ [true,  true,  true,  false ],
                 [true,  false, false, true  ],
                 [true,  false, false, false ],
                 [true,  false, false, false ],
                 [false, true,  false, true  ] ],
        cellSize: 21,
        dispRowCount: 9,
        dispColCount: 8
      },
      {//Pentadecathlon 1
        rows: 10,
        cols: 3,
        cells: [ [false, true,  false ],
                 [false, true,  false ],
                 [true,  false, true  ],
                 [false, true,  false ],
                 [false, true,  false ],
                 [false, true,  false ],
                 [false, true,  false ],
                 [true,  false, true  ],
                 [false, true,  false ],
                 [false, true,  false ] ],
        cellSize: 15,
        dispRowCount: 10,
        dispColCount: 11
      },
      {//Pentadecathlon 1
        rows: 3,
        cols: 10,
        cells: [ [false, false, true,  false, false, false, false, true,  false, false ],
                 [true,  true,  false, true,  true,  true,  true,  false, true,  true  ],
                 [false, false, true,  false, false, false, false, true,  false, false ] ],
        cellSize: 15,
        dispRowCount: 11,
        dispColCount: 10
      },
      {//Gosper glider gun
        rows: 9,
        cols: 36,
        cells: [ [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, true,  false, false, false, false, false, false, false, false, false, false, false ],
                 [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, true , false, true,  false, false, false, false, false, false, false, false, false, false, false ],
                 [false, false, false, false, false, false, false, false, false, false, false, false, true,  true,  false, false, false, false, false, false, true,  true,  false, false, false, false, false, false, false, false, false, false, false, false, true,  true  ],
                 [false, false, false, false, false, false, false, false, false, false, false, true,  false, false, false, true,  false, false, false, false, true,  true,  false, false, false, false, false, false, false, false, false, false, false, false, true,  true  ],
                 [true,  true,  false, false, false, false, false, false, false, false, true,  false, false, false, false, false, true,  false, false, false, true,  true,  false, false, false, false, false, false, false, false, false, false, false, false, false, false ],
                 [true,  true,  false, false, false, false, false, false, false, false, true,  false, false, false, true,  false, true,  true,  false, false, false, false, true,  false, true,  false, false, false, false, false, false, false, false, false, false, false ],
                 [false, false, false, false, false, false, false, false, false, false, true,  false, false, false, false, false, true,  false, false, false, false, false, false, false, true,  false, false, false, false, false, false, false, false, false, false, false ],
                 [false, false, false, false, false, false, false, false, false, false, false, true,  false, false, false, true,  false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false ],
                 [false, false, false, false, false, false, false, false, false, false, false, false, true,  true,  false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false ] ],
        cellSize: 4,
        dispRowCount: 9,
        dispColCount: 36
      }
    ];

    this.patternListBoxInfo = [
      {
        name: "Single Cell",
        rows: 1,
        cols: 1
      },
      {
        name: "Block",
        rows: 2,
        cols: 2
      },
      {
        name: "Blinker 1",
        rows: 1,
        cols: 3
      },
      {
        name: "Blinker 2",
        rows: 3,
        cols: 1
      },
      {
        name: "Tub",
        rows: 3,
        cols: 3
      },
      {
        name: "Boat 1",
        rows: 3,
        cols: 3
      },
      {
        name: "Boat 2",
        rows: 3,
        cols: 3
      },
      {
        name: "Glider 1",
        rows: 3,
        cols: 3
      },
      {
        name: "Glider 2",
        rows: 3,
        cols: 3
      },
      {
        name: "Glider 3",
        rows: 3,
        cols: 3
      },
      {
        name: "Glider 4",
        rows: 3,
        cols: 3
      },
      {
        name: "Behive 1",
        rows: 3,
        cols: 4
      },
      {
        name: "Behive 2",
        rows: 4,
        cols: 3
      },
      {
        name: "Loaf 1",
        rows: 4,
        cols: 4
      },
      {
        name: "Loaf 2",
        rows: 4,
        cols: 4
      },
      {
        name: "Toad 1",
        rows: 4,
        cols: 4
      },
      {
        name: "Toad 2",
        rows: 4,
        cols: 4
      },
      {
        name: "Beacon 1",
        rows: 4,
        cols: 4
      },
      {
        name: "Beacon 2",
        rows: 4,
        cols: 4
      },
      {
        name: "Lightweight Spaceship 1",
        rows: 4,
        cols: 5
      },
      {
        name: "Lightweight Spaceship 2",
        rows: 5,
        cols: 4
      },
      {
        name: "Lightweight Spaceship 3",
        rows: 4,
        cols: 5
      },
      {
        name: "Lightweight Spaceship 4",
        rows: 5,
        cols: 4
      },
      {
        name: "Pentadecathlon 1",
        rows: 8,
        cols: 3
      },
      {
        name: "Pentadecathlon 2",
        rows: 3,
        cols: 8
      },
      {
        name: "Gosper Glider Gun",
        rows: 9,
        cols: 36
      }
    ];

    this.state = {
      patternSelected: -1,
    };
  }

  /**
  * Called by React framework whenever properties are received by
  * this component.  If switching from hidden to visible, sets
  * state.patternSelected to this.props.patternID.
  * @param {obj} nextProps Object containing all props received
  */
  componentWillReceiveProps(nextProps) {
    if (nextProps.dlgState != this.props.dlgState &&
        nextProps.dlgState == DlgSelectInsertPattern.DS_VISIBLE) {
      this.setState({
                     patternSelected: this.props.patternID
                    });
    }
  }

  /**
  * Called from PatternListBox when user selects a pattern in
  * this list.
  * @param {number} selectedIndex Integer index of pattern
  *   selected, top item has index 0, etc.
  */
  handlePatternSelectedInList = (selectedIndex) => {
    this.setState({
      patternSelected: selectedIndex
    });
  }

  /**
  * Called when user presses the Select button in dialog.
  */
  handleSelect = () => {
    let i;
    let iPattern = this.state.patternSelected;
    let rows = this.patternInfo[iPattern].rows;
    let cellsCopy = new Array(rows);

    for (i = 0; i < rows; i++)
      cellsCopy[i] = this.patternInfo[iPattern].cells[i].slice();

    this.props.handleSelect({
      rows: rows,
      cols: this.patternInfo[iPattern].cols,
      cells: cellsCopy,
      cellSize: this.patternInfo[iPattern].cellSize,
      dispRowCount: this.patternInfo[iPattern].dispRowCount,
      dispColCount: this.patternInfo[iPattern].dispColCount,
      patternID: iPattern
    });
  }

  /**
  * Called by React framework whenever this component is rendered.
  * @return Rendered React elements.
  */
  render() {
    if (this.props.dlgState == DlgSelectInsertPattern.DS_HIDDEN)
      return null;

    return (
      <div className="dlg-modal-overlay">
        <div className="dlg-frame" onSubmit={this.handleSubmit}>
          <div className="dlg-title">
            <h2>Select Pattern</h2>
          </div>
          <div className="insertPatternDisp" style={{"margin-bottom": "10px", "margin-right": "10px", "margin-left": "10px"}}>
            <CellDisplay divWidth="580" divHeight="210"
                         rows={this.patternInfo[this.state.patternSelected].rows}
                         cols={this.patternInfo[this.state.patternSelected].cols}
                         cells={this.patternInfo[this.state.patternSelected].cells}
                         cellSize={this.patternInfo[this.state.patternSelected].cellSize}
                         idStr={"insPatDlgDisp"}
            />
          </div>
          <PatternListBox patternList={this.patternListBoxInfo}
            selectedIndex={this.state.patternSelected}
            handleSelected={this.handlePatternSelectedInList}
            listBoxHeight="240px"/>
          <div className="dlg-btn-row" style={{"width": "170px"}}>
            <input type="button" className="btn-unlit" value="Select"
              onClick={this.handleSelect} />
            <input type="button" className="btn-unlit" value="Cancel"
              onClick={this.props.handleCancel} />
          </div>
        </div>
      </div>
    );
  }
}

export default DlgSelectInsertPattern
