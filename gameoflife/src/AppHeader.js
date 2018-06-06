/**
 * @fileOverview React component based object for rendering header on the page.
 * Contains app title, app info and info link, and three sections containing
 * buttons for board settings.  Board setting include board size, simulation
 * speed, and toroidal board option.
 *
 * This component has the following props:
 *
 * boardSize - Required, current board size (must be one of the 'BS_' constants).
 * boardSizeChanged - Required, function called when user clicks button to
 *   change board size.  Only called if different size selected then current
 *   one.
 * simSpeed - Required, current simulation speed (must be one of the 'SS_'
 *   constants).
 * simSpeedChanged - Required, function called when user clicks button to change
 *   simulation speed.  Only called if defferent speed selected then current one.
 * toroidalBoard - Required, current status of teroidal board option (must be one
 *   of the 'TB_' constants).
 * toroidalBoardChanged - Required, function called when user clicks button to
 *   change toroidal board option.  Only called if different setting is selected.
 *
 * @exports AppHeader
 * @author Brian Denton
 * @version 1.0
 */

import React, { Component } from 'react';
import './index.sass';

class AppHeader extends React.Component {
  //Static constants for board size
  static get BS_50x30() { return 0; };
  static get BS_75x45() { return 1; };
  static get BS_100x60() { return 2; };

  //Static constants for simulation speed
  static get SS_FAST() { return 250; };
  static get SS_MEDIUM() { return 500; };
  static get SS_SLOW() { return 1000; };

  //Static constants for toroidal board option
  static get TB_ON() { return 0; };
  static get TB_OFF() { return 1; };

  /**
  * Handler for click event of board size buttons.  If user clicked on board
  * size button that is not for current board size, then boardSizeChanged
  * function in props is called with new board size.
  * @param {obj} evt Event object for onClick event
  */
  handleBoardSizeClick = (evt) => {
    switch (evt.target.id) {
      case "bs0":
        if (this.props.boardSize != AppHeader.BS_50x30) {
          this.props.boardSizeChanged(AppHeader.BS_50x30);
        }
        break;
      case "bs1":
        if (this.props.boardSize != AppHeader.BS_75x45) {
          this.props.boardSizeChanged(AppHeader.BS_75x45);
        }
        break;
      case "bs2":
        if (this.props.boardSize != AppHeader.BS_100x60) {
          this.props.boardSizeChanged(AppHeader.BS_100x60);
        }
        break;
    }
  }

  /**
  * Handler for click event of simulation speed buttons.  If user clicked on
  * sim speed button that is not for current sim speed, then simSpeedChanged
  * function in props is called with new sim speed.
  * @param {obj} evt Event object for onClick event
  */
  handleSimSpeedClick = (evt) => {
    switch (evt.target.id) {
      case "ss0":
        if (this.props.simSpeed != AppHeader.SS_FAST) {
          this.props.simSpeedChanged(AppHeader.SS_FAST);
        }
        break;
      case "ss1":
        if (this.props.simSpeed != AppHeader.SS_MEDIUM) {
          this.props.simSpeedChanged(AppHeader.SS_MEDIUM);
        }
        break;
      case "ss2":
        if (this.props.simSpeed != AppHeader.SS_SLOW) {
          this.props.simSpeedChanged(AppHeader.SS_SLOW);
        }
        break;
    }
  }

  /**
  * Handler for click event of toroidal board option buttons.  If user
  * clicked on toroidal board button that is not for currently
  * selected value for this option, then toroidalBoardChanged function
  * in props is called with new toroidal board selection.
  * @param {obj} evt Event object for onClick event
  */
  handleToroidalBoardClick = (evt) => {
    switch (evt.target.id) {
      case "tb0":
        if (this.props.toroidalBoard != AppHeader.TB_ON) {
          this.props.toroidalBoardChanged(AppHeader.TB_ON);
        }
        break;
      case "tb1":
        if (this.props.toroidalBoard != AppHeader.TB_OFF) {
          this.props.toroidalBoardChanged(AppHeader.TB_OFF);
        }
        break;
    }
  }

  /**
  * Called by React framework whenever this component is rendered.
  * @return Rendered React elements.
  */
  render() {
    let toroidalOpsDivStyle = {
      width: "170px"
    };

    let bsBtnClasses = [
      (this.props.boardSize == AppHeader.BS_50x30) ? "btn-lit right-margin-10" : "btn-unlit right-margin-10",
      (this.props.boardSize == AppHeader.BS_75x45) ? "btn-lit right-margin-10" : "btn-unlit right-margin-10",
      (this.props.boardSize == AppHeader.BS_100x60) ? "btn-lit" : "btn-unlit"
    ];
    let ssBtnClasses = [
      (this.props.simSpeed == AppHeader.SS_FAST) ? "btn-lit right-margin-10" : "btn-unlit right-margin-10",
      (this.props.simSpeed == AppHeader.SS_MEDIUM) ? "btn-lit right-margin-10" : "btn-unlit right-margin-10",
      (this.props.simSpeed == AppHeader.SS_SLOW) ? "btn-lit" : "btn-unlit"
    ];
    let tbBtnClasses = [
      (this.props.toroidalBoard == AppHeader.TB_ON) ? "btn-lit right-margin-10" : "btn-unlit right-margin-10",
      (this.props.toroidalBoard == AppHeader.TB_OFF) ? "btn-lit" : "btn-unlit",
    ];

    return (
      <div>
        <div className="app-header">
          <div className="app-header-info">
            <div className="app-header-title">
              <h1>Game of Life</h1>
            </div>
            <p className="app-header-text">A cellular automation devised by John Conway.  To learn more <a href="https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life"  target="_blank">click here</a>.</p>
          </div>
          <div className="app-header-option-div" style={toroidalOpsDivStyle}>
            <h2>Toroidal Board:</h2>
            <input type="button" className={tbBtnClasses[0]} value="On"
              id="tb0" onClick={this.handleToroidalBoardClick}/>
            <input type="button" className={tbBtnClasses[1]} value="Off"
              id="tb1" onClick={this.handleToroidalBoardClick}/>
          </div>
          <div className="app-header-option-div">
            <h2>Simulation Speed:</h2>
            <input type="button" className={ssBtnClasses[0]} value="Fast"
              id="ss0" onClick={this.handleSimSpeedClick}/>
            <input type="button" className={ssBtnClasses[1]} value="Medium"
              id="ss1" onClick={this.handleSimSpeedClick}/>
            <input type="button" className={ssBtnClasses[2]} value="Slow"
              id="ss2" onClick={this.handleSimSpeedClick} />
          </div>
          <div className="app-header-option-div">
            <h2>Board Size:</h2>
            <input type="button" className={bsBtnClasses[0]} value="50 x 30"
              id="bs0" onClick={this.handleBoardSizeClick} />
            <input type="button" className={bsBtnClasses[1]} value="75 x 45"
              id="bs1" onClick={this.handleBoardSizeClick} />
            <input type="button" className={bsBtnClasses[2]} value="100 x 60"
              id="bs2" onClick={this.handleBoardSizeClick} />
          </div>
        </div>
      </div>
    );
  }
}

export default AppHeader;
