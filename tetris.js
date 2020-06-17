const canvas = document.getElementById('tetris');
const context = canvas.getContext('2d');

context.scale(20, 20);

context.fillStyle = '#000';
context.fillRect(0, 0, canvas.width, canvas.height);

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
            [0, 0, 1, 0],
            [0, 0, 1, 0],
            [0, 0, 1, 0],
            [0, 0, 1, 0]
        ];
    } else if (type === 'J') {
        return [
            [0, 0, 1],
            [0, 0, 1],
            [0, 1, 1]
        ];
    } else if (type === 'L') {
        return [
            [1, 0, 0],
            [1, 0, 0],
            [1, 1, 0]
        ];
    } else if (type === 'O') {
        return [
            [1, 1],
            [1, 1]
        ];
    } else if (type === 'S') {
        return [
            [0, 1, 1],
            [1, 1, 0],
            [0, 0, 0]
        ];
    } else if (type === 'Z') {
        return [
            [1, 1, 0],
            [0, 1, 1],
            [0, 0, 0]
        ];
    }
}

function drawMatrix(matrix, offset) {
    matrix.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {
                context.fillStyle = 'red';
                context.fillRect(x + offset.x, y + offset.y, 1, 1);
            }
        });
    });
}

function draw() {
    context.fillStyle = '#000';
    context.fillRect(0, 0, canvas.width, canvas.height);

    drawMatrix(board, { x: 0, y: 0 });
    drawMatrix(player.matrix, player.pos)
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
        player.pos.y--
        merge(board, player);
        player.pos.y = 0
        player.pos.x = 5
    }
    dropCounter = 0;
}

function playerMove(direction) {
    player.pos.x += direction;
    if (collide(board, player)) {
        player.pos.x -= direction;
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

/* function rotate(matrix, direction) {
    for (let y = 0; y < matrix.length, y++) {
        for (let x = 0; x < y; x++) {
            [matrix[x][y], matrix[y][x]] = [matrix[y][x], matrix[x][y]]
        }
    }

    if (direction > 0) {
        matrix.forEach(row => row.reverse());
    } else {
        matrix.reverse();
    }
} */

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

const board = createMatrix(12, 20);

const player = {
    pos: { x: 5, y: 1 },
    matrix: createPiece('T')
}

document.addEventListener('keydown', key => {
    if (key.keyCode === 37) {
        playerMove(-1);
    } else if (key.keyCode === 39) {
        playerMove(1);
    } else if (key.keyCode === 40) {
        playerDrop();
    } else if (key.keyCode === 38) {
        playerRotate()
    }
})

update()
