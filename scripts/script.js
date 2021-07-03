var player1 = 'player1',
player2 = 'player2',
player1Score = 0,
player2Score = 0,
currentTurn = player1,
winningConditions = [],
winningIndex,
dataFieldNum,
cellsToWin,
gameSize,
playedRounds = 0;

//------------------------------------------------------------------------------------------
//get players' name
$('#nameSubmitBtn').on('click', function() {
    if ($('#player1Input').val() === "") {
        $('#player1-input-error').removeClass('d-none');
    } else {
        $('#player1-input-error').addClass('d-none');
        player1 = $('#player1Input').val();
    }
    if ($('#player2Input').val() === "") {
        $('#player2-input-error').removeClass('d-none');
    } else {
        $('#player2-input-error').addClass('d-none');
        player2 = $('#player2Input').val();        
    }
    if ($('#player2Input').val() === $('#player1Input').val() && $('#player1Input').val() !== '') {
        $('#same-names-error').removeClass('d-none');
    } else {
        $('#same-names-error').addClass('d-none');      
    }

    if ($('#player2Input').val() !== "" && $('#player1Input').val() !== "" && $('#player2Input').val() !== $('#player1Input').val()) {
        $('#players-name-container').css({
            'animation-name': 'vanish',
            'animation-duration': '0.4s',
            'animation-fill-mode': 'forwards',
            'animation-delay': '0s'
        });
        $('.score').text(player1 + ': ' + player1Score + ' | ' + player2 + ': ' + player2Score);
        currentTurn = player1;
    }
})
$('#skipNameBtn').on('click', function() {
    $('#players-name-container').css({
        'animation-name': 'vanish',
        'animation-duration': '0.4s',
        'animation-fill-mode': 'forwards',
        'animation-delay': '0s'
    });     
    $('.score').text(player1 + ': ' + player1Score + ' | ' + player2 + ': ' + player2Score);
})

//------------------------------------------------------------------------------------------
//default game mode
mode(3);

//------------------------------------------------------------------------------------------
//restart game
$('#restartBtn').on('click', function() {
    restart();
})
function restart() {
    player1Score = 0,
    player2Score = 0;
    $('.score').text(player1 + ': ' + player1Score + ' | ' + player2 + ': ' + player2Score);
    for (let c = 0; c < dataFieldNum; c++) {
        $('[data-field-number="' + c + '"]').removeClass(`taken ${player1} ${player2}`).text('');
        $('#result').text('');
    }
    $('#prev-rounds').empty();
    playedRounds = 0;
}

//play again
$('#playAgainBtn').on('click', function() {
    $(this).addClass('d-none');
    playAgain();
})
$('#result-container').on('click', function() {
    $(this).css({
        'animation-name': 'vanish',
        'animation-duration': '0.4s',
        'animation-fill-mode': 'forwards',
        'animation-delay': '0s'
    });
    playAgain();
})
function playAgain() {
    for (let c = 0; c < dataFieldNum; c++) {
        $('[data-field-number="' + c + '"]').removeClass(`taken ${player1} ${player2} winCells`).text('');
        $('#result').text('');
    }
}

//field onclick function
function movements(fieldNum) {
    var field = $('[data-field-number="' + fieldNum + '"]')
    if (!field.hasClass('taken')) {
        currentTurn === player1 ? $(field).append('<div class="Xshape"><div class="line1"></div><div class="line2"></div></div>').addClass(`taken ${player1}`)
        : $(field).append('<div class="Oshape"><div class="circle1"><div class="circle2"></div></div></div>').addClass(`taken ${player2}`);
        isDraw();
        isWinner();
        switchTurn();     
    }
}

//switch turn
function switchTurn() {
    currentTurn === player1 ? currentTurn = player2 : currentTurn = player1;
}

//------------------------------------------------------------------------------------------
//check if the last movement causes a win condition
function isWinner() {
    for (let i = 0; i < winningConditions.length; i++) {
        var isSamePlayer;
        for (let x = 0; x < cellsToWin; x++) {
            isSamePlayer = $('[data-field-number="' + winningConditions[i][x] + '"]').hasClass(currentTurn);
            if (!isSamePlayer) {
                break;
            }
        }
        if (isSamePlayer) {
            $('#result').text(currentTurn + ' wins!');
            currentTurn === player1 ? player1Score++ : player2Score++;
            $('.score').text(player1 + ': ' + player1Score + ' | ' + player2 + ': ' + player2Score)
            for (let e = 0; e < dataFieldNum; e++) {
                $('[data-field-number="' + e + '"]').removeClass('taken').addClass('taken');
            }
            for (let x = 0; x < cellsToWin; x++) {
                $('[data-field-number="' + winningConditions[i][x] + '"]').addClass('winCells');
            }
            showResult();
            saveThisRound(false);
            break;
        }
    }
}

