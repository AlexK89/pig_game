const playersContainer = document.querySelector('.game__players');
const playersEls = playersContainer.querySelectorAll('.js-players');
const scoreEls = playersContainer.querySelectorAll('.js-score');
const dicesContainer = document.querySelector('.game__dices');
const diceEls = dicesContainer.querySelectorAll('.js-dice');

const gameButtons = document.querySelector('.game__btns');
const nextTurnBtn = document.getElementById('js-next_turn');
const throughDicesBtn = document.getElementById('js-through_dices');

let tempDiceResult = [0, 0];
const playTill = 100;
const players = {
    player_1: {
        turn: true,
        score: 0
    },
    player_2: {
        turn: false,
        score: 0
    }
};

const randomNumBtw = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const switchPlayers = () => {
    nextTurnBtn.disabled = true;
    Object.keys(players).forEach(player => players[player].turn = !players[player].turn);
};

// renderData - Render score, turn and dices
const renderData = () => {
    Object.keys(players).forEach((player, index) => {
        scoreEls[index].innerText = players[player].score;
        players[player].turn ? playersEls[index].classList.add('active') : playersEls[index].classList.remove('active');
    });

    [...diceEls].forEach((diceEl, index) => {
        diceEl.innerHTML = tempDiceResult[index];
    });
};

// newGame - Reset all data and render
const newGame = () => {
    nextTurnBtn.disabled = false;
    throughDicesBtn.disabled = false;

    Object.keys(players).forEach(player => {
        players[player].score = 0;
        player === 'player_1' ? (players[player].turn = true) : (players[player].turn = false)
    });
    tempDiceResult = [0, 0];

    renderData()
};

const nextTurn = (resetCurrentResult = false, resetUserScore = false) => {
    const activeUser = playersContainer.querySelector('.active').dataset.user;
    const points = resetCurrentResult ? 0 : tempDiceResult.reduce((sum, num) => sum + num);

    (!resetCurrentResult && !resetUserScore) && (tempDiceResult = [0, 0]);
    resetUserScore ? (players[activeUser].score = 0) : (players[activeUser].score += points);

    switchPlayers();
    renderData();
};

const throughDices = () => {
    nextTurnBtn.disabled = false;
    tempDiceResult = [randomNumBtw(1, 6), randomNumBtw(1, 6)];
    const anyOnes = tempDiceResult.filter(num => num === 1).length;
    let resetCurrentResult;
    let resetUserScore;

    if (anyOnes) {
        anyOnes === 1 && (resetCurrentResult = true);
        anyOnes === 2 && (resetUserScore = true);

        nextTurn(resetCurrentResult, resetUserScore)
    } else {
        const activeUser = playersContainer.querySelector('.active').dataset.user;
        const newScore = players[activeUser].score + tempDiceResult.reduce((sum, num) => sum + num);

        newScore >= playTill && endGame(activeUser, newScore);
        renderData();
    }
};

const endGame = (user, newScore) => {
        players[user].score = newScore;
        renderData();
        nextTurnBtn.disabled = true;
        throughDicesBtn.disabled = true;

        alert(`${user} won with score: ${newScore}!`);
};

gameButtons.addEventListener('click', (event) => {
    const clickedEl = event.target;

    switch (clickedEl.id) {
        case 'js-new_game':
            return newGame();
        case 'js-next_turn':
            return nextTurn();
        case 'js-through_dices':
            return throughDices();
        default:
            return;
    }
});




