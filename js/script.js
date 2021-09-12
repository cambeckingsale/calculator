// TO DO


// ------------- START CALCULATOR FUNCTIONS -----------------

function add(a, b) {
    return String(a + b);
}

function subtract(a, b) {
    return String(a - b);
}

function multiply(a, b) {
    return String(a * b);
}

function divide(a, b) {
    if (!b) {
        //divide by 0
        return "#div/0"
    }
    else {
        return String(a / b);
    }
}

function operate(a, o, b) {
    a = parseFloat(a);
    b = parseFloat(b);
    switch (o) {
        case '+':
            return add(a, b);
            break;
        case '-':
            return subtract(a, b);
            break;
        case '*':
            return multiply(a, b);
            break;
        case '/':
            return divide(a, b);
            break
    }
}
// ------------- END CALCULATOR FUNCTIONS -----------------


// ------------- START DOM FUNCTIONS ----------------------

let state = {
    mode: 'time',
}


let inputs = {
    a: '0',
    b: '0',
    o: '',
    inputAB: 'a'
}

function negValToDisp(val, decimalPoint) {
    if (Number.isInteger(val)) {
        // number is negative, but no decimal places, so seven digit spots left
        return '-' + String(val * -1).padStart(7,'0');
    }
    else {
        // number is negative and decimal, so 6 digit spots left
        if (decimalPoint) {
            // last digit was decimal, so put this there as doesnt otherwise
            return ('-' + String(val * -1).padStart(6,'0')).slice(0,8).slice(0, -1) + '.';
        }
        return ('-' + String(val * -1).padStart(6,'0')).slice(0,8);
    }
}

function posValToDisp(val, decimalPoint) {
    if (Number.isInteger(val)) {
        // number is positive and no decimal places, so 8 digit spots left
        return String(val).padStart(8,'0');
    }
    else {
        // number is positive and decimal, so 7 digit spots left
        if (decimalPoint) {
            // last digit was decimal, so put this there as doesnt otherwise
            return String(val).padStart(8,'0').slice(0,8).slice(0, -1) + '.';
        }
        return String(val).padStart(8,'0').slice(0,8);
    }
}

function valToDisp(val) {

    if (val === '#div/0') {
        return '#DIV/0'
    }

    let decimalPoint = 0;
    if (val.slice(val.length -1) === '.') {
        // deal with decimal places
        decimalPoint = 1
    }        

    if (val > 99999999 | val < -9999999 | val === NaN) {
        // beyond the bounds of our screen
        return 'ERROR'
    }

    if (val < 0) {
        return negValToDisp(val, decimalPoint);
    }
    else {
        return posValToDisp(val, decimalPoint);
    }
}

function updateCurrent(val) {
    const currDigits = document.querySelector('.current-digits');
    currDigits.textContent = valToDisp(val);
}

function updateHistory(val) {
    const histDigits = document.querySelector('.history-digits');
    histDigits.textContent = valToDisp(val);
}

function updateOperator(val) {
    const currOp = document.querySelector('.current-operator');
    currOp.textContent = val;
}

function resetInputs() {
    inputs.a = '0';
    inputs.b = '0';
    inputs.o = '';
    updateCurrent('0');
    updateHistory('0');
    updateOperator('');

}

function updateAB(target) {
    switch (inputs.inputAB) {
        case 'a':
            if (inputs.o === '=') {
                // if the last operator was the equal sign, then we want to write over this result
                resetInputs()
            }
            // save the 'a' value
            inputs.a += target.value
            updateCurrent(inputs.a);
            if (inputs.a.includes('.')) {
                // disable '.' if already one there
                disableDecimalButton();
            }
            break;
        case 'b':
            // save the 'b' value
            inputs.b += target.value
            updateCurrent(inputs.b);
            updateHistory(inputs.a);
            if (inputs.b.includes('.')) {
                // disable '.' if already one there
                disableDecimalButton();
            }
            break
    }
}

function operateAfterA(target) {
    if (target.value === '-' & inputs.a == 0) {
        //if its a negative sign and 'a' is still 0, then we want 'a' to be -ve
        inputs.a = '-'
    }
    else {
        // new operator so save it
        inputs.o = target.value;
        if (inputs.o === '=') {
            // if the operator was the equal sign then we clear, as this is our clear button
            resetInputs()
        }
        else {
            inputs.inputAB = 'b'
            updateOperator(inputs.o);   
            updateHistory(inputs.a); 
            updateCurrent('0');
        }
    }
}

function operateAfterB(target) {
    // second time an operator has been clicked is always an '=' operation regardless of button
    let res = operate(inputs.a, inputs.o, inputs.b);
    inputs.o = target.value;
    updateCurrent(res);
    updateHistory(inputs.b);
    updateOperator(inputs.o);
    inputs.a = res;
    inputs.b = '0';
    if (inputs.o === '=') {
        inputs.inputAB = 'a'
    }
    else {
        inputs.inputAB = 'b'
    }
}

function modeSwitch() {
    switch (state.mode) {
        case 'time':
            setUpCalc();
            state.mode = 'calc'
            break;
        case 'calc':
            setUpTime();
            state.mode = 'time'
            break;
    }
}

