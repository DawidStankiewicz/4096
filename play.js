var playState = {

    preload: function () {
        board.load();

    },

    create: function () {
        board.create();
        this.turns = 0;
    },

    update: function () {
        cursors = game.input.keyboard.createCursorKeys();

        if (cursors.up.isDown && board.canMove) {
            this.turns++;
            console.log('move up');
            board.moveUp();

            board.canMove = false;
            game.time.events.add(300, function () {
                board.canMove = true;
            });
        }

        if (cursors.down.isDown && board.canMove) {
            this.turns++;
            console.log('move down');
            board.moveDown();

            board.canMove = false;
            game.time.events.add(300, function () {
                board.canMove = true;
            });
        }

        if (cursors.left.isDown && board.canMove) {
            this.turns++;
            console.log('move left');
            board.moveLeft();

            board.canMove = false;
            game.time.events.add(300, function () {
                board.canMove = true;
            });
        }
        if (cursors.right.isDown && board.canMove) {
            this.turns++;
            console.log('move right');
            board.moveRight();

            board.canMove = false;
            game.time.events.add(300, function () {
                board.canMove = true;
            });
        }

    },


}





