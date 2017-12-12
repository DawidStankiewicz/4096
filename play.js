var playState = {

    board : function() {
        return new Board();
    },
    
    preload: function () {
        board = new Board();
        board.create();
        console.log('created board')
    },

    create: function () {
        
    },

    update: function () {
        board.draw();
    },
    

}





