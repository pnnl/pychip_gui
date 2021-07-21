"use strict";

/*
 * This is one js file for the pyCHIP webapp. It communicates with the pyCHIP app
 * and facilitates the transfer and display of information on the app. More specifically
 * it focuses on the predict.html page, where it populates the window with chips created
 * by the support_select route in app.py and handles the creation/removal/modification of
 * support sets by the user.
 */

(function() {

  window.addEventListener('load', init);

  // this variable is used to keep track of which set the user is currently modifying
  var currentSet = 1;

  /**
   * adds listeners to buttons and other inputs, sets the number of rows and columns in the image, and begins
   * adding chips to the image field by calling showChips
   */
  function init() {
    id('add_set').addEventListener('click', addSet);
    id('remove_set').addEventListener('click', removeSet);
    id('edit_select').addEventListener('change', updateCurrentSet);
    id('form1').addEventListener('submit', saveSets);
    id("name1").addEventListener("blur", updateNames)

    var total_rows = dim.num_crops_x;
    var total_columns = dim.num_crops_y;

    showChips(total_rows, total_columns);
  }

  /**
  * updates the currentSet variable based on the user's choice of dropdown menu options
  */
  function updateCurrentSet() {
    let newSet = id('edit_select').selectedIndex + 1;
    currentSet = newSet;
  }

  /**
  * adds an empty set to the selected_sets_window and adds it to the drop down menu
  */
  function addSet() {
    // find out how many sets exist currently
    let existing_sets = id('selected_sets_window').childElementCount;
    let set_number = existing_sets + 1;
    let set_name = 'name' + set_number.toString();

    // create label and input field for user to modify name of set, give it default name 'feature_type_#'
    let newLabel = document.createElement('label');
    newLabel.setAttribute("for", set_name)
    newLabel.innerHTML = "Name of set " + set_number.toString() + ": ";

    let newInput = document.createElement('input');
    newInput.setAttribute("type", 'text');
    newInput.setAttribute("name", set_name);
    newInput.value = "feature_type_" + set_number.toString();
    newInput.id = set_name;
    newInput.addEventListener("blur", updateNames)

    // create div for chips
    let newDiv = document.createElement('div');
    newDiv.id = "chips" + set_number.toString();
    newDiv.classList.add('selected_chips_window')

    // create overall div for set
    let newBigDiv = document.createElement('div');
    newBigDiv.id = "set" + set_number.toString();

    // create 2 line break elements for between sets
    let br1 = document.createElement("br");
    let br2 = document.createElement("br");

    // add them all together into the overall div and add to html
    newBigDiv.appendChild(newLabel);
    newBigDiv.appendChild(newInput);
    newBigDiv.appendChild(br1);
    newBigDiv.appendChild(br2);
    newBigDiv.appendChild(newDiv);
    id('selected_sets_window').appendChild(newBigDiv);

    // add drop down option with generic name
    let newDropdown = document.createElement('option');
    newDropdown.setAttribute("value", set_number);
    newDropdown.innerHTML = newInput.value;
    id('edit_select').appendChild(newDropdown);
    id('edit_select').value = set_number

    updateCurrentSet()
  }

  /**
  * removes the last set and its corresponding drop down menu option
  */
  function removeSet() {
    // find out how many sets exist currently
    let existing_sets = id('selected_sets_window').childElementCount;
    let last_set_number = existing_sets;

    // there must be at least one set remaining
    if (last_set_number > 1) {
        // remove the overall div for the set
        let div_to_remove = id("set" + last_set_number.toString());
        div_to_remove.remove();

        // remove the corresponding drop down option
        var dropdown = id('edit_select');
        dropdown.remove(dropdown.length -1);
    } else {
        console.log("There must be at least one support set")
    }
  }

  /**
  * Updates the names of the drop down menu options to reflect the user's names from text input fields
  */
  function updateNames() {
    // iterate through the children of the selected_sets_window
    var set_children = id('selected_sets_window').children;
    for (var i=0;i<set_children.length;i++) {
        var current_child = set_children[i];
        // get just the number from the current set's id
        let myString = current_child.id.toString();
        let current_set = myString[myString.length -1];
        let current_index = current_set - 1;
        // get the user inputted set name
        let set_name = id('name' + current_set).value;
        // modify the drop down menu option for this set
        id('edit_select').options[current_index].innerHTML = set_name;
    }
  }

  /**
  * Based on the current class list of the chip, either adds the chip to the current set or removes it from all sets.
  */
  function selectChip() {
  // check if this chip has been selected or not
    if (this.classList.contains('selectable')) {
        // change class lists to make it selected and specify the set it is selected for
        let currentSet_string = currentSet.toString();
        this.classList.add('selected');
        this.classList.add('selected'+ currentSet_string);
        this.classList.remove('selectable');

        let chipname = this.id;

        // create figure and image elements
        let chipFig = document.createElement('fig');
        let chipImg = document.createElement('img');

        // use selected chip's id to add the correct chip to the image element and add it to figure element
        chipImg.src = getChipLocation(chipname);
        chipImg.alt = chipname;
        chipFig.appendChild(chipImg);
        let chipname_selected = chipname.toString() + '_selected';
        chipFig.id = chipname_selected.toString();

        // add the figure element to the selected_chips_window under the correct set
        let el = id('chips' + currentSet_string);
        el.appendChild(chipFig);

    } else {
        // look for any class on this chip that has 'selected' in it and remove that class
        for (let i = this.classList.length - 1; i>=0; i--) {
        const className = this.classList[i];
            if (className.startsWith('selected')) {
            this.classList.remove(className);
            }
        }
        this.classList.remove('selected');

        // delete the figure in the selected_chips_window that corresponds to this chip
        let id_to_remove = this.id + '_selected';
        let el = id(id_to_remove)
        el.remove();

        // make this chip selectable again
        this.classList.add('selectable');
    }
  }

  /**
   * Populates the chip view with the chips. Note that based on the styling, row and column are actually switched
   * so a row is oriented vertically.
   * @param {object} number of rows and columns in the grid (kind of backwards - see css styling)
   */
  function showChips(total_rows, total_columns) {
    // iterate through each row and column to get the image names
    for (let i=0; i < total_rows; i++) {
        // create an element to hold all chips in one row of the image
        let row = document.createElement('div');
        row.classList.add('img_row');
        // add all chips in this row to the row element
        for (let j=0; j < total_columns; j++) {
            let img_name = 'cropX_' + i + '_Y_' + j;
            let chipFig = document.createElement('fig');
            let chipImg = document.createElement('img');
            chipImg.src = getChipLocation(img_name);
            chipImg.alt = img_name;
            chipFig.appendChild(chipImg);
            chipFig.id = img_name;
            chipFig.classList.add('selectable');
            chipFig.addEventListener('click', selectChip);
            row.appendChild(chipFig);
           }

        // add the row element to the image view
        id('chips_holder').appendChild(row);
    }

  }

  /**
   * returns the location of the chip in the folder system
   * @param {object} the name of the chip in the folder (minus the .jpg). Should have the form cropX_#_Y_#
   */
  function getChipLocation(chip_name) {
    var getUrl = window.location;
    var baseUrl = getUrl.protocol + "//" + getUrl.host + "/";
    var chip_location = baseUrl + 'static/username/query/all_chips/' + chip_name + '.jpg';
    return chip_location
  }

  /**
   * saves all support sets in a dictionary like this:
   * {query_set: [list of all image names]; support_set_1: [list...]; support_set_2: [list...];...}
   * This dictionary is sent back to the flask app via the 'submit' button action to be used in prediction.
   */
  function saveSets() {
    console.log("print loading")
    loading()
    console.log("print loading")
    // initialize dictionary
    var support_chip_dict = {};
    // iterate through the sets
    var sets = id('selected_sets_window').children;
    for (var i=0;i<sets.length;i++) {
        // get the user defined name for the set
        var current_child = sets[i];
        let myString = current_child.id.toString();
        let current_set = myString[myString.length -1];
        let set_name = id('name' + current_set).value;
        //TODO: check if set_name is empty first. if so, use current_set instead

        // initialize list of images
        var support_chip_lst = [];
        // get the images in this set
        let set_images = id('chips'+ current_set).children;
        for (var j=0;j<set_images.length;j++) {
            var current_fig = set_images[j];
            var chip_id = current_fig.id;
            // remove the _selected ending and add .jpg
            var myChip = chip_id.substring(0, chip_id.length - 9) + '.jpg';
            // add chip to list
            support_chip_lst.push(myChip);
        }
        //TODO: check if set list is empty or not and only add set if not empty
        support_chip_dict[set_name.toString()] = support_chip_lst;
    }
    console.log(support_chip_dict)
    // add the dictionary to the hidden support_sets input field to be passed back to the flask app
    id("support_sets").value = JSON.stringify(support_chip_dict);
    return true;
  }


  // --------------------------- helper functions -------------------------- //
  /**
   * Helper function to return the response's result text if successful, otherwise
   * returns the rejected Promise result with an error status and corresponding text
   * @param {object} response - response to check for success/error
   * @return {object} - valid response if response was successful, otherwise rejected
   *                    Promise result
   */
  function checkStatus(response) {
    if (response.ok) {
      return response;
    } else {
      throw Error("Error in request: " + response.statusText);
    }
  }

  /**
   * Returns the element that has the ID attribute with the specified value.
   * @param {string} idName - element ID
   * @returns {object} DOM object associated with id.
   */
  function id(idName) {
    return document.getElementById(idName);
  }

  /**
   * Returns the first element that matches the given CSS selector.
   * @param {string} query - CSS query selector.
   * @returns {object} The first DOM object matching the query.
   */
  function qs(query) {
    return document.querySelector(query);
  }

  /**
   * Returns all elements that match the given CSS selector.
   * @param {string} query - CSS query selector.
   * @returns {array} an array of DOM objects matching the query.
   */
  function qsa(query) {
    return document.querySelectorAll(query);
  }
})();