//check if all fields are taken and no one won
function isDraw() {
    var checkDraw = 0;
    for (let x = 0; x < dataFieldNum; x++) {
        var checkField = $('[data-field-number="' + x + '"]');
        if (checkField.hasClass(player1) || checkField.hasClass(player2)) {
            checkDraw++;
        }
    }
    if (checkDraw === dataFieldNum) {
        $('#result').text('TIE! play again');
        showResult();
        saveThisRound(true);
    }
}

//show result after win and draw
function showResult() {
    $('#playAgainBtn').removeClass('d-none');
    $('#result-container').css({
        'animation-name': 'show',
        'animation-duration': '0.8s',
        'animation-fill-mode': 'forwards',
        'animation-delay': '1s'
    });
}

//------------------------------------------------------------------------------------------
//round saver
function saveThisRound(tie) {
    saverFieldGenerator(tie);
    saveFieldsClass();
    savedFieldSizeCalc();
    outsideSavedBorderRemover()
    playedRounds++;
}
//generate saver fields
function saverFieldGenerator(tie) {
    var savedFieldNum = 0;
    $('#prev-rounds').append(`<div class="prev-round" id="round${playedRounds}"></div>`);
    for (let i = 0; i < gameSize; i++) {
        $(`#round${playedRounds}`).append(`<div class="saved-row" id="saved-row-num${playedRounds}${i}">`)
        for (let x = 0; x < gameSize; x++) {
            $(`#saved-row-num${playedRounds}${i}`).append(`<div class="saved-field" data-saved-field-number="${playedRounds}${savedFieldNum}"></div>`)
            savedFieldNum++;
        }
    }
    tie ? $(`#round${playedRounds}`).append(`<span class="round-result">round ${playedRounds+1}: tie</span>`)
    : $(`#round${playedRounds}`).append(`<span class="round-result">round ${playedRounds+1}: ${currentTurn} won</span>`);
    $(`#round${playedRounds}`).append(`<div class="rounds-divider"></div>`);
}
//get and set class of each field
function saveFieldsClass() {
    for (let i = 0; i < (gameSize * gameSize); i++) {
        var gameField = $('[data-field-number="' + i + '"]'),
        savedField = $('[data-saved-field-number="' + playedRounds + i + '"]');
        if (gameField.hasClass(player1)) {
            savedField.append('<div class="Xshape"><div class="line1"></div><div class="line2"></div></div>');
            if (gameField.hasClass('winCells')) {
                savedField.addClass('winCells');
            }
        } else if (gameField.hasClass(player2)) {
            savedField.append('<div class="Oshape"><div class="circle1"><div class="circle2"></div></div></div>');
            if (gameField.hasClass('winCells')) {
                savedField.addClass('winCells');
            }
        }
    }
}
//set a responsive size for saved fields
function savedFieldSizeCalc() {
    var savedFieldSize;
    if (gameSize === 3) {
        savedFieldSize = 76;
    } else if (gameSize === 5) {
        savedFieldSize = 45.5;
    } else {
        savedFieldSize = 32.5;
    }
    for (let i = 0; i < (gameSize * gameSize); i++) {
        $('[data-saved-field-number="' + playedRounds + i + '"]').css({
            'height': savedFieldSize + 'px',
            'width': savedFieldSize + 'px'});
    }
}
//saved fields outside border remover
function outsideSavedBorderRemover() {
    for (let i = 0; i < gameSize; i++) {
        $('[data-saved-field-number="' + playedRounds + i + '"]').css('border-top', 'none');
        $('[data-saved-field-number="' + playedRounds + (i + (gameSize * (gameSize - 1)))  + '"]').css('border-bottom', 'none');
        $('[data-saved-field-number="' + playedRounds + (i * gameSize) + '"]').css('border-left', 'none');
        $('[data-saved-field-number="' + playedRounds + ((i * gameSize) + (gameSize - 1)) + '"]').css('border-right', 'none');
    }
}

