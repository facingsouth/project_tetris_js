controller.init();
setInterval(function(){
  view.resetCanvas();
  controller.gravity();
  if (model.activeCells.length == 0) model.randomFactory()(5,-1,0);
}, 1000)