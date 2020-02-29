let gameStatus = {
    titleTimeOut : 1000,
    refreshRate: 300,
    code: 0,
    showMessage:function(message,size){
        groups.status.removeAll();
        let sprite = game.add.sprite(game.width/2,game.height/2,message);
        sprite.anchor.x = .5;
        sprite.anchor.y = .5;
        let scale = game.width/game.cache.getImage(message).width*size;
        sprite.scale.setTo(scale,scale);
        groups.status.add(sprite);
        game.world.bringToTop(groups.status);
    },
    ready: function(){
        gameStatus.code = 1;
        gameStatus.showMessage("ready",.5);
        setTimeout(gameStatus.set,gameStatus.titleTimeOut);
        maze.Generate();
    },
    set: function(){
        gameStatus.code = 2;
        gameStatus.showMessage("set",.6);
        setTimeout(gameStatus.go,gameStatus.titleTimeOut);
    },
    go: function (){
        gameStatus.code = 3;
        gameStatus.showMessage("go",.8);
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
        gameStatus.showMessage("game_over",.8);
    },
    youWin:function(){
        gameStatus.code = 6;
        gameStatus.showMessage("you_win",.8);
    },
    update:function(){
        if (gameStatus.code !== 4) return;
        prey.move();
        predator.move();
    }
}
