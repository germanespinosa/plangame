let virtualGamePad = {
    _anchor : {x:0, y:0},
    _isDown : false,
    _radius : 30,
    _lastEvent : "",
    _dispatch : function (a){
        virtualGamePad._lastEvent = a;
        console.log(a);
        for (let i=0;i<virtualGamePad._callbacks[a].length;i++)
            virtualGamePad._callbacks[a][i]();
    },
    _getPos : function(a){
        if ("touches" in a ) {
            return {x: a.touches[0].screenX, y: a.touches[0].screenY};
        } else {
            return {x: a.screenX, y: a.screenY};
        }
    },
    _down : function(a) {
        console.log(a);
        virtualGamePad._isDown = true;
        virtualGamePad._anchor = virtualGamePad._getPos(a);
    },
    _up : function(a) {
        virtualGamePad._isDown = false;
        if (virtualGamePad._lastEvent.endsWith("down")){
            const up = virtualGamePad._lastEvent.substring(0,virtualGamePad._lastEvent.length - 4);
            virtualGamePad._dispatch(up + "up");
        }
    },
    _move : function(a) {
        if (virtualGamePad._isDown) {
            const c = virtualGamePad._getPos(a);
            const l = {x:c.x - virtualGamePad._anchor.x, y:c.y - virtualGamePad._anchor.y};
            const d = Math.sqrt(l.x * l.x + l.y * l.y );
            let event = "";
            if (d>virtualGamePad._radius) {
                if (Math.abs(l.x) > Math.abs(l.y)){
                    if (l.x>0) {
                        event = "right";
                    }else{
                        event = "left";
                    }
                }else{
                    if (l.y>0) {
                        event = "down";
                    }else{
                        event = "up";
                    }
                }
                if (virtualGamePad._lastEvent !== event + "down"){
                    if (virtualGamePad._lastEvent.endsWith("down")){
                        const up = virtualGamePad._lastEvent.substring(0,virtualGamePad._lastEvent.length - 4);
                        virtualGamePad._dispatch(up + "up");
                    }
                    virtualGamePad._dispatch(event + "down");
                }
            }else {
                if (virtualGamePad._lastEvent !== event + "down"){
                    if (virtualGamePad._lastEvent.endsWith("down")){
                        const up = virtualGamePad._lastEvent.substring(0,virtualGamePad._lastEvent.length - 4);
                        virtualGamePad._dispatch(up + "up");
                    }
                }
            }
        }
    },
    _callbacks:{
        leftup: [],
        leftdown:[],
        rightup: [],
        rightdown: [],
        upup: [],
        updown: [],
        downup: [],
        downdown: []
    },
    addEventListener: function(event, callback){
        virtualGamePad._callbacks[event].push(callback);
    },
    start: function(radius) {
        virtualGamePad._radius = radius;
        window.addEventListener("touchstart", virtualGamePad._down);
        window.addEventListener("mousedown", virtualGamePad._down);
        window.addEventListener("mouseup", virtualGamePad._up);
        window.addEventListener("touchend", virtualGamePad._up);
        window.addEventListener("mousemove", virtualGamePad._move);
        window.addEventListener("touchmove", virtualGamePad._move);
    }
};

/*
*     onLeftDown: function (){

    },
    onRightDown: function (){

    },
    onUpDown: function (){

    },
    onDownDown: function (){

    },
    onLeftUp: function (){

    },
    onRightUp: function (){

    },
    onUpUp: function (){

    },
    onDownUp: function (){

    },
    update: function() {
        if (game.input.activePointer.isDown) {
            let new_anchor = {x: game.input.activePointer.clientX, y: game.input.activePointer.clientY};
            if (gameStatus.anchor.x === 0 && gameStatus.anchor.y === 0) {
                gameStatus.anchor = new_anchor;
            } else {
                if (maze.distance(gameStatus, new_anchor) > 30) {

                }
            }
        } else {
            gameStatus.anchor = {x: 0, y: 0};
        }
    },

*
* */