let virtualGamePad = {
    joystick: null,
    _anchor: {x:0, y:0},
    _isDown: false,
    _radius: 15,
    _lastEvent: "",
    _dispatch: function (a){
        virtualGamePad._lastEvent = a;
        for (let i=0;i<virtualGamePad._callbacks[a].length;i++)
            virtualGamePad._callbacks[a][i]();
    },
    _getPos: function(a){
        if ("touches" in a ) {
            return {x: a.touches[0].screenX, y: a.touches[0].screenY};
        } else {
            return {x: a.screenX, y: a.screenY};
        }
    },
    _down: function(a) {
        virtualGamePad._isDown = true;
        virtualGamePad._anchor = virtualGamePad._getPos(a);
    },
    _up: function(a) {
        virtualGamePad._isDown = false;
        if (virtualGamePad._lastEvent.endsWith("down")){
            const up = virtualGamePad._lastEvent.substring(0,virtualGamePad._lastEvent.length - 4);
            virtualGamePad._dispatch(up + "up");
        }
    },
    _move: function(a) {
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
    _callbacks: {
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
    start: function(radius, div, size) {
        let defaultPrevent = function(e){e.preventDefault();}
        window.addEventListener("touchstart", defaultPrevent);
        window.addEventListener("touchmove" , defaultPrevent);

        virtualGamePad._radius = radius;
        window.addEventListener("touchstart", virtualGamePad._down);
        window.addEventListener("mousedown", virtualGamePad._down);
        window.addEventListener("mouseup", virtualGamePad._up);
        window.addEventListener("touchend", virtualGamePad._up);
        window.addEventListener("mousemove", virtualGamePad._move);
        window.addEventListener("touchmove", virtualGamePad._move);

        if (typeof div !== "undefined") {
            let w = div.clientWidth;
            let h = div.clientHeight;
            virtualGamePad.joystick = new Phaser.Game(w, h, Phaser.AUTO, div.id);
            virtualGamePad.joystick.state.add("virtualGamePad.runJoystick", virtualGamePad.runJoystick);
            virtualGamePad.joystick.state.start("virtualGamePad.runJoystick");
        }
    },
    runJoystick: function(game){},
    drawSprite: function (screenPos, img, size){
        let cache = virtualGamePad.joystick.cache.getImage(img);
        let sprite = virtualGamePad.joystick.add.sprite(screenPos.x, screenPos.y, img);
        const scaleX = size / cache.width;
        const scaleY = size / cache.height;
        sprite.scale.setTo(scaleX, scaleY);
        return sprite;
    }
};

virtualGamePad.runJoystick.prototype = {
    preload: function () {
        virtualGamePad.joystick.load.image("circle", "img/grey_circle.png");
        virtualGamePad.joystick.load.image("ball", "img/red_ball.png");
    },
    create: function() {
        virtualGamePad.circle = virtualGamePad.drawSprite({x:virtualGamePad.joystick.width/2,y:virtualGamePad.joystick.height/2},"circle", virtualGamePad.joystick.width);
        virtualGamePad.circle.z = 1;
        virtualGamePad.circle.anchor.setTo(.5,.5);
        virtualGamePad.ball = virtualGamePad.drawSprite({x:virtualGamePad.joystick.width/2,y:virtualGamePad.joystick.height/2},"ball", virtualGamePad.joystick.width * .5);
        virtualGamePad.ball.z = 2;
        virtualGamePad.ball.anchor.setTo(.5,.5);
    },
    update: function() {
    }
}
