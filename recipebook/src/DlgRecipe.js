/**
 * @fileOverview React component based object for rendering modal recipe dialog.
 * This dialog has four modes (or states):
 *
 * DS_HIDDEN - This dialog is not visible (nothing is rendered).
 * DS_VIEW_RECIPE - Dialog is visible and shows recipe data, but this data is
 *    not editable.
 * DS_EDIT_RECIPE - Dialog is visible and shows recipe data inside a form, so
 *    recipe data is editable.
 * DS_CREATE_RECIPE - Same as DS_EDIT_RECIPE, except no existing recipe data is
 *    shown (all fields blank until values are entered via form controls).
 *
 * These values are defined as static constant members of this object for use
 * with props.dlgState.
 *
 * This component has the following props:
 *
 * dlgState - Required, current state for dialog (see above).  If DS_VIEW_RECIPE
 *    then contents of name, description, ingredients, and directions are stored
 *    in this compenent's state.  If DS_HIDDEN, then component's state is
 *    cleared.  If DS_VIEW_RECIPE or DS_EDIT_RECIPE, then recipe info in
 *    state is displayed next time dialog is rendered.  Updates entered during
 *    DS_EDIT_RECIPE via dialog controls are also applied to info in state.
 * name - Recipe name, required if dlgState is DS_VIEW_RECIPE (string)
 * description - Brief, single-line description of recipe (string).  Required if
 *    dlgState is DS_VIEW_RECIPE.
 * ingredients - Multi-line list of ingredients (string).  Required if
 *    dlgState is DS_VIEW_RECIPE.
 * directions - Multi-line list of instructions (string).  Required if
 *    dlgState is DS_VIEW_RECIPE.
 * handleCancelClose - Function called if Close or Cancel buttons are pressed.
 *    Required is dlgState is not DS_HIDDEN.
 * handleDelete - Function called if Delete button is pressed, required if
 *    dlgState is DS_VIEW_RECIPE.
 * handleEdit - Function called if Edit button is pressed.  Required if dlgState
 *    is DS_VIEW_RECIPE.
 * handleSave - Function called if Save button is pressed.  Required if dlgState
 *    is DS_EDIT_RECIPE.  This function has a single parameter which is set by
 *    this component to an object containing name, description, ingredients, and
 *    instructions members, each set to the equivalent string from this
 *    component's state (which includes all edits done in the dialog).
 *
 * @exports DlgRecipe
 * @author Brian Denton
 * @version 1.0
 */

import React, { Component } from 'react';
import './App.sass';
import './DlgRecipe.sass';

class DlgRecipe extends React.Component {
  static DS_HIDDEN = 0;
  static DS_VIEW_RECIPE = 1;
  static DS_EDIT_RECIPE = 2;
  static DS_CREATE_RECIPE = 3;

