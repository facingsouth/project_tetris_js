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

  rotatePiece: function() {
    model.angle += Math.PI / 2;
    currentPos = [model.activeCells[0].x, model.activeCells[0].y];
    model.activeCells = [];
    model.currentPiece(currentPos[0], currentPos[1], model.angle);
  }


}

var controller = {
  userMove: {
    37: -1,
    39: 1,
    40: "down"
  },

  init: function(){
    $(document).keydown(function(event){
      controller.checkLegalMove(event);
    });
  },

  gravity: function(){
    model.moveCellsDown();
    model.checkCells();
  },

  movePiece: function(direction){
    for (var i = model.activeCells.length - 1; i >= 0; i--) {
      cell = model.activeCells[i]
      cell.x += direction;
    }
  },




  checkLegalMove: function(event){
    var eligibleToMove = true
    if (event.which == 37 || event.which == 39){
      for (var i=0; i<model.activeCells.length; i++) {
        var cell = model.activeCells[i];
        var nextX = cell.x + controller.userMove[event.which];
        if ((nextX < 0 || nextX > view.boardWidth/view.cellWidth - 1) || model.checkSideCells(cell, nextX)) {
     // if (nextX >= 0 && nextX < view.boardWidth/view.cellWidth && !model.checkSideCells(cell, nextX)) {
          eligibleToMove = false
        }
      };

      if (eligibleToMove){
        controller.movePiece(controller.userMove[event.which])
      }

      view.resetCanvas();
      view.drawPiece();
    }

    if (event.which == 40){
      model.jumpDown()
    }

    if (event.which === 38) {
      model.rotatePiece();
    }
  }
}

var view = {
  context: document.getElementById("board").getContext("2d"),
  boardHeight: 500,
  boardWidth: 250,
  cellWidth: 25,

  resetCanvas: function() {
    this.context.clearRect(0, 0, this.boardWidth, this.boardHeight);
    // horizontal lines
    for (var i=0; i<this.boardHeight; i+=this.cellWidth) {
      this.context.beginPath();
      this.context.moveTo(0, i);
      this.context.lineTo(this.boardWidth, i);
      this.context.closePath();
      this.context.stroke();
    }

    // vertical lines
    for (var i=0; i<this.boardWidth; i+=this.cellWidth) {
      this.context.beginPath();
      this.context.moveTo(i, 0);
      this.context.lineTo(i, this.boardHeight);
      this.context.closePath();
      this.context.stroke();
    }

    view.drawPlacedCells();
    view.drawPiece();
  },

  drawPlacedCells: function(){
    for (var i = model.placedCells.length - 1; i >= 0; i--) {
      view.drawCell(model.placedCells[i].x,model.placedCells[i].y)
    };
  },

  drawCell: function(x, y) {
    this.context.fillStyle = "#ABCDEF";
    this.context.fillRect(x*this.cellWidth, y*this.cellWidth, this.cellWidth, this.cellWidth);
    this.context. strokeRect(x*this.cellWidth, y*this.cellWidth, this.cellWidth, this.cellWidth);
  },

  drawPiece: function() {
    for (var i = model.activeCells.length - 1; i >= 0; i--) {
      view.drawCell(model.activeCells[i].x,model.activeCells[i].y)
    };
  }

}
/*
if row is full, the delete row
model.deleteCells(row);
 */


controller.init();
setInterval(function(){
  view.resetCanvas();
  controller.gravity();
  if (model.activeCells.length == 0) model.randomFactory()(5,-1,0);
}, 1000)