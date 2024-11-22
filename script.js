const board = document.querySelectorAll('.cell');
let currentPlayer = 'X';
let movesCount = 0;
let playerMoves = { 'X': [], 'O': [] }; // Tracciamo le mosse dei giocatori
let gameOver = false;
let movePhase = 1; // 1: Fase di mosse iniziali, 2: Fase di spostamento
let selectedSymbol = null;

const checkWinner = (playerMoves) => {
    const winningCombinations = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // righe
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // colonne
        [0, 4, 8], [2, 4, 6]  // diagonali
    ];

    return winningCombinations.some(combination => 
        combination.every(index => playerMoves.includes(index))
    );
}

const updateStatus = () => {
    document.getElementById('current-player').textContent = currentPlayer;
    document.getElementById('move-status').textContent = movePhase === 1 ? 
        `Fai ${3 - playerMoves[currentPlayer].length} mossa/i` : 
        `Sposta un simbolo di ${currentPlayer}`;
};

const resetGame = () => {
    board.forEach(cell => cell.textContent = '');
    playerMoves = { 'X': [], 'O': [] };
    movesCount = 0;
    gameOver = false;
    movePhase = 1;
    selectedSymbol = null;
    updateStatus();
};

const handleCellClick = (e) => {
    if (gameOver) return;

    const cellIndex = e.target.dataset.cellIndex;

    // Se è la fase di spostamento, bisogna spostare un simbolo
    if (movePhase === 2 && selectedSymbol !== null) {
        // Se la cella è vuota e il simbolo selezionato è nella lista delle mosse
        if (board[cellIndex].textContent === '' && playerMoves[currentPlayer].includes(selectedSymbol)) {
            board[cellIndex].textContent = currentPlayer;
            board[selectedSymbol].textContent = ''; // Rimuove il simbolo dalla vecchia posizione
            playerMoves[currentPlayer] = playerMoves[currentPlayer].filter(index => index !== selectedSymbol);
            playerMoves[currentPlayer].push(parseInt(cellIndex));

            if (checkWinner(playerMoves[currentPlayer])) {
                setTimeout(() => alert(`${currentPlayer} ha vinto!`), 10);
                gameOver = true;
                return;
            }

            // Cambia giocatore
            currentPlayer = (currentPlayer === 'X') ? 'O' : 'X';
            updateStatus();
            selectedSymbol = null; // Deseleziona il simbolo
        }
        return;
    }

    // Se la cella è già occupata, non fare nulla
    if (board[cellIndex].textContent !== '') return;

    // Se è la fase di mosse iniziali
    if (movePhase === 1) {
        board[cellIndex].textContent = currentPlayer;
        playerMoves[currentPlayer].push(parseInt(cellIndex));
        movesCount++;

        if (checkWinner(playerMoves[currentPlayer])) {
            setTimeout(() => alert(`${currentPlayer} ha vinto!`), 10);
            gameOver = true;
            return;
        }

        if (movesCount === 6) {
            movePhase = 2; // Passa alla fase di spostamento
            updateStatus();
        }

        // Cambia giocatore
        currentPlayer = (currentPlayer === 'X') ? 'O' : 'X';
        updateStatus();
    }
};

const selectSymbolToMove = (e) => {
    if (movePhase === 2) {
        const cellIndex = e.target.dataset.cellIndex;

        // Se la cella contiene il simbolo del giocatore corrente e non è già selezionato
        if (board[cellIndex].textContent === currentPlayer && selectedSymbol !== cellIndex) {
            selectedSymbol = parseInt(cellIndex);
            //alert(`Hai selezionato il simbolo in posizione ${cellIndex + 1}. Ora scegli una casella vuota dove spostarlo.`);
        }
    }
};

board.forEach(cell => cell.addEventListener('click', handleCellClick));
board.forEach(cell => cell.addEventListener('click', selectSymbolToMove));

document.getElementById('reset-button').addEventListener('click', resetGame);
