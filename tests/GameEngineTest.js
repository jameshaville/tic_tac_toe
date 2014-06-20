describe("getCellsOfType", function(){
  
  var GameEngine; 

  beforeEach(module("TicTacToe"));
  beforeEach(inject(function(_GameEngine_){
  	GameEngine = _GameEngine_;
  }));

  it("should return an array for current cell positions with char X", function(){
    var gameState = ['','X','O','','X','','','','X'];
    var charToFind = 'X';
    var expectedResult = [1,4,8];
  	expect(GameEngine.getCellsOfType(gameState,charToFind)).toEqual(expectedResult);
  });

  it("should return an array for current cell positions with char O", function(){
    var gameState = ['','O','','X','','','','',''];
    var charToFind = 'O';
    var expectedResult = [1];
  	expect(GameEngine.getCellsOfType(gameState,charToFind)).toEqual(expectedResult);
  });

  it("should return an array for current empty cell positions", function(){
    var gameState = ['','O','','X','','','','',''];
    var charToFind = '';
    var expectedResult = [0,2,4,5,6,7,8];
  	expect(GameEngine.getCellsOfType(gameState,charToFind)).toEqual(expectedResult);
  });

  it("should return an empty array if no cell positions for that char", function(){
    var gameState = ['','X','','','','','','',''];
    var charToFind = 'O';
    var expectedResult = [];
  	expect(GameEngine.getCellsOfType(gameState,charToFind)).toEqual(expectedResult);
  });
});

describe("checkWin", function(){
  
  var GameEngine; 

  beforeEach(module("TicTacToe"));
  beforeEach(inject(function(_GameEngine_){
  	GameEngine = _GameEngine_;
  }));

  it("should return an array for possible winning moves for char X", function(){
    var gameState = ['X','','X','X','O','','O','','O'];
    var charMove = 'X';
    var filledCells = [0,2,3];
    var expectedResult = [1];
  	expect(GameEngine.getWinningMoves(gameState,filledCells,charMove)).toEqual(expectedResult);
  });

  it("should return an array for possible winning moves for char O", function(){
    var gameState = ['X','','O','O','X','','X','','O'];
    var charMove = 'X';
    var filledCells = [2,3,8];
    var expectedResult = [5];
  	expect(GameEngine.getWinningMoves(gameState,filledCells,charMove)).toEqual(expectedResult);
  });

  it("should return an array with two possible winning moves to spot an upcoming fork situation for char X", function(){
    var gameState = ['O','','X','','O','','X','','X'];
    var charMove = 'X';
    var filledCells = [2,6,8];
    var expectedResult = [5,7];
  	expect(GameEngine.getWinningMoves(gameState,filledCells,charMove)).toEqual(expectedResult);
  });
});

describe("checkFork", function(){

  var GameEngine; 

  beforeEach(module("TicTacToe"));
  beforeEach(inject(function(_GameEngine_){
  	GameEngine = _GameEngine_;
  }));

  it("should return an array with fork move for char X", function(){
    var gameState = ['','','X','','O','','X','','O'];
    var charToFind = 'X';
    var expectedResult = [0];
  	expect(GameEngine.getForkMoves(gameState,charToFind)).toEqual(expectedResult);
  });

  it("should return an array with two fork moves for char X - first stage of blocking", function(){
    var gameState = ['','','X','','O','','X','',''];
    var charToFind = 'X';
    var expectedResult = [0,8];
  	expect(GameEngine.getForkMoves(gameState,charToFind)).toEqual(expectedResult);
  });
});

describe("getEmptyCornersOppositeOpponent", function(){
   
  var GameEngine; 

  beforeEach(module("TicTacToe"));
  beforeEach(inject(function(_GameEngine_){
  	GameEngine = _GameEngine_;
  }));

  it("should return an array with empty corners opposite opponent", function(){
    var gameState = ['O','X','O','X','','','','',''];
    var charToFind = 'X';
    var opponentChar = 'O';
    var expectedResult = [8,6];
  	expect(GameEngine.getEmptyCornersOppositeOpponent(gameState,charToFind,opponentChar)).toEqual(expectedResult);
  });

  it("should return an empty array when corners are taken", function(){
    var gameState = ['X','','X','','O','','X','','O'];
    var charToFind = 'X';
    var expectedResult = [];
  	expect(GameEngine.getEmptyCornersOppositeOpponent(gameState,charToFind)).toEqual(expectedResult);
  });
});

describe("getEmptyCorners", function(){
   
  var GameEngine; 

  beforeEach(module("TicTacToe"));
  beforeEach(inject(function(_GameEngine_){
  	GameEngine = _GameEngine_;
  }));

  it("should return an array with empty corners", function(){
    var gameState = ['O','X','O','X','','','','',''];
    var expectedResult = [6,8];
  	expect(GameEngine.getEmptyCorners(gameState)).toEqual(expectedResult);
  });

  it("should return an empty array when corners are taken", function(){
    var gameState = ['O','X','O','X','','','O','','X'];
    var expectedResult = [];
  	expect(GameEngine.getEmptyCorners(gameState)).toEqual(expectedResult);
  });
});

describe("playCenter", function(){
   
  var GameEngine; 

  beforeEach(module("TicTacToe"));
  beforeEach(inject(function(_GameEngine_){
  	GameEngine = _GameEngine_;
  }));

  it("should mark the center cell and return true as is empty", function(){
    var gameState = ['O','X','O','X','','','','',''];
    var expectedGameState = ['O','X','O','X','X','','','',''];
    expect(GameEngine.playCenter(gameState,4,'X')).toBe(true);
  	expect(gameState).toEqual(expectedGameState);
  });

  it("should not mark the center cell and return false as is taken", function(){
    var gameState = ['O','X','O','X','X','','','',''];
    var expectedGameState = ['O','X','O','X','X','','','',''];

    expect(GameEngine.playCenter(gameState,4,'O')).toBe(false);
  	expect(gameState).toEqual(expectedGameState);

  });
});

describe("playCell", function(){
   
  var GameEngine; 

  beforeEach(module("TicTacToe"));
  beforeEach(inject(function(_GameEngine_){
  	GameEngine = _GameEngine_;
  }));

  it("should change the gameState array to reflect the cell played", function(){
    var gameState = ['O','X','O','X','','','','',''];
    GameEngine.playCell(gameState,8,'X');
    var expectedGameState = ['O','X','O','X','','','','','X'];
  	expect(gameState).toEqual(expectedGameState);
  });
});

describe("calculateResult", function(){
   
  var GameEngine; 

  beforeEach(module("TicTacToe"));
  beforeEach(inject(function(_GameEngine_){
    GameEngine = _GameEngine_;
  }));

  it("should return HUMAN string to indicate winner", function(){
    var gameState = ['O','X','O','X','X','X','O','X','O'];
    expect(GameEngine.calculateResult(gameState,'X','O')).toBe('HUMAN');
  });

  it("should return COMPUTER string to indicate winner", function(){
   var gameState = ['O','O','O','X','O','X','X','X','O'];
    expect(GameEngine.calculateResult(gameState,'X','O')).toBe('COMPUTER');
  });

  it("should return DRAW string to indicate draw", function(){
   var gameState = ['O','O','X','X','O','O','O','X','X'];
   expect(GameEngine.calculateResult(gameState,'X','O')).toBe('DRAW');
  });
});









