// TO DO
// 1. deal with decimal places. This should be dealt with by below
// 2. deal with overflow / > 8 digits (throw an error)
//          - this should be rounded for numbers less than 9999,9999 and error otherwise
// 3 hitting '.' twice should delete the last digit entered (just slice off current input..?). wont work for operators



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

let inputs = {
    a: '0',
    b: '0',
    o: '',
    inputAB: 'a'
}

function resetInputs() {
    inputs.a = '0';
    inputs.b = '0';
    inputs.o = '';
    console.log('cleared');
    updateCurrent('');
    updateHistory('');
    updateOperator('');

}

function updateCurrent(val) {
    const currDigits = document.querySelector('.current-digits');
    if (parseInt(val) < 0) {
        currDigits.textContent = '-' + String(parseInt(val)*-1).padStart(7, '0');
    }
    else {
        currDigits.textContent = val.padStart(8,'0');
    }
}

function updateHistory(val) {
    const histDigits = document.querySelector('.history-digits');
    if (parseInt(val) < 0) {
        histDigits.textContent = '-' + String(parseInt(val)*-1).padStart(7, '0');
    }
    else {
        histDigits.textContent = val.padStart(8,'0');
    }
}

function updateOperator(val) {
    const currOp = document.querySelector('.current-operator');
    currOp.textContent = val;
}

function setupButtons() {
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
        button.addEventListener('click', buttonClick);
    })
}

function buttonClick(e) {
    switch (e.target.className) {
        case 'digit':
            switch (inputs.inputAB) {
                case 'a':
                    if (inputs.o === '=') {
                        // if the last operator was the equal sign, then we want to write over this result
                        resetInputs()
                    }
                    // save the 'a' value
                    inputs.a += e.target.value;
                    console.log(inputs);
                    updateCurrent(inputs.a);
                    break;
                case 'b':
                    // save the 'b' value
                    inputs.b += e.target.value;
                    console.log(inputs);
                    updateCurrent(inputs.b);
                    updateHistory(inputs.a);
                    break
            }
            break;
        case 'operator':
            switch (inputs.inputAB) {
                case 'a':
                    // new operator so save it
                    inputs.o = e.target.value;
                    if (inputs.o === '=') {
                        // if the operator was the equal sign then we clear, as this is our clear button
                        resetInputs()
                    }
                    else {
                        inputs.inputAB = 'b'
                        console.log(inputs);
                        updateOperator(inputs.o);    
                    }
                        break;
                case 'b':
                    // second time an operator has been clicked is always an '=' operation regardless of button
                    let res = operate(inputs.a, inputs.o, inputs.b);
                    inputs.o = e.target.value;
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
                    console.log(inputs)
                    break
            }
        break;
    }
}


function setUp() {
    updateCurrent('0');
    updateHistory('0');
    updateOperator('');
    setupButtons()
}

setUp();
    
// ------------- END DOM FUNCTIONS ----------------------