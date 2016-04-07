//business logic
function Game(player) {
  this.board = [["","",""], ["","",""], ["","",""]];
  this.turn = "x";
  this.players = player;
  this.nameOfGame = "";
  this.winner = "";
}
  // function change player, make computer move
  Game.prototype.changePlayer = function(){
    if (this.players === 2) {
      if(this.turn === "x") {
        this.turn = "o";
      } else { this.turn = "x"; }
    } else {
      //Computer logic -random
      while(!this.testWinner()) {
        var row = Math.floor(Math.random() * this.board.length);
        var col = Math.floor(Math.random() * this.board[0].length);
        console.log(row);
        if (!this.board[row][col]) {
          this.board[row][col] = "o";
          return;
        }
      }

    }
  }

  //function test winner
  Game.prototype.testWinner = function(){

    //if someone already won
    if (this.winner) {
      return this.winner;
    }

    //check rows
    for (var i=0; i<this.board[0].length; i++){
      if (this.board[i].join("") === "xxx"){
        // console.log("X wins!")
        this.winner = "x"
      } else if (this.board[i].join("") === "ooo"){
        // console.log("O wins!")
        this.winner = "o"
      }
    }

    //check columns
    //check each row for column
    for (var k = 0; k < this.board[0].length; k++) {

      var column = "";
      //check column by row
      for (var i=0; i<this.board.length; i++){
        column = column + this.board[i][k];
      }

      // test win
      if (column === "xxx"){
        // console.log("X wins column!")
        this.winner = "x"
      } else if (column === "ooo"){
        // console.log("O wins column!")
        this.winner = "o"
      }
    }


    // check diagonals
    if (this.board[1][1] &&
      ( (this.board[0][0] === this.board[1][1] && this.board[1][1] === this.board[2][2]) ||
      (this.board[0][2] === this.board[1][1] && this.board[1][1] === this.board[2][0]) )
    ) {
      this.winner = this.board[1][1]
    }

    // check tie
    if (this.board.join("").length === 15 && !this.winner){
      this.winner = "tie"
    }
    return this.winner;
  }

  //function take and validate input
  Game.prototype.setBoard = function(row,col){

    // if not an empty string
    if(!this.board[row][col]) {
      //add turn to board
      this.board[row][col] = this.turn;
      return true;
    } else { return false; }
  }



// ui
function syncBoard(array) {

  //for every row
  for (var r = 0; r<array.length; r++){
    //for every coloumn in that row
    for (var c = 0; c<array[0].length; c++ ){
      //append table cell with inputted array index value
      $("tr." + c + " td." + r).text(array[c][r]);
    }
  }

}

$(function(){
  //newgame (constructor), clear html fields
  var newGame = new Game(2);
  $("td").text("");
  $(".out").text("it is " + newGame.turn +"'s turn");

  $("td").click(function() {
    //take and test input
    if ( newGame.setBoard( parseInt($(this).parent().attr('class')), parseInt($(this).attr('class')) ) ) {
      // $(this).text(newGame.turn);
      newGame.changePlayer();
      syncBoard(newGame.board);

      // set random color
      var randomColor = '#'+Math.floor(Math.random()*16777215).toString(16);
      $(this).css("background-color", randomColor);

    } else { $(".out").html("invalid input!!<br>it is " + newGame.turn +"'s turn"); }

    // log board
    // console.log(newGame.board[0]);
    // console.log(newGame.board[1]);
    // console.log(newGame.board[2]);

    //test if game over
    if (newGame.testWinner()) {

      // test how game ended
      if (newGame.testWinner() === "tie") {
        $(".out").html("Nobody wins, new game!");
      } else {
        $(".out").html(newGame.testWinner() + " wins, new game!");
      }

      // reset board, remove saved game if required
      setTimeout(function(){

        //if saved game, remove its cookie and its
        if (newGame.nameOfGame) {
          $("p[value='" + newGame.nameOfGame + "']").remove();
          $.removeCookie(newGame.nameOfGame);
        }

        newGame = new Game(2);
        $("td").text("");
        $(".out").text("it is " + newGame.turn +"'s turn");
      }, 1000);
    } else {
      $(".out").text("it is " + newGame.turn +"'s turn");
    }

  });

  //new one player game
  $("#new1").click(function() {
    newGame = new Game(1);
    $("td").text("");
    $(".out").text("it is " + newGame.turn +"'s turn");
  });

  //new two player game
  $("#new2").click(function() {
    newGame = new Game(2);
    $("td").text("");
    $(".out").text("it is " + newGame.turn +"'s turn");
  });


  $("#old").keypress(function(e) {

    //detect enter key
    var key = e.which
    if (key == 13){
      newGame.nameOfGame = $("#old").val();
      // console.log(newGame.nameOfGame);

      //var oldGame = newGame;

      $(".saved-games").append("<p class='old-game' value='" + newGame.nameOfGame + "'>" + newGame.nameOfGame + "</p>");

      var gameString = JSON.stringify(newGame)
      $.cookie(newGame.nameOfGame, gameString);

      newGame = new Game(2);
      $("td").text("");
      $(".out").text("it is " + newGame.turn +"'s turn");

      $(".old-game").click(function() {

        newGame = new Game();
        var lastGame = JSON.parse($.cookie($(this).text()));
        for (var i in lastGame){
          console.log(newGame[i])
          newGame[i] = lastGame[i];
        }
        console.log(newGame)
        syncBoard(newGame.board);

        $(".out").text("it is " + newGame.turn + "'s turn");
      });
    }
  });

  for(var i in $.cookie()) {
    console.log(i)
    $(".saved-games").prepend("<p class='old-game' value='" + i + "'>" + i + "</p>");
  }

  $(".old-game").click(function() {

    newGame = new Game();
    var lastGame = JSON.parse($.cookie($(this).text()));
    for (var i in lastGame){
      newGame[i] = lastGame[i];
    }
    syncBoard(newGame.board);

    $(".out").text("it is " + newGame.turn + "'s turn");
  });

});
