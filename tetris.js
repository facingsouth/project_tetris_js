var model = {
  activeCells: [],
  placedCells: [],

  Cell: function(){
    this.x = Math.floor(Math.random() * view.boardWidth/view.cellWidth)
    this.y = -1;
    model.activeCells.push(this);
  },

  moveCellsDown: function(){
    for (i = 0; i < model.activeCells.length; i++){
      cell = model.activeCells[i]
      cell.y++
      view.drawCell(cell.x, cell.y)
    }
  },

  stopPiece: function(){
    console.log("stopping!")
    model.placedCells = model.placedCells.concat(model.activeCells)
    model.activeCells = []
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

  checkSideCells: function(currentCell, nextX) {
    for (var i = model.placedCells.length - 1; i >= 0; i--) {
      var nextCell = model.placedCells[i];
      if (currentCell.y === nextCell.y && nextX === nextCell.x) {
        return true;
      }
    };
    return false;
  },

  deleteCells: function(row){
    for (i = 0; i < model.activeCells.length; i++){
      cell = model.placedCells[i]
      if (cell.y == row){
        model.activeCells.splice(i,1)
      }
    }
  },
  /*
  if cell reaches bottom OR placed cell, then
  stopCell -> move cell from ActiveCells to PlacedCells
   */


}

var controller = {
  userMove: {
    37: -1,
    39: 1
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
  },

  drawPlacedCells: function(){
    for (var i = model.placedCells.length - 1; i >= 0; i--) {
      view.drawCell(model.placedCells[i].x,model.placedCells[i].y)
    };
  },

  drawCell: function(x, y) {
    this.context.fillStyle = "#ABCDEF";
    this.context.fillRect(x*this.cellWidth, y*this.cellWidth, this.cellWidth, this.cellWidth);
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
}, 200)