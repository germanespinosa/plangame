var game_status = {
    timeOut : 1000,
    code: 0,
    group: {},
    ready: function(){
        game_status.code = 1;
        game_status.group = game.add.group();
        var sprite = game.add.sprite(200,290,"ready");
        sprite.scale.setTo(1,1);
        game_status.group.add(sprite);
        setTimeout(game_status.set,game_status.timeOut);
    },
    set: function(){
        game_status.code = 2;
        game_status.group.removeAll();
        var sprite = game.add.sprite(280,290,"set")
        sprite.scale.setTo(1,1);
        game_status.group.add(sprite);
        setTimeout(game_status.go,game_status.timeOut);
    },
    go: function (){
        game_status.code = 3;
        game_status.group.removeAll();
        var sprite = game.add.sprite(140,220,"go");
        sprite.scale.setTo(3.5,3.5);
        game_status.group.add(sprite);
        setTimeout(game_status.gameOn,game_status.timeOut);
    },
    gameOn:function (){
        game_status.code = 4;
        game_status.group.removeAll();
    },
    gameOver:function(){
        game_status.code = 5;
        game_status.group.removeAll();
        var sprite = game.add.sprite(60,280,"game_over");
        sprite.scale.setTo(1,1);
        game_status.group.add(sprite);
    }
}
