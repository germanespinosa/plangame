var game;
var tileSize = 48;
var scale = 4;

window.onload = function () {
	 game = new Phaser.Game(1000, 700, Phaser.AUTO, "game-div");
     game.state.add("PlayGame", playGame);
     game.state.start("PlayGame");
}

var playGame = function(game){};

let groups = {
     maze:null,
     status:null
}

playGame.prototype = {
     preload: function(){
          game.load.image("goal", "img/goal.png");
          game.load.image("tile", "img/tile.png");
          game.load.image("wall", "img/wall.png");
          game.load.image("prey", "img/prey.png");
          game.load.image("predator", "img/predator.png");
          game.load.image("ready", "img/ready.png");
          game.load.image("set", "img/set.png");
          game.load.image("go", "img/go.png");
          game.load.image("game_over", "img/game_over.png");
          game.load.image("you_win", "img/you_win.png");
     },
     create: function(){
          groups.status = game.add.group();
          groups.maze = game.add.group();
          gameStatus.ready();
     },
     update: function(){
          this.visited = [];
          this.visited.length = 0;
          if (maze.ready) {
               maze.draw();
               maze.drawVisibility(prey);
               predator.draw();
               prey.draw();
          }
     },
}

var Helpers = {
    GetRandom: function (low, high) {
        return~~ (Math.random() * (high - low)) + low;
    },
    GetRandomInt: function (ceiling) {
         return Math.floor(Helpers.GetRandom(0,ceiling));
    },
    GetRandomElement: function (arr) {
         return arr[Helpers.GetRandomInt(arr.length)];
    }
};