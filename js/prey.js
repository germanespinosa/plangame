let prey = {
    downKeys:[moves.stay()],
    x:0,
    y:0,
    lastMove: moves.stay(),
    nextMove: function (){
        return prey.downKeys[prey.downKeys.length-1];
    },
    spriteName: null,
    addDownKey: function (key){
        prey.downKeys.push(key);
        prey.lastMove = moves.copy(key);
    },
    removeDownKey: function (key){
        for( let i = 0; i < prey.downKeys.length; i++){
            if ( prey.downKeys[i].x === key.x && prey.downKeys[i].y === key.y) {
                prey.downKeys.splice(i, 1);
            }
        }
    },
    onDownKeyDown : function (){
        prey.addDownKey(moves.down());
    },
    onUpKeyDown : function (){
        prey.addDownKey(moves.up());
    },
    onLeftKeyDown : function (){
        prey.addDownKey(moves.left());
    },
    onRightKeyDown : function (){
        prey.addDownKey(moves.right());
    },
    onDownKeyUp : function (){
        prey.removeDownKey(moves.down());
    },
    onUpKeyUp : function (){
        prey.removeDownKey(moves.up());
    },
    onLeftKeyUp : function (){
        prey.removeDownKey(moves.left());
    },
    onRightKeyUp : function (){
        prey.removeDownKey(moves.right());
    },
    start: function(){
        prey.scaleX = maze.tileSizeX/game.cache.getImage("prey").width;
        prey.scaleY = maze.tileSizeY/game.cache.getImage("prey").height;
        const pos = maze.copy(maze.world.startPosition);
        prey.x = pos.x;
        prey.y = pos.y;
    },
    addMove: function(pos){
        let new_pos = {
            x:pos.x,
            y:pos.y
        };
        new_pos.x += prey.x;
        new_pos.y += prey.y;
        return new_pos;
    },
    move: function() {
        let nextMove = prey.nextMove();
        if (moves.isStay(nextMove)) {
            nextMove = prey.lastMove;
        }
        prey.lastMove = moves.stay();
        if (!prey.checkMove(nextMove)) return false;
        prey.x += nextMove.x;
        prey.y += nextMove.y;
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
