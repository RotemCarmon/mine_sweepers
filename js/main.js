'use strict'

var gBoard;
var EMPTY = ''
var MINE = `<img src="img/mine.jpg"/ style="width:36.5px; height:36px ; padding:0">`
var timer = document.querySelector('.timer');
var watch = new stopWatch(timer); // constract stopwatch function
var gFirstClick = true;

var gLevel = { SIZE: 4, MINES: 2 } // sets the size of the board

var emoji = {
    happy: '🙂',
    dead: '😵',
    sunGlasses: '😎'
}

var elRestart = document.querySelector('.restart')
elRestart.innerHTML = emoji.happy;


var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    numOflives: 3,
    safeClick: 0
    
}


// initalize the game - called on load
function initGame() {
    watch.stop();
    watch.reset();
    gGame.isOn = true
    gBoard = buildBoard(gLevel.SIZE)
    renderBoard(gBoard)
    gGame.shownCount = 0;
    gGame.numOflives = 3;
    gGame.safeClick = 0
    
    
    gFirstClick = true;
    elRestart.innerHTML = emoji.happy;
    if (localStorage.bestScore) document.querySelector('.bestScore').innerHTML = `Best Time is - ${localStorage.bestScore}`;
    document.querySelector(`.live`).innerText = `Lives - ${gGame.numOflives}`
    var el = document.querySelectorAll('.hint')
    for(var i = 0 ; i < el.length ; i++){
        
        el[i].style.opacity = 1;
        el[i].style.cursor= 'pointer'
        el[i].setAttribute('onclick','getHint(\'reveal(this)\', this)')
    
    }
}


// render board to the DOM
function renderBoard(board) {
    var strHtml = `<table border="0"><tbody>`;     //DOM  Build the board 
    for (var i = 0; i < board.length; i++) {
        strHtml += '<tr>'
        for (var j = 0; j < board.length; j++) {
            var cell = board[i][j];
            
            strHtml += `<td class="cell cell-${i}-${j}" onclick="cellClicked(this)" oncontextmenu="flagCell(this,event)">
            <img class="close" src="img/back_pic2.jpg"/>
            <img class="flag" style="display:none" src="img/pirate_flag.png"/>
            <div class="open" style="display:none"></div></td>`
        }
        strHtml += `</tr>`
    }
    strHtml += `</tbody></table>`;
    var elContainer = document.querySelector('.container')
    elContainer.innerHTML = strHtml;
}

function flagCell(elCell, e) {
    e.preventDefault()                                  // disable context menu
    var coord = getCellId(elCell);                          //get coords from DOM to Model
    var currCell = gBoard[coord.i][coord.j];
    var elFlaged = elCell.querySelector('.flag');           //DOM  grabs the flag img element
    
    if (gGame.isOn && !currCell.isShown) {
        if (!currCell.isMarked) {        //conditions to flag
            currCell.isMarked = true;     // set as marked - Model
            elFlaged.style.display = 'block'; // DOM show flag img
            gGame.markedCount++
            checkVictory()
        } else if (currCell.isMarked) {
            currCell.isMarked = false;   // set as unmarked - Model
            elFlaged.style.display = 'none';  // DOM hides flag img
            gGame.markedCount--
        }
    }
}

function cellClicked(elCell) {
    if (!gGame.isOn) return
    var coord = getCellId(elCell);
    var currCell = gBoard[coord.i][coord.j];  // in model
    if (currCell.isMarked) return
    
    if (gFirstClick) {
        updateMinesCount(gBoard)
        watch.start();
    }
    if (currCell.isMine) {
        // debugger;
        GameOver(coord.i,coord.j)
    }
    if (!currCell.isShown || gFirstClick) {  //if cell NOT been tuched
        expandShown(gBoard, coord.i, coord.j, elCell) //open neighbors
        currCell.isShown = true;               // update cell to shown - Model
        flippedCell(coord.i, coord.j, 'none', 'block')
        checkVictory()
    }
    gFirstClick = false;
    
    
}

function expandShown(board, cellI, cellJ, elCell) {
    if (elCell.querySelector('.open').innerHTML) {  //if cell not EMPTY -  contains a number -- End function
        gGame.shownCount++
        return
    }
    recurExpantion(board, cellI, cellJ)
    
}
function recurExpantion(board, cellI, cellJ, ) {
    var currCell;
    var startI = cellI - 1;                 // neighbor conditions
    var startJ = cellJ - 1;
    var endI = cellI + 1;
    var endJ = cellJ + 1;
    for (var i = startI; i <= endI; i++) {              // board boundaries
        for (var j = startJ; j <= endJ; j++) {                                  //neighbor loop
            if (i >= 0 && i < board.length && j >= 0 && j < board.length) {
                currCell = board[i][j];       //current cell -  Model
                if (!currCell.isMine && !currCell.isShown) {
                    currCell.isShown = true;
                    gGame.shownCount++
                    flippedCell(i, j, 'none', 'block')
                    if (isEmpty(board, i, j)) recurExpantion(board, i, j)
                }
            }
        }
    }
}

