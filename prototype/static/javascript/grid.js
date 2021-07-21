window.addEventListener('load', initSlider)

function updateTextInput(val) {
          document.getElementById('textInput').value=val;
        }

//height and width are imported at index.html, which is calculated in app.py, and can still be accessed here
var org_height = dim.height;
var org_width = dim.width;

var x_image = d3.scaleLinear()
  .domain([0, org_width ])
  .range([ 0, 800]);


// this default grid size will change based on image size as soon as the page loads
var initial_grid_size = 50;

// use size of image to determine the initial value and range of the slider
function initSlider() {
    // the minimum and maximum number of squares along the width
    var min_grids = 5;
    var max_grids = Math.round(org_width/50);

    if (max_grids < 30) {max_grids = 30}

    // get the width in pixels of grids for the above conditions
    let max_spacing = Math.round(org_width / min_grids);
    let min_spacing = Math.round(org_width / max_grids);
    initial_grid_size = Math.round((min_spacing + max_spacing) / 4);

    // adjust the slider range and value
    let slider = document.getElementById('mySlider');
    slider.min = min_spacing;
    slider.max = max_spacing;
    slider.value = initial_grid_size;

    //create the initial grid
    update(initial_grid_size);
  }


//using the margin convention: https://bl.ocks.org/mbostock/3019563
var margin ={top: 50, right: 50, bottom: 50, left: 50};

//svg is created at the	<div id="map"></div> in index.html
//append adds <div id="map"> <svg> <g> </g> </svg> </div> to the div

console.log(dim.image);
width = x_image(org_width)
height = x_image(org_height)

var svg = d3.select("#map").append("svg")
    .attr("width", height + margin.left +margin.right)
    .attr("height", width + margin.top + margin.bottom)
    //The <g> SVG element is a container used to group other SVG elements.
    //Transformations applied to the <g> element are performed on its child elements
    .append("g")
    .attr("transform","translate("+margin.left+","+margin.top+")")

//add image to the background (could make this a user input)
var myimage = svg.append('image')
    .attr('xlink:href', dim.image)
    .attr('width', width)
    .attr('height', height)

function update(width_input){
  var width_input = x_image(width_input)
  //function to create data that will be used to make the squares

  //grid lines adapted from https://bl.ocks.org/cagrimmett/07f8c8daea00946b9e704e3efcbd5739
  function gridData(width_input) {
    //update var for total rows and columns
    total_columns = Math.floor(width/width_input)
    total_rows = Math.floor(height/width_input)

    var data = new Array();
    var xpos = 1; //starting xpos and ypos at 1 so the stroke will show when we make the grid below
    var ypos = 1;
    var width_square = width_input;
    var height_square = width_input;

    // iterate for rows
    for (var row = 0; row < total_rows; row++) {
      // iterate for cells/columns inside rows
      for (var column = 0; column < total_columns; column++) {
        data.push({
          x: xpos,
          y: ypos,
          width: width_square,
          height: height_square
        })
        // increment the x position. I.e. move it over by 50 (width variable)
        xpos += width_square;
      }
      // reset the x position after a row is complete
      xpos = 1;
      // increment the y position for the next row. Move it down 50 (height variable)
      ypos += height_square;
    }
    return data;
  }

  var gridData = gridData(width_input);
  console.log(gridData)
  //remove and delete the previously drawn rectangles
  d3.selectAll("rect.mygrid").remove()

  var row_data = svg
  //the rect in class "mygrid" will be created in the next step, but you select it before creating it
  .selectAll("rect.mygrid")
  .data(gridData)

  //for each row in the data, a rect is created
  var row_enter = row_data
  .enter()
  .append("rect")
  .attr("class", "mygrid")

  //introduce the features associated with the square
  row_enter
  .attr("x", function(d) { return d.x; })
  .attr("y", function(d) { return d.y; })
  .attr("width", function(d) { return d.width; })
  .attr("height", function(d) { return d.height; })
  .style("fill", "#fff")
  .style("stroke", "yellow")
  .attr("fill-opacity", 0)

  row_enter.exit().remove();
  }

  //use the value from the slider to set the total number of squares that fit in the image
  var width_input = document.getElementById('mySlider').value
  var total_rows = Math.floor(width/width_input)
  var total_columns = Math.floor(height/width_input)

  // collect selected squares here
  var selected_squares = new Array();



  // Listen to the slider
  d3.select("#mySlider").on("change", function(d){
    //get brand new array to collect selected squares
    selected_squares = new Array();
    //use value on slider to decide width and number of squares
    selectedValue = this.value
    update(parseFloat(selectedValue))
  })

  //
  // function drawCircle(x, y) {
  //       console.log('Drawing circle at', x, y);
  //       svg.append("circle")
  //           .attr('class', 'click-circle')
  //           .attr("cx", x)
  //           .attr("cy", y)
  //           .attr("r", 4);
  //   }
  //
  //   svg.on('click', function() {
  //       var coords = d3.mouse(this);
  //
  //       console.log(coords);
  //       drawCircle(coords[0], coords[1], 2);
  //   });
