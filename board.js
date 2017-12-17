var board = {
    load: function () {
        game.load.image('board', 'assets/board.png');
        game.load.image('cell-0', 'assets/cell-0.png');
        game.load.image('cell-1', 'assets/cell-1.png');
        game.load.image('cell-2', 'assets/cell-2.png');
        game.load.image('cell-3', 'assets/cell-3.png');
        game.load.image('cell-4', 'assets/cell-4.png');
        game.load.image('cell-5', 'assets/cell-5.png');
        game.load.image('cell-6', 'assets/cell-6.png');
        game.load.image('cell-7', 'assets/cell-7.png');
        game.load.image('cell-8', 'assets/cell-8.png');
        game.load.image('cell-9', 'assets/cell-9.png');

    },

    create: function () {
        console.log('Create board...');

        game.add.sprite(0, 0, 'board');

        this.cols = 4;
        this.rows = 4;
        this.margin = 70;
        this.side = game.width / 5;
        this.fields = game.add.group();
        this.fields.enableBody = true;


        // index = lvl of field
        this.fieldSprites = [
            'cell-0',
            'cell-1',
            'cell-2',
            'cell-3',
            'cell-4',
            'cell-5',
            'cell-6',
            'cell-7',
            'cell-8',
            'cell-9',
        ];

        this.newFieldRate = 0.1;
        this.initFields = 2;
        this.initFieldsLvl = 0;

        console.log('   create [%s] initial fields...', this.initFields);
        this.createFields(this.initFields, this.initFieldsLvl);


        this.canMove = true;
        this.fieldMoveTime = 300; // ms
        this.fieldFadeInTime = this.fieldMoveTime;
        console.log('Board created.');
    },

    createFields: function (howMany, lvl) {
        let createdFields = new Array();


        for (let created = 0; created < howMany; created++) {
            let emptyField = board.findRandomEmptyField();
            console.log('Founded empty field at [%s,%s]', emptyField.col, emptyField.row);


            let field = board.createField(emptyField.col, emptyField.row, lvl);
            console.log('   and created new field at [%s,%s] lvl %s', field.col, field.row, field.lvl);


            createdFields.push(field);
            console.log('   and added created field to the array [%s]', createdFields.length);
            console.log('   and now there is %s fields on the board', board.fields.length);
        }


        return createdFields;
    },

    createField: function (col, row, lvl = 0) {
        let sprite = board.fieldSprites[lvl];

        let field = this.fields.create(col * this.side + this.margin, row * this.side + this.margin, sprite);
        field.col = col;
        field.row = row;
        field.lvl = lvl;

        return field;
    },

    getFields: function (col, row) {
        return this.fields.children.filter((field) => field.col === col && field.row === row)[0];
    },

    findRandomEmptyField: function () {
        let found = false;
        let col, row;

        while (!found) {
            col = Math.round(Math.random() * (board.cols - 1));
            row = Math.round(Math.random() * (board.rows - 1));

            found = isFieldEmpty(col, row);
        }

        return {col, row};
    },

    moveUp: function () {
        /*
            logic:
            1. select FIELD at (x,y) where x = col and y = row
            2. check if FIELD is empty (is undefined)
                if it's and EMPTY mark isn't assigned then assign FIELD to EMPTY mark

            if FIELD is defined
                check if MERGE field is assigned
                if not then assign FIELD to MERGE

                and if EMPTY mark is defined
                then move FIELD to EMPTY position
                and update FIELD (new coordinates), set FIELD as MERGE, update EMPTY (increase of one)



            if there is field to merge (find field to merge) -> move to and merge
            else if there is free field (find free field) -> move to
         */

        let movedAnyField = false;
        let movedFieldCounter = 0;


        for (let col = 0; col < board.cols; col++) {
            let emptyFieldRow = null;
            let mergeField = null;

            for (let row = 0; row < board.rows; row++) {
                let field = board.getFields(col, row);

                if (field === undefined) {
                    console.log('FIELD [%s,%s] is EMPTY', col, row);
                    if (emptyFieldRow === null) {
                        emptyFieldRow = row;
                        console.log('   and is marked as EMPTY.');
                    }
                }

                if (field !== undefined) {
                    console.log('FIELD [%s,%s] is defined on %s lvl', col, row, field.lvl);
                    if (mergeField === null || mergeField.lvl !== field.lvl) { // add this
                        mergeField = field;
                        console.log('   and is marked as new MERGE lvl %s ', mergeField.lvl);

                        if (emptyFieldRow !== null) {
                            console.log('   and there is EMPTY field [%s,%s] where this FIELD [%s,%s] lvl %s can move', col, emptyFieldRow, field.col, field.row, field.lvl);

                            board.moveFieldTo(field, col, emptyFieldRow, function () {
                            });
                            console.log('   and moved FIELD [%s,%s] lvl %s to [%s,%s]', field.col, field.row, field.lvl, col, emptyFieldRow);

                            field.col = col;
                            field.row = emptyFieldRow;
                            console.log('   and updated FIELD lvl %s to [%s,%s]', field.lvl, field.col, field.row);

                            mergeField = field;
                            console.log('   and updated MERGE to [%s,%s] lvl %s', mergeField.col, mergeField.row, mergeField.lvl);

                            emptyFieldRow++;
                            console.log('   and updated EMPTY to [%s,%s]', col, emptyFieldRow);

                            movedFieldCounter++;
                            movedAnyField = true;
                        }
                    }
                    else {
                        console.log('   and there is defined MERGE lvl %s [%s,%s]', mergeField.lvl, mergeField.col, mergeField.row);

                        let mergedField = board.mergeFields(field, mergeField);

                        console.log('   merge FIELD lvl %s [%s,%s] with MERGE field lvl %s [%s,%s] complete', field.lvl, field.col, field.row, mergeField.lvl, mergeField.col, mergeField.row);


                        mergeField = null;
                        console.log('   and updated MERGE to null');

                        emptyFieldRow = mergedField.row + 1;
                        console.log('   and updated EMPTY to [%s,%s]', col, emptyFieldRow);


                        movedFieldCounter++;
                        movedAnyField = true;
                    }
                }
            }
        }

        console.log('This turn moved %s fields', movedFieldCounter);
        if (movedAnyField) {
            let createdField = board.createFields(1)[0];
            createdField.alpha = 0;
            console.log('   and created new field lvl %s at random position [%s,%s].', createdField.lvl, createdField.col, createdField.row)
            game.add.tween(createdField).to({alpha: 1}, board.fieldFadeInTime, Phaser.Easing.Linear.None, true);
        }
        console.log('After this turn [%s] there is %s fields on the board', playState.turns, board.fields.length);

    },


    moveDown: function () {


        let movedAnyField = false;
        let movedFieldCounter = 0;


        for (let col = 0; col < board.cols; col++) {
            let emptyFieldRow = null;
            let mergeField = null;

            for (let row = board.rows - 1; row >= 0; row--) {
                let field = board.getFields(col, row);

                if (field === undefined) {
                    console.log('FIELD [%s,%s] is EMPTY', col, row);
                    if (emptyFieldRow === null) {
                        emptyFieldRow = row;
                        console.log('   and is marked as EMPTY.');
                    }
                }

                if (field !== undefined) {
                    console.log('FIELD [%s,%s] is defined on %s lvl', col, row, field.lvl);
                    if (mergeField === null || mergeField.lvl !== field.lvl) { // add this
                        mergeField = field;
                        console.log('   and is marked as new MERGE lvl %s ', mergeField.lvl);

                        if (emptyFieldRow !== null) {
                            console.log('   and there is EMPTY field [%s,%s] where this FIELD [%s,%s] lvl %s can move', col, emptyFieldRow, field.col, field.row, field.lvl);

                            board.moveFieldTo(field, col, emptyFieldRow, function () {
                            });
                            console.log('   and moved FIELD [%s,%s] lvl %s to [%s,%s]', field.col, field.row, field.lvl, col, emptyFieldRow);

                            field.col = col;
                            field.row = emptyFieldRow;
                            console.log('   and updated FIELD lvl %s to [%s,%s]', field.lvl, field.col, field.row);

                            mergeField = field;
                            console.log('   and updated MERGE to [%s,%s] lvl %s', mergeField.col, mergeField.row, mergeField.lvl);

                            emptyFieldRow--; // one up
                            console.log('   and updated EMPTY to [%s,%s]', col, emptyFieldRow);

                            movedFieldCounter++;
                            movedAnyField = true;
                        }
                    }
                    else {
                        console.log('   and there is defined MERGE lvl %s [%s,%s]', mergeField.lvl, mergeField.col, mergeField.row);

                        let mergedField = board.mergeFields(field, mergeField);

                        console.log('   merge FIELD lvl %s [%s,%s] with MERGE field lvl %s [%s,%s] complete', field.lvl, field.col, field.row, mergeField.lvl, mergeField.col, mergeField.row);


                        mergeField = null;
                        console.log('   and updated MERGE to null');

                        emptyFieldRow = mergedField.row - 1; // one up
                        console.log('   and updated EMPTY to [%s,%s]', col, emptyFieldRow);


                        movedFieldCounter++;
                        movedAnyField = true;
                    }
                }
            }
        }

        console.log('This turn moved %s fields', movedFieldCounter);
        if (movedAnyField) {
            let createdField = board.createFields(1)[0];
            createdField.alpha = 0;
            console.log('   and created new field lvl %s at random position [%s,%s].', createdField.lvl, createdField.col, createdField.row)
            game.add.tween(createdField).to({alpha: 1}, board.fieldFadeInTime, Phaser.Easing.Linear.None, true);
        }
        console.log('After this turn [%s] there is %s fields on the board', playState.turns, board.fields.length);

    },

    moveLeft: function () {


        let movedAnyField = false;
        let movedFieldCounter = 0;

        for (let row = 0; row < board.rows; row++) {

            let emptyFieldCol = null;
            let mergeField = null;

            for (let col = 0; col < board.cols; col++) {
                let field = board.getFields(col, row);

                if (field === undefined) {
                    console.log('FIELD [%s,%s] is EMPTY', col, row);
                    if (emptyFieldCol === null) {
                        emptyFieldCol = col;
                        console.log('   and is marked as EMPTY.');
                    }
                }

                if (field !== undefined) {
                    console.log('FIELD [%s,%s] is defined on %s lvl', col, row, field.lvl);
                    if (mergeField === null || mergeField.lvl !== field.lvl) {
                        mergeField = field;
                        console.log('   and is marked as new MERGE lvl %s ', mergeField.lvl);

                        if (emptyFieldCol !== null) {
                            console.log('   and there is EMPTY field [%s,%s] where this FIELD [%s,%s] lvl %s can move', emptyFieldCol, row, field.col, field.row, field.lvl);

                            board.moveFieldTo(field, emptyFieldCol, row, function () {
                            });
                            console.log('   and moved FIELD [%s,%s] lvl %s to [%s,%s]', field.col, field.row, field.lvl, emptyFieldCol, row);

                            field.col = emptyFieldCol;
                            field.row = row;
                            console.log('   and updated FIELD lvl %s to [%s,%s]', field.lvl, field.col, field.row);

                            mergeField = field;
                            console.log('   and updated MERGE to [%s,%s] lvl %s', mergeField.col, mergeField.row, mergeField.lvl);

                            emptyFieldCol++; // one right
                            console.log('   and updated EMPTY to [%s,%s]', emptyFieldCol, row);

                            movedFieldCounter++;
                            movedAnyField = true;
                        }
                    }
                    else {
                        console.log('   and there is defined MERGE lvl %s [%s,%s]', mergeField.lvl, mergeField.col, mergeField.row);

                        let mergedField = board.mergeFields(field, mergeField);

                        console.log('   merge FIELD lvl %s [%s,%s] with MERGE field lvl %s [%s,%s] complete', field.lvl, field.col, field.row, mergeField.lvl, mergeField.col, mergeField.row);


                        mergeField = null;
                        console.log('   and updated MERGE to null');

                        emptyFieldCol = mergedField.col + 1; // one right
                        console.log('   and updated EMPTY to [%s,%s]', emptyFieldCol, row);


                        movedFieldCounter++;
                        movedAnyField = true;
                    }
                }
            }
        }

        console.log('This turn moved %s fields', movedFieldCounter);
        if (movedAnyField) {
            let createdField = board.createFields(1)[0];
            createdField.alpha = 0;
            console.log('   and created new field lvl %s at random position [%s,%s].', createdField.lvl, createdField.col, createdField.row)
            game.add.tween(createdField).to({alpha: 1}, board.fieldFadeInTime, Phaser.Easing.Linear.None, true);
        }
        console.log('After this turn [%s] there is %s fields on the board', playState.turns, board.fields.length);

    },

    moveRight: function () {


        let movedAnyField = false;
        let movedFieldCounter = 0;

        for (let row = 0; row < board.rows; row++) {

            let emptyFieldCol = null;
            let mergeField = null;

            for (let col = board.cols - 1; col >= 0; col--) {
                let field = board.getFields(col, row);

                if (field === undefined) {
                    console.log('FIELD [%s,%s] is EMPTY', col, row);
                    if (emptyFieldCol === null) {
                        emptyFieldCol = col;
                        console.log('   and is marked as EMPTY.');
                    }
                }

                if (field !== undefined) {
                    console.log('FIELD [%s,%s] is defined on %s lvl', col, row, field.lvl);
                    if (mergeField === null || mergeField.lvl !== field.lvl) {
                        mergeField = field;
                        console.log('   and is marked as new MERGE lvl %s ', mergeField.lvl);

                        if (emptyFieldCol !== null) {
                            console.log('   and there is EMPTY field [%s,%s] where this FIELD [%s,%s] lvl %s can move', emptyFieldCol, row, field.col, field.row, field.lvl);

                            board.moveFieldTo(field, emptyFieldCol, row, function () {
                            });
                            console.log('   and moved FIELD [%s,%s] lvl %s to [%s,%s]', field.col, field.row, field.lvl, emptyFieldCol, row);

                            field.col = emptyFieldCol;
                            field.row = row;
                            console.log('   and updated FIELD lvl %s to [%s,%s]', field.lvl, field.col, field.row);

                            mergeField = field;
                            console.log('   and updated MERGE to [%s,%s] lvl %s', mergeField.col, mergeField.row, mergeField.lvl);

                            emptyFieldCol--; // one left
                            console.log('   and updated EMPTY to [%s,%s]', emptyFieldCol, row);

                            movedFieldCounter++;
                            movedAnyField = true;
                        }
                    }
                    else {
                        console.log('   and there is defined MERGE lvl %s [%s,%s]', mergeField.lvl, mergeField.col, mergeField.row);

                        let mergedField = board.mergeFields(field, mergeField);

                        console.log('   merge FIELD lvl %s [%s,%s] with MERGE field lvl %s [%s,%s] complete', field.lvl, field.col, field.row, mergeField.lvl, mergeField.col, mergeField.row);


                        mergeField = null;
                        console.log('   and updated MERGE to null');

                        emptyFieldCol = mergedField.col - 1; // one left
                        console.log('   and updated EMPTY to [%s,%s]', emptyFieldCol, row);


                        movedFieldCounter++;
                        movedAnyField = true;
                    }
                }
            }
        }

        console.log('This turn moved %s fields', movedFieldCounter);
        if (movedAnyField) {
            let createdField = board.createFields(1)[0];
            createdField.alpha = 0;
            console.log('   and created new field lvl %s at random position [%s,%s].', createdField.lvl, createdField.col, createdField.row)
            game.add.tween(createdField).to({alpha: 1}, board.fieldFadeInTime, Phaser.Easing.Linear.None, true);
        }
        console.log('After this turn [%s] there is %s fields on the board', playState.turns, board.fields.length);

    },


    moveTo: function (field, x, y, time, callback) {
        let moveTween = game.add.tween(field).to({x: x, y: y}, time, Phaser.Easing.Back.Out, true);
        if (callback) {
            moveTween.onComplete.add(callback);
        }
    },

    moveFieldTo: function (field, col, row, callback) {
        let x = (col * board.side) + board.margin;
        let y = (row * board.side) + board.margin;
        board.moveTo(field, x, y, board.fieldMoveTime, callback);
    },

    mergeFields: function (field, mergeField) {
        let mergedField;
        if (field.lvl !== mergeField.lvl) {
            console.error('fields are not on the same lvl');
            return;
        }

        let mergedLvl = mergeField.lvl + 1;

        game.add.tween(field).to({x: mergeField.x, y: mergeField.y}, board.fieldMoveTime, Phaser.Easing.Back.Out, true);

        mergedField = board.createField(mergeField.col, mergeField.row, mergedLvl);
        mergedField.alpha = 0;
        game.add.tween(mergedField).to({alpha: 1}, board.fieldFadeInTime, Phaser.Easing.Linear.None, true);

        console.log('   created MERGED FIELD lvl %s at [%s,%s]', mergedField.lvl, mergedField.col, mergedField.row);

        game.time.events.add(300, function () {
            field.destroy();
            mergeField.destroy();
        });

        return mergedField;
    }
}

isFieldEmpty = function (col, row) {

    return board.fields.children.filter(function (f) {
        return (row === f.row && col === f.col);
    }).length === 0;

}
