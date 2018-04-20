/**
 * @fileOverview React component for main application page.  Contains package
 * header, list of recipies and dialog to view/edit/create them, and a footer.
 *
 * All user input takes place in the dialog which has four possible modes:
 * hidden, view recipe, edit recipe, and create recipe (see DS_ constants in
 * DlgRecipe.js).  Current mode of this dialog is controlled by saving this
 * value in App.state.recipeDlgState.  This value is passed to the dialog
 * component in App.render().
 *
 * This component stores all recipes as separate key/value pairs in local
 * storage.  These are retrieved in App.componentDidMount() and created/updated/
 * removed whenever created, edited, or deleted by the user via App UI.
 *
 * This component has no props.
 *
 * @exports App
 * @author Brian Denton
 * @version 1.0
 */

import React, { Component } from 'react';
import AppHeader from './AppHeader.js';
import RecipeItem from './RecipeItem.js';
import DlgRecipe from './DlgRecipe.js';
import './App.sass';

class App extends React.Component {
  static RECIPE_KEY_STR = "FisBDRecipe";

  /**
  * @constructor
  */
  constructor() {
    super();

    this.state = {
      recipeDlgState: DlgRecipe.DS_HIDDEN,
      iEdit: 0,
      recipeList: []
    }

    this.handleNewRecipe = this.handleNewRecipe.bind(this);
    this.handleDlgCancelClose = this.handleDlgCancelClose.bind(this);
    this.handleDlgDelete = this.handleDlgDelete.bind(this);
    this.handleDlgEdit = this.handleDlgEdit.bind(this);
    this.handleDlgSave = this.handleDlgSave.bind(this);
    this.onClickViewRecipe = this.onClickViewRecipe.bind(this);
  }

  /**
  * Called by React framework after this component did mount on the DOM.  Reads
  * all recipies from local storage and saves them into an array in App.state.
  */
  componentDidMount() {
    var recipes = this.readRecipesFromLocalStorage();
    this.setState({recipeList: recipes});
  }

  /**
  * Called by AppHeader component when 'new recipe' button is pressed. Changes
  * App.state.recipeDlgState to DS_CREATE_RECIPE, which causes App to render,
  * during which the dialog is rendered in the DS_CREATE_RECIPE mode.  Also sets
  * App.state.iEdit to -1, which indicates that a new recipe is being entered in
  * the dialog (see handleDlgSave() below).
  */
  handleNewRecipe() {
    this.setState({
      recipeDlgState: DlgRecipe.DS_CREATE_RECIPE,
      iEdit: -1
    });
  }

  /**
  * Called by DlgRecipe component when cancel or close button is pressed.
  * App.state.recipeDlgState to DS_HIDDEN, which causes App to render,
  * during which the dialog is hidden.
  */
  handleDlgCancelClose() {
    this.setState({
      recipeDlgState: DlgRecipe.DS_HIDDEN
    });
  }

  /**
  * Called by DlgRecipe component when edit button is pressed while dialog is
  * in the DS_VIEW_RECIPE mode. Sets App.state.recipeDlgState to DS_EDIT_RECIPE,
  * which causes App to render, during which the dialog is rendered in the
  * DS_EDIT_RECIPE mode.
  */
  handleDlgEdit() {
    this.setState({
      recipeDlgState: DlgRecipe.DS_EDIT_RECIPE
    });
  }

  /**
  * Called by DlgRecipe component when delete button is pressed while dialog is
  * in the DS_VIEW_RECIPE mode.  Uses the value in App.state.iEdit as index in
  * App.state.recipeList of recipe to delete.  App.state.iEdit was set when the
  * user first clicked on the RecipeItem component to view the recipe.  The
  * recipe is removed from local starage and all other recipes saved to local
  * storage (to update their keys).  The recipe is spliced from the list in
  * App.state.recipeList.
  *
  * Also sets App.state.recipeDlgState to DS_HIDDEN, which hides dialog during
  * next render.
  */
  handleDlgDelete() {
    var oRecipes = this.state.recipeList.slice();

    oRecipes.splice(this.state.iEdit, 1);
    this.saveRecipesToLocalStorage(this.state.recipeList, oRecipes);

    this.setState({
      recipeList: oRecipes,
      recipeDlgState: DlgRecipe.DS_HIDDEN
    });
  }

  /**
  * Called by DlgRecipe component when save button is pressed while dialog is
  * in the DS_EDIT_RECIPE or DS_CREATE_RECIPE mode.  If a new recipe was being
  * created in the dialog, then App.state.iEdit will be -1, otherwise it will
  * be the index of the recipe in App.state.recipeList.  If a new recipe, a new
  * recipe object is created from the data in the recipeData param and added
  * onto the end of App.state.recipeList, otherwise existing recipe is updated.
  * The new/updated recipe is then saved to local storage.
  *
  * Also sets App.state.recipeDlgState to DS_HIDDEN, which hides dialog during
  * next render.
  *
  * @param {obj} recipeData Object containing name, description, ingredients,
  * and instructions members (all strings) for new/updated recipe.
  */
  handleDlgSave(recipeData) {
    var oRecipes = this.state.recipeList.slice();
    var i;

    if (this.state.iEdit <= -1) {
      oRecipes.push({
        name: recipeData.name,
        description: recipeData.description,
        ingredients: recipeData.ingredients,
        directions: recipeData.directions
      });
      i = oRecipes.length - 1;
    } else {
      i = this.state.iEdit;
      oRecipes[i].name = recipeData.name;
      oRecipes[i].description = recipeData.description;
      oRecipes[i].ingredients = recipeData.ingredients;
      oRecipes[i].directions = recipeData.directions;
    }

    this.saveRecipeToLocalStorage(recipeData, i);

    this.setState({
      recipeList: oRecipes,
      recipeDlgState: DlgRecipe.DS_HIDDEN
    });
  }

