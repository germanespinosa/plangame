let game_status = {
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
        game_status.code = 1;
        game_status.showMessage("ready",.5);
        setTimeout(game_status.set,game_status.titleTimeOut);
        maze.Generate();
    },
    set: function(){
        game_status.code = 2;
        game_status.showMessage("set",.6);
        setTimeout(game_status.go,game_status.titleTimeOut);
    },
    go: function (){
        game_status.code = 3;
        game_status.showMessage("go",.8);
        setTimeout(game_status.gameOn,game_status.titleTimeOut);
    },
    gameOn:function (){
        prey.start();
        predator.start();
        game_status.code = 4;
        groups.status.removeAll();
        setInterval(game_status.update, game_status.refreshRate);
    },
    gameOver:function(){
        game_status.code = 5;
        game_status.showMessage("game_over",.8);
    },
    youWin:function(){
        game_status.code = 6;
        game_status.showMessage("you_win",.8);
    },
    update:function(){
        if (game_status.code !== 4) return;
        prey.move();
        predator.move();
        if (prey.x === predator.x && prey.y === predator.y) game_status.gameOver();
    }
}
