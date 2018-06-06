/**
 * @fileOverview React component for basic listbox for
 * listing and selecting patterns.
 *
 * This component has the following props:
 *
 * patternList - Required, List of pattern info objects, each
 *   contains a 'name' string for name of the pattern, a rows
 *   integer and cols integer for the number of rows/cols in
 *   pattern.
 * selectedIndex - Required, Integer indiating which pattern in
 *   list is currently selected (-1 if none).
 * listBoxHeight - Height of list box (including frame).
 * handleSelected - Rquired, called when item in list is selected.
 *   Has one parameter set to index of selected item.
 *
 * @exports PatternListBox
 * @author Brian Denton
 * @version 1.0
 */

import React, { Component } from 'react';
import './index.sass';

class PatternListBox extends React.Component {
  /**
  * Called when user clicks on item in pattern list, selecting it
  * from the list.
  * @param {obj} event Javascript event for onClick event.
  */
  handleItemClick = (event) => {
    let itemIndex = parseInt(event.target.id.substring(4));
    this.props.handleSelected(itemIndex);
  }

  /**
  * Called by React framework whenever this component is rendered.
  * @return Rendered React elements.
  */
  render() {
    let i, sId1, sId2, sId3, sRowsCols, patterns = [], itemClass;
    let listStyle = { height: this.props.listBoxHeight };

    for (i = 0; i < this.props.patternList.length; i++) {
      sId1 = "plbb" + i;
      sId2 = "plbl" + i;
      sId3 = "plbr" + i;
      sRowsCols = this.props.patternList[i].rows + " row(s), " +
                  this.props.patternList[i].cols + " column(s)";
      itemClass = (i == this.props.selectedIndex) ? "plb-entry plb-selected" : "plb-entry";
      patterns.push(
        <div className={itemClass} id={sId1} onClick={this.handleItemClick}>
          <p className="plb-pattern-name" id={sId2}>{this.props.patternList[i].name}</p>
          <p className="plb-pattern-rows-cols" id={sId3}>{sRowsCols}</p>
        </div>
      );
    }

    return (
      <div className="plb-frame" style={listStyle}>
        {patterns}
      </div>
    );
  }
}

export default PatternListBox;
