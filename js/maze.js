let maze = {
    tileScaleX:0,
    tileScaleY:0,
    wallScaleX:0,
    wallScaleY:0,
    goalScaleX:0,
    goalScaleY:0,
    tileSizeX:0,
    tileSizeY:0,
    startPosition: null,
    goalPosition: null,
    dimensions: {},
    map: null,
    visibility: null,
    ready : false,
    occlusions : [],
    scale : {},
    draw: function () {
        if (maze.ready) {
            groups.maze.removeAll();
            for (let i = 0; i < maze.occlusions.length; i++) {
                const screenPos = maze.screenLocation(maze.occlusions[i]);
                let wall = game.add.sprite(screenPos.x, screenPos.y, "wall");
                wall.scale.setTo(maze.wallScaleX, maze.wallScaleY)
                groups.maze.add(wall);
            }
            const screenPos = maze.screenLocation(maze.goalPosition);
            let goal = game.add.sprite(screenPos.x, screenPos.y, "goal");
            goal.scale.setTo(maze.goalScaleX, maze.goalScaleY)
            groups.maze.add(goal);
            game.world.sendToBack(groups.maze);
        }
    },
    Generate: function () {
        maze.loadWorld("savanna","1");
    },
    computeVisibility: function() {
        maze.visibility = maze.new_map();
        for (let x = 0; x < maze.dimensions.h; x++) {
            for (let y = 0; y < maze.dimensions.w; y++) {
                maze.visibility[x][y]=maze.new_map();
                for (let i=0; i< maze.dimensions.h;i++) {
                    for (let j = 0; j < maze.dimensions.w; j++) {
                        maze.visibility[x][y][i][j] = maze.existsViewLine({x:x,y:y},{x:i,y:j});
                    }
                }
            }
        }
    },
    loadWorld: function (world_type, world_version) {
        let request = new XMLHttpRequest();
        request.overrideMimeType("application/json");
        request.open('GET', 'maps/' +world_type + '-' + world_version + '.json', true);
        request.onreadystatechange = function () {
            if (request.readyState === 4 && request.status === 200) {
                let world = JSON.parse(request.responseText);
                maze.occlusions = world.occlusions;
                maze.dimensions = world.dimensions;
                maze.startPosition = world.startPosition;
                maze.goalPosition = world.goalPosition;

                maze.tileSizeX = game.width/maze.dimensions.w;
                maze.tileSizeY = game.height/maze.dimensions.h;
                maze.tileScaleX = maze.tileSizeX/game.cache.getImage("tile").width;
                maze.tileScaleY = maze.tileSizeY/game.cache.getImage("tile").height;
                maze.wallScaleX = maze.tileSizeX/game.cache.getImage("wall").width;
                maze.wallScaleY = maze.tileSizeY/game.cache.getImage("wall").height;
                maze.goalScaleX = maze.tileSizeX/game.cache.getImage("goal").width;
                maze.goalScaleY = maze.tileSizeY/game.cache.getImage("goal").height;

                console.log(maze.tileSizeY);
                console.log(game.cache.getImage("goal").width);
                console.log(maze.tileSizeY);
                console.log(game.cache.getImage("goal").height);
                console.log(maze.goalScaleX);
                console.log(maze.goalScaleY);

                maze.visualRange = world.visualRange;
                maze.map = maze.new_map();
                for(let i=0;i<world.occlusions.length;i++) {
                    const y = world.occlusions[i].y;
                    const x = world.occlusions[i].x;
                    maze.map[x][y] = 1;
                }
                maze.ready = true;
                maze.visualRange = world.visualRange;
                maze.computeVisibility();
            }
        };
        request.send(null);
    },
    free: function(pos){
        return maze.ready && pos.x>=0 && pos.y>=0 && pos.x < maze.dimensions.w && pos.y< maze.dimensions.h && maze.map[pos.x][pos.y]===0;
    },
    distance: function(pos0, pos1){
        let pos = { x: pos0.x - pos1.x, y: pos0.y - pos1.y};
        return Math.sqrt(pos.x*pos.x+pos.y*pos.y);
    },
    isVisible: function (pos0, pos1){
        return maze.visibility[pos0.x][pos0.y][pos1.x][pos1.y];
    },
    addPos: function(pos0,pos1){
        return {x:pos0.x+pos1.x , y:pos0.y+pos1.y};
    },
    new_map: function (){
        let map = [];
        for (let x = 0; x < maze.dimensions.h; x++) {
            map[x] = [];
            for (let y = 0; y < maze.dimensions.w; y++) {
                map[x][y] = 0;
            }
        }
        return map;
    },
    drawVisibility: function(pos){
        let radius = maze.visualRange;
        for (let y = pos.y - radius ; y < pos.y + radius; y++){
            for (let x = pos.x - radius ; x < pos.x + radius; x++){
                const candidate = {x:x,y:y}
                if (maze.free(candidate) && maze.isVisible(pos,candidate))
                    maze.drawTile(candidate,maze.distance(pos,candidate));
            }
        }
    },
    copy: function(pos){
      return {x:pos.x,y:pos.y};
    },
    drawTile: function(pos, value){
        const screenPos = maze.screenLocation(pos);
        let tile = game.add.sprite(screenPos.x, screenPos.y, "tile");
        tile.scale.setTo(maze.tileScaleX,maze.tileScaleY);
        tile.tint = 0xffffAA;
        tile.alpha = 1 - value / maze.visualRange;
        groups.maze.add(tile);
    },
    existsViewLine: function(pos0, pos1){
        if (!maze.free(pos1)) return false;
        if (maze.distance(pos0,pos1)>maze.visualRange) return false;
        let a = maze.copy(pos0);
        let b = maze.copy(pos1);
        let dx = Math.abs(b.x - a.x);
        let sx = a.x < b.x ? 1 : -1;
        let dy = Math.abs(b.y - a.y);
        let sy = a.y < b.y ? 1 : -1;
        let err = dx > dy ?  dx / 2 : -dy / 2;
        while((a.x !== b.x || a.y !== b.y)){
            if (!maze.free(a)) return false;
            let e2 = err;
            if(e2 > -dx){
                err -= dy;
                a.x += sx;
            }
            if(e2 < dy){
                err += dx;
                a.y += sy;
            }
        }
        return true;
    },
    screenLocation: function (pos){
        return {x:pos.x * maze.tileSizeX, y:pos.y * maze.tileSizeY};
    }
}