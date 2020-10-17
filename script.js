class Calculator {
    constructor(previousOperandTextElement, currentOperandTextElement, error) {
        this.previousOperandTextElement = previousOperandTextElement;
        this.currentOperandTextElement = currentOperandTextElement;
        this.readyToReset = false;
        this.error = error;
        this.flag = '';
        this.but= '';
        this.val= '';
        this.clear(); 
    }

    clear() {
        this.currentOperand = '';
        this.previousOperand = '';
        this.but= '';
        this.val= '';
        this.flag = '';
        this.error.innerHTML = '';
        this.operation = undefined;
        this.readyToReset = false;
    }

    delete() {
        this.currentOperand = this.currentOperand.toString().slice(0, -1);
    }

    appendNumber(number) {
        if (number === '.' && this.currentOperand.includes('.')) return
        this.currentOperand = this.currentOperand.toString() + number.toString();
    }

    chooseOperation(operation) {
        if (this.currentOperand === '' && operation !== '-') return
        if (this.previousOperand !== '') {  
            this.compute();         
        }
        
        this.operation = operation;
        this.previousOperand = this.currentOperand;
        this.currentOperand = '';
        if (this.currentOperand === '' && this.previousOperand === '' && operation === '-') {
            this.previousOperand = this.previousOperand * (-1);
            return
        }
        else if (this.previousOperand !== '') {
            this.but = operation;
            this.val = this.previousOperand;
            return
            
        }
        this.flag = operation;
    }

    compute() {
        let computation;
        const prev = parseFloat(this.previousOperand);
        const current = parseFloat(this.currentOperand);   
        if (isNaN(prev) || isNaN(current)) return
        switch (this.operation) {
            case '+':
                computation = prev + current;               
                break;
            case '-':   
                computation = prev - current;            
                if (prev === 0) {
                    if (this.but === '÷') computation = this.val / (current * (-1));
                    if (this.but === '*') computation = this.val * (current * (-1));
                    if (this.but === '+') computation = this.val - current;
                }               
                break;
            case '*':
                computation = prev * current;
                break;
            case '÷':
                computation = prev / current;
                break;
            case '^':
                computation = Math.pow(prev, current);
                break;
            default:
                return;
        }
        if ((computation.toString().indexOf('.')) !== -1) {
            computation = parseFloat(computation.toFixed(10));
        }
        this.readyToReset = true;
        this.currentOperand = computation;        
        // this.val = this.currentOperand;
        this.operation = undefined;
        this.previousOperand = '';
    }

    sqrtVal() {
        const prev = parseFloat(this.previousOperand);
        const current = parseFloat(this.currentOperand);
        if (!isNaN(current) && prev === 0) {
            this.chooseOperation('√');
            this.error.innerHTML = 'ОШИБКА. Нажмите AC для продолжения работы.';
            this.error.style.display = 'block';
            return
        }
        else {
            if (!isNaN(current) && isNaN(prev)) {
                this.chooseOperation('√');
                this.updateDisplay(); 
                this.currentOperand = Math.sqrt(current);                     
            }
            if ((!isNaN(current) && !isNaN(prev))) {
                this.currentOperand = Math.sqrt(current);
            }
        }
              
    }

    getDisplayNumber(number) {
        const stringNumber = number.toString();
        const integerDigits = parseFloat(stringNumber.split('.')[0]);
        const decimalDigits = stringNumber.split('.')[1];
        let integerDisplay;
        if (isNaN(integerDigits)) {
            integerDisplay = '';
        } else {
            integerDisplay = integerDigits.toLocaleString('en', {
                maximumFractionDigits: 0
            });
        }
        if (decimalDigits != null) {
            return `${integerDisplay}.${decimalDigits}`;
        } else {
            return integerDisplay
        }
    }

    updateDisplay() {
        this.currentOperandTextElement.innerText =
            this.getDisplayNumber(this.currentOperand)
        if (this.operation != null) {
            this.previousOperandTextElement.innerText =
                `${this.getDisplayNumber(this.previousOperand)} ${this.operation}`
        } else {
            this.previousOperandTextElement.innerText = ''
        }
    }
}

const numberButtons = document.querySelectorAll('[data-number]');
const operationButtons = document.querySelectorAll('[data-operation]');
const equalsButtons = document.querySelector('[data-equals]');
const deleteButtons = document.querySelector('[data-delete]');
const allClearButton = document.querySelector('[data-all-clear]');
const sqrtButton = document.querySelector('[data-operation-sqrt]');
const previousOperandTextElement = document.querySelector('[data-previous-operand]');
const currentOperandTextElement = document.querySelector('[data-current-operand]');
const error = document.querySelector('[data-error]');

const calculator = new Calculator(previousOperandTextElement, currentOperandTextElement, error);

numberButtons.forEach(button => {
    button.addEventListener('click', () => {
        if (calculator.previousOperand === "" &&
            calculator.currentOperand !== "" &&
            calculator.readyToReset) {
            calculator.currentOperand = "";
            calculator.readyToReset = false;
            error.innerHTML = '';
        }
        calculator.appendNumber(button.innerText); // получаем номер кнопки
        calculator.updateDisplay();
        
    })
})

operationButtons.forEach(button => {
    button.addEventListener('click', () => {
        calculator.chooseOperation(button.innerText); // получаем номер кнопки
        calculator.updateDisplay();

    })
})

equalsButtons.addEventListener('click', button => {
    calculator.compute();
    calculator.updateDisplay();
})

allClearButton.addEventListener('click', button => {
    calculator.clear();
    calculator.updateDisplay();
})

deleteButtons.addEventListener('click', button => {
    calculator.delete();
    calculator.updateDisplay();
})

sqrtButton.addEventListener('click', button => {
    calculator.sqrtVal();
    calculator.updateDisplay();
})