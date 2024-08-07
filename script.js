let currentPlayer = "X";
    let gameBoard = ["", "", "", "", "", "", "", "", ""];
    let powerUpActive = false;
    let selectedCell = null;
    let destroyActive = false;
    let bombActive = false;
    let bombCell = null;
    let victoryMessageElement = document.getElementById("victoryMessage");
    let gameEnded = false;

    // Track remaining power-ups for each player
    let swapPowerUps = { "X": 2, "O": 2 };
    let destroyPowerUps = { "X": 1, "O": 1 };
    let bombPowerUps = { "X": 1, "O": 1 };
    let mysteryPowerUps = { "X": 1, "O": 1 };
    

      function playClickSound() {
      const clickSound = document.getElementById("clickSound");
      clickSound.play();
    }

    function initGame() {
  const boardElement = document.getElementById("board");
  for (let i = 0; i < 9; i++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    cell.addEventListener("click", () => cellClick(i));
    boardElement.appendChild(cell);
  }
  updateBoard();

  // Initialize Swap power-ups for both players
  swapPowerUps = { "X": 2, "O": 2 };

  // mysteryPowerUps = { "X": 1, "O": 1 };
  // updateMysteryButton();
}


    function cellClick(index) {
  if (!gameEnded) {
    playClickSound(); // Play sound on cell click

    if (!powerUpActive && !destroyActive) {
      if (gameBoard[index] === "") {
        gameBoard[index] = currentPlayer;
        if (checkWinner()) {
          displayVictoryMessage(`Player ${currentPlayer} wins!`);
          activateResetButton();
        } else if (gameBoard.every((cell) => cell !== "")) {
          displayVictoryMessage("It's a draw!");
          activateResetButton();
        } else {
          currentPlayer = currentPlayer === "X" ? "O" : "X";
          updateCurrentPlayer();
        }
      }
    } else if (powerUpActive && !destroyActive) {
      selectedCell = index;
      powerUpActive = false;
      currentPlayer = currentPlayer === "X" ? "O" : "X";
      updateCurrentPlayer();
    } else if (destroyActive && destroyPowerUps[currentPlayer] > 0) {
      if (gameBoard[index] !== "") {
        gameBoard[index] = "";
        destroyPowerUps[currentPlayer]--;
        destroyActive = false;
        currentPlayer = currentPlayer === "X" ? "O" : "X";
        updateCurrentPlayer();
      }
    } else if (powerUpActive && swapPowerUps[currentPlayer] > 0) {
      gameBoard[selectedCell] = gameBoard[selectedCell] === "X" ? "O" : "X";
      selectedCell = null;
      swapPowerUps[currentPlayer]--;
      powerUpActive = false;
      currentPlayer = currentPlayer === "X" ? "O" : "X";
      updateCurrentPlayer();
    }else if (bombActive && bombPowerUps[currentPlayer] > 0 && gameBoard[index] === "") {
      playBombEffect(index);
      bombPowerUps[currentPlayer]--;
      bombActive = false;
      currentPlayer = currentPlayer === "X" ? "O" : "X";
      updateCurrentPlayer();
    }
    updateBoard();
  }
}

function playBombEffect(index) {
  // Remove symbols from adjacent cells of the chosen cell
  const adjacentCells = getAdjacentCells(index);
  adjacentCells.forEach((adjIndex) => {
    if (gameBoard[adjIndex] !== "BLOCK") {
      gameBoard[adjIndex] = "";
    }
  });
}


function getAdjacentCells(index) {
  // Calculate and return the indices of adjacent cells (horizontal, vertical, and diagonal)
  const row = Math.floor(index / 3);
  const col = index % 3;
  const adjacentCells = [];
  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      const newRow = row + i;
      const newCol = col + j;
      if (newRow >= 0 && newRow < 3 && newCol >= 0 && newCol < 3 && !(i === 0 && j === 0)) {
        adjacentCells.push(newRow * 3 + newCol);
      }
    }
  }
  return adjacentCells;
}

function updateBombButton() {
  document.getElementById("bomb").innerText = `Bomb (${bombPowerUps[currentPlayer]} left)`;
}


function updateCurrentPlayer() {
  document.getElementById("currentPlayer").innerText = `Current Player: ${currentPlayer}`;
}

function activateSwap() {
  if (swapPowerUps[currentPlayer] > 0) {
    playClickSound();
    powerUpActive = !powerUpActive;

    if (powerUpActive) {
      // Highlight cells with the opponent's symbol
      const cells = document.getElementsByClassName("cell");
      for (let i = 0; i < cells.length; i++) {
        if (gameBoard[i] !== "" && gameBoard[i] !== currentPlayer) {
          cells[i].classList.add("swap");
          cells[i].addEventListener("click", () => swapCell(i));
        }
      }
    } else {
      // Remove highlighting and event listeners
      const cells = document.getElementsByClassName("cell");
      for (let i = 0; i < cells.length; i++) {
        cells[i].classList.remove("swap");
        cells[i].removeEventListener("click", () => swapCell(i));
      }
    }

    updateSwapButton();
  }
}

