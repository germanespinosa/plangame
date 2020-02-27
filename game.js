var game;
var tileSize = 12;
var sightRadius = 30;

window.onload = function() {	
	game = new Phaser.Game(768, 768, Phaser.AUTO, "");
     game.state.add("PlayGame", playGame);
     game.state.start("PlayGame");
}

var playGame = function(game){};

playGame.prototype = {
     preload: function(){
           game.load.image("tile", "tile.png");
     },
     create: function(){
          for(var i = 0; i < Dungeon.map_size; i++){
               for(var j = 0; j < Dungeon.map_size; j++){
                    var tile = Dungeon.map[j][i];
                    if(tile == 0){
                         var wall = game.add.sprite(i * tileSize, j * tileSize, "tile");   
                         wall.tint = 0x222222;       
                    }
                    if(tile == 2){
                         var wall = game.add.sprite(i * tileSize, j * tileSize, "tile");   
                         wall.tint = 0x555555;       
                    }
               }
          }
          var startCol = game.rnd.between(0, Dungeon.map_size - 1);
          var startRow = game.rnd.between(0, Dungeon.map_size - 1);
          this.lineGroup = game.add.group();
          this.playerPosition = game.add.sprite(startCol * tileSize, startRow * tileSize, "tile");
          this.playerPosition.tint = 0x00ff00;
          this.playerPosition.alpha = 0.5;
          this.playerPosition.inputEnabled = true;
          this.playerPosition.input.enableDrag();
          this.playerPosition.input.boundsRect = new Phaser.Rectangle(0, 0, game.width, game.height);
          this.playerPosition.input.enableSnap(tileSize, tileSize, true, true);
          
     },
     update: function(){
          this.visited = [];
          this.visited.length = 0;
          this.lineGroup.removeAll(true);
          this.drawCircle(this.playerPosition.x / tileSize, this.playerPosition.y / tileSize, sightRadius);
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
               var dist = this.distance(saveX0, saveY0, x0, y0);
               if(x0 < 0 || y0 < 0 || x0 >= Dungeon.map_size || y0 >= Dungeon.map_size || Dungeon.map[y0][x0] != 1 || dist > sightRadius / 2){
                    break;
               }
               if(this.visited.indexOf(x0 + "," + y0) == -1){
                    var tile = game.add.sprite(x0 * tileSize, y0 * tileSize, "tile");
                    tile.tint = 0xffff00;
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

var Dungeon = {
    map: null,
    map_size: 64,
    rooms: [],
    Generate: function () {
        this.map = [];
        for (var x = 0; x < this.map_size; x++) {
            this.map[x] = [];
            for (var y = 0; y < this.map_size; y++) {
                this.map[x][y] = 0;
            }
        }

        var room_count = Helpers.GetRandom(10, 20);
        var min_size = 5;
        var max_size = 15;

        for (var i = 0; i < room_count; i++) {
            var room = {};

            room.x = Helpers.GetRandom(1, this.map_size - max_size - 1);
            room.y = Helpers.GetRandom(1, this.map_size - max_size - 1);
            room.w = Helpers.GetRandom(min_size, max_size);
            room.h = Helpers.GetRandom(min_size, max_size);

            if (this.DoesCollide(room)) {
                i--;
                continue;
            }
            room.w--;
            room.h--;

            this.rooms.push(room);
        }

        this.SquashRooms();

        for (i = 0; i < room_count; i++) {
            var roomA = this.rooms[i];
            var roomB = this.FindClosestRoom(roomA);

            pointA = {
                x: Helpers.GetRandom(roomA.x, roomA.x + roomA.w),
                y: Helpers.GetRandom(roomA.y, roomA.y + roomA.h)
            };
            pointB = {
                x: Helpers.GetRandom(roomB.x, roomB.x + roomB.w),
                y: Helpers.GetRandom(roomB.y, roomB.y + roomB.h)
            };

            while ((pointB.x != pointA.x) || (pointB.y != pointA.y)) {
                if (pointB.x != pointA.x) {
                    if (pointB.x > pointA.x) pointB.x--;
                    else pointB.x++;
                } else if (pointB.y != pointA.y) {
                    if (pointB.y > pointA.y) pointB.y--;
                    else pointB.y++;
                }

                this.map[pointB.x][pointB.y] = 1;
            }
        }

        for (i = 0; i < room_count; i++) {
            var room = this.rooms[i];
            for (var x = room.x; x < room.x + room.w; x++) {
                for (var y = room.y; y < room.y + room.h; y++) {
                    this.map[x][y] = 1;
                }
            }
        }

        for (var x = 0; x < this.map_size; x++) {
            for (var y = 0; y < this.map_size; y++) {
                if (this.map[x][y] == 1) {
                    for (var xx = x - 1; xx <= x + 1; xx++) {
                        for (var yy = y - 1; yy <= y + 1; yy++) {
                            if (this.map[xx][yy] == 0) this.map[xx][yy] = 2;
                        }
                    }
                }
            }
        }
    },
    FindClosestRoom: function (room) {
        var mid = {
            x: room.x + (room.w / 2),
            y: room.y + (room.h / 2)
        };
        var closest = null;
        var closest_distance = 1000;
        for (var i = 0; i < this.rooms.length; i++) {
            var check = this.rooms[i];
            if (check == room) continue;
            var check_mid = {
                x: check.x + (check.w / 2),
                y: check.y + (check.h / 2)
            };
            var distance = Math.min(Math.abs(mid.x - check_mid.x) - (room.w / 2) - (check.w / 2), Math.abs(mid.y - check_mid.y) - (room.h / 2) - (check.h / 2));
            if (distance < closest_distance) {
                closest_distance = distance;
                closest = check;
            }
        }
        return closest;
    },
    SquashRooms: function () {
        for (var i = 0; i < 10; i++) {
            for (var j = 0; j < this.rooms.length; j++) {
                var room = this.rooms[j];
                while (true) {
                    var old_position = {
                        x: room.x,
                        y: room.y
                    };
                    if (room.x > 1) room.x--;
                    if (room.y > 1) room.y--;
                    if ((room.x == 1) && (room.y == 1)) break;
                    if (this.DoesCollide(room, j)) {
                        room.x = old_position.x;
                        room.y = old_position.y;
                        break;
                    }
                }
            }
        }
    },
    DoesCollide: function (room, ignore) {
        for (var i = 0; i < this.rooms.length; i++) {
            if (i == ignore) continue;
            var check = this.rooms[i];
            if (!((room.x + room.w < check.x) || (room.x > check.x + check.w) || (room.y + room.h < check.y) || (room.y > check.y + check.h))) return true;
        }

        return false;
    }
}

var Helpers = {
    GetRandom: function (low, high) {
        return~~ (Math.random() * (high - low)) + low;
    }
};

Dungeon.Generate();