/**
 * @fileOverview React component for export dialog.
 *
 * This component has the following props:
 *
 * dlgState - Required, Indicates current mode of dialog box:
 *   DS_HIDDEN - Not Visible (nothing rendered)
 *   DS_VISIBLE - Export pattern dialog box rendered
 * patternHex - Required, string containing hex version of cell
 *   data, each hex digit representing four cells.  Each row of
 *   the pattern is sepatated by a cr/lf.
 * handleDone - Required, function called when user presses 'Done'
 *   button in dialog.
 *
 * @exports DlgExport
 * @author Brian Denton
 * @version 1.0
 */

import React, { Component } from 'react';

class DlgExport extends React.Component {
  //Static constants for dialog state
  static get DS_HIDDEN() { return 0; };
  static get DS_VISIBLE() { return 1; };

  /**
  * Called by React framework whenever this component is rendered.
  * @return Rendered React elements.
  */
  render() {
    if (this.props.dlgState == DlgExport.DS_HIDDEN)
      return null;

    return (
      <div className="dlg-modal-overlay">
        <div className="dlg-frame">
          <div className="dlg-title">
            <h2>Export Pattern</h2>
          </div>
          <p className="dlg-label" style={{"text-align": "justify", "margin-bottom": "10px"}}>Use this dialog to share a pattern with others.  Copy the hexadecimal text in the textarea below and paste it into an email or text.  Recipient can then use this text with the Import feature of this site.</p>
          <textarea className="dlg-textarea" readOnly={true}
            value={this.props.patternHex} />
          <div className="dlg-btn-row" style={{ width: "80px" }}>
            <input type="button" className="btn-unlit" value="Done"
              onClick={this.props.handleDone} />
          </div>
        </div>
      </div>
    );
  }
}

export default DlgExport;
