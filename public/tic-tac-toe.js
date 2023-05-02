// Your code here
document.addEventListener("DOMContentLoaded", event => {
    // Variables
    const squares = document.querySelectorAll('.square');

    const winMsg = document.getElementById('win-message');
    const resetBtn = document.getElementById("reset-button");
    const giveUpBtn = document.getElementById("give-up");

    // Set up variables to keep track of game state
    let currentPlayer = 'X';
    let grid = ['', '', '', '', '', '', '', '', ''];
    let gameStarted = false;

    // Function to handle a square click
    function handleSquareClick(e) {
        // Get the index of the clicked square
        const squareIndex = Array.from(squares).indexOf(e.target);

        // Check if the square is already filled
        if (grid[squareIndex] !== '') {
            return;
        }

        // Fill the square with the current player's symbol
        grid[squareIndex] = currentPlayer;
        e.target.innerHTML = `<img src="https://assets.aaonline.io/Module-DOM-API/formative-project-tic-tac-toe/player-${currentPlayer.toLowerCase()}.svg">`;

        // Check if the game is over
        const winner = checkForWinner();
        if (winner !== null) {
            announceWinner(winner);
            giveUpBtn.disabled = true;
            resetBtn.disabled = false;
            return;
        } else {
            resetBtn.disabled = true;
        }

        // Switch to the other player
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';

        // Enable the "New Game Button"
        if (!gameStarted) {
            resetBtn.removeAttribute("disabled");
            gameStarted = true;
            resetBtn.addEventListener("click", resetGame);
        }
        saveGameState();


    }

    // Add event listeners to the squares
    squares.forEach(square => square.addEventListener('click', handleSquareClick));

    // Function to check if there is a winner
    function checkForWinner() {
        const winningLines = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6]
        ];

        for (let i = 0; i < winningLines.length; i++) {
            const [a, b, c] = winningLines[i];
            if (grid[a] !== '' && grid[a] === grid[b] && grid[a] === grid[c]) {
                return grid[a];
            }
        }

        // Check for a tie
        if (!grid.includes('')) {
            return 'tie';
        }

        // Game is not over yet
        return null;
    }

    // Function to announce the winner
    function announceWinner(winner) {
        if (winner === 'tie') {
            winMsg.innerText = "Winner: None";
            winMsg.classList.toggle("show");
        } else {
            winMsg.innerText = `Winner: ${winner}`;
            winMsg.classList.toggle("show");
        }

        // Saving the current game state
        saveGameState();
        resetBtn.addEventListener("click", resetGame);


        // Disable square clicks
        squares.forEach(square => square.removeEventListener('click', handleSquareClick));
    }

    // Reset the game
    function resetGame() {
        window.localStorage.removeItem("ticTacToeGameState");
        window.location.reload();
    }

    // Forfeit game
    function forfeit() {
        const winner = currentPlayer === "X" ? "O" : "X";
        giveUpBtn.disabled = true;

        announceWinner(winner);

        saveGameState();
        resetBtn.disabled = false;
        resetBtn.addEventListener("click", resetGame);
    }

    giveUpBtn.addEventListener("click", forfeit);



    // Load saved game state
    const savedGameState = JSON.parse(window.localStorage.getItem("ticTacToeGameState"));
    const gameState = JSON.parse(window.localStorage.getItem("gameState"));

    if (savedGameState) {
        currentPlayer = savedGameState.currentPlayer;
        grid = savedGameState.grid;
        gameStarted = savedGameState.gameStarted;
        squares.forEach((square, i) => {
            if (grid[i]) {
                square.innerHTML = `<img src="https://assets.aaonline.io/Module-DOM-API/formative-project-tic-tac-toe/player-${grid[i].toLowerCase()}.svg">`;
            }
        });

        if (checkForWinner()) {
            announceWinner(checkForWinner());
            giveUpBtn.disabled = true;
            resetBtn.disabled = false;
        } else {
            resetBtn.disabled = true
        }
    } else {
        resetBtn.disabled = true;
    }


    // Save game state
    function saveGameState() {
        const gameState = { currentPlayer, grid, gameStarted };
        window.localStorage.setItem("ticTacToeGameState", JSON.stringify(gameState));
    }
});
