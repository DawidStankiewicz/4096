var playState = {

    board : function() {
        return new Board();
    },
    
    preload: function () {
        board = new Board();
        board.load();
        
    },

    create: function () {
        board.create();
    },

    update: function () {
        board.draw();
    },
    

}





