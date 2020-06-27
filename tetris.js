const canvas = document.getElementById('tetris');
const context = canvas.getContext('2d');

const nextCanvas = document.getElementById('next');
const nextContext = nextCanvas.getContext('2d');

const holdCanvas = document.getElementById('hold');
const holdContext = holdCanvas.getContext('2d');

const blockSide = 30;

context.fillStyle = '#aaaaaa';
context.lineWidth = 1;
context.fillRect(0, 0, canvas.width, canvas.height);

nextContext.fillStyle = '#aaaaaa';
nextContext.lineWidth = 1;
nextContext.fillRect(0, 0, nextCanvas.width, nextCanvas.height);

holdContext.fillStyle = '#aaaaaa';
holdContext.lineWidth = 1;
holdContext.fillRect(0, 0, holdCanvas.width, holdCanvas.height);


function drawGrid() {
    for (i = 0; i < canvas.height; i += blockSide) {
        context.moveTo(0, i);
        context.lineTo(canvas.width, i);
        context.stroke();

    }

    for (i = 0; i < canvas.width; i += blockSide) {
        context.moveTo(i, 0);
        context.lineTo(i, canvas.height);
        context.stroke();
    }

    for (i = 0; i < nextCanvas.height; i += blockSide) {
        nextContext.moveTo(0, i);
        nextContext.lineTo(nextCanvas.width, i);
        nextContext.stroke();
    }

    for (i = 0; i < nextCanvas.width; i += blockSide) {
        nextContext.moveTo(i, 0);
        nextContext.lineTo(i, nextCanvas.height);
        nextContext.stroke();
    }

    for (i = 0; i < holdCanvas.height; i += blockSide) {
        holdContext.moveTo(0, i);
        holdContext.lineTo(holdCanvas.width, i);
        holdContext.stroke();

    }

    for (i = 0; i < holdCanvas.width; i += blockSide) {
        holdContext.moveTo(i, 0);
        holdContext.lineTo(i, holdCanvas.height);
        holdContext.stroke();
    }
}

function boardSweep() {
    let lineCount = 1;
    outer: for (let y = board.length - 1; y > 0; y--) {
        for (let x = 0; x < board[y].length; x++) {
            if (board[y][x] === 0) {
                continue outer;
            }
        }

        let row = board.splice(y, 1)[0].fill(0);
        board.unshift(row);
        y++;
        if (dropInterval > 50) {
            dropInterval--;
        }
        console.log(dropInterval);
        player.score += lineCount * 10;
        lineCount *= 2;
    }
}

function collide(board, player) {
    const matrix = player.matrix;
    const offset = player.pos;
    for (let y = 0; y < matrix.length; y++) {
        for (let x = 0; x < matrix[y].length; x++) {
            if (matrix[y][x] !== 0 &&
                (board[y + offset.y] &&
                    board[y + offset.y][x + offset.x]) !== 0) {
                return true;
            }
        }
    }
    return false;
}

function createMatrix(width, height) {
    const matrix = [];
    while (height--) {
        matrix.push(new Array(width).fill(0));
    }
    return matrix;
}

function createPiece(type) {
    if (type === 'T') {
        return [
            [0, 0, 0],
            [1, 1, 1],
            [0, 1, 0]
        ];
    } else if (type === 'I') {
        return [
            [0, 2, 0, 0],
            [0, 2, 0, 0],
            [0, 2, 0, 0],
            [0, 2, 0, 0]
        ];
    } else if (type === 'J') {
        return [
            [0, 3, 0],
            [0, 3, 0],
            [3, 3, 0]
        ];
    } else if (type === 'L') {
        return [
            [0, 4, 0],
            [0, 4, 0],
            [0, 4, 4]
        ];
    } else if (type === 'O') {
        return [
            [5, 5],
            [5, 5]
        ];
    } else if (type === 'S') {
        return [
            [0, 6, 6],
            [6, 6, 0],
            [0, 0, 0]
        ];
    } else if (type === 'Z') {
        return [
            [7, 7, 0],
            [0, 7, 7],
            [0, 0, 0]
        ];
    }
}

function drawMatrix(matrix, offset) {
    matrix.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {
                context.fillStyle = colors[value];
                context.fillRect((x + offset.x) * blockSide, (y + offset.y) * blockSide, blockSide, blockSide);
            }
        });
    });
}

function drawNextMatrix(matrix, offset) {
    matrix.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {
                nextContext.fillStyle = colors[value];
                nextContext.fillRect((x + offset.x) * blockSide, (y + offset.y) * blockSide, blockSide, blockSide);
            }
        });
    });
}

function drawHoldMatrix(matrix, offset) {
    matrix.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {
                holdContext.fillStyle = colors[value];
                holdContext.fillRect((x + offset.x) * blockSide, (y + offset.y) * blockSide, blockSide, blockSide);
            }
        });
    });
}

