/**
 * @fileOverview React component for import dialog.
 *
 * This component has the following props:
 *
 * dlgState - Required, Indicates current mode of dialog box:
 *   DS_HIDDEN - Not Visible (nothing rendered)
 *   DS_VISIBLE - Export pattern dialog box rendered
 * handleCancel - Required, function called when Cancel button
 *   in dialog pressed.
 * handleImport - Required, function called when Import button
 *   in dialog pressed, contains one parameter set
 *   to the pattern hex string in the dialog textarea.
 *
 * @exports DlgImport
 * @author Brian Denton
 * @version 1.0
 */

import React, { Component } from 'react';

class DlgImport extends React.Component {
  //Static constants for dialog state
  static get DS_HIDDEN() { return 0; };
  static get DS_VISIBLE() { return 1; };

  /**
  * @constructor
  */
  constructor() {
    super();

    this.state = {
      patternHex: ""
    };
  }

 /**
  * Called by React framework whenever properties are received by
  * this component.  Clears state properties when hidden, so next
  * time dialog appears, textarea is blank.
  * @param {obj} nextProps Object containing all props received
  */
  componentWillReceiveProps(nextProps) {
    if (nextProps.dlgState != this.props.dlgState &&
        nextProps.dlgState == DlgImport.DS_HIDDEN) {
      this.setState({
                     patternHex: "",
                    });
    }
  }

  /**
  * Called whenever pattern hex in text area is changed.  Updates state
  * to match what is in text area.  Chars other then alpha-numeric
  * and cr/lf chars are filtered out.
  * @param {obj} event Javascript event object for onChange event
  */
  handlePatternHexChange = (event) => {
    let value = event.target.value.trim();
    let i, c, value2 = "";

    for (i = 0; i < value.length; i++) {
      c = value.charAt(i);
      if ((c >= '0' && c <= "9") ||
          (c >= 'A' && c <= 'F') ||
          c == '\r' || c == '\n') {
        value2 += c;
      }
    }

    this.setState({
      patternHex: value2
    });
  }

  /**
  * Called when Import button is pressed.  Passes value in
  * state.patternHex to this.props.handleImport().
  */
  handleImport = () => {
    this.props.handleImport(this.state.patternHex);
  }

  /**
  * Called by React framework whenever this component is rendered.
  * @return Rendered React elements.
  */
  render() {
    if (this.props.dlgState == DlgImport.DS_HIDDEN)
      return null;

    return (
      <div className="dlg-modal-overlay">
        <div className="dlg-frame">
          <div className="dlg-title">
            <h2>Import Pattern</h2>
          </div>
          <p className="dlg-label" style={{"text-align": "justify", "margin-bottom": "10px"}}>If you are the recipient of an email/text containing pattern hexadecimal text, use this dialog to import the pattern into this site.  Paste the hexadecimal text into the textarea below, then press the Import button.</p>
          <textarea className="dlg-textarea" onChange={this.handlePatternHexChange}
            value={this.state.patternHex} />
          <div className="dlg-btn-row" style={{ width: "170px" }}>
            <input type="button" className="btn-unlit" value="Import"
              onClick={this.handleImport} />
            <input type="button" className="btn-unlit" value="Cancel"
              onClick={this.props.handleCancel} />
          </div>
        </div>
      </div>
    );
  }
}

export default DlgImport;
