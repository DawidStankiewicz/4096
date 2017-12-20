var playState = {

    preload: function () {
        board.load();

        game.load.image('drag', 'assets/drag.png');

    },

    create: function () {
        board.create();
        this.turns = 0;

        console.log('creaeee');

        var dg = game.add.group();

        dg.inputEnableChildren = true;

        this.drag = dg.create(0, 0, 'drag');
        this.drag.alpha = 0.2;
        //  Enable input and allow for dragging
        this.drag.inputEnabled = true;
        this.drag.input.enableDrag();
        this.drag.events.onDragStart.add(playState.onDragStart, this);
        this.drag.events.onDragStop.add(playState.onDragStop, this);

        console.log('created drag');

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

    onDragStart: function (info, pointer) {
        playState.drag.startx = pointer.x;
        playState.drag.starty = pointer.y;

        console.log('start drag ', info);
    },

    onDragStop: function (info, pointer) {
        playState.drag.x = 0;
        playState.drag.y = 0;
        
        playState.drag.startx = pointer.x;
        playState.drag.starty = pointer.y;
        console.log('stop drag ', info);
        let vector = {
            x: info.input._tempPoint.x - info.input.downPoint.x,
            y: info.input._tempPoint.y - info.input.downPoint.y
        };

        console.log(' vector [%s,%s] ', vector.x, vector.y);
        console.log(' pointer ', pointer);
    }


}
