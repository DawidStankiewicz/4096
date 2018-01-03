var playState = {

    preload: function () {
        board.load();

        game.load.image('drag', 'assets/drag.png');
    },

    create: function () {
        board.create();
        this.turns = 0;
        this.initDragHandler();
    },

    initDragHandler: function () {
        this.dragOffset = 80;

        var dg = game.add.group();
        dg.inputEnableChildren = true;
        this.dragHandler = dg.create(0, 0, 'drag');
        this.dragHandler.alpha = 0;

        //  Enable input and allow for dragging
        this.dragHandler.inputEnabled = true;
        this.dragHandler.input.enableDrag();
        this.dragHandler.events.onDragStart.add(playState.onDragStart, this);
        this.dragHandler.events.onDragStop.add(playState.onDragStop, this);
    },

    update: function () {
        if (this.isGameOver()) {
            this.gameOver();
        } else {
            this.updateMove();
        }
    },

    updateMove: function () {
        cursors = game.input.keyboard.createCursorKeys();
        let dir;
        if ((cursors.up.isDown || playState.dragHandler.movedUp) && board.canMove) {
            this.move('up');
        }

        if ((cursors.down.isDown || playState.dragHandler.movedDown) && board.canMove) {
            this.move('down');
        }

        if ((cursors.left.isDown || playState.dragHandler.movedLeft) && board.canMove) {
            this.move('left');
        }

        if ((cursors.right.isDown || playState.dragHandler.movedRight) && board.canMove) {
            this.move('right');
        }


        playState.dragHandler.movedRight =
            playState.dragHandler.movedLeft =
            playState.dragHandler.movedUp =
            playState.dragHandler.movedDown = false;
    },

    move: function (dir) {
        this.turns++;
        board.canMove = false;

        switch (dir) {
            case 'up':
                board.moveUp();
                break;
            case 'down':
                board.moveDown();
                break;
            case 'left':
                board.moveLeft();
                break;
            case 'right':
                board.moveRight();
                break;
        }

        game.time.events.add(300, function () {
            board.canMove = true;
        });
    },

    onDragStart: function (info, pointer) {
        playState.dragHandler.startX = pointer.x;
        playState.dragHandler.startY = pointer.y;
    },

    onDragStop: function (info, pointer) {
        console.debug('drag stop')
        playState.resetDraggingHandler();

        playState.dragHandler.stopX = pointer.x;
        playState.dragHandler.stopY = pointer.y;

        let vector = {
            x: playState.dragHandler.stopX - playState.dragHandler.startX,
            y: playState.dragHandler.stopY - playState.dragHandler.startY
        };

        playState.setDragMoveDir(vector);
    },

    resetDraggingHandler: function () {
        playState.dragHandler.x = 0;
        playState.dragHandler.y = 0;
    },

    setDragMoveDir: function (vector) {
        if (vector.x > playState.dragOffset) {
            console.debug('drag right');

            playState.dragHandler.movedRight = true;
        } else if (-vector.x > playState.dragOffset) {
            console.debug('drag left');

            playState.dragHandler.movedLeft = true;
        } else if (vector.y > playState.dragOffset) {
            console.debug('drag down');

            playState.dragHandler.movedDown = true;
        } else if (-vector.y > playState.dragOffset) {
            console.debug('drag top');

            playState.dragHandler.movedUp = true;
        }
    },

    isGameOver: function () {
        return !board.isNextMove();
    },

    gameOver: function () {
        alert('game over');
        game.restart();
    }
}
