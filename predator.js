let predator = {
    alwaysVisible : true,
    scaleX: 0,
    scaleY: 0,
    x: 0,
    y: 0,
    start: function(){
        predator.scaleX = maze.tileSizeX/game.cache.getImage("predator").width;
        predator.scaleY = maze.tileSizeY/game.cache.getImage("predator").height;
    },
    contact: false,
    getPos: function() {
        return {x:predator.x, y:predator.y};
    },
    setPos: function (pos){
      predator.x = pos.x;
      predator.y = pos.y;
    },
    move: function(){
        if (!maze.isVisible(prey,predator)) { // no visual contact random move
            predator.randomMove();
        } else {
            predator.moveTowards();
        }
    },
    addMove: function(pos){
        let new_pos = {
            x:pos.x,
            y:pos.y
        };
        new_pos.x += predator.x;
        new_pos.y += predator.y;
        return new_pos;
    },
    moveTowards: function (){
        let min_distance = maze.distance(prey, predator);
        let selected = { x:0, y:0};
        for (let i = 0; i < moves.list.length; i++){
            if (predator.checkMove(moves.list[i])) {
                const ref = {x:prey.x - moves.list[i].x,y:prey.y - moves.list[i].y};
                if (maze.distance(predator,ref) < min_distance) selected = moves.list[i];
            }
        }
        if(Helpers.GetRandomInt(3)===0) setTimeout(predator.moveTowards, game_status.refreshRate/2);
        predator.tryMove(selected);
    },
    draw: function (){
        if (maze.isVisible(predator, prey) || predator.alwaysVisible) {
            const screenPos = maze.screenLocation(predator);
            let tile = game.add.sprite(screenPos.x , screenPos.y , "predator");
            tile.scale.setTo(predator.scaleX, predator.scaleY);
            if (!maze.isVisible(predator,prey)) tile.alpha = .3;

            groups.maze.add(tile);
        }
    },
    randomMove: function (){
        while (!predator.tryMove(Helpers.GetRandomElement(moves.list)));
    },
    tryMove: function(move) {
        if (!predator.checkMove(move)) return false;
        predator.x += move.x;
        predator.y += move.y;
        return true;
    },
    checkMove: function(move){
        const candidate = predator.addMove(move);
        return maze.free(candidate);
    }
};