  /**
  * @constructor
  */
  constructor() {
    super();

    this.state = {
      name: "",
      description: "",
      ingredients: "",
      directions: ""
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  /**
  * Called by React framework whenever props of this component are set.
  * @param {obj} nextProps Object containing all props about to be set.
  */
  componentWillReceiveProps(nextProps) {
    if (nextProps.dlgState === DlgRecipe.DS_VIEW_RECIPE) {
      this.setState({
        name: (nextProps.name) ? nextProps.name : "",
        description: (nextProps.description) ? nextProps.description : "",
        ingredients: (nextProps.ingredients) ? nextProps.ingredients : "",
        directions: (nextProps.directions) ? nextProps.directions : ""
      });
    } else if (nextProps.dlgState === DlgRecipe.DS_HIDDEN) {
      this.setState({
        name: "",
        description: "",
        ingredients: "",
        directions: ""
      });
    }
  }

  /**
  * Event handler for onChange event for all form controls.  Updates components
  * state with changes entered in dialog controls.
  * @param {obj} event Javascript event object for onChange event.
  */
  handleInputChange(event) {
    const value = event.target.value;
    const name = event.target.name;

    this.setState({
      [name]: value
    });
  }

  /**
  * Event handler for onSubmit event for form.  Creates copy of state values for
  * recipe name, description, ingredients, and instructions and puts them in a
  * new object.  Then calls props.handleSave with this object as its parameter.
  * @param {obj} event Javascript event object for onSubmit event.
  */
  handleSubmit(event) {
    event.preventDefault();

    this.props.handleSave({
      name: this.state.name,
      description: this.state.description,
      ingredients: this.state.ingredients,
      directions: this.state.directions
    });
  }

  /**
  * Called by React framework whenever this component is rendered.
  * @return Rendered React elements, or null if props.dlgState is DS_HIDDEN.
  */
  render() {
    if (this.props.dlgState === DlgRecipe.DS_HIDDEN)
      return null;

    if (this.props.dlgState === DlgRecipe.DS_VIEW_RECIPE) {
      return (
        <div className="dlg-modal-overlay">
          <div className="dlg-recipe">
            <div className="dlg-title">
              <h2>{this.state.name}</h2>
            </div>

            <div className="dlg-ctrl-row">
              <p className="dlg-left-col">Description:</p>
              <p className="dlg-right-col dlg-description">{this.state.description}</p>
            </div>
            <div className="clear-floats"></div>
            <div className="dlg-ctrl-row">
              <p className="dlg-left-col">Ingredients:</p>
              <textarea readonly className="dlg-right-col dlg-ingredients-directions">{this.state.ingredients}</textarea>
            </div>
            <div className="clear-floats"></div>
            <div className="dlg-ctrl-row">
              <p className="dlg-left-col">Directions:</p>
              <textarea readonly className="dlg-right-col dlg-ingredients-directions">{this.state.directions}</textarea>
            </div>
            <div className="clear-floats"></div>

            <div className="dlg-btn-spacer">&nbsp;</div>
            <div className="dlg-btn-row">
              <div className="dlg-btns-3">
                <input type="submit" className="btn" value="Delete"
                  onClick={this.props.handleDelete} />
                <input type="submit" className="btn dlg-btn-left-margin" value="Edit"
                  onClick={this.props.handleEdit} />
                <input type="button" className="btn dlg-btn-left-margin" value="Close"
                  onClick={this.props.handleCancelClose} />
              </div>
              <div className="clear-floats"></div>
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div className="dlg-modal-overlay">
          <form className="dlg-recipe" onSubmit={this.handleSubmit}>
            <div className="dlg-title">
              <h2>Create/Edit Recipe</h2>
            </div>

            <div className="dlg-ctrl-row">
              <p className="dlg-left-col">Name:</p>
              <input className="dlg-right-col dlg-input"
                name="name" type="input" value={this.state.name}
                onChange={this.handleInputChange} />
            </div>
            <div className="clear-floats"></div>
            <div className="dlg-ctrl-row">
              <p className="dlg-left-col">Description:</p>
              <textarea className="dlg-right-col dlg-description"
                name="description" value={this.state.description}
                onChange={this.handleInputChange} />
            </div>
            <div className="clear-floats"></div>
            <div className="dlg-ctrl-row">
              <p className="dlg-left-col">Ingredients:</p>
              <textarea className="dlg-right-col dlg-ingredients-directions"
                name="ingredients" value={this.state.ingredients}
                onChange={this.handleInputChange} />
            </div>
            <div className="clear-floats"></div>
            <div className="dlg-ctrl-row">
              <p className="dlg-left-col">Directions:</p>
              <textarea className="dlg-right-col dlg-ingredients-directions"
                name="directions" value={this.state.directions}
                onChange={this.handleInputChange} />
            </div>
            <div className="clear-floats"></div>

            <div className="dlg-btn-row">
              <div className="dlg-btns-2">
                <input type="submit" className="btn" value="Save" />
                <input type="button" className="btn dlg-btn-left-margin"
                  onClick={this.props.handleCancelClose} value="Cancel" />
              </div>
              <div className="clear-floats"></div>
            </div>
          </form>
        </div>
      );
    }
  }
}

export default DlgRecipe;
