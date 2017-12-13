function Field(val, x, y) {
    this.val = val;
    this.x = x;
    this.y = y;
    this.sprite = getSprite(val, x, y);
}

Field.prototype.drawField = function () {

};


function getSprite(val, x, y) {
    let wh = game.width / 5;
    let margin = wh - 50;
    let sprite = 'bg-0';
    const sprites = [
                    'bg-0',
                    'bg-2',
                    'bg-4',
                    'bg-8'
                    ];

    if (val > 0)
        sprite = sprites[Math.log2(this.val)];
    console.log();
    game.add.sprite(x * wh + margin, y * wh + margin, sprite);
}