function isEmpty(board, i, j) {
    if (board[i][j].isMine) {
        return false
    }
    else if (board[i][j].isMarked) {
        return false
    }
    else if (board[i][j].minesAroundCount > 0) {
        return false
    } else {
        return true
    }
    
}

function checkVictory() {
    if (gGame.markedCount === gLevel.MINES
        && gGame.shownCount === (gLevel.SIZE ** 2 - gLevel.MINES)) {  // conditions for win
            gGame.isOn = false;                                 // ends game
            console.log('VICTORY!')
            elRestart.innerHTML = emoji.sunGlasses;
            getBestScore(timer.innerText)
            watch.stop();
        }
    }
    
    function GameOver(coordI, coordJ) {
        var mineRevealTime;
        clearInterval(mineRevealTime);
        
        
        gGame.numOflives--
        document.querySelector(`.live`).innerText = `Lives - ${gGame.numOflives}`
        if (gGame.numOflives === 0) {
            for (var i = 0; i < gBoard.length; i++) {
                for (var j = 0; j < gBoard[i].length; j++) {
                    var cell = gBoard[i][j];                     //Model
                    if (cell.isMine) {
                        flippedCell(i, j, 'none', 'block')
                    }
                }
            }
            
            getBestScore(timer.innerText)
            gGame.isOn = false;
            elRestart.innerHTML = emoji.dead;
            console.log('GAME OVER')
            watch.stop();
        } else if(gGame.numOflives > 0) {
            
            gGame.shownCount--
            mineRevealTime = setTimeout(function () {
            gBoard[coordI][coordJ].isShown = false;
            flippedCell(coordI, coordJ, 'block', 'none')
        }, 2000)

    }

}



function getHint(value, el) {

    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[i].length; j++) {
            var elCell = document.querySelector(`.cell-${i}-${j}`);
            elCell.setAttribute('onclick', value)
        }
    }
    el.style.opacity = 0.5;
    el.style.cursor= 'context-menu'
    el.removeAttribute('onclick')

}

// TODO - when pressing hint on first click, nothing has renderd yet

function reveal(elCell) {
    // updateMinesCount(gBoard)
    var coord = getCellId(elCell)
    var checkedCells = [];
    var startI = coord.i - 1;
    var startJ = coord.j - 1;
    var endI = coord.i + 1;
    var endJ = coord.j + 1;
    for (var i = startI; i <= endI; i++) {
        for (var j = startJ; j <= endJ; j++) {
            if (i >= 0 && i < gBoard.length && j >= 0 && j < gBoard.length) {
                if (!gBoard[i][j].isShown)
                    checkedCells.push(gBoard[i][j]);
            }
        }
    }
    for (var k = 0; k < checkedCells.length; k++) {
        var i = checkedCells[k].i
        var j = checkedCells[k].j
        flippedCell(i, j, 'none', 'block')
    }
    setTimeout(() => {
        for (var k = 0; k < checkedCells.length; k++) {
            var i = checkedCells[k].i
            var j = checkedCells[k].j
            flippedCell(i, j, 'block', 'none')
        } getHint('cellClicked(this)',elCell.querySelector('.open'))
    }, 2500)
    gFirstClick = false;
}

function flippedCell(i, j, cover, value) {
    var elCellId = document.querySelector(`.cell-${i}-${j}`)   //DOM - cell
    var backPic = elCellId.querySelector('.close');         // DOM               
    var openCell = elCellId.querySelector('.open');
    backPic.style.display = cover
    openCell.style.display = value
}

function safeClick(el) {
    if (gGame.safeClick >= 3) {
        return
    }
    el.querySelector('span').innerText = 2 - gGame.safeClick
    var possibleCells = []
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[i].length; j++) {
            var cell = gBoard[i][j]
            if (!cell.isMarked && !cell.isShown && !cell.isMine) {
                possibleCells.push(cell);
            }
        }
    }
    var chosenCell = getRandomIntInclusive(0, possibleCells.length)
    var i = possibleCells[chosenCell].i
    var j = possibleCells[chosenCell].j
    var elCell = document.querySelector(`.cell-${i}-${j}`)   //DOM - cell
    showCell(elCell)
    gGame.safeClick++
    if (gGame.safeClick === 3) el.innerText = 'no more'

}

function showCell(elCell) {
    var backPic = elCell.querySelector('.close');
    var openCell = elCell.querySelector('.open');
    backPic.style.display = 'none';
    openCell.style.display = 'block';
    setTimeout(function () {
        backPic.style.display = 'block';
        openCell.style.display = 'none';
    }, 2000)
}