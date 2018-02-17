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
        doMath();
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


function doMath() {
    var operators = '+-/x';
    var solution = '';
    if (userInput.length === 0 || $('#displayBar').text() === 'Ready' ){
        $('#displayBar').text('Ready');
        return
    }
    if (userInput[userInput.length-1] === '.') {
        userInput[userInput.length - 1] = '0';
        $('#displayBar').text($('#displayBar').text().substring(0, $('#displayBar').text().length - 1) + '0' + $(this).text());
    }
    if (operationRepeat === true){
        repeatingOperation(solution);
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
        rolloverOperation(solution);
        return
    }while (userInput.length) {
        if (isNaN(userInput[0]) === false) {
            solution = solution + userInput[0];
            userInput.shift();
        } else {
            if (userInput[0] === 'x') {
                userInput[0] = '*';
            }
            solution = solution + userInput[0];
            userInput.shift();
        }
    }
    solution = eval(solution);
    if (solution === Infinity || isNaN(solution)){
        userInput[0] = '';
        $('#displayBar').text('Error');
    } else {
        userInput[0] = ''+solution;
        $('#displayBar').text(solution);
    }
    operationRepeat = true;
}


function decimalCheck(){
    var operators = '+-/x';
    if (userInput[userInput.length-1] === undefined){
        if (userInput[userInput.length-1] === userInput[-1]){
            userInput[0]=('.');
            $('#displayBar').text($('#displayBar').text()+'.');
        } else {
            userInput[userInput.length-1]+=('.');
            $('#displayBar').text($('#displayBar').text()+'.');
        }
    }
    if (operators.indexOf(userInput[userInput.length-1]) !== -1){
        userInput.push('.');
        $('#displayBar').text($('#displayBar').text()+'.');
        return;
    } else {
        if (userInput[userInput.length-1].indexOf('.') === -1){
            userInput[userInput.length-1]+=('.');
            $('#displayBar').text($('#displayBar').text()+'.');
        }
    }
}


function repeatingOperation(solution){
    if (isNaN(repeatMath[1]) === true){
        var rM0 = repeatMath[1];
        var rM1 = repeatMath[0];
        repeatMath[0] = rM0;
        repeatMath[1] = rM1;
    }
    userInput.push(repeatMath[0], repeatMath[1]);
    while (userInput.length) {
        if (isNaN(userInput[0]) === false) {
            solution = solution + userInput[0];
            userInput.shift();
        } else {
            if (userInput[0] === 'x') {
                userInput[0] = '*';
            }
            solution = solution + userInput[0];
            userInput.shift();
        }
    }
    solution = eval(solution);
    if (solution === Infinity){
        userInput[0] = '';
        $('#displayBar').text('Error');
    } else {
        userInput[0] = ''+solution;
        $('#displayBar').text(solution);
    }
}

function rolloverOperation(solution){
    while (userInput.length) {
        if (isNaN(userInput[0]) === false) {
            solution = solution + userInput[0];
            userInput.shift();
        } else {
            if (userInput[0] === 'x') {
                userInput[0] = '*';
            }
            solution = solution + userInput[0];
            userInput.shift();
        }
    }
    solution = eval(solution);
    if (operationRollover === 'x'){
        operationRollover = '*';
    }
    solution = eval(solution + operationRollover + solution);
    if (solution === Infinity){
        userInput[0] = '';
        $('#displayBar').text('Error');
    } else {
        userInput[0] = ''+solution;
        $('#displayBar').text(solution);
    }
    operationRepeat = true;
}