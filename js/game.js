let game;

window.onload = function () {
     let body = document.body;
     let w = body.clientWidth;
     let h = body.clientHeight;
     let size = w<1024?w:1024;
     loadMaps( function (maps, images){
          gameStatus.maps = maps;
          gameStatus.images = images;
          game = new Phaser.Game(size, size, Phaser.AUTO, "game-div");
          game.state.add("PlayGame", playGame);
          game.state.start("PlayGame");
     });
}

let playGame = function(game){};

let groups = {
     maze:null,
     status:null,
     agents:null,
     tiles:null
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
          groups.tiles = game.add.group();
          gameStatus.menu();

          prey.keyLeft = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
          prey.keyRight = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
          prey.keyUp = game.input.keyboard.addKey(Phaser.Keyboard.UP);
          prey.keyDown = game.input.keyboard.addKey(Phaser.Keyboard.DOWN);

          prey.keyLeft.onDown.add(prey.onLeftKeyDown);
          prey.keyRight.onDown.add(prey.onRightKeyDown);
          prey.keyUp.onDown.add(prey.onUpKeyDown);
          prey.keyDown.onDown.add(prey.onDownKeyDown);

          prey.keyLeft.onUp.add(prey.onLeftKeyUp);
          prey.keyRight.onUp.add(prey.onRightKeyUp);
          prey.keyUp.onUp.add(prey.onUpKeyUp);
          prey.keyDown.onUp.add(prey.onDownKeyUp);

          virtualGamePad.addEventListener("leftdown", prey.onLeftKeyDown);
          virtualGamePad.addEventListener("rightdown", prey.onRightKeyDown);
          virtualGamePad.addEventListener("updown", prey.onUpKeyDown);
          virtualGamePad.addEventListener("downdown", prey.onDownKeyDown);

          virtualGamePad.addEventListener("leftup", prey.onLeftKeyUp);
          virtualGamePad.addEventListener("rightup", prey.onRightKeyUp);
          virtualGamePad.addEventListener("upup", prey.onUpKeyUp);
          virtualGamePad.addEventListener("downup", prey.onDownKeyUp);

          virtualGamePad.start(game.width*.10);

     },
     update: function(){
          this.visited = [];
          this.visited.length = 0;
          if (gameStatus.code===4) {
               maze.draw();
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
