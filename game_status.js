let game_status = {
    titleTimeOut : 1000,
    refreshRate: 300,
    code: 0,
    ready: function(){
        game_status.code = 1;
        let sprite = game.add.sprite(200,290,"ready");
        sprite.scale.setTo(1,1);
        groups.status.add(sprite);
        game.world.bringToTop(groups.status);
        setTimeout(game_status.set,game_status.titleTimeOut);
        maze.Generate();
    },
    set: function(){
        game_status.code = 2;
        groups.status.removeAll();
        let sprite = game.add.sprite(280,290,"set")
        sprite.scale.setTo(1,1);
        groups.status.add(sprite);
        game.world.bringToTop(groups.status);
        setTimeout(game_status.go,game_status.titleTimeOut);
    },
    go: function (){
        game_status.code = 3;
        groups.status.removeAll();
        let sprite = game.add.sprite(140,220,"go");
        sprite.scale.setTo(3.5,3.5);
        groups.status.add(sprite);
        game.world.bringToTop(groups.status);
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
        groups.status.removeAll();
        let sprite = game.add.sprite(60,280,"game_over");
        sprite.scale.setTo(1,1);
        groups.status.add(sprite);
    },
    update:function(){
        if (game_status.code !== 4) return;
        prey.move();
        predator.move();
        if (prey.x === predator.x && prey.y === predator.y) game_status.gameOver();
    }
}
