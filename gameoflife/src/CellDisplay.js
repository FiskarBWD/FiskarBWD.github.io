/**
 * @fileOverview React component for showing a grid of square cells.
 * The cellSize, pattern row/col count, and row/col count of the
 * entire display are included as props, so the pattern is centered
 * in the display.  Only live cells are rendered.
 *
 * This component has the following props:
 *
 * cells - Required, 2D array of booleans, each true if cell is alive,
 *   flase if not.  Contains cells for bounding rectangle of pattern
 *   only.  Size of this bounding rectangle defined by rows/cols.
 * rows - Required, Number of rows of cells in pattern.
 * cols - Required, Number of columns of cells in pattern.
 * cellSize - Required, Cell width/height in pixels
 * dispRowCount - Number of rows of cells in display
 * dispColCount - Number of columns of cells in display
 * idStr - String used as prefix for cell IDs
 */

import React, { Component } from 'react';
import Cell from './Cell.js';
import './index.sass';

class CellDisplay extends React.Component {
 /**
  * Called by React framework whenever this component is rendered.
  * @return Rendered React elements.
  */
  render() {
    let row, col;
    let divHeight = Math.round(((this.props.cellSize + 2) * this.props.dispRowCount) + 2);
    let cdStyle = {
                    width: (((this.props.cellSize + 2) * this.props.dispColCount) + 2) + "px",
                    height: divHeight + "px",
                    margin: "0px auto"
                  };
    let cells = new Array();
    let yTop = 2 + Math.floor(((this.props.dispRowCount - this.props.rows) / 2) * (this.props.cellSize + 2));
    let xLeft = 2 + Math.floor(((this.props.dispColCount - this.props.cols) / 2) * (this.props.cellSize + 2));

    for (row = 0; row < this.props.rows; row++) {
      for (col = 0; col < this.props.cols; col++) {
        if (!this.props.cells[row][col])
          continue;

        cells.push(<Cell
          row={row} 
          col={col}
          x={xLeft + (col * (this.props.cellSize + 2))}
          y={yTop + (row * (this.props.cellSize + 2))}
          cellSize={this.props.cellSize}
          cellID={this.props.idStr + "R" + row + "C" + col}
          alive={this.props.cells[row][col]}
        />);
      }
    }

    return (
      <div className="board" style={cdStyle}>
        {cells}
      </div>
    );
  }
}

export default CellDisplay;
