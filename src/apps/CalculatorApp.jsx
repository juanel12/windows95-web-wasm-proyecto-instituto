import React, { useState } from 'react';
import { playClickSound } from '../utils/win95Sound';

export default function CalculatorApp() {
  const [display, setDisplay] = useState('0');
  const [prevValue, setPrevValue] = useState(null);
  const [operator, setOperator] = useState(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  const [memory, setMemory] = useState(0);

  const inputDigit = (digit) => {
    playClickSound();
    if (waitingForOperand) {
      setDisplay(String(digit));
      setWaitingForOperand(false);
    } else {
      setDisplay((prev) => (prev === '0' ? String(digit) : prev + digit));
    }
  };

  const inputDecimal = () => {
    playClickSound();
    if (waitingForOperand) {
      setDisplay('0.');
      setWaitingForOperand(false);
      return;
    }
    if (!display.includes('.')) {
      setDisplay((prev) => prev + '.');
    }
  };

  const calculate = (a, b, op) => {
    switch (op) {
      case '+':
        return a + b;
      case '-':
        return a - b;
      case '*':
        return a * b;
      case '/':
        return b === 0 ? 'Error' : a / b;
      default:
        return b;
    }
  };

  const handleOperator = (nextOp) => {
    playClickSound();
    const inputValue = parseFloat(display);
    if (Number.isNaN(inputValue)) {
      setDisplay('0');
      return;
    }

    if (prevValue === null) {
      setPrevValue(inputValue);
    } else if (operator && !waitingForOperand) {
      const result = calculate(prevValue, inputValue, operator);
      if (result === 'Error') {
        setDisplay('No se puede dividir por 0');
        setPrevValue(null);
        setOperator(null);
        setWaitingForOperand(true);
        return;
      }
      const rounded = Number(result.toPrecision(12));
      setDisplay(String(rounded));
      setPrevValue(rounded);
    }

    setWaitingForOperand(true);
    setOperator(nextOp);
  };

  const handleEquals = () => {
    playClickSound();
    if (operator === null || prevValue === null) return;
    const inputValue = parseFloat(display);
    const result = calculate(prevValue, inputValue, operator);
    if (result === 'Error') {
      setDisplay('No se puede dividir por 0');
    } else {
      setDisplay(String(Number(result.toPrecision(12))));
    }
    setPrevValue(null);
    setOperator(null);
    setWaitingForOperand(true);
  };

  const handleClear = () => {
    playClickSound();
    setDisplay('0');
    setPrevValue(null);
    setOperator(null);
    setWaitingForOperand(false);
  };

  const handleClearEntry = () => {
    playClickSound();
    setDisplay('0');
  };

  const handleBackspace = () => {
    playClickSound();
    if (waitingForOperand) return;
    setDisplay((prev) => (prev.length > 1 ? prev.slice(0, -1) : '0'));
  };

  const handleSqrt = () => {
    playClickSound();
    const val = parseFloat(display);
    if (val < 0 || Number.isNaN(val)) {
      setDisplay('Entrada no válida');
    } else {
      setDisplay(String(Number(Math.sqrt(val).toPrecision(12))));
    }
    setWaitingForOperand(true);
  };

  const handleInverse = () => {
    playClickSound();
    const val = parseFloat(display);
    if (val === 0 || Number.isNaN(val)) {
      setDisplay('No se puede dividir por 0');
    } else {
      setDisplay(String(Number((1 / val).toPrecision(12))));
    }
    setWaitingForOperand(true);
  };

  const handleToggleSign = () => {
    playClickSound();
    const val = parseFloat(display);
    if (!Number.isNaN(val) && val !== 0) {
      setDisplay(String(val * -1));
    }
  };

  const handlePercent = () => {
    playClickSound();
    const val = parseFloat(display);
    if (!Number.isNaN(val)) {
      const pct = prevValue !== null ? (prevValue * val) / 100 : val / 100;
      setDisplay(String(Number(pct.toPrecision(12))));
    }
  };

  const btnStyle = {
    minWidth: 0,
    padding: '4px 0',
    fontWeight: 'bold',
    fontSize: 12,
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: 6, height: '100%' }}>
      {/* Pantalla digital */}
      <input
        type="text"
        readOnly
        value={display}
        style={{
          textAlign: 'right',
          fontFamily: '"Courier New", monospace',
          fontSize: 16,
          fontWeight: 'bold',
          padding: '4px 6px',
          background: '#ffffff',
          color: '#000000',
        }}
      />

      {/* Fila superior: Backspace, CE, C */}
      <div style={{ display: 'grid', gridTemplateColumns: '38px 1fr 1fr 1fr', gap: 4 }}>
        <div
          style={{
            border: '2px inset #808080',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 11,
            fontWeight: 'bold',
            color: '#000080',
          }}
          title="Indicador de memoria"
        >
          {memory !== 0 ? 'M' : ''}
        </div>
        <button type="button" style={{ ...btnStyle, color: '#800000' }} onClick={handleBackspace}>
          Retroceso
        </button>
        <button type="button" style={{ ...btnStyle, color: '#800000' }} onClick={handleClearEntry}>
          CE
        </button>
        <button type="button" style={{ ...btnStyle, color: '#800000' }} onClick={handleClear}>
          C
        </button>
      </div>

      {/* Teclado principal */}
      <div style={{ display: 'grid', gridTemplateColumns: '38px repeat(5, 1fr)', gap: 4, flex: 1 }}>
        {/* Columna Memoria */}
        <button type="button" style={{ ...btnStyle, color: '#ff0000' }} onClick={() => setMemory(0)}>MC</button>
        <button type="button" style={{ ...btnStyle, color: '#0000ff' }} onClick={() => inputDigit(7)}>7</button>
        <button type="button" style={{ ...btnStyle, color: '#0000ff' }} onClick={() => inputDigit(8)}>8</button>
        <button type="button" style={{ ...btnStyle, color: '#0000ff' }} onClick={() => inputDigit(9)}>9</button>
        <button type="button" style={{ ...btnStyle, color: '#ff0000' }} onClick={() => handleOperator('/')}>/</button>
        <button type="button" style={{ ...btnStyle, color: '#000080' }} onClick={handleSqrt}>sqrt</button>

        <button type="button" style={{ ...btnStyle, color: '#ff0000' }} onClick={() => { setDisplay(String(memory)); setWaitingForOperand(true); }}>MR</button>
        <button type="button" style={{ ...btnStyle, color: '#0000ff' }} onClick={() => inputDigit(4)}>4</button>
        <button type="button" style={{ ...btnStyle, color: '#0000ff' }} onClick={() => inputDigit(5)}>5</button>
        <button type="button" style={{ ...btnStyle, color: '#0000ff' }} onClick={() => inputDigit(6)}>6</button>
        <button type="button" style={{ ...btnStyle, color: '#ff0000' }} onClick={() => handleOperator('*')}>*</button>
        <button type="button" style={{ ...btnStyle, color: '#000080' }} onClick={handlePercent}>%</button>

        <button type="button" style={{ ...btnStyle, color: '#ff0000' }} onClick={() => setMemory(parseFloat(display) || 0)}>MS</button>
        <button type="button" style={{ ...btnStyle, color: '#0000ff' }} onClick={() => inputDigit(1)}>1</button>
        <button type="button" style={{ ...btnStyle, color: '#0000ff' }} onClick={() => inputDigit(2)}>2</button>
        <button type="button" style={{ ...btnStyle, color: '#0000ff' }} onClick={() => inputDigit(3)}>3</button>
        <button type="button" style={{ ...btnStyle, color: '#ff0000' }} onClick={() => handleOperator('-')}>-</button>
        <button type="button" style={{ ...btnStyle, color: '#000080' }} onClick={handleInverse}>1/x</button>

        <button type="button" style={{ ...btnStyle, color: '#ff0000' }} onClick={() => setMemory((m) => m + (parseFloat(display) || 0))}>M+</button>
        <button type="button" style={{ ...btnStyle, color: '#0000ff' }} onClick={() => inputDigit(0)}>0</button>
        <button type="button" style={{ ...btnStyle, color: '#0000ff' }} onClick={handleToggleSign}>+/-</button>
        <button type="button" style={{ ...btnStyle, color: '#0000ff' }} onClick={inputDecimal}>.</button>
        <button type="button" style={{ ...btnStyle, color: '#ff0000' }} onClick={() => handleOperator('+')}>+</button>
        <button type="button" style={{ ...btnStyle, color: '#ff0000' }} onClick={handleEquals}>=</button>
      </div>
    </div>
  );
}
