var model = {
  activeCells: [],
  placedCells: [],

  Cell: function(){
    this.x = Math.floor(Math.random() * view.boardWidth/view.cellWidth)
    this.y = -1;
    model.activeCells.push(this);
  },

  makeNewCell: function(){
    if (model.activeCells.length === 0) { new model.Cell() }
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

  stopPiece: function(){
    console.log("stopping!")
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
    for(var row= 19; row>=0 ; row--){
      var count = 0
      for (var idx = 0; idx < model.placedCells.length; idx++){
        var cell = model.placedCells[idx];
        if (cell.y == row){
          count++
        }
      }

      if (count == 10){
        model.clearRow(row)
      }
    }
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
    console.log("clearing")
    for (i = 0; i < model.placedCells.length; i++){
      cell = model.placedCells[i]
      if (cell.y == row){
        model.placedCells.splice(i,1)
      }
    }
  },


}

var controller = {
  userMove: {
    37: -1,
    39: 1,
    40: "down"
  },

  init: function(){
    $(document).keydown(function(event){
      controller.movePiece(event);
    });
  },

  gravity: function(){
    model.moveCellsDown();
  },


  movePiece: function(event){
    if (event.which == 37 || event.which == 39){
      for (var i=0; i<model.activeCells.length; i++) {
        var cell = model.activeCells[i];
        var nextX = cell.x + controller.userMove[event.which];
        if (nextX >=0 && nextX < view.boardWidth/view.cellWidth && !model.checkSideCells(cell, nextX)) {
          cell.x = nextX;
        }
      };
      view.resetCanvas();
      view.drawPiece();
    }

    if (event.which == 40){
      model.jumpDown()
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
  model.checkCells()
  model.makeNewCell();
}, 200)