  /**
  * Called by unnamed function passed to all RecipeItem components.  This
  * unnamed function is called by its RecipeItem component when the component
  * is clicked by the user, which then calls onClickViewRecipe().  When the
  * unnamed function is passed to its RecipeItem, its call of onClickViewRecipe
  * contains the appropriate value for the index param for that recipe (See
  * render() below).
  *
  * The value in the index param is saved to App.state.iEdit, which is used
  * later if this recipe is edited and saved.
  *
  * Also sets App.state.recipeDlgState to DS_VIEW_RECIPE, which shows the Dialog
  * in the DS_VIEW_RECIPE mode during the next render, and also passes recipe
  * info to the dialog.
  *
  * @param {number} index Index (in App.state.recipeList) of the recipe to be
  *    viewed.
  */
  onClickViewRecipe(index) {
    this.setState({
                  iEdit: index,
                  recipeDlgState: DlgRecipe.DS_VIEW_RECIPE
                });
  }

  /**
  * Called by React framework whenever this component is rendered.
  * @return Rendered React elements.
  */
  render() {
    var recipeItems = [];
    this.state.recipeList.forEach((item, i) => {
      recipeItems.push(<RecipeItem name={item.name} description={item.description}
                       onClickView={() => this.onClickViewRecipe(i)} />);
    });

    var recipeDialog = "";
    switch (this.state.recipeDlgState) {
      case DlgRecipe.DS_HIDDEN:
        recipeDialog = <DlgRecipe dlgState={DlgRecipe.DS_HIDDEN} />
        break;
      case DlgRecipe.DS_VIEW_RECIPE:
        var i = this.state.iEdit;
        recipeDialog = <DlgRecipe dlgState={DlgRecipe.DS_VIEW_RECIPE}
                         name={this.state.recipeList[i].name}
                         description={this.state.recipeList[i].description}
                         ingredients={this.state.recipeList[i].ingredients}
                         directions={this.state.recipeList[i].directions}
                         handleDelete={this.handleDlgDelete}
                         handleEdit={this.handleDlgEdit}
                         handleCancelClose={this.handleDlgCancelClose} />
        break;
      case DlgRecipe.DS_EDIT_RECIPE:
        recipeDialog = <DlgRecipe dlgState={DlgRecipe.DS_EDIT_RECIPE}
                         handleSave={this.handleDlgSave}
                         handleCancelClose={this.handleDlgCancelClose}/>
        break;
      case DlgRecipe.DS_CREATE_RECIPE:
        recipeDialog = <DlgRecipe dlgState={DlgRecipe.DS_CREATE_RECIPE}
                         handleSave={this.handleDlgSave}
                         handleCancelClose={this.handleDlgCancelClose}/>
        break;
    }

    return (
      <div className="app">
        <AppHeader newRecipe={this.handleNewRecipe}/>
        {recipeItems}
        {recipeDialog}
        <div class="app-footer">
          <p class="footer-text">&copy; Brian Denton</p>
        </div>
      </div>
    );
  }

  /**
  * Reads recipes from local storage.  Each recipe is saved as a stringified
  * javascript object.  Each has a key starting with App.RECIPE_KEY_STR and
  * ending with an integer value.
  *
  * @return Array of javascript objects, each with name, description,
  *    ingredients, and instructions members, each holding a string.
  */
  readRecipesFromLocalStorage() {
    var i;
    var recipeList = [];
    var sValue;

    if (typeof(Storage) !== "undefined") {
      for (i = 0; i < 100; i++) {
        if ((sValue = localStorage.getItem(App.RECIPE_KEY_STR + i)) == null) {
          break;
        }

        recipeList.push(JSON.parse(sValue));
      }
    }

    return recipeList;
  }

  /**
  * Updates all recipies in local storage by saving only those in the newList
  * array and deleting those only in the oldList array (if oldList has more
  * recipies).
  *
  * @param {array} oldList Array of javascript objects, each with the members
  *    name, description, ingredients, and instructions, each containing a
  *    string.
  * @param {array} newList Array of javascript object, each object has the same
  *    format as those in oldList.
  */
  saveRecipesToLocalStorage(oldList, newList) {
    if (typeof(Storage) !== "undefined") {
      var i;

      for (i = 0; i < newList.length; i++) {
        this.saveRecipeToLocalStorage(newList[i], i);
      }

      if (newList.length < oldList.length) {
        i = oldList.length - 1;
        do {
          var sKey = App.RECIPE_KEY_STR + i;
          localStorage.removeItem(sKey);
          --i;
        } while (i >= newList.length);
      }
    }
  }

  /**
  * Saves a recipe to local storage.  The recipe object in the recipeData param
  * is stringified and saved with a key created by appending the number in the i
  * param with the string App.RECIPE_KEY_STR.
  *
  * @param {obj} recipeData Javascript object with members name, description,
  *    ingredients, and instructions, each containing a string.
  * @param {number} i Integer appended onto end of key.
  */
  saveRecipeToLocalStorage(recipeData, i) {
    if (typeof(Storage) !== "undefined") {
      var sStrData = JSON.stringify(recipeData);
      var sKey = App.RECIPE_KEY_STR + i;
      localStorage.setItem(sKey, sStrData);
    }
  }
}

export default App;
