let gameStatus = {
    updateInterval: null,
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
        groups.status.removeAll();
        groups.maze.removeAll();
        groups.agents.removeAll();
        let back = game.add.image(0, 0, 'background');
        back.scale.setTo(game.width/back.width,game.height/back.height);
        groups.menu.add(back);

        gameStatus.code = 0;
        let options=[];
        for (let i = 0;i < gameStatus.maps.length ;i++) options.push(gameStatus.maps[i].name);
        gameStatus.mapSpinner = new Spinner(game.width * .1,game.height * .3,game.width *.8,game.height *.1,options,"8bit");
        gameStatus.modSpinner = new Spinner(game.width * .1,game.height * .5,game.width *.8,game.height *.1,["beginner","expert"],"8bit");
        groups.status.removeAll();
        let text = game.add.bitmapText(game.width/2,game.height * .125, '8bit',"Game Menu",54);
        text.anchor.x = .5;
        text.anchor.y = .5;
        groups.menu.add(text);
        let playButton = game.add.bitmapText(game.width/2,game.height * .9, '8bit',"play",40);
        playButton.anchor.x = .5;
        playButton.anchor.y = .5;
        groups.menu.add(playButton);
        playButton.inputEnabled = true;
        playButton.events.onInputDown.add(gameStatus.ready, this);
    },
    ready: function(){
        groups.menu.removeAll(true);
        gameStatus.mapSpinner.clear();
        gameStatus.modSpinner.clear();
        gameStatus.code = 1;
        gameStatus.showMessage("ready",.5, 0xFF0000);
        setTimeout(gameStatus.set,gameStatus.titleTimeOut);
        maze.mode = gameStatus.modSpinner.selected;
        maze.loadWorld(gameStatus.maps[gameStatus.mapSpinner.selected].name,0);
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
        gameStatus.updateInterval = setInterval(gameStatus.update, gameStatus.refreshRate);
    },
    gameOver:function(){
        clearInterval(gameStatus.updateInterval);
        gameStatus.code = 5;
        maze.draw();
        gameStatus.showMessage("game over",.8);
        setTimeout(gameStatus.menu,gameStatus.titleTimeOut * 5);
    },
    youWin:function(){
        clearInterval(gameStatus.updateInterval);
        gameStatus.code = 6;
        gameStatus.showMessage("you win",.8);
        setTimeout(gameStatus.menu,gameStatus.titleTimeOut * 5);
    },
    update:function(){
        if (gameStatus.code !== 4) return;
        prey.move();
        predator.move();
    }
}
