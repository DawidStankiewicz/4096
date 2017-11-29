var canvas = document.getElementById('c');
var ctx = canvas.getContext('2d');


var game = {

    width: 400,
    height: 400,
    block: 100,
    margin: 5,

    create: function () {
        canvas.width = 500,
            canvas.height = 500,

            ctx.fillStyle = '#c6e2ff';
        ctx.fillRect(0, 0, this.width, this.height);

        canvas.addEventListener("keypress", this.move, true);
        console.log('created');
    },



    update: function () {
        board.draw();
    },

    play: function () {
        this.update();
        setInterval(this.update, 1000 / 60);
    },

    move: function (e) {
        console.log(e.keyCode);
    }

};

var board = {
    size: 3,

    fields: [
        [0, 2, 4, 8],
        [16, 32, 64, 128],
        [256, 512, 1024, 2048],
        [4096, 8192, 16384, 32768],
    ],

    colors: [
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
                    ],


    create: function () {

    },

    draw: function () {
        for (var x = 0; x < 4; x++) {
            for (var y = 0; y < 4; y++) {

                var bX = game.margin + (game.block * x);
                var bY = game.margin + (game.block * y);

                var field = this.fields[y][x];

                this.drawFields(field, bX, bY);
                this.fillNumbers(field, bX, bY);

            }
        }


    },
    drawFields: function (field, bX, bY) {
        //        console.log('field;' + field + ' log ' + Math.log2(field));
        var color = '#566676';
        if (field > 1 && field <= 16384) {
            color = this.colors[Math.log2(field)];
        } else {
            color = '#000000';
        }

        ctx.fillStyle = color;
        ctx.fillRect(bX, bY, game.block - 2 * game.margin, game.block - 2 * game.margin);

    },

    fillNumbers: function (field, bX, bY) {
        ctx.fillStyle = '#fff';
        var fontSize = '900 40px';
        if (field > 512) {
            fontSize = '700 40px';
        }
        if (field > 8192) {
            fontSize = '600 30px';
        }
        ctx.font = fontSize + ' Arial';
        ctx.fillText(field + '', bX + (game.block / 2) - game.margin, bY + (game.block / 2) + game.margin);
        ctx.textAlign = "center";
    }
}



game.create();
game.play();
