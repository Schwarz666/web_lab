const SCENE_WIDTH = 800;
const SCENE_HEIGTH = 600;

const INITIAL_PLATFORM_X = SCENE_WIDTH / 2;
const INITIAL_PLATFORM_WIDTH = 100;
const INITIAL_PLATFORM_STEP = 20;
const PLATFORM_HEIGHT = 20;

const KEY_CODE_LEFT = 37;
const KEY_CODE_RIGHT = 39;

const INITIAL_BALL_X = 0;
const INITIAL_BALL_Y = SCENE_HEIGTH / 2;
const INITIAL_DIRECTION = 1;
const INITIAL_BALL_STEP = 2;
const INITIAL_BALL_RADIUS = 30;
const BLOCK_COUNT = 8;

const NORMAL_BLOCK_COLOR = 'mediumslateblue';
const STRONG_BLOCK_COLOR = 'midnightblue';

const BLOCK_WIDTH = 160;
const BLOCK_HEIGHT = 80;


var Model = function () {
    this.objs = {
        'platform': {
            x: INITIAL_PLATFORM_X,
            width: INITIAL_PLATFORM_WIDTH,
            step: INITIAL_PLATFORM_STEP
        },
        'ball': {
            x: INITIAL_BALL_X,
            y: INITIAL_BALL_Y,
            direction_x: INITIAL_DIRECTION,
            direction_y: INITIAL_DIRECTION,
            step: INITIAL_BALL_STEP,
            radius: INITIAL_BALL_RADIUS
        },
        'count_blocks': BLOCK_COUNT
    };
    this.blocks = [];

};


Model.prototype.init = function (renderFunction) {
    this.needRendering = renderFunction;
    requestAnimationFrame(this.ballMove);

    var space_hor = (SCENE_WIDTH - 4 * BLOCK_WIDTH) / 5;
    var space_wert = 30;

    for (var i = 0; i < arcanoidModel.objs.count_blocks; i++) {
        var x = space_hor * (i % 4 + 1) + BLOCK_WIDTH * (i % 4);
        var y = space_wert * (parseInt(i / 4) + 1) + BLOCK_HEIGHT * (parseInt(i / 4));
        var strength = Math.floor(Math.random() * 2) +1;
        //var strength = parseInt(i / 4) + 1;
        var color;
        if (strength === 1) {
            color = NORMAL_BLOCK_COLOR;
        }
        else {
            color = STRONG_BLOCK_COLOR;
        }

        arcanoidModel.blocks[i] = {x: x, y: y, strength: strength, color: color, bwidth:BLOCK_WIDTH, bheight: BLOCK_HEIGHT};
    }
    return this.objs.count_blocks;
};

function checkBordersVertical(x, delta) {
    return (x < 0 || x > ( SCENE_WIDTH - delta)); //Можно упростить до return (x < 0 || x > ( SCENE_WIDTH - delta)) + по codeStyle каждое выражение if else оформляется в скобках и с новой строки
};


//_______________________________________________PLATFORM_____________________________________________________
Model.prototype.platformMove = function (e) {
    var keyCode = e.keyCode;
    var objp = arcanoidModel.objs.platform;

    switch (keyCode) {
        case KEY_CODE_RIGHT: {
            if (!(checkBordersVertical(objp.x + objp.step, objp.width))){
                objp.x += objp.step;
            }
            break;
        }
        case KEY_CODE_LEFT: {
            if (!(checkBordersVertical(objp.x - objp.step, 0))) {
                objp.x -= objp.step;
            }
            break;
        }
    }
    this.needRendering();
};

//_______________________________________________BALL________________________________________________________

function checkBordersTop(y) {
    if (y <= 0) return true;
    else return false;
};

function checkBallPlatform() {
    var objb = arcanoidModel.objs.ball;
    var objp = arcanoidModel.objs.platform;
    if ((((SCENE_HEIGTH - PLATFORM_HEIGHT) - objb.y) <= objb.radius) && (((SCENE_HEIGTH - PLATFORM_HEIGHT) - objb.y) >= (objb.radius - objb.step)) && ((objb.x - objp.x) >= (-1 * objb.radius)) && ((objb.x - objp.x) <= (objp.width))) //Жесткое условие... Как минимум отформатировать надо.
        return true;
    else return false;
};

