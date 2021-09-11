// TO DO
// 1. deal with decimal places. not coming up on the screen imediately after being clicked
// 3 hitting '.' twice should delete the last digit entered (just slice off current input..?). wont work for operators
// 4. add in key presses
// 5. get digital clock font
// 6. add in time and day


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
    updateCurrent('0');
    updateHistory('0');
    updateOperator('');

}

function valToDisp(val) {
    // if val > 9999999 or <-999999 then ERROR
    // if val < 0, then only 7 digits + '-'
    // if val is decimal, then only use first 7/8 characters..
    if (val.slice(val.length -1) === '.') {
        // do something here to deal with decimal point not coming up...
    }        
    val = Number(val)
    

    if (val > 99999999 | val < -9999999 | val === NaN) {
        return 'ERRROR'
    }

    if (val < 0) {
        if (Number.isInteger(val)) {
            // number is negative, but no decimal places, so seven digit spots left
            return '-' + String(val * -1).padStart(7,'0');
        }
        else {
            // number is negative and decimal, so 6 digit spots left
            return ('-' + String(val * -1).padStart(6,'0')).slice(0,8);
        }
    }
    else {
        if (Number.isInteger(val)) {
            // number is positive and no decimal places, so 8 digit spots left
            return String(val).padStart(8,'0');
        }
        else {
            // number is psoitive and decimal, so 7 digit spots left
            return String(val).padStart(8,'0').slice(0,8);
        }
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

function setupButtons() {
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
        button.addEventListener('click', inputIn);
    })
}

function inputIn(e) {
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
                    //if its a negative sign and 'a' is still 0, then we want 'a' to be -ve
                    if (e.target.value === '-' & inputs.a == 0) {
                        inputs.a = '-';
                        console.log(inputs);
                        break
                    }
                    else {
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
                            updateHistory(inputs.a); 
                            updateCurrent('0');
                        }
                        break;
                    }
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