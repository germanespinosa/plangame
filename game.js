var game;
var tileSize = 48;
var sightRadius = 30;
var scale = 4;
window.onload = function() {	
	game = new Phaser.Game(720, 720, Phaser.AUTO, "");
     game.state.add("PlayGame", playGame);
     game.state.start("PlayGame");
}

const stay = {x:0,y:0};
const left = {x:-1,y:0};
const right = {x:1,y:0};
const up = {x:0,y:-1};
const down = {x:0,y:1};
const moves = [left, right, down, up];
var playGame = function(game){};

playGame.prototype = {
     preload: function(){
          myimage = game.load.image("tile", "tile.png");
     },
     create: function(){
          for(var i = 0; i < Dungeon.map_size; i++){
               for(var j = 0; j < Dungeon.map_size; j++){
                    var tile = Dungeon.map[j][i];
                    if(tile == 0){
                         var wall = game.add.sprite(i * tileSize, j * tileSize, "tile");
                         wall.scale.setTo(scale,scale)
                         wall.tint = 0x222222;
                    }
                    if(tile == 2){
                         var wall = game.add.sprite(i * tileSize, j * tileSize, "tile");
                         wall.scale.setTo(scale,scale)
                         wall.tint = 0x555555;
                    }
               }
          }
          var startCol = 7;
          var startRow = 14;
          this.lineGroup = game.add.group();
          this.playerPosition = game.add.sprite(startCol * tileSize, startRow * tileSize, "tile");
          this.playerPosition.scale.setTo(scale,scale)
          this.playerPosition.tint = 0x00ff00;
          this.playerPosition.alpha = 0.5;
          this.playerPosition.inputEnabled = true;
          this.playerPosition.input.enableDrag();
          this.playerPosition.input.boundsRect = new Phaser.Rectangle(0, 0, game.width, game.height);
          this.playerPosition.input.enableSnap(tileSize, tileSize, true, true);
          setInterval(this.time_out, 500);
     },
     update: function(){
          this.visited = [];
          this.visited.length = 0;
          this.lineGroup.removeAll(true);
          this.drawCircle(this.playerPosition.x / tileSize, this.playerPosition.y / tileSize, sightRadius);
     },
     contact: false,
     time_out: function (){
          var move=stay;
          if (!this.contact) { // no visual contact random move
               predator.randomMove();
          }
          console.log(predator);
     },
     drawBresenham: function(x0, y0, x1, y1){
          var saveX0 = x0;
          var saveY0 = y0;
          var dx = Math.abs(x1 - x0);
          var sx = -1;
          if(x0 < x1){
               var sx = 1
          }
          var dy = Math.abs(y1 - y0);
          var sy = -1;
          if(y0 < y1){
               var sy = 1;
          }
          var err = -dy / 2;
          if(dx > dy){
               err = dx / 2;
          }
          do{
               if(x0 < 0 || y0 < 0 || x0 >= Dungeon.map_size || y0 >= Dungeon.map_size || Dungeon.map[y0][x0] != 1){
                    break;
               }
               var dist = this.distance(saveX0, saveY0, x0, y0);
               if (dist > sightRadius / 2){
                    break;
               }
               if(this.visited.indexOf(x0 + "," + y0) == -1){
                    var tile = game.add.sprite(x0 * tileSize, y0 * tileSize, "tile");
                    tile.scale.setTo(scale,scale);
                    if (y0==predator.y && x0==predator.x)
                         tile.tint = 0xff0000;
                    else
                         tile.tint = 0xffffAA;
                    tile.alpha = 1 - dist / (sightRadius / 2);
                    this.visited.push(x0 + "," + y0);
                    this.lineGroup.add(tile);
               }
               var e2 = err;
               if(e2 > -dx){
                    err -= dy;
                    x0 += sx;
               }
               if(e2 < dy){
                    err += dx;
                    y0 += sy;
               }
          } while(x0 != x1 || y0 != y1)        
     },
     drawCircle: function(x0, y0, radius){
          var x = -radius
          var y = 0;
          var err = 2 - 2 * radius; 
          do {
               this.drawBresenham(this.playerPosition.x / tileSize, this.playerPosition.y / tileSize, (x0 - x), (y0 + y));
               this.drawBresenham(this.playerPosition.x / tileSize, this.playerPosition.y / tileSize, (x0 - y), (y0 - x));
               this.drawBresenham(this.playerPosition.x / tileSize, this.playerPosition.y / tileSize, (x0 + x), (y0 - y));
               this.drawBresenham(this.playerPosition.x / tileSize, this.playerPosition.y / tileSize, (x0 + y), (y0 + x));
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

Dungeon.Generate();