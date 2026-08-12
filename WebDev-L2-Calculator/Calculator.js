document.addEventListener('DOMContentLoaded', () => {
    const expressionDisplay = document.getElementById('expression');
    const resultDisplay = document.getElementById('result');
    const buttons = document.querySelectorAll('.btn');

    let currentInput = '0';
    let previousInput = '';
    let operator = '';
    let shouldResetDisplay = false;

    buttons.forEach(button => {
        button.addEventListener('click', () => {
            const num = button.dataset.num;
            const op = button.dataset.op;
            const action = button.dataset.action;

            if (num !== undefined) handleNumber(num);
            if (op !== undefined) handleOperator(op, button.textContent);
            if (action === 'clear') clearAll();
            if (action === 'backspace') handleBackspace();
            if (action === 'equals') calculate();
        });
    });

    function handleNumber(num) {
        if (currentInput === '0' || shouldResetDisplay) {
            currentInput = num === '.' ? '0.' : num;
            shouldResetDisplay = false;
        } else {
            if (num === '.' && currentInput.includes('.')) return;
            currentInput += num;
        }
        
        resultDisplay.textContent = currentInput;

        // تحديث التعبير العلوي مباشرة أثناء كتابة الرقم الثاني
        if (operator) {
            expressionDisplay.textContent = `${previousInput} ${operator} ${currentInput}`;
        }
    }

    function handleOperator(opValue, opSymbol) {
        if (operator && !shouldResetDisplay) {
            calculate();
        }
        previousInput = currentInput;
        operator = opSymbol;
        shouldResetDisplay = true;
        expressionDisplay.textContent = `${previousInput} ${operator}`;
    }

    function calculate() {
        if (!operator || shouldResetDisplay) return;

        const num1 = parseFloat(previousInput);
        const num2 = parseFloat(currentInput);

        // منع القسمة على صفر
        if (operator === '÷' && num2 === 0) {
            resultDisplay.textContent = 'خطأ: قسمة على صفر';
            expressionDisplay.textContent = '';
            resetState();
            return;
        }

        let result = 0;
        switch (operator) {
            case '+': result = num1 + num2; break;
            case '-': result = num1 - num2; break;
            case '×': result = num1 * num2; break;
            case '÷': result = num1 / num2; break;
        }

        // عرض المعاملة كاملة مع شارة = فوق والناتج تحت
        expressionDisplay.textContent = `${previousInput} ${operator} ${currentInput} =`;
        resultDisplay.textContent = Number.isInteger(result) ? result : result.toFixed(4);
        
        currentInput = result.toString();
        operator = '';
        shouldResetDisplay = true;
    }

    function handleBackspace() {
        if (shouldResetDisplay) return;
        currentInput = currentInput.length > 1 ? currentInput.slice(0, -1) : '0';
        resultDisplay.textContent = currentInput;
        if (operator) {
            expressionDisplay.textContent = `${previousInput} ${operator} ${currentInput}`;
        }
    }

    function clearAll() {
        currentInput = '0';
        previousInput = '';
        operator = '';
        shouldResetDisplay = false;
        expressionDisplay.textContent = '';
        resultDisplay.textContent = '0';
    }

    function resetState() {
        currentInput = '0';
        previousInput = '';
        operator = '';
        shouldResetDisplay = true;
    }
});