//------------------------------------------------------------------------------------------
//mode changer
function mode(size) {
    gameSize = size,
    winningConditions = [],
    winningIndex = 0;
    cellGenerator(size);
    winningCondCalc(size);
    playAgain();
}
function cellGenerator(size) {
    size === 3 ? cellsToWin = 3 : cellsToWin = 4;
    dataFieldNum = 0;
    $('#dropdownMenuLink').text('Mode: ' + size + ' X ' + size);
    $('#game-board').empty();
    for (let i = 0; i < size; i++) {
        $('#game-board').append(`<div class="row" id="row-num${i}">`);
        for (let x = 0; x < size; x++) {
            $(`#row-num${i}`).append(`<div class="field" data-field-number="${dataFieldNum}" onclick="movements(${dataFieldNum})"></div>`);
            dataFieldNum++;
        }
    }
    outsideBorderRemover(size);
    fieldSizeCalc(size);
}
function outsideBorderRemover(size) {
    for (let i = 0; i < size; i++) {
        $('[data-field-number="' + i + '"]').css('border-top', 'none');
        $('[data-field-number="' + (i + (size * (size - 1)))  + '"]').css('border-bottom', 'none');
        $('[data-field-number="' + (i * size) + '"]').css('border-left', 'none');
        $('[data-field-number="' + ((i * size) + (size - 1)) + '"]').css('border-right', 'none');
    }
}
function fieldSizeCalc(size) {
    var fieldSize;
    if (size === 3) {
        fieldSize = 20;
    } else if (size === 5) {
        fieldSize = 15;
    } else {
        fieldSize = 12;
    }
    $('.field').css({
        'height': fieldSize + 'vw',
        'width': fieldSize + 'vw',
        'max-width': fieldSize + 'vh',
        'max-height': fieldSize + 'vh'});
}
//------------------------------------------------------------------------------------------

function winningCondCalc(size) {
    colRowCond(size);
    diameterCond(size);
}
function colRowCond(size) {
    //  -
    var rectangle = size - (cellsToWin - 1),
    finalCellNums = [],
    finalIndex = 0;
    for (let i = 0; i < rectangle; i++) {
        for (let x = 0; x < size; x++) {
            finalCellNums[finalIndex] = i + (size * x),
            finalIndex++;
        }
    }
    for (let z = 0; z < finalCellNums.length; z++) {
        var save = [],
        saveIndex = 0;
        for (let y = 0; y < cellsToWin; y++) {
            save[saveIndex] = finalCellNums[z] + (y * 1),
            saveIndex++;
        }
        winningConditions[winningIndex] = save,
        winningIndex++;
    }

    //  |
    finalCellNums = [],
    finalIndex = 0;
    for (let i = 0; i < size; i++) {
        for (let x = 0; x < rectangle; x++) {
            finalCellNums[finalIndex] = i + (size * x),
            finalIndex++;
        }
    }
    for (let z = 0; z < finalCellNums.length; z++) {
        var save = [],
        saveIndex = 0;
        for (let y = 0; y < cellsToWin; y++) {
            save[saveIndex] = finalCellNums[z] + (y * size),
            saveIndex++;
        }
        winningConditions[winningIndex] = save,
        winningIndex++;
    }
}
function diameterCond(size) {
    //  \
    var square = size - (cellsToWin - 1),
    finalCellNums = [],
    finalIndex = 0;
    for (let i = 0; i < square; i++) {
        for (let x = 0; x < square; x++) {
            finalCellNums[finalIndex] = i + (size * x),
            finalIndex++;
        }
    }
    for (let z = 0; z < finalCellNums.length; z++) {
        var save = [],
        saveIndex = 0;
        for (let y = 0; y < cellsToWin; y++) {
            save[saveIndex] = finalCellNums[z] + (y * (size + 1)),
            saveIndex++;
        }
        winningConditions[winningIndex] = save,
        winningIndex++;
    }

    //  /
    finalCellNums = [],
    finalIndex = 0;
    for (let i = cellsToWin - 1; i < size; i++) {
        for (let x = 0; x < square; x++) {
            finalCellNums[finalIndex] = i + (size * x),
            finalIndex++;
        }
    }
    for (let z = 0; z < finalCellNums.length; z++) {
        var save = [],
        saveIndex = 0;
        for (let y = 0; y < cellsToWin; y++) {
            save[saveIndex] = finalCellNums[z] + (y * (size - 1)),
            saveIndex++;
        }
        winningConditions[winningIndex] = save,
        winningIndex++;
    }
}
//------------------------------------------------------------------------------------------

function color(color) {
    var hcode;
    switch (color) {
        case 'orange':
            hcode = 35;            
        break;

        case 'yellow':
            hcode = 55;
        break;

        case 'green':
            hcode = 90;
        break;

        case 'teal':
            hcode = 165;
        break;

        case 'lblue':
            hcode = 195;
        break;

        case 'dblue':
            hcode = 205;
        break;

        default:
            break;
    }
    $(':root').css({
        '--primary-color': 'hsl(' + hcode + ', 90%, 52%)',
        '--box-shadow': 'hsl(' + hcode + ', 90%, 38%)',
        '--bg-color': 'hsl(' + hcode + ', 90%, 5%)',
        '--sliders-bg-color': 'hsla(' + hcode + ', 90%, 5%, 0.85)'
    });
}