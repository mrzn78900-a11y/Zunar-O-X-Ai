/**
 * SENIOR DEV GRADE TIC-TAC-TOE LOGIC
 * Features: Unbeatable Minimax AI, PvP Mode, Smooth Animations
 */

const boardElem = document.getElementById('board');
const cells = document.querySelectorAll('.cell');
const statusText = document.getElementById('statusText');
const resetBtn = document.getElementById('resetBtn');
const aiBtn = document.getElementById('aiBtn');
const pvpBtn = document.getElementById('pvpBtn');

let board = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let isGameActive = true;
let isAiMode = true;

const WIN_COMBO = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Horizontal
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Vertical
    [0, 4, 8], [2, 4, 6]             // Diagonal
];

// Initialize Game
const init = () => {
    cells.forEach(cell => cell.addEventListener('click', handleCellClick));
    resetBtn.addEventListener('click', resetGame);
    aiBtn.addEventListener('click', () => setMode(true));
    pvpBtn.addEventListener('click', () => setMode(false));
};

const setMode = (ai) => {
    isAiMode = ai;
    aiBtn.classList.toggle('active', ai);
    pvpBtn.classList.toggle('active', !ai);
    resetGame();
};

function handleCellClick(e) {
    const index = e.target.dataset.index;

    if (board[index] !== "" || !isGameActive) return;

    processMove(index, "X");

    if (isGameActive && isAiMode) {
        statusText.innerText = "AI is thinking...";
        boardElem.style.pointerEvents = "none";
        
        setTimeout(() => {
            const bestMove = minimax(board, "O").index;
            processMove(bestMove, "O");
            boardElem.style.pointerEvents = "auto";
        }, 600);
    }
}

function processMove(index, player) {
    board[index] = player;
    cells[index].innerText = player;
    cells[index].classList.add(player.toLowerCase());

    if (checkWin(board, player)) {
        finishGame(false);
    } else if (board.every(cell => cell !== "")) {
        finishGame(true);
    } else {
        currentPlayer = currentPlayer === "X" ? "O" : "X";
        statusText.innerText = isAiMode && currentPlayer === "O" ? "AI Turn..." : `Player ${currentPlayer}'s Turn`;
    }
}

function checkWin(currentBoard, player) {
    return WIN_COMBO.some(combo => {
        return combo.every(idx => currentBoard[idx] === player);
    });
}

function finishGame(draw) {
    isGameActive = false;
    if (draw) {
        statusText.innerText = "Game Draw! ð¤";
        boardElem.classList.add('shake');
    } else {
        statusText.innerText = `${currentPlayer} Wins the Match! ð¥`;
        highlightWinner();
    }
}

function highlightWinner() {
    WIN_COMBO.forEach(combo => {
        const [a, b, c] = combo;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            cells[a].classList.add('winner');
            cells[b].classList.add('winner');
            cells[c].classList.add('winner');
        }
    });
}

// --- MINIMAX CORE (The Unbeatable Brain) ---
function minimax(newBoard, player) {
    const availSpots = newBoard.map((v, i) => v === "" ? i : null).filter(v => v !== null);

    if (checkWin(newBoard, "X")) return { score: -10 };
    if (checkWin(newBoard, "O")) return { score: 10 };
    if (availSpots.length === 0) return { score: 0 };

    const moves = [];

    for (let i = 0; i < availSpots.length; i++) {
        const move = {};
        move.index = availSpots[i];
        newBoard[availSpots[i]] = player;

        if (player === "O") {
            const result = minimax(newBoard, "X");
            move.score = result.score;
        } else {
            const result = minimax(newBoard, "O");
            move.score = result.score;
        }

        newBoard[availSpots[i]] = "";
        moves.push(move);
    }

    let bestMove;
    if (player === "O") {
        let bestScore = -10000;
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].score > bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    } else {
        let bestScore = 10000;
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].score < bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    }
    return moves[bestMove];
}

function resetGame() {
    board = Array(9).fill("");
    isGameActive = true;
    currentPlayer = "X";
    statusText.innerText = "Your turn (X)";
    boardElem.classList.remove('shake');
    boardElem.style.pointerEvents = "auto";
    cells.forEach(cell => {
        cell.innerText = "";
        cell.classList.remove('x', 'o', 'winner');
    });
}

init();
