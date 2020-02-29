var game;
var tileSize = 48;
var scale = 4;

window.onload = function () {
	 game = new Phaser.Game(720, 720, Phaser.AUTO, "game-div");
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
          game.load.image("goal", "goal.png");
          game.load.image("tile", "tile.png");
          game.load.image("wall", "tile.png");
          game.load.image("prey", "prey.png");
          game.load.image("predator", "predator.png");
          game.load.image("ready", "ready.png");
          game.load.image("set", "set.png");
          game.load.image("go", "go.png");
          game.load.image("game_over", "game_over.png");
     },
     create: function(){
          groups.status = game.add.group();
          groups.maze = game.add.group();
          game_status.ready();
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