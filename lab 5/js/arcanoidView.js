
var View = function() {
    this.onKeyDownEvent = null;

    this.svg = document.querySelector('#mainScene');
    this.platform = document.querySelector('#platform');
    this.ball = document.querySelector('#ball');
    this.final_sign = document.querySelector('#final');
};

View.prototype.init = function (count_blocks, oblocks){
    document.addEventListener('keydown', this.onKeyDownEvent);

    for(var i = 0; i < count_blocks; i++) {
        var newBlock = document.createElementNS("http://www.w3.org/2000/svg", 'rect');
        newBlock.setAttribute('class','block');
        newBlock.style.fill = oblocks[i].color;
        newBlock.style.x = oblocks[i].x;
        newBlock.style.y = oblocks[i].y;
        this.svg.appendChild(newBlock);
    }
    this.blocks = document.querySelectorAll('.block');
};

View.prototype.render = function (objs, oblocks) {

    this.platform.style.x = objs.platform.x;

    this.ball.style.cx = objs.ball.x+objs.ball.radius/2;
    this.ball.style.cy = objs.ball.y+objs.ball.radius/2;

    for (var i = 0; i < this.blocks.length; i++) {
        this.blocks[i].style.fill = oblocks[i].color;
    }
};

View.prototype.destroyBlock = function (i)
{
    this.blocks[i].style.visibility = "hidden";
};

View.prototype.destroyBall = function ()
{
    this.ball.style.visibility = "hidden";
};

View.prototype.showFinalSign = function (has_won)
{
    this.final_sign.setAttribute("x", "400");
    this.final_sign.setAttribute("y", "300");
    if (has_won) {
        this.final_sign.innerHTML="You Won :)";
    }
    else {
        this.final_sign.innerHTML="You Lose :(";
    }
};
var arcanoidView = new View();