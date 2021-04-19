var Controller = function (View, Model) {
    this.arcanoidView = View;
    this.arcanoidModel = Model;
};

Controller.prototype.init = function() {
    this.arcanoidView.onKeyDownEvent = this.moving.bind(this);
    var count_blocks = this.arcanoidModel.init(this.needRendering.bind(this));
    this.arcanoidView.init(count_blocks, arcanoidModel.blocks);
    this.needRendering();
};

Controller.prototype.moving = function(e) {
    this.arcanoidModel.platformMove(e);
};

Controller.prototype.needRendering = function(){
    this.arcanoidView.render(arcanoidModel.objs, arcanoidModel.blocks);
};

Controller.prototype.destroyBlock = function(i) {
    this.arcanoidView.destroyBlock(i);
    this.arcanoidView.render(arcanoidModel.objs, arcanoidModel.blocks);
};

Controller.prototype.lose = function() {
    this.arcanoidView.destroyBall();
    arcanoidModel.destroyAllBlocks();
    this.arcanoidView.showFinalSign(false);
    this.arcanoidView.render(arcanoidModel.objs, arcanoidModel.blocks);
};

Controller.prototype.win = function() {
    this.arcanoidView.destroyBall();
    this.arcanoidView.showFinalSign(true);
    this.arcanoidView.render(arcanoidModel.objs, arcanoidModel.blocks);
};

var arcanoidController = new Controller(arcanoidView, arcanoidModel);

arcanoidController.init();