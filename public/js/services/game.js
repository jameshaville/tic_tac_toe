app.factory('GameEngine', function(){

	var getWinningCombos = function(){
		return [[0,1,2],[0,3,6],[0,4,8],[1,4,7],[2,4,6],[2,5,8],[3,4,5],[6,7,8]];
	}

  var getCellsOfType = function(gameState,charToFind){
    var cells = [];
    for (var i=0;i<gameState.length;i++){
  	  if (gameState[i] == charToFind){
  	    cells.push(i);
  	  }
  	}
  	return cells;
  }

  var getWinningMoves = function(gameState,filledCells,charToWin){
  	var winningCombos = getWinningCombos();
  	var winningMoves = [];

    _.each(winningCombos, function(winningCombo){
    	//find out how far away from winning move
    	var diff = _.difference(winningCombo, filledCells);
    	//if only 1 then check the cell is empty to validate winning move
    	if (diff.length == 1 && gameState[diff[0]] == ''){
        var winningMove = diff[0];
        winningMoves.push(winningMove);
    	}
    });
  	return winningMoves;
  }

  var getForkMoves = function(gameState, charToFind){
  	//copy gameState
  	var gameStateCopy = angular.copy(gameState);
  	var emptyCells = getCellsOfType(gameStateCopy,'');
  	var forksFound = [];
  	//find empty positions
  	for (var i=0;i<emptyCells.length;i++){
  	 	  gameStateCopy[emptyCells[i]] = charToFind;
  	 		var filledCells = getCellsOfType(gameStateCopy,charToFind);
  	 		//console.log(filledCells);
  	  	var winningMoves = getWinningMoves(gameStateCopy,filledCells,charToFind);
  	 		if (winningMoves.length==2){
  				//fork exists
  	 			forksFound.push(emptyCells[i]);
  	 		}
  	  //reset for next run through
  	 	gameStateCopy[emptyCells[i]] = '';
  	 } 	
  	
  	return forksFound;
  }

  var getEmptyCornersOppositeOpponent = function(gameState, charToFind, opponentChar){
  	var opponentCells = getCellsOfType(gameState,opponentChar);
  	var cornerCells = [0,2,6,8];
  	var oppositeCorners = [8,6,2,0];
  	var emptyCornersOppositeOpponent = [];
  	for (var i=0;i<cornerCells.length;i++){
  		if (gameState[cornerCells[i]]==opponentChar && gameState[oppositeCorners[i]] == ''){  
  			emptyCornersOppositeOpponent.push(oppositeCorners[i]);
  		}
  	}
  	return emptyCornersOppositeOpponent;
  }

  var getEmptyCorners = function(gameState){
  	var cornerCells = [0,2,6,8];
  	var emptyCorners = [];
  	for (var i=0;i<cornerCells.length;i++){
  		if (gameState[cornerCells[i]] == ''){
  			emptyCorners.push(cornerCells[i]);
  		}
  	}
  	return emptyCorners;
  }

  var playCenter = function(gameState, centerCell,charToPlay){
  	if(gameState[centerCell]==''){
  		gameState[centerCell] = charToPlay;
  		return true;
  	}else{return false;}
  }

  var playCell = function(gameState, cellToPlay, charToPlay){
  	gameState[cellToPlay] = charToPlay;
  }

  var calculateResult = function(gameState,humanChar,computerChar){
  	
  	var humanCells = getCellsOfType(gameState,humanChar);
  	var computerCells = getCellsOfType(gameState,computerChar);
  	var winningCombos = getWinningCombos();

  	for (var i=0;i<winningCombos.length;i++){
  		var diffComputer = _.difference(winningCombos[i],computerCells);
  		var diffHuman = _.difference(winningCombos[i], humanCells);
  		if (diffComputer.length == 0){
  			return 'COMPUTER';
  		}else if (diffHuman.length == 0){
  			return 'HUMAN';
  		}
  	}
  	return 'DRAW';
  }

  return{
    getCellsOfType: getCellsOfType,
    getWinningMoves: getWinningMoves,
    getForkMoves: getForkMoves,
    getEmptyCornersOppositeOpponent: getEmptyCornersOppositeOpponent,
    getEmptyCorners: getEmptyCorners,
    playCenter: playCenter,
    playCell: playCell,
    calculateResult: calculateResult
  }

});