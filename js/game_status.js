let gameStatus = {
    titleTimeOut : 1000,
    refreshRate: 300,
    code: 0,
    maps:[],
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
    menu: function (){
        gameStatus.code = 0;
        let options=[];
        for (let i = 0;i < gameStatus.maps.length ;i++) options.push(gameStatus.maps[i].name);
        gameStatus.spinner = new Spinner(50,50,620,50,options,"8bit");
        groups.status.removeAll();
        let playButton = game.add.bitmapText(game.width/2,game.height/2, '8bit',"play",40);
        playButton.anchor.x = .5;
        playButton.anchor.y = .5;
        groups.status.add(playButton);
        playButton.inputEnabled = true;
        playButton.events.onInputDown.add(gameStatus.ready, this);
    },
    ready: function(){
        gameStatus.spinner.clear();
        gameStatus.code = 1;
        gameStatus.showMessage("ready",.5, 0xFF0000);
        setTimeout(gameStatus.set,gameStatus.titleTimeOut);
        maze.loadWorld(gameStatus.maps[gameStatus.spinner.selected].name,0);
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
        groups.status.removeAll();
        prey.start();
        predator.start();
        gameStatus.code = 4;
        maze.draw();
        setInterval(gameStatus.update, gameStatus.refreshRate);
    },
    gameOver:function(){
        gameStatus.code = 5;
        maze.draw();
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
