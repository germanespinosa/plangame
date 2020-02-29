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
}

playGame.prototype = {
     preload: function(){
          game.load.image("tile", "tile.png");
          game.load.image("ready", "ready.png");
          game.load.image("set", "set.png");
          game.load.image("go", "go.png");
          game.load.image("game_over", "game_over.png");
     },
     create: function(){
          groups.maze = game.add.group();
          this.lineGroup = game.add.group();
          prey.playerPosition = game.add.sprite(prey.x * tileSize, prey.y * tileSize, "tile");
          prey.playerPosition.scale.setTo(scale,scale)
          prey.playerPosition.tint = 0x00ff00;
          prey.playerPosition.alpha = 0.5;
          game_status.ready();
     },
     update: function(){
          this.visited = [];
          this.visited.length = 0;
          if (maze.ready) {
               maze.draw();
               this.lineGroup.removeAll(true);
               this.drawCircle(prey.x, prey.y);
          }
     },
     drawBresenham: function(x0, y0, x1, y1){
          let saveX0 = x0;
          let saveY0 = y0;
          let dx = Math.abs(x1 - x0);
          let sx = -1;
          if(x0 < x1){
               sx = 1
          }
          let dy = Math.abs(y1 - y0);
          let sy = -1;
          if(y0 < y1){
               sy = 1;
          }
          let err = -dy / 2;
          if(dx > dy){
               err = dx / 2;
          }
          do{
               if(!maze.free({x:x0, y:y0})){
                    break;
               }
               let dist = this.distance(saveX0, saveY0, x0, y0);
               if (dist > maze.visualRange){
                    break;
               }
               if(this.visited.indexOf(x0 + "," + y0) === -1){
                    let tile = game.add.sprite(x0 * tileSize, y0 * tileSize, "tile");
                    tile.scale.setTo(scale,scale);
                    if (y0===predator.y && x0===predator.x) {
                         tile.tint = 0xff0000;
                         predator.contact = true;
                    } else {
                         tile.tint = 0xffffAA;
                    }
                    tile.alpha = 1 - dist / maze.visualRange;
                    this.visited.push(x0 + "," + y0);
                    this.lineGroup.add(tile);
               }
               let e2 = err;
               if(e2 > -dx){
                    err -= dy;
                    x0 += sx;
               }
               if(e2 < dy){
                    err += dx;
                    y0 += sy;
               }
          } while(x0 !== x1 || y0 !== y1)
     },
     drawCircle: function(x0, y0){
          let radius = maze.visualRange;
          let x = -radius;
          let y = 0;
          let err = 2 - 2 * radius;
          do {
               this.drawBresenham(prey.x, prey.y, (x0 - x), (y0 + y));
               this.drawBresenham(prey.x, prey.y, (x0 - y), (y0 - x));
               this.drawBresenham(prey.x, prey.y, (x0 + x), (y0 - y));
               this.drawBresenham(prey.x, prey.y, (x0 + y), (y0 + x));
               radius = err;
               if (radius <= y){
                    y++;
                    err += y * 2 + 1;
               }          
               if (radius > x || err > y){
                    x++;
                    err += x * 2 + 1;
               } 
          } while (x < 0);    
     },
     distance: function(x0, y0, x1, y1){
          return Math.sqrt((x0-x1)*(x0-x1)+(y0-y1)*(y0-y1))     
     }
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

maze.Generate();