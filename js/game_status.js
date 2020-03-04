let gameStatus = {
    updatePreyInterval: null,
    updatePredatorInterval: null,
    titleTimeOut : 1000,
    preyUpdateRate: 3,
    predatorUpdateRate: 4.5,
    code: 0,
    maps:[],
    predatorRandomness: 4, //%25 percent random
    showMessage:function(message, size, tint = 0xFFFFFF, location = {x:  .5, y: .5}){
        let sprite = game.add.bitmapText(game.width * location.x,game.height * location.y, '8bit',message,34);
        sprite.anchor.x = .5;
        sprite.anchor.y = .5;
        sprite.tint = tint;
        let scaleX = game.width * size.w / sprite.width;
        let scaleY = game.width * size.h / sprite.height;
        sprite.scale.setTo(scaleX<scaleY?scaleX:scaleY,scaleX<scaleY?scaleX:scaleY);
        groups.status.add(sprite);
        game.world.bringToTop(groups.status);
        return sprite;
    },
    menu: function (){
        groups.status.removeAll();
        groups.maze.removeAll();
        groups.agents.removeAll();
        let back = game.add.image(0, 0, 'background');
        back.scale.setTo(game.width / back.width,game.height / back.height);
        groups.status.add(back);

        gameStatus.code = 0;
        let options = [];
        for (let i = 0;i < gameStatus.maps.length ;i++) options.push(gameStatus.maps[i].name);
        gameStatus.mapSpinner = new Spinner(game.width * .1,game.height * .20,game.width *.8,game.height *.1,options,"8bit", groups.status);
        gameStatus.modSpinner = new Spinner(game.width * .1,game.height * .35,game.width *.8,game.height *.1,["beginner","expert"],"8bit", groups.status);
        gameStatus.speedSpinner = new Spinner(game.width * .1,game.height * .50,game.width *.8,game.height *.1,["normal","fast", "fastest", "slowest", "slow"],"8bit", groups.status);
        gameStatus.randomnessSpinner = new Spinner(game.width * .1,game.height * .65,game.width *.8,game.height *.1,["natural","assertive", "random"],"8bit", groups.status);
        gameStatus.showMessage("GAME MENU",{w:.8,h:.1},0xFFFFFF,{x:.5,y:.10});

        let playButton = gameStatus.showMessage("PLAY",{w:.8,h:.1},0xFFFFFF,{x:.5,y:.9});
        playButton.anchor.x = .5;
        playButton.anchor.y = .5;
        groups.status.add(playButton);
        playButton.inputEnabled = true;
        playButton.events.onInputDown.add(gameStatus.ready, this);
    },
    ready: function(){
        let speeds = [3,4,6,1.5,2];
        gameStatus.preyUpdateRate = speeds[gameStatus.speedSpinner.selected];
        gameStatus.predatorUpdateRate = gameStatus.preyUpdateRate * 1.5;
        let randomness = [4,8,2];
        gameStatus.predatorRandomness = randomness[gameStatus.randomnessSpinner.selected];
        groups.status.removeAll(true);
        gameStatus.code = 1;
        gameStatus.showMessage("ready",{w:.5,h:1}, 0xFF0000);
        setTimeout(gameStatus.set,gameStatus.titleTimeOut);
        maze.mode = gameStatus.modSpinner.selected;
        maze.loadWorld(gameStatus.maps[gameStatus.mapSpinner.selected].name,0);
        gameStatus.mapSpinner.destroy();
        gameStatus.modSpinner.destroy();
        gameStatus.speedSpinner.destroy();
        gameStatus.randomnessSpinner.destroy();
    },
    set: function(){
        gameStatus.code = 2;
        groups.status.removeAll();
        gameStatus.showMessage("set",{w:.6,h:1}, 0xFFFF00);
        setTimeout(gameStatus.go,gameStatus.titleTimeOut);
    },
    go: function (){
        gameStatus.code = 3;
        groups.status.removeAll();
        gameStatus.showMessage("GO",{w:.80,h:1},0x00FF00);
        setTimeout(gameStatus.gameOn,gameStatus.titleTimeOut);
    },
    gameOn:function (){
        groups.status.removeAll();
        prey.start();
        predator.start();
        gameStatus.code = 4;
        maze.draw();
        gameStatus.updatePreyInterval = setInterval(gameStatus.updatePrey, 1000/ gameStatus.preyUpdateRate);
        gameStatus.updatePredatorInterval = setInterval(gameStatus.updatePredator, 1000 / gameStatus.predatorUpdateRate);
    },
    gameOver:function(){
        clearInterval(gameStatus.updatePreyInterval);
        clearInterval(gameStatus.updatePredatorInterval);
        gameStatus.code = 5;
        maze.draw();
        gameStatus.showMessage("game over",{w:.8,h:1});
        setTimeout(gameStatus.menu,gameStatus.titleTimeOut * 5);
    },
    youWin:function(){
        clearInterval(gameStatus.updatePreyInterval);
        clearInterval(gameStatus.updatePredatorInterval);
        gameStatus.code = 6;
        maze.draw();
        gameStatus.showMessage("you win",{w:.8,h:1});
        setTimeout(gameStatus.menu,gameStatus.titleTimeOut * 5);
    },
    updatePrey:function(){
        if (gameStatus.code === 4) prey.move();
    },
    updatePredator:function(){
        if (gameStatus.code === 4) predator.move();
    }
}
