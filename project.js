// 1. Deposit some money
// 2. Determine number of lines to bet on
// 3. collect a bet amount
// 4. Spin the slot machine
// 5. Check if the player won
// 6. If won, pay out the winnings
// 7. Play again or exit

const prompt = require("prompt-sync") ();

const ROWS = 3;
const COLUMNS = 3;
const SYMBOL_COUNT = {
    A: 2,
    B: 4,
    C: 6,
    D: 8
};
const SYMBOL_VALUES = {
    A: 5,
    B: 4,
    C: 3,
    D: 2
};

const deposit = () => {
    while (true) {
        const depositAmount = prompt ("Enter the deposit amount: ");
        const numberDepositAmount = parseFloat (depositAmount);

        if (isNaN(numberDepositAmount) || numberDepositAmount <= 0) {
            console.log("Invalid deposit amount, Please try again!!");
        } else {
            return numberDepositAmount;
        }
    }
    
};

const getNumberOfLines = () => {
    while (true) {
        const lines = prompt ("Enter the number of lines bet on (1-3): ");
        const numberOfLines = parseFloat(lines);

        if (isNaN(numberOfLines) || numberOfLines<= 0 || numberOfLines > 3) {
            console.log ("Invalid number of lines, Please try again!!");
        } else {
            return numberOfLines;
        }
    }
};

const getBet = (balance, numberOfLines) => {
    while (true) {
        const bet = prompt ("Enter the bet per line: ");
        const numberBet = parseFloat(bet);

        if (isNaN(numberBet) || numberBet<= 0 || numberBet > balance / numberOfLines) {
            console.log ("Invalid Bet, Please try again!!");
        } else {
            return numberBet;
        }
    }
};

const spin = () => {
    const symbols = [];
    for ( const [symbol, count] of Object.entries(SYMBOL_COUNT)) {
        for (let i = 0; i < count; i++) {
            symbols.push(symbol);
        }
    }
    const reels = [];
    for (let i=0; i< COLUMNS; i++) {
        reels.push([]);
        // Create a copy of symbols to avoid modifying the original array
        const reelSymbols = [...symbols];
        for (let j=0; j<ROWS; j++) {
            const randomIndex = Math.floor(Math.random() * reelSymbols.length);
            const selectedSymbol = reelSymbols[randomIndex];
            reels[i].push(selectedSymbol);
            reelSymbols.splice(randomIndex, 1);
        }
    }
    return reels;
};

const transpose = (reels) => {
    const rows = [];  
    for (let i = 0; i < ROWS; i++) {
        rows.push([]);
        for (let j = 0; j < COLUMNS; j++) {
            rows[i].push(reels[j][i]);
        }
    }
    return rows;
}

const printRows = (rows) => {
    for (const row of rows) {
        let rowString = "";
        for (const [i, symbol ] of row.entries()) {
            rowString += symbol;
            if (i !== row.length - 1) {
                rowString += " | ";
            }
        }
        console.log(rowString);
    }
};

// Main game logic starts here
const getWinnings = (rows, bet, numberOfLines) => {
    let winnings = 0;
    for (let row = 0; row < numberOfLines; row++) {
        const symbols = rows[row];
        let allSame = true;
        for (const symbol of symbols) {
            if (symbol !== symbols[0]) {
                allSame = false;
                break;
            }
        }
        if (allSame) {
            winnings += bet * SYMBOL_VALUES[symbols[0]];
        }
    }
    return winnings;
};

const game = () => {
    let balance = deposit();

    while (true) {
        console.log("Current balance: $" + balance.toString());
        const numberOfLines = getNumberOfLines();
        const bet = getBet (balance, numberOfLines);
        balance -= bet * numberOfLines;
        const reel = spin();
        const rows = transpose(reel);
        printRows(rows);
        const winnings = getWinnings(rows, bet, numberOfLines);
        balance += winnings;
        console.log("You won: $" + winnings.toString());
        if (balance <= 0) {
            console.log("You have run out of balance, Please deposit more money to continue playing!!");
            break;
        }
        const playAgain = prompt("Do you want to play again? (y/n): ");
        if (playAgain.toLowerCase() !== 'y') {
            console.log("Thanks for playing! Your final balance is: $" + balance.toString());
            break;
        }
    }
};

game();


