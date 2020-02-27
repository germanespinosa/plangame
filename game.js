var refreshRate = 200;
var game;
var tileSize = 48;
var sightRadius = 30;
var scale = 4;
window.onload = function () {
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

var prey = {
    x:7,
    y:14,
    nextMove : {x:0,y:0},
     addMove: function(pos){
          var new_pos = {
               x:pos.x,
               y:pos.y
          };
          new_pos.x += prey.x;
          new_pos.y += prey.y;
          return new_pos;
     },
     setNextMove: function(move){
         prey.nextMove.x = move.x;
         prey.nextMove.y = move.y;
    },
     move: function() {
          if (!prey.checkMove(prey.nextMove)) return false;
          prey.x += prey.nextMove.x;
          prey.y += prey.nextMove.y;
          return true;
     },
     checkMove: function(move){
          var candidate = prey.addMove(move);
          return candidate.x >= 0 &&
              candidate.y >= 0 &&
              candidate.x < Dungeon.map_size &&
              candidate.y < Dungeon.map_size &&
              Dungeon.map[candidate.y][candidate.x] == 1;
     }
};

var key_up;
var key_down;
var key_left;
var key_right;

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
          this.lineGroup = game.add.group();
          prey.playerPosition = game.add.sprite(prey.x * tileSize, prey.y * tileSize, "tile");
          prey.playerPosition.scale.setTo(scale,scale)
          prey.playerPosition.tint = 0x00ff00;
          prey.playerPosition.alpha = 0.5;
          setInterval(this.time_out, refreshRate);
     },
     update: function(){
          this.visited = [];
          this.visited.length = 0;
          this.lineGroup.removeAll(true);
          this.drawCircle( prey.x, prey.y , sightRadius);
     },
     time_out: function (){
          var move=stay;
          if (!predator.contact) { // no visual contact random move
               predator.randomMove();
          } else {
               predator.moveTowards(prey);
          }
          if (game.input.keyboard.isDown(Phaser.Keyboard.LEFT)) {
               console.log("left");
               prey.setNextMove(left);
          } else if (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) {
               console.log("right");
               prey.setNextMove(right);
          } else if (game.input.keyboard.isDown(Phaser.Keyboard.UP)) {
               console.log("up");
               prey.setNextMove(up);
          } else if (game.input.keyboard.isDown(Phaser.Keyboard.DOWN)) {
               console.log("down");
               prey.setNextMove(down);
          } else {
               prey.setNextMove(stay);
          }
          prey.move();
          prey.playerPosition.x = prey.x * tileSize;
          prey.playerPosition.y = prey.y * tileSize;
          predator.contact = false;
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
                    if (y0==predator.y && x0==predator.x) {
                         tile.tint = 0xff0000;
                         predator.contact = true;
                    } else {
                         tile.tint = 0xffffAA;
                    }
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

Dungeon.Generate();