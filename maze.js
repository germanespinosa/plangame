let maze = {
    dimensions: {},
    map: null,
    ready : false,
    occlusions : [],
    scale : {},
    draw: function () {
        if (maze.ready) {
            groups.maze.removeAll();
            for (let i = 0; i < maze.occlusions.length; i++) {
                const y = maze.occlusions[i].y;
                const x = maze.occlusions[i].x;
                let wall = game.add.sprite(x * tileSize, y * tileSize, "tile");
                wall.scale.setTo(scale, scale)
                wall.tint = 0x555555;
                groups.maze.add(wall);
                game.world.sendToBack(groups.maze);
            }
        }
    },
    Generate: function () {
        maze.loadWorld("savanna","1");
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
                maze.visualRange = world.visualRange;
                maze.map = maze.new_map();
                for(let i=0;i<world.occlusions.length;i++) {
                    const y = world.occlusions[i].y;
                    const x = world.occlusions[i].x;
                    maze.map[y][x] = 1;
                }
                maze.ready = true;
                maze.visualRange = world.visualRange;
            }
        };
        request.send(null);
    },
    free: function(pos){
        return maze.ready && pos.x>=0 && pos.y>=0 && pos.x < maze.dimensions.w && pos.y< maze.dimensions.h && maze.map[pos.y][pos.x]===0;
    },
    distance: function(pos0, pos1){
        let pos = { x: pos0.x - pos1.x, y: pos0.y - pos1.y};
        return Math.sqrt(pos.x*pos.x+pos.y*pos.y);
    },
    addPos: function(pos0,pos1){
        return {x:pos0.x+pos1.x , y:pos0.y+pos1.y};
    },
    new_map: function (){
        let map = []
        for (let x = 0; x < maze.dimensions.h; x++) {
            map[x] = [];
            for (let y = 0; y < maze.dimensions.w; y++) {
                map[x][y] = 0;
            }
        }
        return map;
    },
    drawCircle: function(pos){
        let radius = maze.visualRange;
        let limit = radius-1;
        let visited = [];
        for (let y = 0; y < radius; y++){
            while(maze.distance({x:0,y:0},{x:limit,y})>radius && limit>=0) limit--;
            for (let x = limit; x >=0; x--){
                maze.drawBresenham(pos, {x:(pos.x - x), y:(pos.y + y)}, visited);
                maze.drawBresenham(pos, {x:(pos.x - y), y:(pos.y - x)}, visited);
                maze.drawBresenham(pos, {x:(pos.x + x), y:(pos.y - y)}, visited);
                maze.drawBresenham(pos, {x:(pos.x + y), y:(pos.y + x)}, visited);
            }
        }
    },
    drawBresenham: function(pos0, pos1, visited){

        let x0=pos0.x;
        let y0=pos0.y;

        let x1=pos1.x;
        let y1=pos1.y;

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
            if(visited.indexOf(x0 + "," + y0) === -1){
                let tile = game.add.sprite(x0 * tileSize, y0 * tileSize, "tile");
                tile.scale.setTo(scale,scale);
                if (y0===predator.y && x0===predator.x) {
                    tile.tint = 0xff0000;
                    predator.contact = true;
                } else {
                    tile.tint = 0xffffAA;
                }
                let dist = maze.distance(pos0, {x:x0, y:y0});
                tile.alpha = 1 - dist / maze.visualRange;
                visited.push(x0 + "," + y0);
                groups.maze.add(tile);
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
}