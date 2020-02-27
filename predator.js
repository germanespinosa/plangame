var predator = {
    x : 7,
    y : 7,
    moveTowards: function (pos){

    },
    randomMove: function (){
        while (!predator.move( Helpers.GetRandomElement(moves)));
    },
    move: function(move) {
        if (!predator.checkMove(move)) return false;
        predator.x += move.x;
        predator.y += move.y;
        return true;
    },
    checkMove: function(move){
        return predator.x + move.x >= 0 &&
            predator.y + move.y >= 0 &&
            predator.x + move.x < Dungeon.map_size &&
            predator.y + move.y < Dungeon.map_size &&
            Dungeon.map[this.y + move.y][this.x + move.x] == 1;
    }
};
