var predator = {
    x : 7,
    y : 7,
    contact: false,
    distance: function (pos){
        return Math.sqrt(Math.pow(pos.x-predator.x,2) + Math.pow(pos.y-predator.y,2));
    },
    getPos: function() {
        return {x:predator.x, y:predator.y};
    },
    setPos: function (pos){
      predator.x = pos.x;
      predator.y = pos.y;
    },
    addMove: function(pos){
        var new_pos = {
            x:pos.x,
            y:pos.y
        };
        new_pos.x += predator.x;
        new_pos.y += predator.y;
        return new_pos;
    },
    moveTowards: function (pos){
        var min_distance = predator.distance(pos);
        var selected = { x:0, y:0};
        for (var i = 0; i < moves.length; i++){
            if (predator.checkMove(moves[i])) {
                var ref = {x:pos.x - moves[i].x,y:pos.y - moves[i].y};
                if (predator.distance(ref) < min_distance) selected = moves[i];
            }
        }
        predator.move(selected);
    },
    randomMove: function (){
        while (!predator.move(Helpers.GetRandomElement(moves)));
    },
    move: function(move) {
        if (!predator.checkMove(move)) return false;
        predator.x += move.x;
        predator.y += move.y;
        return true;
    },
    checkMove: function(move){
        var candidate = predator.addMove(move);
        return candidate.x >= 0 &&
            candidate.y >= 0 &&
            candidate.x < Dungeon.map_size &&
            candidate.y < Dungeon.map_size &&
            Dungeon.map[candidate.y][candidate.x] == 1;
    }
};
