let moves = {
    stay : {x:0,y:0},
    left : {x:-1,y:0},
    right : {x:1,y:0},
    up : {x:0,y:-1},
    down : {x:0,y:1},
    list: [],
    isMove :function (a,b){
        return a.x === b.x && a.y === b.y;
    },
    isRight(a){
        return moves.isMove(a,moves.right);
    },
    isLeft(a){
        return moves.isMove(a,moves.left);
    },
    isUp(a){
        return moves.isMove(a,moves.up);
    },
    isDown(a){
        return moves.isMove(a,moves.down);
    }
}

moves.list = [moves.left, moves.right, moves.down, moves.up];
