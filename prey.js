var prey = {
    x:7,
    y:14,
    nextMove : {x:0,y:0},
    start: function(){

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
            prey.setNextMove(left);
        } else if (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) {
            console.log("right");
            prey.setNextMove(right);
        } else if (game.input.keyboard.isDown(Phaser.Keyboard.UP)) {
            console.log("up");
            prey.setNextMove(up);
        } else if (game.input.keyboard.isDown(Phaser.Keyboard.DOWN)) {
            console.log("down");
            prey.setNextMove(down);
        } else {
            prey.setNextMove(stay);
        }
        if (!prey.checkMove(prey.nextMove)) return false;
        prey.x += prey.nextMove.x;
        prey.y += prey.nextMove.y;
        return true;
    },
    checkMove: function(move){
        var candidate = prey.addMove(move);
        return candidate.x >= 0 &&
            candidate.y >= 0 &&
            candidate.x < Dungeon.map_size &&
            candidate.y < Dungeon.map_size &&
            Dungeon.map[candidate.y][candidate.x] == 1;
    }
};
