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
  }
}