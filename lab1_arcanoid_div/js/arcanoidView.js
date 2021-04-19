


var View = function() {
    this.platform = document.querySelector('.platform');
    this.ball = document.querySelector('.ball');
    this.blocks;
    this.final_sign = document.querySelector('.final');
    this.blocks_aria = document.querySelector('.blocks_aria');

    this.onKeyDownEvent = null;
};

View.prototype.init = function (count_blocks, oblocks){
    document.addEventListener('keydown', this.onKeyDownEvent);

   for(var i = 0; i < count_blocks; i++)
   {
       var newBlock = document.createElement('div');
       newBlock.className = "block";
       this.blocks_aria.appendChild(newBlock);
   };
    this.blocks = document.querySelectorAll('.block');

    for (var i = 0; i < this.blocks.length; i++) {
        this.blocks[i].style.background = oblocks[i].color;
        this.blocks[i].style.left = oblocks[i].x + 'px';
        this.blocks[i].style.top = oblocks[i].y + 'px';
    }

};

View.prototype.render = function (objs, oblocks) {
    this.platform.style.left = objs.platform.x + 'px';

    this.ball.style.left = objs.ball.x + 'px';
    this.ball.style.top = objs.ball.y + 'px';
    for (var i = 0; i < this.blocks.length; i++){
        this.blocks[i].style.background = oblocks[i].color;}

};

View.prototype.destroyBlock = function (i)
{
    this.blocks[i].setAttribute('hidden', 'true');
}

View.prototype.destroyBall = function ()
{
    this.ball.setAttribute('hidden', 'true');
}

View.prototype.showFinalSign = function (has_won)
{
    if (has_won) {
        this.final_sign.innerHTML="You Won :)";
    }
    else {
        this.final_sign.innerHTML="You Lose :(";
    }
}

var arcanoidView = new View();