Model.prototype.checkBallOut = function () {
    if (arcanoidModel.objs.ball.y >= SCENE_HEIGTH) {
        arcanoidController.lose();
        cancelAnimationFrame(arcanoidModel.ballMove);
        return "finish";
    }
};

Model.prototype.checkAllBlocksOut = function () {
    var objbs = arcanoidModel.blocks;
    for (var i = 0; i < objbs.length; i++)
        if (objbs[i].strength > 0) return false;
    return true;

};

Model.prototype.checkBallBlocks = function () {
    var objb = arcanoidModel.objs.ball;
    var objbs = arcanoidModel.blocks;

    var i, result = "none";
    for (var i = 0; i < objbs.length; i++) {
        if (objbs[i].strength === 0) continue;
        if (((objb.y - objbs[i].y) <= BLOCK_HEIGHT) && ((objb.y - objbs[i].y) >= (BLOCK_HEIGHT - objb.step)) && (objb.x >= (objbs[i].x - objb.radius)) && (objb.x <= ( objbs[i].x + BLOCK_WIDTH))) {
            result = "bottom";
            break;
        };
        if (((objbs[i].y - objb.y ) <= objb.radius) && ((objbs[i].y - objb.y) >= (objb.radius - objb.step)) && (objb.x >= (objbs[i].x - objb.radius)) && (objb.x <= ( objbs[i].x + BLOCK_WIDTH))) {
            result = "top";
            break;
        };
        if ((objb.y >= objbs[i].y ) && (objb.y <= (objbs[i].y + BLOCK_HEIGHT) ) && (objb.x <= ( objbs[i].x + BLOCK_WIDTH)) && (objb.x >= ( objbs[i].x + BLOCK_WIDTH - objb.step))) {
            result = "right";
            break;
        };
        if ((objb.y >= objbs[i].y ) && (objb.y <= (objbs[i].y + BLOCK_HEIGHT) ) && ((objb.x + objb.radius) >= objbs[i].x) && ((objb.x + objb.radius) <= (objbs[i].x + objb.step))) {
            result = "left";
            break;
        };

    };
    if (result != "none") {
        objbs[i].strength--;
        objbs[i].color = NORMAL_BLOCK_COLOR;
        if (objbs[i].strength === 0) arcanoidController.destroyBlock(objbs[i]);
        if (arcanoidModel.checkAllBlocksOut()) {
            arcanoidController.win();
            cancelAnimationFrame(arcanoidModel.ballMove);
            result = "finish";
            objb.radius = 0;
        }
    }
    return result;
};

Model.prototype.ballMove = function () {
    var objb = arcanoidModel.objs.ball;


    if (checkBordersVertical(objb.x, objb.radius))
        objb.direction_x *= -1;
    if (checkBordersTop(objb.y))
        objb.direction_y *= -1;
    if (checkBallPlatform())
        objb.direction_y *= -1;

    var block_crack = arcanoidModel.checkBallBlocks()
    if ((block_crack === "bottom") || (block_crack === "top")){
        objb.direction_y *= -1;
    }
    if ((block_crack === "right") || (block_crack === "left")){
        objb.direction_x *= -1;
    }

    var ball_crack = arcanoidModel.checkBallOut();

    objb.x += objb.direction_x * objb.step;
    objb.y += objb.direction_y * objb.step;


    if ((block_crack !== "finish") && (ball_crack !== "finish")){
        arcanoidModel.needRendering();
        requestAnimationFrame(arcanoidModel.ballMove);
    }

};
//___________________________________________________________________________BLOCKS________________________
Model.prototype.destroyAllBlocks = function () {
    for (var i = 0; i < arcanoidModel.blocks.length; i++) {
        arcanoidModel.blocks[i].strength = 0;
        arcanoidController.destroyBlock(arcanoidModel.blocks[i]);
    };
};

//___________________________________________________________________________________________________________


var arcanoidModel = new Model();