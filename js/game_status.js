let gameStatus = {
    titleTimeOut : 1000,
    refreshRate: 300,
    code: 0,
    showMessage:function(message,size, tint = 0xFFFFFF){
        groups.status.removeAll();
        let sprite = game.add.bitmapText(game.width/2,game.height/2, '8bit',message,34);
        sprite.anchor.x = .5;
        sprite.anchor.y = .5;
        sprite.tint = tint;
        let scale = game.width*size/sprite.width;
        sprite.scale.setTo(scale,scale);
        groups.status.add(sprite);
        game.world.bringToTop(groups.status);
    },
    ready: function(){
        gameStatus.code = 1;
        gameStatus.showMessage("ready",.5, 0xFF0000);
        setTimeout(gameStatus.set,gameStatus.titleTimeOut);
        maze.Generate();
    },
    set: function(){
        gameStatus.code = 2;
        gameStatus.showMessage("set",.6, 0xFFFF00);
        setTimeout(gameStatus.go,gameStatus.titleTimeOut);
    },
    go: function (){
        gameStatus.code = 3;
        gameStatus.showMessage("GO",.80,0x00FF00);
        setTimeout(gameStatus.gameOn,gameStatus.titleTimeOut);
    },
    gameOn:function (){
        prey.start();
        predator.start();
        gameStatus.code = 4;
        groups.status.removeAll();
        setInterval(gameStatus.update, gameStatus.refreshRate);
    },
    gameOver:function(){
        gameStatus.code = 5;
        gameStatus.showMessage("game over",.8);
    },
    youWin:function(){
        gameStatus.code = 6;
        gameStatus.showMessage("you win",.8);
    },
    update:function(){
        if (gameStatus.code !== 4) return;
        prey.move();
        predator.move();
    }
}
