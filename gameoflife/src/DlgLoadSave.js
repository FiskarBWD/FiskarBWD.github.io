/**
 * @fileOverview React component for load/save pattern modal
 * dialog.
 *
 * This component has the following props:
 *
 * dlgState - Required, Indicates current mode of dialog box:
 *   DS_HIDDEN - Not Visible (nothing rendered)
 *   DS_SAVE - Save pattern dialog box rendered
 *   DS_LOAD - Load pattern dialog box rednered
 * patternList - Required, List of pattern info objects, each
 *   contains a 'name' string for name of the pattern, a rows
 *   integer and cols integer for the number of rows/cols in
 *   pattern.
 * handleCancel - Required, Function called when Cancel button
 *   in dlalog pressed (save or load mode).
 * handleSave - Required in save mode, function called when Save
 *   button in dialog pressed (save mode), contains one parameter
 *   set to the pattern name.
 * handleLoad - Required in load mode, function called when Load
 *   button in dialog pressed (load mode), contains one parameter
 *   set to the pattern name.
 * handleDelete - Required in load mode, function called when
 *   Delete button in dialog pressed (load mode), contains one
 *   parameter set to the pattern name.
 *
 * @exports DlgLoadSave
 * @author Brian Denton
 * @version 1.0
 */

import React, { Component } from 'react';
import PatternListBox from './PatternListBox.js';
import './index.sass';

class DlgLoadSave extends React.Component {
  //Static constants for dialog state
  static get DS_HIDDEN() { return 0; };
  static get DS_LOAD() { return 1; };
  static get DS_SAVE() { return 2; };

  /**
  * @constructor
  */
  constructor() {
    super();

    this.state = {
      patternName: "",
      patternSelected: -1,
      errorText: ""
    };
  }

  /**
  * Called by React framework whenever properties are received by
  * this component.  Clears state properties when hidden, so next
  * time dialog appears, form fields are blank.
  * @param {obj} nextProps Object containing all props received
  */
  componentWillReceiveProps(nextProps) {
    if (nextProps.dlgState != this.props.dlgState &&
        nextProps.dlgState == DlgLoadSave.DS_HIDDEN) {
      this.setState({
                     patternName: "",
                     patternSelected: -1,
                     errorText: ""
                    });
    }
  }

  /**
  * Called whenever name of pattern is changed.  Updates state to
  * match what is in pattern name text box.  Chars other then alpha-
  * numeric chars are filtered out.  Also limits size of pattern name.
  * @param {obj} event Javascript event object for onChange event
  */
  handlePatternNameChange = (event) => {
    let value = event.target.value.trim();
    let i, c, value2 = "";

    for (i = 0; i < value.length && value2.length < 25; i++) {
      c = value.charAt(i);
      if ((c >= 'A' && c <= "Z") || (c >= 'a' && c <= 'z') || (c >= '0' && c <= '9')) {
        value2 += c;
      }
    }

    this.setState({
      patternName: value2,
      patternSelected: -1
    });
  }

  /**
  * Called from PatternListBox when user selects a pattern in
  * this list.
  * @param {number} selectedIndex Integer index of pattern
  *   selected, top item has index 0, etc.
  */
  handlePatternSelected = (selectedIndex) => {
    let patternName = this.props.patternList[selectedIndex].name;
    this.setState({
      patternName: patternName,
      patternSelected: selectedIndex
    });
  }

  /**
  * Called when 'Save' or 'Load' buttons pressed (which are both
  * submit buttons).
  * @param {obj} event Javascript event object for onSubmit event
  */
  handleSubmit = (event) => {
    event.preventDefault();

    if (this.props.dlgState == DlgLoadSave.DS_LOAD) {
      if (this.state.patternSelected == -1) {
        this.setState({ errorText: "Please select a pattern to load from list above." });
      } else {
        this.props.handleLoad(this.state.patternName);
      }
    } else {
      if (this.state.patternName.length <= 0) {
        this.setState({ errorText: "Pattern name cannot be blank." });
      } else {
        this.props.handleSave(this.state.patternName);
      }
    }
  }

  /**
  * Called when delete button in dialog (in Load mode) is pressed.
  */
  handleDelete = () => {
    if (this.state.patternSelected != -1) {
      this.props.handleDelete(this.state.patternName);
    } else {
      this.setState({ errorText: "Please select a pattern to delete from list above." });
    }
  }

  /**
  * Called by React framework whenever this component is rendered.
  * @return Rendered React elements.
  */
  render() {
    if (this.props.dlgState == DlgLoadSave.DS_HIDDEN)
      return null;

    if (this.props.dlgState == DlgLoadSave.DS_SAVE) {
      return (
        <div className="dlg-modal-overlay">
          <form className="dlg-frame" onSubmit={this.handleSubmit}>
            <div className="dlg-title">
              <h2>Save Pattern</h2>
            </div>
            <p className="dlg-label">Saved Patterns (select one to overwrite):</p>
            <PatternListBox patternList={this.props.patternList}
                            selectedIndex={this.state.patternSelected}
                            handleSelected={this.handlePatternSelected}
                            listBoxHeight="360px"/>
            <p className="dlg-label">Pattern name (max 25 characters):</p>
            <input className="dlg-input"
              name="name" type="text" value={this.state.patternName}
              onChange={this.handlePatternNameChange} />
            <div style={{ width: "100%", margin: "0", "margin-bottom": "10px", "text-align": "center"}} >
              <p className="dlg-error-txt">{this.state.errorText}</p>
            </div>
            <div className="dlg-btn-row" style={{"width": "170px"}}>
              <input type="submit" className="btn-unlit" value="Save" />
              <input type="button" className="btn-unlit" value="Cancel"
                onClick={this.props.handleCancel} />
            </div>
          </form>
        </div>
      );
    } else {
      return (
        <div className="dlg-modal-overlay">
          <form className="dlg-frame" onSubmit={this.handleSubmit}>
            <div className="dlg-title">
              <h2>Load Pattern</h2>
            </div>
            <PatternListBox patternList={this.props.patternList}
                            selectedIndex={this.state.patternSelected}
                            handleSelected={this.handlePatternSelected}
                            listBoxHeight="435px" />
            <div style={{ width: "100%", margin: "0", "margin-bottom": "10px", "text-align": "center"}} >
              <p className="dlg-error-txt">{this.state.errorText}</p>
            </div>
            <div className="dlg-btn-row" style={{"width": "260px"}}>
              <input type="submit" className="btn-unlit" value="Load" />
              <input type="button" className="btn-unlit" value="Delete"
                onClick={this.handleDelete} />
              <input type="button" className="btn-unlit" value="Cancel"
                onClick={this.props.handleCancel} />
            </div>
          </form>
        </div>
      );
    }
  }
}

export default DlgLoadSave