function activateMystery() {
  if (mysteryPowerUps[currentPlayer] > 0) {
    playClickSound();
    mysteryPowerUps[currentPlayer]--;
    
    // Disable the Mystery button after it's used
    document.getElementById("mystery").disabled = true;

    // Generate a random number to determine the effect
    const randomEffect = Math.floor(Math.random() * 3); // Adjust the range based on the number of effects
    
    switch (randomEffect) {
      case 0:
        // Swap symbols
        activateSwap();
        break;
      case 1:
        // Destroy a random cell
        const emptyCells = gameBoard.reduce((acc, val, idx) => (val === "" ? acc.concat(idx) : acc), []);
        if (emptyCells.length > 0) {
          const randomCellIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)];
          gameBoard[randomCellIndex] = "";
          updateBoard();
        }
        break;
      case 2:
        // Additional effect (you can define another surprise effect here)
        // For example, teleport symbol to a random cell
        const randomCell = Math.floor(Math.random() * 9);
        gameBoard[randomCell] = currentPlayer;
        updateBoard();
        break;
      // Add more cases for additional effects if needed
    }

    currentPlayer = currentPlayer === "X" ? "O" : "X"; // Switch player
    updateCurrentPlayer(); // Update UI with current player
    updateMysteryButton(); // Update Mystery button text
  }
}

function updateMysteryButton() {
  document.getElementById("mystery").innerText = `Mystery (${mysteryPowerUps[currentPlayer]} left)`;
}

function updateMysteryButton() {
  document.getElementById("mystery").innerText = `Mystery (${mysteryPowerUps[currentPlayer]} left)`;
}

function updateMysteryButton() {
  document.getElementById("mystery").innerText = `Mystery (${mysteryPowerUps[currentPlayer]} left)`;

  let mysteryPowerUps = { "X": 1, "O": 1 };
updateMysteryButton(); // Add this line to initialize the Mystery button text

}


function swapCell(index) {
  gameBoard[index] = currentPlayer;
  powerUpActive = false;
  swapPowerUps[currentPlayer]--;
  currentPlayer = currentPlayer === "X" ? "O" : "X"; // Switch player after using swap
  updateCurrentPlayer();
  updateBoard();
}


    function activateDestroy() {
      if (destroyPowerUps[currentPlayer] > 0) {
        playClickSound();
        destroyActive = true;
        updateBoard();
      }
    }





    function activateBomb() {
  if (bombPowerUps[currentPlayer] > 0 && !bombActive) {
    playClickSound();
    bombActive = true;
    bombPowerUps[currentPlayer]--; // Reduce Bomb power-ups after usage
    document.getElementById("bomb").disabled = true;

    // Allow the player to click on an empty cell to trigger the Bomb effect
    const cells = document.getElementsByClassName("cell");
    const bombClickHandler = (index) => {
      return () => {
        playBombEffect(index);
        bombActive = false; // Deactivate Bomb power-up after effect
        currentPlayer = currentPlayer === "X" ? "O" : "X"; // Switch player
        updateCurrentPlayer(); // Update UI with current player
        updateBoard(); // Update game board UI
        document.getElementById("bomb").disabled = false; // Enable Bomb button
        for (let i = 0; i < cells.length; i++) {
          cells[i].removeEventListener("click", bombClickHandler(i)); // Remove event listeners
        }
      };
    };
    for (let i = 0; i < cells.length; i++) {
      if (gameBoard[i] === "") {
        cells[i].addEventListener("click", bombClickHandler(i), { once: true }); // Ensure click event triggers once
      }
    }
  }
}





    function updateSwapButton() {
      document.getElementById("swap").innerText = `Swap (${swapPowerUps[currentPlayer]} left)`;
    }

    function updateDestroyButton() {
      document.getElementById("destroy").innerText = `Destroy (${destroyPowerUps[currentPlayer]} left)`;
    }
    

    function activateResetButton() {
      document.getElementById("reset").disabled = false;
      gameEnded = true;
    }

    function displayVictoryMessage(message) {
      victoryMessageElement.innerText = message;
    }

    function updateBoard() {
      const cells = document.getElementsByClassName("cell");
      for (let i = 0; i < cells.length; i++) {
        cells[i].innerText = gameBoard[i];
        cells[i].classList.remove("swap", "destroy");
        if (powerUpActive && selectedCell !== null) {
          cells[selectedCell].classList.add("swap");
        }
        if (destroyActive && destroyPowerUps[currentPlayer] > 0 && gameBoard[i] !== "") {
          cells[i].classList.add("destroy");
        }
      }
      updateSwapButton();
      updateDestroyButton();
    }

    function resetGame() {
  gameBoard = ["", "", "", "", "", "", "", "", ""];
  currentPlayer = "X";
  powerUpActive = false;
  selectedCell = null;
  destroyActive = false;
  victoryMessageElement.innerText = "";
  updateBoard();
  document.getElementById("reset").disabled = true;
  gameEnded = false;

  // Reset power-up counts to their initial values
  swapPowerUps = { "X": 2, "O": 2 };
  destroyPowerUps = { "X": 1, "O": 1 };
  bombPowerUps = { "X": 1, "O": 1 };
  mysteryPowerUps = { "X": 1, "O": 1 };

  // Update the buttons to display the correct initial counts
  updateSwapButton();
  updateDestroyButton();
  updateBombButton();
  updateMysteryButton();
}


    function toggleInstructions() {
      const instructionsDiv = document.getElementById("instructions");
      instructionsDiv.style.display = (instructionsDiv.style.display === "none") ? "block" : "none";
    }

    function checkWinner() {
      const winningCombinations = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
      ];

      return winningCombinations.some((combination) =>
        combination.every((index) => gameBoard[index] === currentPlayer)
      );
    }

    initGame();