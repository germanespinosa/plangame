var game_status = {
    titleTimeOut : 1000,
    refreshRate: 300,
    code: 0,
    group: {},
    ready: function(){
        game_status.code = 1;
        game_status.group = game.add.group();
        var sprite = game.add.sprite(200,290,"ready");
        sprite.scale.setTo(1,1);
        game_status.group.add(sprite);
        setTimeout(game_status.set,game_status.titleTimeOut);
    },
    set: function(){
        game_status.code = 2;
        game_status.group.removeAll();
        var sprite = game.add.sprite(280,290,"set")
        sprite.scale.setTo(1,1);
        game_status.group.add(sprite);
        setTimeout(game_status.go,game_status.titleTimeOut);
    },
    go: function (){
        game_status.code = 3;
        game_status.group.removeAll();
        var sprite = game.add.sprite(140,220,"go");
        sprite.scale.setTo(3.5,3.5);
        game_status.group.add(sprite);
        setTimeout(game_status.gameOn,game_status.titleTimeOut);
    },
    gameOn:function (){
        game_status.code = 4;
        game_status.group.removeAll();
        setInterval(game_status.update, game_status.refreshRate);
    },
    gameOver:function(){
        game_status.code = 5;
        game_status.group.removeAll();
        var sprite = game.add.sprite(60,280,"game_over");
        sprite.scale.setTo(1,1);
        game_status.group.add(sprite);
    },
    update:function(){
        if (game_status.code != 4) return;
        prey.move();
        predator.move();
        if (prey.x == predator.x && prey.y == predator.y) game_status.gameOver();
        prey.playerPosition.x = prey.x * tileSize;
        prey.playerPosition.y = prey.y * tileSize;
        predator.contact = false;
    }
}
