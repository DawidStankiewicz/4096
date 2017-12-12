var Board = function () {
    this.fields = new Array();

}

Board.prototype.create = function () {
    const cols = 4;
    const rows = 4;
    let fields = new Array(cols);
    for (let x = 0; x < cols; x++) {
        fields[x] = new Array(rows);
        for (let y = 0; y < rows; y++) {
            let field = new Field(0, x, y);
            fields[x][y] = field;

        }
    }
    Board.fields = fields;

}

Board.prototype.draw = function () {
    for (let field in Board.fields) {
        console.log(field.x);
        field.drawField();
    }
}

let Field = function (val, x, y) {
    this.val = val;
    this.x = x;
    this.y = y;

    this.drawField = function () {
        var graphics = game.add.graphics(game.width, game.height);
        const squareSide = game.width / 4;

        const colors = [
                    '#ffd27f',
                    '#ffae19',
                    '#ffb732',
                    '#ffc04c',
                    '#ffc966',
                    '#e59400',
                    '#cc8400',
                    '#b27300',
                    '#996300',
                    '#7f5200',
                    '#664200',
                    '#4c3100',
                    '#332100',
                    '#191000',
                    '#000000'
                    ];

        let color = '#566676';

        if (this.val > 1 && this.val <= 16384) {
            color = this.colors[Math.log2(this.val)];
        } else {
            color = '#000000';
        }

        graphics.lineStyle(10, 0xFFFFFF, 10);
        graphics.drawRect(100, 100, 150, 150);
        window.graphics = graphics;
        console.log('draw field');
    }
}
