const canvas = document.getElementById('tetris');
const context = canvas.getContext('2d');

context.scale(20, 20);

context.fillStyle = '#000';
context.fillRect(0, 0, canvas.width, canvas.height);

const tPiece = [
    [0, 0, 0],
    [1, 1, 1],
    [0, 1, 0]
]

function render() {
    context.fillStyle = '#000';
    context.fillRect(0, 0, canvas.width, canvas.height);
    drawPiece(player.piece, player.pos)
}

function drawPiece(piece, offset) {
    piece.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {
                context.fillStyle = 'red';
                context.fillRect(x + offset.x, y + offset.y, 1, 1);
            }
        });
    });
}

function update() {
    render();
    requestAnimationFrame(update);
}

const player = {
    pos: { x: 5, y: 5 },
    piece: tPiece
}

update()