app.controller('GameController', ['$scope', 'GameEngine', function($scope, GameEngine){
  
  var winningCombos = [[0,1,2],[0,3,6],[0,4,8],[1,4,7],[2,4,6],[2,5,8],[3,4,5],[6,7,8]];
  var turnNo = 0;
   
  //gameboard
  $scope.gameBoard = ['','','','','','','','',''];
  
  //default chars
  $scope.humanChar = 'X';
  $scope.computerChar = 'O';

  //human plays first by default
  $scope.humanFirst = true;

  //play as char
  $scope.playAs = function(playAsChar){
    var previousChar = $scope.humanChar;
    $scope.humanChar = playAsChar;
    $scope.computerChar = previousChar;
  }
  
  $scope.playFirst = function(){
    $scope.humanFirst = $scope.humanFirst ? false : true;
  }
  
  $scope.title = '8th Light Apprenticeship Programming Challenge';
  $scope.gameOver = false;
  $scope.gameInProgress = false;

  $scope.startGame = function(){
    $scope.gameInProgress = true;
    if (!$scope.humanFirst){
      GameEngine.playCenter($scope.gameBoard,4,$scope.computerChar);
      $scope.displayText = "Computer Has Gone First! Your Turn!";
    }else{
      $scope.displayText = "You Are Going First! Play A Cell!"
    }
  }

  $scope.resetGame = function(){
    $scope.displayText = '';
    $scope.gameBoard = ['','','','','','','','',''];
    $scope.gameInProgress = false;
  }

  $scope.flip = function(a){
    //clear text
    $scope.displayText = '';

    //check if game is in progress
    if (!$scope.gameInProgress) return;

    //check if allowed to flip this cell
    if (!isCellEmpty($scope.gameBoard[a])){
      $scope.displayText = 'This Cell Has Been Played! Play An Empty Cell!';
      return;
    }
  	
  	//increment turn
  	turnNo++;

  	//mark cell
  	$scope.gameBoard[a] = $scope.humanChar;	
    
    //check if this move ends game
    checkGameOver($scope.gameBoard);

  	//play winner if possible
   	var computerCells = GameEngine.getCellsOfType($scope.gameBoard,$scope.computerChar);
   	var winningMovesForComputer = GameEngine.getWinningMoves($scope.gameBoard,computerCells,$scope.computerChar);
   	
   	if (playOrBlockWinner($scope.gameBoard,winningMovesForComputer,$scope.computerChar)) return;
  	
   	//block opponent win if possible
   	var humanCells = GameEngine.getCellsOfType($scope.gameBoard,$scope.humanChar);
   	var winningMovesForHuman = GameEngine.getWinningMoves($scope.gameBoard,humanCells,$scope.humanChar);

	  if (playOrBlockWinner($scope.gameBoard,winningMovesForHuman,$scope.computerChar)) return;

   	 if (turnNo > 1){
   	 	//create fork if possible
   			var forksComputer = GameEngine.getForkMoves($scope.gameBoard,$scope.computerChar);
   			if (createFork($scope.gameBoard, forksComputer,$scope.computerChar)) return;
   			//block fork if possible
   			  var forksHuman = GameEngine.getForkMoves($scope.gameBoard,$scope.humanChar);
   			  if (blockFork($scope.gameBoard,forksHuman,$scope.computerChar)) return;
        }			
  				if (GameEngine.playCenter($scope.gameBoard,4,$scope.computerChar)) return;
   				
   					//play opposite corner
   					var emptyCornersOppositeOpponent = GameEngine.getEmptyCornersOppositeOpponent($scope.gameBoard,'O','X');
   					for (var i=0;i<emptyCornersOppositeOpponent.length;i++){
   						GameEngine.playCell($scope.gameBoard,emptyCornersOppositeOpponent[i],$scope.computerChar);
   						checkGameOver($scope.gameBoard);
              //return on first empty opposite corner filled
   						return;
   					}
   					//play empty corner
   					var emptyCorners = GameEngine.getEmptyCorners($scope.gameBoard);
   					for (var i=0;i<emptyCorners.length;i++){
   						GameEngine.playCell($scope.gameBoard, emptyCorners[i],$scope.computerChar);
              checkGameOver($scope.gameBoard);
   						return;
   					}

   			 //fill remaining empty cells
   			var emptyCells = GameEngine.getCellsOfType($scope.gameBoard,'');
   			var emptyCellsNo = emptyCells.length;
   			if (emptyCellsNo >= 1){
   				GameEngine.playCell($scope.gameBoard,emptyCells[0],$scope.computerChar);
          checkGameOver($scope.gameBoard);
   				return;
   			}
   }

  function playOrBlockWinner(gameBoard, winningMoves, charToPlay){
  	if (winningMoves.length > 0) {
  		GameEngine.playCell(gameBoard,winningMoves[0],charToPlay);
      checkGameOver(gameBoard);
      return true;
  	} else {
  	  return false;
  	}
  }

  function createFork(gameBoard, forks, charToPlay){
  	if (forks.length > 0){
  		GameEngine.playCell(gameBoard,forks[0],charToPlay);
  		return true;
  	}
  	return false;
  }

  function blockFork(gameBoard, forks, charToPlay){
  	//block the fork unless it allows them to play another fork
  	if (forks.length == 2){
  		//two potential forks - try to create two in a row to force them to defend
  		for (var i=0;i<forks.length;i++){
   			var emptyCells = GameEngine.getCellsOfType(gameBoard, '');
   			for (var j=0;j<emptyCells.length;j++){
   			  var gameBoardCopy = angular.copy(gameBoard);
   			  if (emptyCells[j]!=forks[i]){
   			  	gameBoardCopy[emptyCells[j]] = charToPlay;
   			  	var filledCells = GameEngine.getCellsOfType(gameBoardCopy,charToPlay)
   			  	var winningMoves = GameEngine.getWinningMoves(gameBoardCopy,filledCells,charToPlay);
   			  	//reset copied cell
   			  	gameBoardCopy[emptyCells[j]] = '';
   			  	if (winningMoves.length > 0){
   			  		//play move as human will have to block or computer will win
   			  		GameEngine.playCell(gameBoard,emptyCells[j],charToPlay);
   			  		return true;
   			  	}
   			  }
   	    }
      }
  	}
  	//if they have one potential fork then block it
    if (forks.length == 1){
    	GameEngine.playCell(gameBoard,forks[0],charToPlay);
  		return true;
  	}
  	return false;
  }

  // Helper methods

  function setTitle(title){
  	$scope.title = title;
  }

  function isCellEmpty(charInCell){
    return charInCell == '' ? true : false;
  }

  function checkGameOver(gameBoard){
    var emptyCells = GameEngine.getCellsOfType(gameBoard,'');
    var result = GameEngine.calculateResult(gameBoard,$scope.humanChar,$scope.computerChar);
    //Human Can Never Win
    if (result === 'COMPUTER'){
      initGameOver('You Lost!', 'You Lost The Last Game! Try Again!');
    }else if (result === 'DRAW' && emptyCells.length == 0){
      initGameOver('You Have Drawn!', 'You Drew The Last Game! Try Again!');
    }
  }

  function initGameOver(text, title){
    $scope.gameOver = true;
    $scope.gameOverText = text;
    $scope.title = title;
  }


}]);