let Dungeon = {
    dimensions: {},
    map: null,
    ready : false,
    occlusions : [],
    scale : {},
    draw: function () {
        if (Dungeon.ready) {
            groups.maze.removeAll();
            for (let i = 0; i < Dungeon.occlusions.length; i++) {
                const y = Dungeon.occlusions[i].y;
                const x = Dungeon.occlusions[i].x;
                let wall = game.add.sprite(x * tileSize, y * tileSize, "tile");
                wall.scale.setTo(scale, scale)
                wall.tint = 0x555555;
                groups.maze.add(wall);
                game.world.sendToBack(groups.maze);
            }
        }
    },
    Generate: function () {
        Dungeon.loadWorld("savanna","1");
    },
    loadWorld: function (world_type, world_version) {
        let request = new XMLHttpRequest();
        request.overrideMimeType("application/json");
        request.open('GET', 'maps/' +world_type + '-' + world_version + '.json', true);
        request.onreadystatechange = function () {
            if (request.readyState === 4 && request.status === 200) {
                let world = JSON.parse(request.responseText);
                Dungeon.occlusions = world.occlusions;
                Dungeon.dimensions = world.dimensions;
                Dungeon.visualRange = world.visualRange;
                Dungeon.map = [];
                for (let x = 0; x < Dungeon.dimensions.h; x++) {
                    Dungeon.map[x] = [];
                    for (let y = 0; y < Dungeon.dimensions.w; y++) {
                        Dungeon.map[x][y] = 1;
                    }
                }
                for(let i=0;i<world.occlusions.length;i++) {
                    const y = world.occlusions[i].y;
                    const x = world.occlusions[i].x;
                    Dungeon.map[y][x] = 2;
                }
                Dungeon.ready = true;
                Dungeon.visualRange = world.visualRange;
            }
        };
        request.send(null);
    },
    free: function(pos){
        return Dungeon.ready && pos.x>=0 && pos.y>=0 && pos.x < Dungeon.dimensions.w && pos.y< Dungeon.dimensions.h && Dungeon.map[pos.y][pos.x]==1;
    }
}