function clearCurrent() {
    switch (inputs.inputAB) {
        case 'a':
            inputs.a = '0';
            break;
        case 'b':
            inputs.b = '0';
            break
    }
    updateCurrent('0');
}

function inputIn(target) {
    switch (target.className) {
        case 'digit':
            updateAB(target)
            break;
        case 'operator':
            if (target.value === 'CE') {
                // deal with CE
                enableDecimalButton()
                clearCurrent();
            }
            else {
                switch (inputs.inputAB) {
                    case 'a':
                        operateAfterA(target);
                        enableDecimalButton();
                        break;
                    case 'b':
                        operateAfterB(target);
                        enableDecimalButton();
                        break
                }
            }
            break;
        case 'mode': {
            modeSwitch()            
            break;
        }
    }
}

function setUpCalcDisp() {
    let topDisp = document.querySelector('.top-disp')
    let botDisp = document.querySelector('.bot-disp')

    let histDigits = document.createElement('div');
    histDigits.classList.add('history-digits')
    let calcWord = document.createElement('div');
    calcWord.classList.add('calc-display')
    calcWord.textContent = 'CALC'
    topDisp.replaceChildren(calcWord, histDigits)
    
    let currOperator = document.createElement('div');
    currOperator.classList.add('current-operator')
    let currDigits = document.createElement('div');
    currDigits.classList.add('current-digits')
    botDisp.replaceChildren(currOperator, currDigits)
}

function setUpCalc() {
    setupCalcButtons();
    setUpCalcDisp();
    updateCurrent('0');
    updateHistory('0');
    updateOperator('');
}

function updateTime() {
    if (state.mode === 'time') {
        let days = ['SUN','MON','TUE','WED','THU','FRI','SAT'];
        let timeDisp = document.querySelector('.time-display');
        let dateDisp = document.querySelector('.date-display');
        let dayDisp = document.querySelector('.day-display');

        var now = new Date();
        var time = String(now.getHours()).padStart(2,'0') + ":" + String(now.getMinutes()).padStart(2,'0') + ":" + String(now.getSeconds()).padStart(2,'0');
        var date = String(now.getFullYear()).padStart(4,'0')+'-'+String(now.getDate()).padStart(2, '0')+'-'+String(now.getMonth()+1).padStart(2, '0');
        var day = days[ now.getDay() ];

        timeDisp.textContent = time;
        dateDisp.textContent = date;
        dayDisp.textContent = day;
    }
}

function setupTimeDisp() {
    let topDisp = document.querySelector('.top-disp')
    let botDisp = document.querySelector('.bot-disp')

    let dayDisp = document.createElement('div');
    dayDisp.classList.add('day-display');
    let dateDisp = document.createElement('div');
    dateDisp.classList.add('date-display');
    topDisp.replaceChildren(dayDisp, dateDisp)

    let timeDisp = document.createElement('div');
    timeDisp.classList.add('time-display');
    botDisp.replaceChildren(timeDisp)
}

function setUpTime() {
    setupTimeDisp();
    updateTime();
    disableCalcButtons();
}


function setupCalcButtons() {
    // enable the calc buttons when in calculator mode
    const digitButtons = document.querySelectorAll('.digit');
    digitButtons.forEach(button => {
        button.addEventListener('click', onButtonClick);
    })

    const opButtons = document.querySelectorAll('.operator');
    opButtons.forEach(button => {
        button.addEventListener('click', onButtonClick);
    })
}

function disableCalcButtons() {
    // disable the buttons when not in calculator mode
    const digitButtons = document.querySelectorAll('.digit');
    digitButtons.forEach(button => {
        button.removeEventListener('click', onButtonClick);
    })

    const opButtons = document.querySelectorAll('.operator');
    opButtons.forEach(button => {
        button.removeEventListener('click', onButtonClick);
    })
}

function setupModeButton() {
    const modeButton = document.querySelector('.mode');
    modeButton.addEventListener('click', onButtonClick);
}

function enableDecimalButton() {
    const decimalButton = document.querySelector('#decimal');
    decimalButton.addEventListener('click', onButtonClick);
}

function disableDecimalButton() {
    const decimalButton = document.querySelector('#decimal');
    decimalButton.removeEventListener('click', onButtonClick);

}

function onKeyDown(e) {
    // need to deal with backspace seperately as is not registered as keypress
    if (e.key === 'Backspace') {
        inputIn({className: 'operator', value: 'CE'})
    }
}


function onKeyPress(e) {
    // enable keyboard use
    if (state.mode === 'calc')
        if ('+-/*='.includes(e.key)) {
            inputIn({className: 'operator', value: e.key});
        }
        else if ('0123456789.'.includes(e.key)) {
            inputIn({className: 'digit', value: e.key});
        }
    if ('mM'.includes(e.key)) {
        inputIn({className: 'mode', value: 'mode'});
    }
}

function onButtonClick(e) {
    inputIn(e.target);
}

function setUp() {
    document.addEventListener('keypress', onKeyPress);
    document.addEventListener('keydown', onKeyDown);
    setupModeButton()
    setUpTime()
    setInterval(updateTime, 1000);
}

setUp()

    
// ------------- END DOM FUNCTIONS ----------------------