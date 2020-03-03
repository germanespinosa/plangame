var game;
var tileSize = 48;
var scale = 4;

window.onload = function () {
     let div = document.getElementById("game-div")
     loadMaps( function (maps, images){
          gameStatus.maps = maps;
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
               game.load.image(gameStatus.images[i].name, gameStatus.images[i].url + "?r=" + Math.random());
          }
          game.load.image("tile", "img/tile.png");
          game.load.bitmapFont('8bit', 'fonts/8bit.png', 'fonts/8bit.xml');
          //game.load.script('spinner', 'js/spinner.js?r=' + Math.random());
          game.load.script('maze', 'js/maze.js?r=' + Math.random());
          game.load.script('prey', 'js/prey.js?r=' + Math.random());
          game.load.script('predator', 'js/predator.js?r=' + Math.random());
     },
     create: function(){
          groups.agents = game.add.group()
          groups.status = game.add.group();
          groups.maze = game.add.group();
          groups.menu = game.add.group();
          gameStatus.menu();
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

function loadMaps (callback) {
     let request = new XMLHttpRequest();
     request.overrideMimeType("application/json");
     request.open('GET', 'maps/maps.json?r=' + Math.random(), true);
     request.onreadystatechange = function () {
          if (request.readyState === 4 && request.status === 200) {
               loadImages(callback, JSON.parse(request.responseText));
          }
     };
     request.send(null);
}


function loadImages (callback, maps) {
     let request = new XMLHttpRequest();
     request.overrideMimeType("application/json");
     request.open('GET', 'img/images.json?r=' + Math.random(), true);
     request.onreadystatechange = function () {
          if (request.readyState === 4 && request.status === 200) {
               callback (maps, JSON.parse(request.responseText));
          }
     };
     request.send(null);
}
