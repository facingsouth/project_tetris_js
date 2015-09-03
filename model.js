var model = {
  activeCells:  undefined,
  placedCells:  undefined,
  angle:        undefined,
  currentPiece: undefined,



  pieces: {    square: [[1, 0], [0, -1], [1, -1]],
               bar:    [[0, -1], [0, -2], [0, -3]],
               leftL:  [[0, -1], [0, -2], [-1, 0]],
               rightL: [[0, -1], [0, -2], [1, 0]],
               leftS:  [[-1, 0], [0, -1], [-1, -1]],
               rightS: [[-1, 0], [0, -1], [1, -1]]
               },

  init: function(){
    model.activeCells = [];
    model.placedCells = [];
    model.angle = 0;
  },

  Cell: function(x, y){
    this.x = x;//Math.floor(Math.random() * view.boardWidth/view.cellWidth)
    this.y = y;
    model.activeCells.push(this);
  },

  randomFactory: function(x,y,angle){
    model.angle = angle
    var randType = model.pickRandomKey(model.pieces)

   return model.pieceFactory(x,y,angle,randType)
  },

  pickRandomKey: function(obj) {
    var result;
    var count = 0;
    for (var key in obj)
      if (Math.random() < 1/++count)
       result = key;
    return result;
  },

  cellsFactory: function(x,y,rotatedCoords){

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
        rotatedCoords[i][0] = coords[i][0]*Math.cos(model.angle) -
        coords[i][1]*Math.sin(model.angle);

        rotatedCoords[i][1] = coords[i][0]*Math.sin(model.angle) +
        coords[i][1]*Math.cos(model.angle);

        rotatedCoords[i][0] = Math.round(rotatedCoords[i][0]);
        rotatedCoords[i][1] = Math.round(rotatedCoords[i][1]);
        };
        return rotatedCoords
    },

  pieceFactory: function(x,y,angle,type){
    var coords = model.pieces[type]

    var rotatedCoords = model.getRotatedCoordinates(coords);
    model.currentPiece = type
    model.cellsFactory(x,y,rotatedCoords)
  },

  // makeNewCell: function(){
  //   if (model.activeCells.length === 0)
  //   { new model.Cell(Math.floor(Math.random() * view.boardWidth/view.cellWidth), -1) }
  // },

  jumpDown: function(){
    do {model.moveCellsDown(); model.checkCells() } while (model.activeCells.length > 0)
  },

  moveCellsDown: function(){
    for (i = 0; i < model.activeCells.length; i++){
      model.activeCells[i].y++
    }
  },

  movePlacedCellsDown: function(row){
    for (i = 0; i < model.placedCells.length; i++){
      var cell = model.placedCells[i]
      if (cell.y < row) cell.y++;
    }
  },

  stopPiece: function(){
    model.placedCells = model.placedCells.concat(model.activeCells)
    model.activeCells = []
    model.checkRow();
  },

  checkCells: function(){
    for (i = 0; i < model.activeCells.length; i++){
      var cell = model.activeCells[i]
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
    for(var row= 19; row >= -1 ; row--){
      var count = 0
      for (var idx = 0; idx < model.placedCells.length; idx++){
        var cell = model.placedCells[idx];
        if (cell.y == row){
          count++
        }
        else if (cell.y == -1) controller.isGameOver = true
      }
      if (count == 10){
        rowsToClear.push(row)
      }
    }
    for (var i = 0; i < rowsToClear.length; i++) {
      model.clearRow(rowsToClear[i]);
    };
    for (var i = 0; i < rowsToClear.length; i++) {
      model.movePlacedCellsDown(rowsToClear[i])
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
    model.pieceFactory(currentPos[0],currentPos[1], model.angle, model.currentPiece)
    model.checkOutOfBounds();
  },

  checkOutOfBounds: function(){
    for (var i = 0; i < model.activeCells.length; i++) {
      cell = model.activeCells[i]
      if(cell.x < 0){
       model.rotatePiece(-Math.PI/2)
       return
      } else if (cell.x > 9) {
        model.rotatePiece(-Math.PI/2)
        return
      }
    };
  },

  checkEligibleToMove: function(direction){
    for (var i=0; i<model.activeCells.length; i++) {
      var cell = model.activeCells[i];
      var nextX = cell.x + direction;
      if ((nextX < 0 || nextX > view.boardWidth/view.cellWidth - 1) || model.checkSideCells(cell, nextX)) {
        return false
      }
    }
    return true
  },

  movePiece: function(direction){
    for (var i = model.activeCells.length - 1; i >= 0; i--) {
      cell = model.activeCells[i]
      cell.x += direction;
    }
  },

  moveSideway: function(direction) {
    if (model.checkEligibleToMove(direction)){
      model.movePiece(direction)
      controller.resetAndDraw();
    }
  },

  gravity: function(){
    model.moveCellsDown();
    model.checkCells();
  },

  checkLegalMove: function(event){
    if (event.which == 37 || event.which == 39){
      model.moveSideway(controller.userMove[event.which]);
    }

    if (event.which == 40){
      model.jumpDown();
    }

    if (event.which === 38) {
      model.rotatePiece();
    }
  },

}