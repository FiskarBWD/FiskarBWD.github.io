/**
 * @fileOverview React component based object for rendering header on the page.
 * Contains app title and 'new recipe' button.
 *
 * This component has the following props:
 *
 * newRecipe - Required, function called when 'new recipe' button is pressed.
 *   This function has no parameters or return value.
 *
 * @exports AppHeader
 * @author Brian Denton
 * @version 1.0
 */

import React, { Component } from 'react';
import './App.sass';

class AppHeader extends React.Component {
  /**
  * Called by React framework whenever this component is rendered.
  * @return Rendered React elements.
  */
  render() {
    return (
      <div>
        <div className="app-header">
          <div className="app-header-title">
            <h1>Recipe Book</h1>
          </div>
          <div className="app-header-new-btns-div">
            <input type="button" className="btn" value="New Recipe"
              onClick={this.props.newRecipe} />
          </div>
        </div>
        <div className="clear-floats"></div>
      </div>
    );
  }
}

export default AppHeader;
