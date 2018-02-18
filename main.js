$(document).ready(initializeApp);


const userInput = [];
var operationRepeat = false;
var repeatMath = [];
var operationRollover = '';


function initializeApp(){
    attachClickHandlers();
}


function attachClickHandlers(){
    $('.numbers > button').on('click',handleNumberClick);
    $('.operators > button').on('click',handleOperatorClick);
    $('.clear').on('click',handleClearClick);
}


function handleNumberClick(){
    if ($('#displayBar').text() === 'Error' || $('#displayBar').text() === 'Ready'){
        $('#displayBar').text('');
        operationRepeat = false;
    }
    if ($(this).text() === '.'){
        decimalCheck();
        operationRepeat = false;
    } else if($(this).text()!== '=') {
        if (isNaN(userInput[userInput.length-1]) === false || userInput[userInput.length-1] === '.') {
            userInput[userInput.length - 1] = userInput[userInput.length - 1].concat($(this).text());
            $('#displayBar').text($('#displayBar').text() + $(this).text());
            operationRepeat = false;
        } else {
            userInput.push($(this).text());
            $('#displayBar').text($('#displayBar').text() + $(this).text());
            operationRepeat = false;
        }
    }
        else{
        conditionalChecks();
            }
}


function handleOperatorClick(){
    var operators = 'x+-/';
    if ($('#displayBar').text() === 'Error' || $('#displayBar').text() === 'Ready'){
        $('#displayBar').text('');
        operationRepeat = false;
    }
    if (operators.indexOf(userInput[userInput.length-1]) !== -1) {
        userInput.pop();
        userInput.push($(this).text());
        $('#displayBar').text($('#displayBar').text().substring(0,$('#displayBar').text().length-1));
        $('#displayBar').text($('#displayBar').text() + $(this).text());
        operationRepeat = false;
    } else if (userInput[userInput.length-1] === '.'){
        userInput[userInput.length-1]='0';
        userInput.push($(this).text());
        $('#displayBar').text($('#displayBar').text().substring(0,$('#displayBar').text().length-1) + '0' + $(this).text());
        operationRepeat = false;
    } else {
        userInput.push($(this).text());
        $('#displayBar').text($('#displayBar').text() + $(this).text());
        operationRepeat = false;
    }
}


function handleClearClick(){
    if ($(this).text() === 'C'){
        userInput.length = 0;
        $('#displayBar').text('');
        operationRepeat = false;
    } else {
        userInput.pop();
        $('#displayBar').text(userInput.join(''));
        operationRepeat = false;
    }
}


function conditionalChecks() {
    var operators = '+-/x';
    if (userInput.length === 0 || $('#displayBar').text() === 'Ready' ){
        $('#displayBar').text('Ready');
        return
    }
    if (userInput[userInput.length-1] === '.') {
        userInput[userInput.length - 1] = '0';
        $('#displayBar').text($('#displayBar').text().substring(0, $('#displayBar').text().length - 1) + '0' + $(this).text());
    }
    if (operationRepeat === true){
        repeatingOperation();
        return
    } else {
        repeatMath = [];
    }
    repeatMath.push(userInput[userInput.length-2], userInput[userInput.length-1]);
    if (userInput[0] === '/' || userInput[0] === 'x'){
        userInput.shift();
    }
    if (operators.indexOf(userInput[userInput.length-1]) !== -1){
        operationRollover = userInput.pop();
        rolloverOperation();
        return
    }
    if (userInput[0] === '-'){
        userInput[0] = userInput[0] + userInput[1];
        userInput.splice(1,1);
    }

    doMath();
}


function decimalCheck(){
    var operators = '+-/x';
    //if start of array index
    if (userInput[userInput.length-1] === undefined){
        //if array length is 0
        if (userInput[userInput.length-1] === userInput[-1]){
            userInput[0]=('.');
            $('#displayBar').text($('#displayBar').text()+'.');
        } else {
            userInput[userInput.length-1]+=('.');
            $('#displayBar').text($('#displayBar').text()+'.');
        }
    }
    //if operator is not most recent input
    if (operators.indexOf(userInput[userInput.length-1]) !== -1){
        userInput.push('.');
        $('#displayBar').text($('#displayBar').text()+'.');
        return;
    } else {
        //if decimal is not in last array index
        if (userInput[userInput.length-1].indexOf('.') === -1){
            userInput[userInput.length-1]+=('.');
            $('#displayBar').text($('#displayBar').text()+'.');
        }
    }
}


function repeatingOperation(){
    if (repeatMath[0] === undefined){
        return
    }
    if (isNaN(repeatMath[1]) === true){
        var rM0 = repeatMath[1];
        var rM1 = repeatMath[0];
        repeatMath[0] = rM0;
        repeatMath[1] = rM1;
    }
    userInput.push(repeatMath[0], repeatMath[1]);
    doMath();
}


function rolloverOperation(){
    mathMultDiv();
    mathAddSub();
    userInput.push(operationRollover);
    userInput.push(userInput[0]);
    doMath();
}


function doMath(){
    mathMultDiv();
    mathAddSub();
    returnSolution();
}


function mathMultDiv(){
    var changesMade = true;
    do {
        changesMade = false;
        for (var i=0; i<userInput.length; i++){
            if (('x').indexOf(userInput[i]) !== -1){
                userInput[i] = userInput[i-1] * userInput[i + 1];
                userInput.splice(i+1,1);
                userInput.splice(i-1,1);
                changesMade = true;
            } else if (('/').indexOf(userInput[i]) !== -1){
                userInput[i] = userInput[i-1] / userInput[i + 1];
                userInput.splice(i+1,1);
                userInput.splice(i-1,1);
                changesMade = true;
            } else {

            }
        }
    }
    while (changesMade);
}


function mathAddSub(){
    var changesMade = true;
    do {
        changesMade = false;
        for (var k = 0; k < userInput.length; k++) {
            if (('+').indexOf(userInput[k]) !== -1) {
                userInput[k] = parseFloat(userInput[k - 1]) + parseFloat(userInput[k + 1]);
                userInput.splice(k + 1, 1);
                userInput.splice(k - 1, 1);
                changesMade = true;
            } else if (('-').indexOf(userInput[k]) !== -1) {
                userInput[k] = userInput[k - 1] - userInput[k + 1];
                userInput.splice(k + 1, 1);
                userInput.splice(k - 1, 1);
                changesMade = true;
            }
        }
    }
    while (changesMade);
}


function returnSolution(){
    var solution;
    solution = userInput[0];
    if (solution === Infinity || isNaN(solution)){
        userInput[0] = '';
        $('#displayBar').text('Error');
    } else {
        userInput[0] = ''+solution;
        $('#displayBar').text(solution);
    }
    operationRepeat = true;
}