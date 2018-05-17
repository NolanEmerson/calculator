$(document).ready(initializeApp);


const userInput = [];
var operationRepeat = false;
var repeatMath = [];
var operationRollover = '';
var lastEquation = null;


function initializeApp(){
    attachClickHandlers();
    attachKeypressHandlers();
    $('.questionHistory').addClass('hide');
}


function attachClickHandlers(){
    $('.numbers > button').on('click',handleNumberClick);
    $('.operators > button').on('click',handleOperatorClick);
    $('.clear').on('click',handleClearClick);
    $('.historyToggle').on('click',toggleHistoryDisplay);
}


function attachKeypressHandlers(){
   $(document).keyup(function(e){
       switch(e.which){
           case 48:
           case 49:
           case 50:
           case 51:
           case 52:
           case 53:
           case 54:
           case 55:
           case 57:
           case 190:
           case 96:
           case 97:
           case 98:
           case 99:
           case 100:
           case 101:
           case 102:
           case 103:
           case 104:
           case 105:
           case 110:
           case 13:
               if (e.shiftKey === true){
                   break;
               }
               handleNumberClick(e.key);
               break;
           case 56:
               if (e.shiftKey === true){
                   handleOperatorClick('*');
               } else {
                   handleNumberClick(e.key);
               }
               break;
           case 187:
               if (e.shiftKey === true){
                   handleOperatorClick('+');
               } else {
                   handleNumberClick(e.key);
               }
               break;
           case 8:
           case 46:
               handleClearClick(e.key);
               break;
           case 111:
           case 106:
           case 109:
           case 107:
           case 189:
           case 191:
               handleOperatorClick(e.key);
               break;
       }
   });
}


function handleNumberClick(event){
    if (event !== undefined && this.length === 0){
        var textInput = event;
        $('event').blur();
    } else {
        textInput = $(this).text();
        $(this).blur();
    }
    if ($('#displayBar').text() === 'Error' || $('#displayBar').text() === 'Ready'){
        $('#displayBar').text('');
        operationRepeat = false;
    }
    if (textInput === '.'){
        decimalCheck();
        operationRepeat = false;
    } else if(textInput !== '=' && textInput !== 'Enter') {
        if (isNaN(userInput[userInput.length-1]) === false || userInput[userInput.length-1] === '.') {
            userInput[userInput.length - 1] = userInput[userInput.length - 1].concat(textInput);
            $('#displayBar').text($('#displayBar').text() + textInput);
            operationRepeat = false;
        } else {
            userInput.push(textInput);
            $('#displayBar').text($('#displayBar').text() + textInput);
            operationRepeat = false;
        }
    }
        else{
        conditionalChecks(textInput);
            }
}


function handleOperatorClick(event){
    let displayText;
    if (event !== undefined && this.length === 0){
        var textInput = event;
        displayText = event;
        $('event').blur();
    } else {
        displayText = $(this).text();
        switch ($(this).text().charCodeAt(0)){
            case 247:
                textInput = '/';
                break;
            case 215:
                textInput = '*';
                break;
            case 8722:
                textInput = '-';
                break;
            case 43:
                textInput = '+';
                break;
        }
        $(this).blur();
    }
    var operators = '+*-/';
    if ($('#displayBar').text() === 'Error' || $('#displayBar').text() === 'Ready'){
        $('#displayBar').text('');
        operationRepeat = false;
    }
    if (operators.indexOf(userInput[userInput.length-1]) !== -1) {
        userInput.pop();
        userInput.push(textInput);
        $('#displayBar').text($('#displayBar').text().substring(0,$('#displayBar').text().length-1));
        $('#displayBar').text($('#displayBar').text() + displayText);
        operationRepeat = false;
    } else if (userInput[userInput.length-1] === '.'){
        userInput[userInput.length-1]='0';
        userInput.push(textInput);
        $('#displayBar').text($('#displayBar').text().substring(0,$('#displayBar').text().length-1) + '0' + displayText);
        operationRepeat = false;
    } else {
        userInput.push(textInput);
        $('#displayBar').text($('#displayBar').text() + displayText);
        operationRepeat = false;
    }
}


function handleClearClick(event){
    if (event !== undefined && this.length === 0){
        var textInput = event;
        $('event').blur();
    } else {
        textInput = $(this).text();
        $(this).blur();
    }
    if (textInput === 'C' || textInput === 'Delete'){
        userInput.length = 0;
        $('#displayBar').text('');
        operationRepeat = false;
    } else {
        userInput.pop();
        $('#displayBar').text(userInput.join(''));
        operationRepeat = false;
    }
}


function conditionalChecks(textInput) {
    var operators = '+-/*';
    if (userInput.length === 0 || $('#displayBar').text() === 'Ready' ){
        $('#displayBar').text('Ready');
        return
    }
    if (userInput[userInput.length-1] === '.') {
        userInput[userInput.length - 1] = '0';
        $('#displayBar').text($('#displayBar').text().substring(0, $('#displayBar').text().length - 1) + '0' + textInput);
    }
    if (operationRepeat === true){
        repeatingOperation();
        return
    } else {
        repeatMath = [];
    }
    repeatMath.push(userInput[userInput.length-2], userInput[userInput.length-1]);
    if (userInput[0] === '/' || userInput[0] === '*'){
        $('#displayBar').text($('#displayBar').text().substring(1, $('#displayBar').text().length+3));
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
    lastEquation = $('#displayBar').text();
    doMath();
}


function decimalCheck(){
    var operators = '+-/*';
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
            if (('*').indexOf(userInput[i]) !== -1){
                userInput[i] = userInput[i-1] * userInput[i + 1];
                userInput.splice(i+1,1);
                userInput.splice(i-1,1);
                changesMade = true;
                break;
            } else if (('/').indexOf(userInput[i]) !== -1){
                userInput[i] = userInput[i-1] / userInput[i + 1];
                userInput.splice(i+1,1);
                userInput.splice(i-1,1);
                changesMade = true;
                break;
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
                break;
            } else if (('-').indexOf(userInput[k]) !== -1) {
                userInput[k] = userInput[k - 1] - userInput[k + 1];
                userInput.splice(k + 1, 1);
                userInput.splice(k - 1, 1);
                changesMade = true;
                break;
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
        solution = 'Error';
    } else {
        userInput[0] = ''+solution;
        $('#displayBar').text(solution);
    }
    operationRepeat = true;
    updateHistory(solution);
}


function updateHistory(solution){
    $('.questionHistory5').text($('.questionHistory4').text());
    $('.questionHistory4').text($('.questionHistory3').text());
    $('.questionHistory3').text($('.questionHistory2').text());
    $('.questionHistory2').text($('.questionHistory1').text());
    $('.questionHistory1').text(lastEquation);

    $('.answerHistory5').text($('.answerHistory4').text());
    $('.answerHistory4').text($('.answerHistory3').text());
    $('.answerHistory3').text($('.answerHistory2').text());
    $('.answerHistory2').text($('.answerHistory1').text());
    $('.answerHistory1').text(solution);
}


function toggleHistoryDisplay(){
    if ($('.questionHistory').hasClass('hide') === true){
        $('.answerHistory').addClass('hide');
        $('.questionHistory').removeClass('hide');
    } else {
        $('.questionHistory').addClass('hide');
        $('.answerHistory').removeClass('hide');
    }
}