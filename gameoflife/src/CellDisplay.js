/**
 * @fileOverview React component for showing a grid of square cells.
 * The div size, cell size, pattern row/col count, and array of bools for
 * the cells are included as props, so the pattern is centered in the
 * display.  Only live cells are rendered.  This is used in the pattern
 * selector (left side of main screen) and pattern selection dialog.
 *
 * This component has the following props:
 *
 * divWidth  - Width of div, integer count in px
 * divHeight - Height of div, integer count in px
 * cells - Required, 2D array of booleans, each true if cell is alive,
 *   false if not.  Contains cells for bounding rectangle of pattern
 *   only.  Size of this bounding rectangle defined by rows/cols.
 * rows - Required, Number of rows of cells in pattern.
 * cols - Required, Number of columns of cells in pattern.
 * cellSize - Required, integer cell width/height in pixels
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
    let cdStyle = {
                    "min-width": this.props.divWidth + "px",
                    "min-height": this.props.divHeight + "px",
                    width: this.props.divWidth + "px",
                    height: this.props.divHeight + "px"
                  };
    let cells = new Array();
    let pxHeight = (this.props.rows * (this.props.cellSize + 2)) - 2;
    let yTop = Math.floor((this.props.divHeight - pxHeight) / 2);
    let pxWidth = (this.props.cols * (this.props.cellSize + 2)) - 2;
    let xLeft = Math.floor((this.props.divWidth - pxWidth) / 2);

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
