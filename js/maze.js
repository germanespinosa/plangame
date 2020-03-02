let maze = {
    tileScaleX:0,
    tileScaleY:0,
    wallScaleX:0,
    wallScaleY:0,
    goalScaleX:0,
    goalScaleY:0,
    tileSizeX:0,
    tileSizeY:0,
    world: null,
    map: null,
    visibility: null,
    ready : false,
    draw: function () {
        if (maze.ready) {
            groups.maze.removeAll();
            for (let i = 0; i < maze.world.occlusions.length; i++) {
                const screenPos = maze.screenLocation(maze.world.occlusions[i]);
                let wall = game.add.sprite(screenPos.x, screenPos.y, "wall");
                wall.scale.setTo(maze.wallScaleX, maze.wallScaleY)
                groups.maze.add(wall);
            }
            const screenPos = maze.screenLocation(maze.world.goalPosition);
            let goal = game.add.sprite(screenPos.x, screenPos.y, "goal");
            goal.scale.setTo(maze.goalScaleX, maze.goalScaleY)
            groups.maze.add(goal);
            groups.agents.removeAll(true);
            groups.agents.add(maze.drawToTile(prey,maze.newImage(maze.world.preySprite,.5)));
            groups.agents.add(maze.drawToTile(predator,maze.newImage(maze.world.predatorSprite)));
            game.world.sendToBack(groups.maze);
            game.world.bringToTop(groups.agents);
        }
    },
    Generate: function () {
        maze.loadWorld("savanna","1");
    },
    computeVisibility: function() {
        maze.visibility = maze.newMap();
        for (let x = 0; x < maze.world.dimensions.h; x++) {
            for (let y = 0; y < maze.world.dimensions.w; y++) {
                maze.visibility[x][y]=maze.newMap();
                for (let i=0; i< maze.world.dimensions.h;i++) {
                    for (let j = 0; j < maze.world.dimensions.w; j++) {
                        maze.visibility[x][y][i][j] = maze.existsViewLine({x:x,y:y},{x:i,y:j});
                    }
                }
            }
        }
    },
    loadWorld: function (worldType, worldVersion) {
        let request = new XMLHttpRequest();
        request.overrideMimeType("application/json");
        request.open('GET', 'maps/' + worldType + '-' + worldVersion + '.json?r=' + Math.random(), true);
        request.onreadystatechange = function () {
            if (request.readyState === 4 && request.status === 200) {
                maze.world = JSON.parse(request.responseText);
                maze.tileSizeX = game.width/maze.world.dimensions.w;
                maze.tileSizeY = game.height/maze.world.dimensions.h;
                maze.map = maze.newMap();
                for(let i=0;i<maze.world.occlusions.length;i++) {
                    const y = maze.world.occlusions[i].y;
                    const x = maze.world.occlusions[i].x;
                    maze.map[x][y] = 1;
                }
                maze.ready = true;
                maze.computeVisibility();
            }
        };
        request.send(null);
    },
    free: function(pos){
        return maze.ready && pos.x>=0 && pos.y>=0 && pos.x < maze.world.dimensions.w && pos.y< maze.world.dimensions.h && maze.map[pos.x][pos.y]===0;
    },
    equal: function (pos0,pos1){
        return pos0.x === pos1.x && pos0.y === pos1.y;
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
    newMap: function (){
        let map = [];
        for (let x = 0; x < maze.world.dimensions.h; x++) {
            map[x] = [];
            for (let y = 0; y < maze.world.dimensions.w; y++) {
                map[x][y] = 0;
            }
        }
        return map;
    },
    drawVisibility: function(pos){
        let radius = maze.world.visualRange;
        for (let y = pos.y - radius ; y < pos.y + radius; y++){
            for (let x = pos.x - radius ; x < pos.x + radius; x++){
                const candidate = {x:x,y:y}
                if (maze.free(candidate) && maze.isVisible(pos,candidate))
                    maze.drawTile(candidate,maze.distance(pos,candidate));
            }
        }
    },
    copy: function(pos){
      return {x:pos.x, y:pos.y};
    },
    drawTile: function(pos, value){
        const screenPos = maze.screenLocation(pos);
        let tile = game.add.sprite(screenPos.x, screenPos.y, "tile");
        tile.scale.setTo(maze.tileScaleX, maze.tileScaleY);
        tile.tint = 0xffffAA;
        tile.alpha = 1 - value / maze.world.visualRange;
        return tile;
    },
    existsViewLine: function(pos0, pos1){
        if (!maze.free(pos1)) return false;
        if (maze.distance(pos0,pos1)>maze.world.visualRange) return false;
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
    },
    drawToTile: function (pos, img){
        const screenPos = maze.screenLocation(pos);
        let cache = game.cache.getImage(img.name);
        let sprite = game.add.sprite(screenPos.x, screenPos.y, img.name);
        const scaleX = maze.tileSizeX / cache.width;
        const scaleY = maze.tileSizeY / cache.height;
        sprite.scale.setTo(scaleX, scaleY);
        if ("alpha" in img) sprite.alpha = img.alpha;
        if ("tint" in img) sprite.tint = img.tint;
        groups.agents.add(sprite);
    },
    newImage: function(name, alpha, tint){
        let img = {name: name };
        if (!(typeof alpha === "undefined")) img.alpha = alpha;
        if (!(typeof tint === "undefined")) img.tint = tint;
        return img;
    }
}