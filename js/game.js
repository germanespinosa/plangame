var game;
var tileSize = 48;
var scale = 4;

window.onload = function () {
     let div = document.getElementById("game-div")
     loadImages( function (images){
          gameStatus.images = images;
          game = new Phaser.Game(div.clientWidth, div.clientHeight, Phaser.AUTO, "game-div");
          game.state.add("PlayGame", playGame);
          game.state.start("PlayGame");
     });
}

var playGame = function(game){};

let groups = {
     maze:null,
     status:null
}

playGame.prototype = {
     preload: function(){
          for (let i=0;i<gameStatus.images.length;i++){
               game.load.image(gameStatus.images[i].name, gameStatus.images[i].url);
          }
          game.load.image("tile", "img/tile.png");
          game.load.image("wall", "img/tile.png");
          game.load.image("goal", "img/tile.png");
          game.load.image("prey", "img/tile.png");
          game.load.image("predator", "img/tile.png");
          game.load.image("ready", "img/ready.png");
          game.load.image("set", "img/set.png");
          game.load.image("go", "img/go.png");
          game.load.image("game_over", "img/game_over.png");
          game.load.image("you_win", "img/you_win.png");
          game.load.bitmapFont('8bit', 'fonts/8bit.png', 'fonts/8bit.xml');
          game.load.script('maze', 'js/maze.js?r=' + Math.random());
          game.load.script('prey', 'js/prey.js?r=' + Math.random());
          game.load.script('predator', 'js/predator.js?r=' + Math.random());
     },
     create: function(){
          groups.agents = game.add.group()
          groups.status = game.add.group();
          groups.maze = game.add.group();
          gameStatus.ready();
     },
     update: function(){
          this.visited = [];
          this.visited.length = 0;
          if (gameStatus.code===4) {
               maze.draw();
               maze.drawVisibility(prey);
          }
     },
}

var Helpers = {
    GetRandom: function (low, high) {
        return~~ (Math.random() * (high - low)) + low;
    },
    /**
     * @return {number}
     */
    GetRandomInt: function (ceiling) {
         return Math.floor(Helpers.GetRandom(0,ceiling));
    },
    GetRandomElement: function (arr) {
         return arr[Helpers.GetRandomInt(arr.length)];
    }
};

function loadImages (callback) {
     let request = new XMLHttpRequest();
     request.overrideMimeType("application/json");
     request.open('GET', 'img/images.json?r=' + Math.random(), true);
     request.onreadystatechange = function () {
          if (request.readyState === 4 && request.status === 200) {
               callback (JSON.parse(request.responseText));
          }
     };
     request.send(null);
}
