let prey = {
    x:0,
    y:0,
    nextMove: {x:0,y:0},
    spriteName: null,
    nextMoveSet: false,
    leftIsDown: false,
    rightIsDown: false,
    upIsDown: false,
    downIsDown: false,
    onDownKeyDown : function (){
        prey.downIsDown = true;
        prey.setNextMove(moves.down);
    },
    onUpKeyDown : function (){
        prey.upIsDown = true;
        prey.setNextMove(moves.up);
    },
    onLeftKeyDown : function (){
        prey.leftIsDown = true;
        prey.setNextMove(moves.left);
    },
    onRightKeyDown : function (){
        prey.rightIsDown = true;
        prey.setNextMove(moves.right);
    },
    onDownKeyUp : function (){
        prey.downIsDown = false;
    },
    onUpKeyUp : function (){
        prey.upIsDown = false;
    },
    onLeftKeyUp : function (){
        prey.leftIsDown = false;
    },
    onRightKeyUp : function (){
        prey.rightIsDown = false;
    },
    start: function(){
        prey.scaleX = maze.tileSizeX/game.cache.getImage("prey").width;
        prey.scaleY = maze.tileSizeY/game.cache.getImage("prey").height;
        prey.setNextMove(moves.stay);
        const pos = maze.copy(maze.world.startPosition);
        prey.x = pos.x;
        prey.y = pos.y;
    },
    addMove: function(pos){
        var new_pos = {
            x:pos.x,
            y:pos.y
        };
        new_pos.x += prey.x;
        new_pos.y += prey.y;
        return new_pos;
    },
    setNextMove: function(move){
        prey.nextMoveSet = true;
        prey.nextMove.x = move.x;
        prey.nextMove.y = move.y;
    },
    move: function() {
        if (!prey.nextMoveSet){
            if (moves.isLeft(prey.nextMove) && !prey.leftIsDown) {
                prey.setNextMove(moves.stay);
            }
            if (moves.isRight(prey.nextMove) && !prey.rightIsDown) {
                prey.setNextMove(moves.stay);
            }
            if (moves.isUp(prey.nextMove) && !prey.upIsDown) {
                prey.setNextMove(moves.stay);
            }
            if (moves.isDown(prey.nextMove) && !prey.downIsDown) {
                prey.setNextMove(moves.stay);
            }
        }
        prey.nextMoveSet = false;
        if (!prey.checkMove(prey.nextMove)) return false;
        prey.x += prey.nextMove.x;
        prey.y += prey.nextMove.y;
        if (maze.equal(maze.world.goalPosition,prey)) {
            gameStatus.youWin();
            return false;
        }
        return true;
    },
    checkMove: function(move){
        const candidate = prey.addMove(move);
        return maze.free(candidate);
    },
    getPos: function() {
        return {x:predator.x, y:predator.y};
    },
    setPos: function (pos){
        predator.x = pos.x;
        predator.y = pos.y;
    },
};
