var view = {
  context: document.getElementById("board").getContext("2d"),
  boardHeight: 500,
  boardWidth: 250,
  cellWidth: 25,

  drawHorizontalLines: function(){
    for (var i=0; i<view.boardHeight; i+=view.cellWidth) {
      view.context.beginPath();
      view.context.moveTo(0, i);
      view.context.lineTo(view.boardWidth, i);
      view.context.closePath();
      view.context.stroke();
    }
  },

  drawVerticalLines: function(){
    for (var i=0; i<view.boardWidth; i+=view.cellWidth) {
      view.context.beginPath();
      view.context.moveTo(i, 0);
      view.context.lineTo(i, view.boardHeight);
      view.context.closePath();
      view.context.stroke();
    }
  },

  drawLines: function(){
    view.drawHorizontalLines();
    view.drawVerticalLines();
  },

  resetCanvas: function() {
    view.context.clearRect(0, 0, view.boardWidth, view.boardHeight);
    view.drawLines();
    view.drawPlacedCells();
    view.drawPiece();
  },

  drawPlacedCells: function(){
    for (var i = model.placedCells.length - 1; i >= 0; i--) {
      view.drawCell(model.placedCells[i].x,model.placedCells[i].y)
    };
  },

  drawCell: function(x, y) {
    view.context.fillStyle = "#ABCDEF";
    view.context.fillRect(x*view.cellWidth, y*view.cellWidth, view.cellWidth, view.cellWidth);
    view.context. strokeRect(x*view.cellWidth, y*view.cellWidth, view.cellWidth, view.cellWidth);
  },

  drawPiece: function() {
    for (var i = model.activeCells.length - 1; i >= 0; i--) {
      view.drawCell(model.activeCells[i].x,model.activeCells[i].y)
    };
  }
}