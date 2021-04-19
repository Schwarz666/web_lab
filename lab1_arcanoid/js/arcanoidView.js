var View = function() {
    this.onKeyDownEvent = null;

    var canvasScene = document.getElementById("mainScene");
    this.ctx = canvasScene.getContext('2d');
    canvasScene.width  = 800;
    canvasScene.height = 600;
    canvasScene.style.marginLeft = (screen.width - 800)/2 + 'px';

    this.prev_platform_x;
    this.prev_ball_x;
    this.prev_ball_y;
    this.prev_ball_radius;
    this.redcolor = 255;
    this.color_delta = 1;
};

View.prototype.init = function (count_blocks, oblocks, objs){
    document.addEventListener('keydown', this.onKeyDownEvent);

    for(var i = 0; i < count_blocks; i++)
    {
        this.ctx.fillStyle = oblocks[i].color;
        this.ctx.fillRect(oblocks[i].x, oblocks[i].y,  oblocks[i].bwidth, oblocks[i].bheight);
    };
    this.prev_platform_x = objs.platform.x;
    this.prev_ball_x = objs.ball.x;
    this.prev_ball_y = objs.ball.y;
    this.prev_ball_radius = objs.ball.radius;

};

View.prototype.render = function (objs, oblocks) {

   //__________________________platform___________________________
    this.ctx.strokeStyle = "white";
    this.ctx.clearRect (this.prev_platform_x, 580,  objs.platform.width, 20);
    this.ctx.strokeRect (this.prev_platform_x, 580,  objs.platform.width, 20);
    this.ctx.fillStyle = "black";
    //this.ctx.fillRect(objs.platform.x, 580,  objs.platform.width, 20);
    this.prev_platform_x = objs.platform.x;

    this.ctx.fillRect(objs.platform.x + 10, 580,  objs.platform.width - 20, 20);
    this.ctx.beginPath();
    this.ctx.arc(objs.platform.x + 10 , 580 + 10, 10, 0, Math.PI * 2, false);
    this.ctx.closePath();
    this.ctx.fill();
    this.ctx.beginPath();
    this.ctx.arc(objs.platform.x + objs.platform.width - 10 , 580 + 10, 10, 0, Math.PI * 2, false);
    this.ctx.closePath();
    this.ctx.fill();

    //_________________________ball__________________________________
    arcanoidView.destroyBall();
    this.ctx.beginPath();
    this.prev_ball_x = objs.ball.x + objs.ball.radius/2;
    this.prev_ball_y = objs.ball.y + objs.ball.radius/2;
    this.ctx.arc(this.prev_ball_x , this.prev_ball_y, objs.ball.radius/2, 0, Math.PI * 2, false);
    this.ctx.closePath();
    if (( this.redcolor >= 255)||( this.redcolor <= 0))
    {
        this.color_delta *= -1;
    };
    this.redcolor+=this.color_delta;
    this.ctx.fillStyle = 'rgb(' + this.redcolor + ',0,' + (255 - this.redcolor) + ')';
    this.ctx.fill();

    //_________________________blocks________________________________
    for(var i = 0; i < oblocks.length; i++)
    {
        if (oblocks[i].strength===0) continue;
        this.ctx.fillStyle = oblocks[i].color;
        this.ctx.fillRect(oblocks[i].x, oblocks[i].y,  oblocks[i].bwidth, oblocks[i].bheight);
    };
};

View.prototype.destroyBlock = function (block)
{
    this.ctx.clearRect (block.x, block.y,  block.bwidth, block.bheight);
    this.ctx.strokeStyle = "white";
    this.ctx.strokeRect (block.x, block.y,  block.bwidth, block.bheight);
}

View.prototype.destroyBall = function ()
{
    this.ctx.beginPath();
    this.ctx.arc(this.prev_ball_x , this.prev_ball_y, this.prev_ball_radius/2 + 1 , 0, Math.PI * 2, false);
    this.ctx.closePath();
    this.ctx.fillStyle = "white";
    this.ctx.fill();
};

View.prototype.showFinalSign = function (has_won)
{
    this.ctx.fillStyle = "red";
    this.ctx.font = "italic 62pt Monotype Corsiva";
    this.ctx.textAlign = "center";
    this.ctx.textBaseline = "middle";
    if (has_won) {
        this.ctx.fillText("You Won :)", 400, 300);
    }
    else {
        this.ctx.fillText("You Lose :(", 400, 300);
    }
};

var arcanoidView = new View();