//business logic
function Game() {
  this.board = [["","",""], ["","",""], ["","",""]];
  this.turn = "x";


  // function change player
  this.changeplayer = function(){
    if(this.turn === "x") {
      this.turn = "o";
    } else { this.turn = "x"; }
  }

  //function test winner
  this.testWinner = function(){

    //check rows
    for (var i=0; i<this.board[0].length; i++){
      if (this.board[i].join("") === "xxx"){
        // console.log("X wins!")
        return "x"
      } else if (this.board[i].join("") === "ooo"){
        // console.log("O wins!")
        return "o"
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
        return "x"
      } else if (column === "ooo"){
        // console.log("O wins column!")
        return "o"
      }
    }


    // check diagonals
    if (this.board[1][1] &&
      ( (this.board[0][0] === this.board[1][1] && this.board[1][1] === this.board[2][2]) ||
      (this.board[0][2] === this.board[1][1] && this.board[1][1] === this.board[2][0]) )
    ) {
      return this.board[1][1]
    }

    // check tie
    if (this.board.join("").length === 15){
      console.log(this.board.join(""))
      return "tie"
    }
  }

  //function take and validate input
  this.setBoard = function(row,col){

    // if not an empty string
    if(!this.board[row][col]) {
      //add turn to board
      this.board[row][col] = this.turn;
      return true;
    } else { return false; }
  }

}

function start(){
  newGame = new Game();
  $("td").text("");
  $(".out").text("it is " + newGame.turn +"'s turn");
}


// ui
$(function(){

  //newgame (constructor), clear html fields

  var newGame = new Game();
  $("td").text("");
  $(".out").text("it is " + newGame.turn +"'s turn");

  $("td").click(function() {
    //take and test input
    if ( newGame.setBoard( parseInt($(this).parent().attr('class')), parseInt($(this).attr('class')) ) ) {
      $(this).text(newGame.turn);
      newGame.changeplayer();
      $(".out").text("it is " + newGame.turn +"'s turn");
    } else { $(".out").html("invalid input!!<br>it is " + newGame.turn +"'s turn");
    }

    // log board
    console.log(newGame.board[0]);
    console.log(newGame.board[1]);
    console.log(newGame.board[2]);


    //test winner
    if (newGame.testWinner() === "tie"){
      $(".out").html("Nobody wins, new game!");
      setTimeout(function(){
        newGame = new Game();
        $("td").text("");
        $(".out").text("it is " + newGame.turn +"'s turn");
      }, 1000);
    } else if (newGame.testWinner()) {
      // console.log("X wins")
      $(".out").html(newGame.testWinner() + " wins, new game!");
      setTimeout(function(){
        newGame = new Game();
        $("td").text("");
        $(".out").text("it is " + newGame.turn +"'s turn");
      }, 1000);
    }
  });

  $("#new").click(function() {
    newGame = new Game();
    $("td").text("");
    $(".out").text("it is " + newGame.turn +"'s turn");  })
})
