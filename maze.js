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
                maze.map = [];
                for (let x = 0; x < maze.dimensions.h; x++) {
                    maze.map[x] = [];
                    for (let y = 0; y < maze.dimensions.w; y++) {
                        maze.map[x][y] = 1;
                    }
                }
                for(let i=0;i<world.occlusions.length;i++) {
                    const y = world.occlusions[i].y;
                    const x = world.occlusions[i].x;
                    maze.map[y][x] = 2;
                }
                maze.ready = true;
                maze.visualRange = world.visualRange;
            }
        };
        request.send(null);
    },
    free: function(pos){
        return maze.ready && pos.x>=0 && pos.y>=0 && pos.x < maze.dimensions.w && pos.y< maze.dimensions.h && maze.map[pos.y][pos.x]===1;
    },
    distance: function(pos0, pos1){
        let pos = { x: pos0.x - pos1.x, y: pos0.y - pos1.y};
        return Math.sqrt(pos.x*pos.x+pos.y*pos.y);
    }
}