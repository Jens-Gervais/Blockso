const canvas = document.getElementById('tetris');
const context = canvas.getContext('2d');

const blockSide = 30;

context.fillStyle = '#99aab5';
context.lineWidth = 1;
context.fillRect(0, 0, canvas.width, canvas.height);

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

function draw() {
    canvas.width = canvas.width;
    context.fillStyle = '#2c2f33';
    context.fillRect(0, 0, canvas.width, canvas.height);

    drawMatrix(board, { x: 0, y: 0 });
    drawMatrix(player.matrix, player.pos);
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
function playerReset() {
    let randomNumber = Math.floor(availablePieces.length * Math.random());
    player.matrix = createPiece(availablePieces[randomNumber]);

    if (availablePieces.length > 1) {
        availablePieces.splice(randomNumber, 1);
    } else if (availablePieces.length <= 1) {
        availablePieces.pop();
        for (let i = 0; i < allPieces.length; i++) {
            availablePieces.push(allPieces[i]);
        }
    }
    console.log(allPieces);
    console.log(availablePieces);


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
    document.getElementById('score').innerText = player.score;
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
    }
})

playerReset();
updateScore();
update();