function draw() {
    canvas.width = canvas.width;
    nextCanvas.width = nextCanvas.width;
    holdCanvas.width = holdCanvas.width;

    context.fillStyle = '#404348';
    nextContext.fillStyle = '#404348';
    holdContext.fillStyle = '#404348';

    context.fillRect(0, 0, canvas.width, canvas.height);
    nextContext.fillRect(0, 0, nextCanvas.width, nextCanvas.height)
    holdContext.fillRect(0, 0, holdCanvas.width, holdCanvas.height);

    drawMatrix(board, { x: 0, y: 0 });
    drawMatrix(player.matrix, player.pos);

    if (holdMatrixNumber !== 0) {
        if (holdMatrixNumber == 1 || holdMatrixNumber == 7 || holdMatrixNumber == 0) {
            drawHoldMatrix(createPiece(allPieces[holdMatrixNumber]), { x: 0, y: 0 });
        } else if (holdMatrixNumber === 6 || holdMatrixNumber === 5 || holdMatrixNumber === 3) {
            drawHoldMatrix(createPiece(allPieces[holdMatrixNumber]), { x: 0, y: 1 });
        } else if (holdMatrixNumber === 2 || holdMatrixNumber === 4) {
            drawHoldMatrix(createPiece(allPieces[holdMatrixNumber]), { x: 1, y: 1 });
        }
    }

    if (nextMatrixNumber == 1 || nextMatrixNumber == 7 || nextMatrixNumber == 0) {
        drawNextMatrix(createPiece(allPieces[nextMatrixNumber]), { x: 0, y: 0 });
    } else if (nextMatrixNumber === 6 || nextMatrixNumber === 5 || nextMatrixNumber === 3) {
        drawNextMatrix(createPiece(allPieces[nextMatrixNumber]), { x: 0, y: 1 });
    } else if (nextMatrixNumber === 2 || nextMatrixNumber === 4) {
        drawNextMatrix(createPiece(allPieces[nextMatrixNumber]), { x: 1, y: 1 });
    }

    drawGrid();
}

function merge(board, player) {
    player.matrix.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {  
                board[y + player.pos.y][x + player.pos.x] = value;
            }
        });
    });
}

function playerDrop() {
    player.pos.y++;
    if (collide(board, player)) {
        player.pos.y--;
        merge(board, player);
        playerReset();
        boardSweep();
        updateScore();
    }
    dropCounter = 0;
}

function playerInstaDrop() {
    while (!collide(board, player)) {
        player.pos.y++;
    }
    player.pos.y--;
    merge(board, player);
    playerReset();
    boardSweep();
    updateScore();
}

function playerMove(direction) {
    player.pos.x += direction;
    if (collide(board, player)) {
        player.pos.x -= direction;
    }
}


const allPieces = ['T', 'I', 'J', 'L', 'O', 'S', 'Z'];
let availablePieces = ['T', 'I', 'J', 'L', 'O', 'S', 'Z'];
let currentMatrixNumber = null;
let nextMatrixNumber = null;
let holdMatrixNumber = null;

function playerReset() {
    let randomNumber = Math.floor(allPieces.length * Math.random());
    if (currentMatrixNumber === null) {
        nextMatrixNumber = randomNumber;
    }
    currentMatrixNumber = nextMatrixNumber;
    nextMatrixNumber = randomNumber;

    player.matrix = createPiece(allPieces[currentMatrixNumber]);

    player.pos.y = 0;
    player.pos.x = Math.floor(board[0].length / 2) - 1;

    if (collide(board, player)) {
        board.forEach(row => row.fill(0));
        player.score = 0;
        updateScore();
        while (availablePieces.length !== 0) {
            availablePieces.pop();
        }
        for (let i = 0; i < allPieces.length; i++) {
            availablePieces.push(allPieces[i]);
        }
    }

    if (dropInterval > 50) {
        dropInterval--;
    }
    console.log(dropInterval);
}

let firstHold = true;
function hold() {
    let move = 1
    if (firstHold) {
        holdMatrixNumber = currentMatrixNumber;
        playerReset();
        firstHold = false;
    } else if (!firstHold) {
        let helper = currentMatrixNumber;
        currentMatrixNumber = holdMatrixNumber;
        holdMatrixNumber = helper;
        hold
        player.matrix = createPiece(allPieces[currentMatrixNumber]);
        while (collide(board, player)) {
            playerMove(move);
            move = -(move + 1);
        }
        draw();
    }

}

function playerRotate(direction) {
    let offset = 1;
    rotate(player.matrix, direction);
    while (collide(board, player)) {
        player.pos.x += offset;
        offset = -(offset + (offset > 0 ? 1 : -1));
        if (offset > player.matrix[0].length) {
            return
        }
    }
}

function rotate(matrix) {
    for (let y = 0; y < matrix.length; y++) {
        for (let x = 0; x < y; x++) {
            [matrix[x][y], matrix[y][x]] = [matrix[y][x], matrix[x][y]]
        }
    }
    matrix.forEach(row => row.reverse());
}

let lastTime = 0;
let dropCounter = 0;
let dropInterval = 1000;

function update(time = 0) {
    let deltaTime = time - lastTime;

    dropCounter += deltaTime;
    if (dropCounter > dropInterval) {
        playerDrop()
    }

    lastTime = time;

    draw();
    requestAnimationFrame(update);
}

function updateScore() {
    document.getElementById('score').innerText = "Score: " + player.score;
}

const colors = [null, '#2fedfd', '#5fd2ff', '#969efd', '#c465ff', '#e92fff', '#ef16fd', '#e91ff7'];
const board = createMatrix(12, 20);

const player = {
    pos: { x: 5, y: 1 },
    matrix: null,
    score: 0
}

document.addEventListener('keydown', key => {
    if (key.keyCode === 37) {
        playerMove(-1);
    } else if (key.keyCode === 39) {
        playerMove(1);
    } else if (key.keyCode === 40) {
        playerDrop();
    } else if (key.keyCode === 38) {
        playerRotate();
    } else if (key.keyCode === 32) {
        playerInstaDrop();
    } else if (key.keyCode === 16) {
        hold();
    }
})

playerReset();
updateScore();
update();
