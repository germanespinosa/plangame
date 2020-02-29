let prey = {
    x:7,
    y:14,
    scaleX: 0,
    scaleY: 0,
    nextMove : {x:0,y:0},
    onDownKeyDown : function (){
        prey.setNextMove(moves.down);
    },
    onUpKeyDown : function (){
        prey.setNextMove(moves.up);
    },
    onLeftKeyDown : function (){
        prey.setNextMove(moves.left);
    },
    onRightKeyDown : function (){
        prey.setNextMove(moves.right);
    },
    onDownKeyUp : function (){
        if (moves.isDown(prey.nextMove)) prey.nextMove = moves.stay;
    },
    onUpKeyUp : function (){
        if (moves.isUp(prey.nextMove)) prey.nextMove = moves.stay;
    },
    onLeftKeyUp : function (){
        if (moves.isLeft(prey.nextMove)) prey.nextMove = moves.stay;
    },
    onRightKeyUp : function (){
        if (moves.isRight(prey.nextMove)) prey.nextMove = moves.stay;
    },
    start: function(){
        prey.scaleX = maze.tileSizeX/game.cache.getImage("prey").width;
        prey.scaleY = maze.tileSizeY/game.cache.getImage("prey").height;

        const pos = maze.copy(maze.startPosition);
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
        prey.nextMove.x = move.x;
        prey.nextMove.y = move.y;
    },
    move: function() {
        if (game.input.keyboard.isDown(Phaser.Keyboard.LEFT)) {
            console.log("left");
            prey.setNextMove(moves.left);
        } else if (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) {
            console.log("right");
            prey.setNextMove(moves.right);
        } else if (game.input.keyboard.isDown(Phaser.Keyboard.UP)) {
            console.log("up");
            prey.setNextMove(moves.up);
        } else if (game.input.keyboard.isDown(Phaser.Keyboard.DOWN)) {
            console.log("down");
            prey.setNextMove(moves.down);
        } else {
            prey.setNextMove(moves.stay);
        }
        if (!prey.checkMove(prey.nextMove)) return false;
        prey.x += prey.nextMove.x;
        prey.y += prey.nextMove.y;
        if (maze.goalPosition.x===prey.x && maze.goalPosition.y === prey.y) gameStatus.youWin();
        return true;
    },
    checkMove: function(move){
        const candidate = prey.addMove(move);
        return maze.free(candidate);
    },
    draw: function (){
        const screenPos = maze.screenLocation(prey);
        let tile = game.add.sprite(screenPos.x , screenPos.y , "prey");
        tile.scale.setTo(prey.scaleX, prey.scaleY);
        groups.agents.add(tile);
    },
    getPos: function() {
        return {x:predator.x, y:predator.y};
    },
    setPos: function (pos){
        predator.x = pos.x;
        predator.y = pos.y;
    },
};
