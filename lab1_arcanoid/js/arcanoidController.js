var Controller = function (View, Model) {
    this.arcanoidView = View;
    this.arcanoidModel = Model;
};

Controller.prototype.init = function() {
    this.arcanoidView.onKeyDownEvent = this.moving.bind(this);
    var count_blocks = this.arcanoidModel.init(this.needRendering.bind(this));
    this.arcanoidView.init(count_blocks, arcanoidModel.blocks, arcanoidModel.objs);
    this.needRendering();
};

Controller.prototype.moving = function(e) {
    this.arcanoidModel.platformMove(e);
};

Controller.prototype.needRendering = function(){
    this.arcanoidView.render(arcanoidModel.objs, arcanoidModel.blocks);
};

Controller.prototype.destroyBlock = function(block) {
    this.arcanoidView.destroyBlock(block);
    this.arcanoidView.render(arcanoidModel.objs, arcanoidModel.blocks);
};

Controller.prototype.lose = function() {
    this.arcanoidView.destroyBall();
    this.arcanoidModel.destroyAllBlocks();
    this.arcanoidView.showFinalSign(false);
};

Controller.prototype.win = function() {
    this.arcanoidView.destroyBall();
    this.arcanoidView.showFinalSign(true);
};

var arcanoidController = new Controller(arcanoidView, arcanoidModel);

arcanoidController.init();