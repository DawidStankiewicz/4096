var Board = function () {
    this.fields = new Array();
}

Board.prototype.load = function() {
    game.load.image('bg-0', 'assets/bg-0.png');
    game.load.image('bg-2', 'assets/bg-2.png');
    game.load.image('bg-4', 'assets/bg-4.png');
    game.load.image('bg-8', 'assets/bg-8.png');
}

Board.prototype.create = function () {
    const cols = 4;
    const rows = 4;
    let fields = new Array(cols);
    for (let x = 0; x < cols; x++) {
        fields[x] = new Array(rows);
        for (let y = 0; y < rows; y++) {
            let field = new Field(2, x, y);
            fields[x][y] = field;
        }
    }
    Board.fields = fields;

}

Board.prototype.draw = function () {
    for (let x = 0; x < Board.fields.length; x++) {
        for (let y = 0; y < Board.fields.length; y++) {
            let field = Board.fields[x][y];
            field.drawField();
        }
    }
}
