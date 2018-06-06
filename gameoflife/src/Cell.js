/**
 * @fileOverview React component based object for rendering game of
 * life cell.  Each cell is a colored square with black (dead) or
 * non-black (alive) soiid background.  Cell can be clicked to toggle
 * its alive/dead status.
 *
 * This component has the following props:
 *
 * alive - Required, boolean, true if alive, false if dead
 * x - Position, offset in px from left edge of board
 * y - Position, offset in px from top edge of board
 * row - Required, integer row cell is in, numbered top (0) to bottom.
 * col - Required, integer column cell is in, numbered left (0) to
 *    right.
 * cellSize - Required, integer width/height of cell in pixels.
 * cellID - Unique ID for this cell
 * handleClick - Required, function called if this cell is clicked,
 *    has two parameters (row and col) set to above values, no return
 *    value.
 *
 * @exports Cell
 * @author Brian Denton
 * @version 1.0
 */

import React, { Component } from 'react';
import './index.sass';

class Cell extends React.Component {
 /**
  * Handler for click event on cell, calls props.handleClick,
  * passing it props.row and props.col.
  */
  handleClick = () => {
    this.props.handleClick(this.props.row, this.props.col);
  }

 /**
  * Called by React framework whenever this component is rendered.
  * @return Rendered React elements.
  */
  render() {
    let cellStyle = {
      left: this.props.x + "px",
      top: this.props.y + "px",
      width: this.props.cellSize + "px",
      height: this.props.cellSize + "px"
    };
    var cellClass = (this.props.alive) ? "cell-alive" : "cell-dead";
    return (
      <div className={cellClass} style={cellStyle}
           onClick={this.handleClick} id={this.props.cellID}>
      </div>
    );
  }
}

export default Cell;
