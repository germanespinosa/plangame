var Dungeon = {
    map: null,
    map_size: 15,
    rooms: [],
    Generate: function () {
        this.map = [];
        for (var x = 0; x < this.map_size; x++) {
            this.map[x] = [];
            for (var y = 0; y < this.map_size; y++) {
                this.map[x][y] = 1;
            }
        }
        this.map[0][13] = 2;
        this.map[1][11] = 2;
        this.map[1][12] = 2;
        this.map[1][13] = 2;
        this.map[2][11] = 2;
        this.map[3][11] = 2;
        this.map[3][13] = 2;
        this.map[4][11] = 2;
        this.map[4][12] = 2;
        this.map[4][13] = 2;
        this.map[5][9] = 2;
        this.map[5][11] = 2;
        this.map[5][12] = 2;
        this.map[5][13] = 2;
        this.map[6][1] = 2;
        this.map[6][9] = 2;
        this.map[8][10] = 2;
        this.map[8][11] = 2;
        this.map[9][10] = 2;
        this.map[9][11] = 2;
        this.map[10][11] = 2;
        this.map[11][11] = 2;
        this.map[12][6] = 2;
        this.map[12][7] = 2;
        this.map[13][5] = 2;
        this.map[13][6] = 2;
    },
}