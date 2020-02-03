'use strict'

function buildBoard(size = 4) {   //Model build board
    var board = [];
    for (var i = 0; i < size; i++) {
        board[i] = [];
        for (var j = 0; j < size; j++) {
            var cell = {                      // cell object
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: false,
                i:i,
                j:j,
                
            };
            // assign cell object to the board location
            board[i][j] = cell
        }
    }
    return board
}

// itirates through the board and update cell proparty minesAroundCount
function updateMinesCount(board) {
    getRandomMines(board);
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[i].length; j++) {
            var minesAroundCount = setMinesNegsCount(i, j, board)
            board[i][j].minesAroundCount = minesAroundCount;
        }
    }
}

//create random placed mines

function getRandomMines(board) {
    var mineCount = 0;
    var size = gLevel.SIZE;       // mines count & board size from DOM level select
    var numOfMines = gLevel.MINES;
    while (mineCount < numOfMines) {   // itirate until create number of mines
        var mineI = getRandomIntInclusive(0, size - 1)  // randomize coords for mines
        var mineJ = getRandomIntInclusive(0, size - 1)
        if (!board[mineI][mineJ].isMine && !board[mineI][mineJ].isShown) {  //conditions for creating a mine
            board[mineI][mineJ].isMine = true;
            renderNegs(mineI, mineJ)
            mineCount++
        }
    }
    return board
}

function renderNegs(i, j) {
    var cell = document.querySelector(`.cell-${i}-${j}`); // grab the cell fro the DOM
    cell.querySelector('div').innerHTML = MINE   // set the innerHTML to be a MINE img
}



// check neighbor cells for mines
function setMinesNegsCount(cellI, cellJ, board) {
    var minesCount = []
    var checkedCell;
    var startI = cellI - 1;
    var startJ = cellJ - 1;
    var endI = cellI + 1;
    var endJ = cellJ + 1;
    for (var i = startI; i <= endI; i++) {
        for (var j = startJ; j <= endJ; j++) {
            if (i >= 0 && i < board.length && j >= 0 && j < board.length) {
                checkedCell = board[i][j];
                if (checkedCell.isMine) {
                    if (checkedCell !== board[cellI][cellJ]) {
                        minesCount.push(checkedCell)
                    }
                }
            }
        }
    }
    var minesNegsCount = minesCount.length;
    if (!board[cellI][cellJ].isMine && minesNegsCount !== 0) {
        var cell = document.querySelector(`.cell-${cellI}-${cellJ}`); // grab the cell from the DOM
        cell.querySelector('div').innerHTML = `<span>${minesNegsCount}</span>`;
    }
    return minesNegsCount
}

function getCellId(cell) {    // from DOM to models
    var cellClass = cell.classList.item(1);
    var desh = cellClass.lastIndexOf('-');
    var cellI = +cellClass.substring(desh - 1, desh);
    var cellJ = +cellClass.substring(desh + 1);
    var coord = { i: cellI, j: cellJ };
    return coord;
}
function getLevel(elBtn) {
    var possibleLevels = [
        { SIZE: 4, MINES: 2 },
        { SIZE: 8, MINES: 12 },
        { SIZE: 12, MINES: 30 }
    ]
    var currLevel = elBtn.dataset.level;
    gLevel.SIZE = possibleLevels[currLevel].SIZE;
    gLevel.MINES = possibleLevels[currLevel].MINES;
    initGame()
}

function getBestScore(time){
    
    var bestScore = +time.substring(3)
    var prevScore = localStorage.bestScore;
    if(prevScore === undefined)prevScore = Infinity
    
    localStorage.bestScore = bestScore;
    if(bestScore < prevScore ){
    }
    document.querySelector('.bestScore').innerHTML = `Best Time is - ${localStorage.bestScore}`;



}

function getRandomIntInclusive(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}