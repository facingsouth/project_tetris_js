var controller = {
  userMove: {
    37: -1,
    39: 1
  },
  isGameOver: false,

  init: function(){
    model.init();

    $(document).keydown(function(event){
      model.checkLegalMove(event);
    });

    setInterval(controller.gameLoop, 1000)
  },

  resetAndDraw: function(){
    view.resetCanvas();
    view.drawPiece();
  },

  setListener: function(){

  },

  gameLoop: function(){
   if (!controller.isGameOver) {
    // console.log("game not over")

    view.resetCanvas();
    model.gravity();
    if (model.activeCells.length == 0) model.randomFactory(5,-1,0);
  }
  },

}