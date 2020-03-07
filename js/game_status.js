let gameStatus = {
    anchor:{x:0,y:0},
    updatePreyInterval: null,
    updatePredatorInterval: null,
    titleTimeOut : 1000,
    preyUpdateRate: 3,
    predatorUpdateRate: 4.5,
    spinnersValues: [0,0,0,0],
    code: 0,
    maps:[],
    predatorRandomness: 4, //%25 percent random
    showMessage:function(message, size, tint = 0xFFFFFF, location = {x:  .5, y: .5}, anchor = {x:.5,y:.5}){
        let sprite = game.add.bitmapText(game.width * location.x,game.height * location.y, '8bit',message,34);
        sprite.anchor.x = anchor.x;
        sprite.anchor.y = anchor.y;
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
        gameStatus.showMessage("SURVIVAL",{w:.95,h:.1},0xFFFFFF,{x:.5,y:.10});
        gameStatus.showMessage("MAP: ",{w:.3,h:.05},0xFFFFFF,{x:.025,y:.275}, {x:0,y:.5});
        gameStatus.showMessage("MODE: ",{w:.3,h:.05},0xFFFFFF,{x:.025,y:.425}, {x:0,y:.5});
        gameStatus.showMessage("SPEED: ",{w:.3,h:.05},0xFFFFFF,{x:.025,y:.575}, {x:0,y:.5});
        gameStatus.showMessage("PURSUIT: ",{w:.3,h:.05},0xFFFFFF,{x:.025,y:.725}, {x:0,y:.5});
        let options = [];
        for (let i = 0;i < gameStatus.maps.length ;i++) options.push(gameStatus.maps[i].name);
        gameStatus.mapSpinner = new Spinner(game.width * .325,game.height * .225,game.width *.675,game.height *.1,options,"8bit", groups.status);
        gameStatus.mapSpinner.selected = gameStatus.spinnersValues[0];
        gameStatus.mapSpinner.update();
        gameStatus.modSpinner = new Spinner(game.width * .325,game.height * .375,game.width *.675,game.height *.1,["beginner","natural"],"8bit", groups.status);
        gameStatus.modSpinner.selected = gameStatus.spinnersValues[1];
        gameStatus.modSpinner.update();
        gameStatus.speedSpinner = new Spinner(game.width * .325,game.height * .525,game.width *.675,game.height *.1,["natural","fast", "fastest", "slowest", "slow"],"8bit", groups.status);
        gameStatus.speedSpinner.selected = gameStatus.spinnersValues[2];
        gameStatus.speedSpinner.update();
        gameStatus.randomnessSpinner = new Spinner(game.width * .325,game.height * .675,game.width *.675,game.height *.1,["natural","aggressive", "fumbling"],"8bit", groups.status);
        gameStatus.randomnessSpinner.selected = gameStatus.spinnersValues[3];
        gameStatus.randomnessSpinner.update();
        let playButton = gameStatus.showMessage("PLAY",{w:.8,h:.1},0xFFFFFF,{x:.5,y:.9});
        playButton.anchor.x = .5;
        playButton.anchor.y = .5;
        groups.status.add(playButton);
        playButton.inputEnabled = true;
        playButton.events.onInputDown.add(gameStatus.ready, this);
    },
    ready: function(){
        gameStatus.spinnersValues[0] = gameStatus.mapSpinner.selected;
        gameStatus.spinnersValues[1] = gameStatus.modSpinner.selected;
        gameStatus.spinnersValues[2] = gameStatus.speedSpinner.selected;
        gameStatus.spinnersValues[3] = gameStatus.randomnessSpinner.selected;

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
        gameStatus.code = 4;
        maze.start();
        gameStatus.updatePreyInterval = 1000 / gameStatus.preyUpdateRate;
        gameStatus.updatePredatorInterval = 1000 / gameStatus.predatorUpdateRate;
        gameStatus.preyDaemon = setInterval(maze.updatePrey,gameStatus.updatePreyInterval);
        gameStatus.predatorDaemon = setInterval(maze.updatePredator,gameStatus.updatePredatorInterval);
    },
    gameOver:function(){
        clearInterval(gameStatus.preyDaemon);
        clearInterval(gameStatus.predatorDaemon);
        gameStatus.code = 5;
        maze.draw();
        gameStatus.showMessage("game over",{w:.8,h:1});
        setTimeout(gameStatus.menu,gameStatus.titleTimeOut * 5);
    },
    youWin:function(){
        clearInterval(gameStatus.preyDaemon);
        clearInterval(gameStatus.predatorDaemon);
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
