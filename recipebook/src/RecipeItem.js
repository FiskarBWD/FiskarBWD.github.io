/**
 * @fileOverview React component based object for rendering a single recipe as
 * part of a larger list of recipes shown on the main app page.  The component
 * shows a strip with a gradient background, and containing the name and
 * description of the recipe.  The user can click this component to view the
 * recipe.
 *
 * This component has the following props:
 *
 * name - Required, single line name (string) of the recipe
 * description - Required, single line brief description of the recipe
 * onClickView - Required, function called if this component is clicked.  This
 *    function has to parameters or return value.
 *
 * @exports RecipeItem
 * @author Brian Denton
 * @version 1.0
 */

import React, { Component } from 'react';
import './App.sass';
import './RecipeItem.sass';

class RecipeItem extends React.Component {
  /**
  * Called by React framework whenever this component is rendered.
  * @return Rendered React elements.
  */
  render() {
    return (
      <div className="recipe-item-outer">
        <a className="recipe-item" href="#" onClick={this.props.onClickView}>
          <p className="recipe-item-name">{this.props.name}</p>
          <p className="recipe-item-desc">{this.props.description}</p>
        </a>
        <div className="clear-floats"></div>
      </div>
    );
  }
}

export default RecipeItem;
