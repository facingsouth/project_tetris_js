var model = {
  activeCells: [],
  placedCells: [],
  angle: 0,
  currentPiece: undefined,

  Cell: function(x, y){
    this.x = x;//Math.floor(Math.random() * view.boardWidth/view.cellWidth)
    this.y = y;
    model.activeCells.push(this);
  },

  // Piece: function(type, x, y) {
  //   shapes: {
  //     0: square,
  //     1: bar,
  //     2: leftL,
  //     3: rightL,
  //     4: leftS,
  //     5: rightS
  //   },

  //   this.x: x;
  //   this.y: y;

  // },
  //
  randomFactory: function(){
    var factories = [model.squareFactory, model.barFactory, model.rightLFactory,
                model.leftLFactory, model.leftSFactory, model.rightSFactory]

    model.angle = 0
    var rand = Math.floor(Math.random()*6)

   return factories[rand]
  },

  getRelativeCoordinates: function(activeCells){
    base = activeCells[0]
  },

  pieceFactory: function(x,y,rotatedCoords){

    if (model.activeCells.length === 0){
      new model.Cell( x , y);
      new model.Cell(x+rotatedCoords[0][0], y+rotatedCoords[0][1]);
      new model.Cell(x+rotatedCoords[1][0], y+rotatedCoords[1][1]);
      new model.Cell(x+rotatedCoords[2][0], y+rotatedCoords[2][1])
    }
  },


  getRotatedCoordinates: function(coords){

      var rotatedCoords = [[],[],[]]

      for (var i = 0; i < coords.length; i++) {
        rotatedCoords[i][0] = coords[i][0]*Math.cos(model.angle) - coords[i][1]*Math.sin(model.angle);
        rotatedCoords[i][1] = coords[i][0]*Math.sin(model.angle) + coords[i][1]*Math.cos(model.angle);
        rotatedCoords[i][0] = Math.round(rotatedCoords[i][0]);
        rotatedCoords[i][1] = Math.round(rotatedCoords[i][1]);
        };

        return rotatedCoords

    },

  squareFactory: function(x,y,angle) {

      var coords = [[1, 0], [0, -1], [1, -1]]

      var rotatedCoords = model.getRotatedCoordinates(coords);
      model.currentPiece = model.squareFactory;
      model.pieceFactory(x,y,rotatedCoords)

    },

  barFactory: function(x,y) {

      var coords = [[0, -1], [0, -2], [0, -3]]

      var rotatedCoords = model.getRotatedCoordinates(coords)
      model.currentPiece = model.barFactory;
      model.pieceFactory(x,y,rotatedCoords)

  },

  leftLFactory: function(x,y,angle) {

    var coords = [[0, -1], [0, -2], [-1, 0]]

    var rotatedCoords = model.getRotatedCoordinates(coords, angle)
    model.currentPiece = model.leftLFactory;
    model.pieceFactory(x,y,rotatedCoords)


    // if (model.activeCells.length === 0){
    //   new model.Cell(5, -1);
    //   new model.Cell(5, -2);
    //   new model.Cell(5, -3);
    //   new model.Cell(4, -1);
    // }
  },

  rightLFactory: function(x,y,angle) {

    var coords = [[0, -1], [0, -2], [1, 0]]

    var rotatedCoords = model.getRotatedCoordinates(coords);
    model.currentPiece = model.rightLFactory;
    model.pieceFactory(x,y,rotatedCoords)


    // if (model.activeCells.length === 0){
    //   new model.Cell(5, -1);
    //   new model.Cell(5, -2);
    //   new model.Cell(5, -3);
    //   new model.Cell(6, -1);
    // }
  },

  leftSFactory: function(x,y,angle) {

    var coords = [[-1, 0], [0, -1], [-1, -1]]

    var rotatedCoords = model.getRotatedCoordinates(coords);
    model.currentPiece = model.leftSFactory;
    model.pieceFactory(x,y,rotatedCoords)



    // if (model.activeCells.length === 0){
    //   new model.Cell(4, -1);
    //   new model.Cell(5, -1); // base
    //   new model.Cell(5, -2);
    //   new model.Cell(6, -2);
    // }
  },

  rightSFactory: function(x,y,angle) {

    var coords = [[-1, 0], [0, -1], [1, -1]]

    var rotatedCoords = model.getRotatedCoordinates(coords);
    model.currentPiece = model.rightSFactory;
    model.pieceFactory(x,y,rotatedCoords)

    // if (model.activeCells.length === 0){
    //   new model.Cell(5, -1);
    //   new model.Cell(6, -1); // base
    //   new model.Cell(6, -2);
    //   new model.Cell(7, -2);
    // }
  },



  makeNewCell: function(){
    if (model.activeCells.length === 0) { new model.Cell(Math.floor(Math.random() * view.boardWidth/view.cellWidth), -1) }
  },

  jumpDown: function(){
    do {model.moveCellsDown()} while (model.activeCells.length > 0)


  },

  moveCellsDown: function(){
    for (i = 0; i < model.activeCells.length; i++){
      cell = model.activeCells[i]
      cell.y++

    }
    model.checkCells()
  },

  movePlacedCellsDown: function(row){
    for (i = 0; i < model.placedCells.length; i++){
      cell = model.placedCells[i]
      if (cell.y < row) {
        cell.y++;
      }
    }
  },

  stopPiece: function(){
    // console.log("stopping!")
    model.placedCells = model.placedCells.concat(model.activeCells)
    model.activeCells = []
    model.checkRow();
  },

  checkCells: function(){
    for (i = 0; i < model.activeCells.length; i++){
      cell = model.activeCells[i]
      if (cell.y == (view.boardHeight/view.cellWidth) - 1 || model.checkBelowCells(cell)){
       model.stopPiece();
      }
    }
  },

  checkBelowCells: function(currentCell) {
    for (var i = model.placedCells.length - 1; i >= 0; i--) {
      var nextCell = model.placedCells[i];
      if (currentCell.x === nextCell.x && currentCell.y + 1 === nextCell.y) {
        return true;
      }
    };
    return false;
  },

  checkRow: function(){
    var rowsToClear = []
    for(var row= 19; row>=0 ; row--){
      var count = 0
      for (var idx = 0; idx < model.placedCells.length; idx++){
        var cell = model.placedCells[idx];
        if (cell.y == row){
          count++
        }
      }
      if (count == 10){
        rowsToClear.push(row)
        console.log("going to clear row " + row)
      }
    }
    for (var i = 0; i < rowsToClear.length; i++) {
      model.clearRow(rowsToClear[i]);
      console.log("cleared row "+ rowsToClear[i])
    };
    for (var i = 0; i < rowsToClear.length; i++) {
      model.movePlacedCellsDown(rowsToClear[i])
      console.log("moved rows down above row "+ rowsToClear[i])
    };

  },

  checkSideCells: function(currentCell, nextX) {
    for (var i = model.placedCells.length - 1; i >= 0; i--) {
      var nextCell = model.placedCells[i];
      if (currentCell.y === nextCell.y && nextX === nextCell.x) {
        return true;
      }
    };
    return false;
  },

  clearRow: function(row){
    // console.log("clearing")
    // for (i = 0; i < model.placedCells.length; i++){
    //   cell = model.placedCells[i]
    //   if (cell.y == row){
    //     model.placedCells.splice(i,1)
    //   }
    // }
    var i = 0;
    while (model.placedCells[i]) {
      if (model.placedCells[i].y == row){
        model.placedCells.splice(i,1);
      } else {
        i++;
      }
    }
  },

  rotatePiece: function(direction) {
    if (typeof(direction)==='undefined') direction = Math.PI/2;
    model.angle += Math.PI / 2;
    currentPos = [model.activeCells[0].x, model.activeCells[0].y];
    model.activeCells = [];
    model.currentPiece(currentPos[0], currentPos[1], model.angle);
    controller.checkOutOfBounds();
  },

  moveSideway: function(direction) {
    var eligibleToMove = true;
    for (var i=0; i<model.activeCells.length; i++) {
      var cell = model.activeCells[i];
      var nextX = cell.x + direction;
      if ((nextX < 0 || nextX > view.boardWidth/view.cellWidth - 1) || model.checkSideCells(cell, nextX)) {
        eligibleToMove = false
      }
    };

    if (eligibleToMove){
      controller.movePiece(direction)
    }

    view.resetCanvas();
    view.drawPiece();
  }


}