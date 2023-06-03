import { assemble } from './assembler';
import { getInitState, handleOpcodes, nextInstruction } from './emulator';
import { InstructionCode } from './instructions';
import { getProgram } from './program';
import { ControlWord, State } from './state';

let running = 0;
let manualMode = 1;
setProgram('Fibonacci');
let state: State = init();
let speed = 1;

document.querySelector('#speed')?.addEventListener('change', speedChanged);
document.querySelector('#toggleBtn')?.addEventListener('click', toggle);
document.querySelector('#pulseBtn')?.addEventListener('mousedown', toggleClock);
document.querySelector('#pulseBtn')?.addEventListener('mouseup', toggleClock);
document.querySelector('#resetBtn')?.addEventListener('click', reset);
document.querySelector('#nextInstructionBtn')?.addEventListener('click', next);
document.querySelector('#program')?.addEventListener('change', programChanged);
document.querySelector('#code')?.addEventListener('input', reset);

function setBinaryValue(module: string, number: number) {
  let moduleDiv = document.querySelector(`#${module}`) as HTMLDivElement;
  if (!moduleDiv) throw new Error(`Module ${module} not found`);

  let leds = Array.from(moduleDiv.querySelectorAll(`.led`)).reverse();
  for (let led of leds) {
    led.classList.remove('active');
  }

  let digits = number.toString(2).split('').reverse();
  if (digits.length > leds.length)
    throw new Error(`Number: ${number} exceeds bits of module ${module}`);

  for (let i = 0; i < digits.length; i++) {
    if (digits[i] === '1') {
      leds[i].classList.add('active');
    }
  }
}

function setNumericValue(module: string, number: number) {
  let moduleDiv = document.querySelector(`#${module}`) as HTMLDivElement;
  if (!moduleDiv) throw new Error(`Module ${module} not found`);

  let titleSpan = moduleDiv.querySelector('.title');
  if (!titleSpan) throw new Error(`Title for Module: ${module} not found`);

  let title = titleSpan.textContent?.split('[')[0];
  let newTitle = title + ' [' + number + ']';
  titleSpan.textContent = newTitle;
}

function setInstructionRegisterValue(number: number) {
  let moduleDiv = document.querySelector(
    `#instruction-register`
  ) as HTMLDivElement;
  if (!moduleDiv) throw new Error(`Module instruction register not found`);

  let titleSpan = moduleDiv.querySelector('.title');
  if (!titleSpan) throw new Error(`Title for Module: ${module} not found`);

  let title = titleSpan.textContent?.split('[')[0];

  let instruction = number >> 4;
  let value = number & 15;
  let instructionText: string = InstructionCode[instruction];
  let newTitle = title + '[' + instructionText + ' ' + value + ']';
  titleSpan.textContent = newTitle;
}

function setOutputValue(number: number) {
  let sevenSegmentDisplay = document.querySelector('.seven-segment-display');
  if (!sevenSegmentDisplay) throw new Error('Seven Segment Display not found');

  const onesPlace = number % 10;
  const tensPlace = Math.floor((number / 10) % 10);
  const hundredsPlace = Math.floor((number / 100) % 10);

  let digits = sevenSegmentDisplay.querySelectorAll(
    '.seven-segment-display-digit'
  );
  if (digits.length !== 4)
    throw new Error('Seven Segment Display does not have enough digits');

  digits[0].textContent = number >= 0 ? '' : '-';
  digits[1].textContent = hundredsPlace ? hundredsPlace.toString() : '0';
  digits[2].textContent = tensPlace ? tensPlace.toString() : '0';
  digits[3].textContent = onesPlace ? onesPlace.toString() : '0';
}

function setFlagsRegister(carryFlag: number, zeroFlag: number) {
  let binaryValue = `${carryFlag}${zeroFlag}`;
  var value = Number.parseInt(binaryValue, 2);
  setBinaryValue('flags-register', value);
}

function setOpCodesCounter(value: number) {
  let binaryNumber = value
    .toString(2)
    .padStart(3, '0')
    .split('')
    .reverse()
    .join('');
  for (let i = 0; i < 5; i++) {
    if (value === i) {
      binaryNumber += '0';
    } else {
      binaryNumber += '1';
    }
  }

  let decimalNumber = Number.parseInt(binaryNumber, 2);
  setBinaryValue('op-code-counter', decimalNumber);
}

function setSumRegister(value: number, c: number, z: number) {
  let binaryNumber = '';
  binaryNumber += value.toString(2).padStart(8, '0');
  binaryNumber += c;
  binaryNumber += z;

  let decimalNumber = Number.parseInt(binaryNumber, 2);
  setBinaryValue('sum-register', decimalNumber);
}

function setActiveLine(value: number) {
  let lines = document.querySelectorAll('.line-counter span');
  for (let line of lines) {
    line.classList.remove('active-line');
  }
  lines[value].classList.add('active-line');
}

function setRam(ram: number[]) {
  let ramValues = document.querySelectorAll('.ram-value');
  for (let i = 0; i < ram.length; i++) {
    let binaryNumber = ram[i].toString(2).padStart(8, '0');
    ramValues[i].textContent =
      binaryNumber.substring(0, 4) + ' ' + binaryNumber.substring(4);
  }
}

function setControlWord(controlWord: ControlWord) {
  let binaryNumber = '';
  binaryNumber += controlWord.HLT;
  binaryNumber += controlWord.MI;
  binaryNumber += controlWord.RI;
  binaryNumber += controlWord.RO;
  binaryNumber += controlWord.IO;
  binaryNumber += controlWord.II;
  binaryNumber += controlWord.AI;
  binaryNumber += controlWord.AO;
  binaryNumber += controlWord.EO;
  binaryNumber += controlWord.SU;
  binaryNumber += controlWord.BI;
  binaryNumber += controlWord.OI;
  binaryNumber += controlWord.CE;
  binaryNumber += controlWord.CO;
  binaryNumber += controlWord.J;
  binaryNumber += controlWord.FI;

  let decimalNumber = Number.parseInt(binaryNumber, 2);
  setBinaryValue('control-word', decimalNumber);
}

function updateUI(state: State) {
  setBinaryValue('clock', state.clock);
  setBinaryValue('memory-address', state.memoryAddress);
  setNumericValue('memory-address', state.memoryAddress);
  setBinaryValue('memory-content', state.memoryContent);
  setNumericValue('memory-content', state.memoryContent);

  setBinaryValue('instruction-register', state.instructionRegister);
  setInstructionRegisterValue(state.instructionRegister);
  setOpCodesCounter(state.opcodeCounter);

  setBinaryValue('bus', state.bus);
  setNumericValue('bus', state.bus);

  setBinaryValue('counter', state.counter);
  setNumericValue('counter', state.counter);
  setFlagsRegister(state.carryFlag, state.zeroFlag);
  setBinaryValue('a-register', state.aRegister);
  setNumericValue('a-register', state.aRegister);
  setSumRegister(
    state.sumRegister,
    state.sumRegisterOverflow,
    state.sumRegisterZero
  );
  setNumericValue('sum-register', state.sumRegister);
  setBinaryValue('b-register', state.bRegister);
  setNumericValue('b-register', state.bRegister);
  setOutputValue(state.outRegister);
  setControlWord(state.controlWord);
  setActiveLine(state.counter);
  setRam(state.ram);
}

function init(): State {
  let textArea = document.querySelector('#code') as HTMLTextAreaElement;
  let code = textArea.value?.split('\n') ?? [];
  let program = assemble(code);

  let state = getInitState();
  for (let i = 0; i < state.ram.length; i++) {
    if (program.length > i) {
      state.ram[i] = program[i];
    }
  }

  updateUI(state);

  return state;
}

function speedChanged(e: Event) {
  let htmlElement: HTMLInputElement = e.target as HTMLInputElement;
  let value = htmlElement.value;
  switch (value) {
    case '1':
      speed = 1000;
      break;
    case '2':
      speed = 500;
      break;
    case '3':
      speed = 100;
      break;
    case '4':
      speed = 10;
      break;
    case '5':
      speed = 1;
      break;
    default:
      throw new Error(`unsupported value: ${speed}`);
  }
}

function programChanged(e: Event) {
  let programSelect = document.querySelector('#program') as HTMLSelectElement;
  setProgram(programSelect.value);
  reset();
}

function setProgram(name: string) {
  let code = getProgram(name.toLowerCase());
  setBootloader(code);
}

function setBootloader(code: string[]) {
  let textArea = document.querySelector('#code') as HTMLTextAreaElement;
  if (!textArea) throw new Error('textarea not found');
  textArea.value = code.join('\n');
}

function reset() {
  state = init();
  run();
}

function next() {
  do {
    state = handleOpcodes(state); // 0 -> 1
    if (state.halted) break;

    state = handleOpcodes(state); // 1 -> 0
    if (state.halted) break;
  } while (state.opcodeCounter !== 4);

  updateUI(state);
}

function toggleClock() {
  if (state.halted === 1) {
    return;
  }

  state = handleOpcodes(state);
  updateUI(state);
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function toggle() {
  let startBtn = document.querySelector('#toggleBtn');
  let pulseBtn = document.querySelector('#pulseBtn');
  let nextInstructionBtn = document.querySelector('#nextInstructionBtn');
  if (!startBtn) throw new Error('startBtn not available');
  if (!pulseBtn) throw new Error('pulseBtn not available');
  if (!nextInstructionBtn) throw new Error('nextInstructionBtn not available');

  if (manualMode === 0) {
    startBtn.textContent = 'OSC';
    pulseBtn.removeAttribute('disabled');
    nextInstructionBtn.removeAttribute('disabled');
    manualMode = 1;
    return;
  }

  pulseBtn.setAttribute('disabled', 'disabled');
  nextInstructionBtn.setAttribute('disabled', 'disabled');
  startBtn.textContent = 'MAN';
  manualMode = 0;

  run();
}

async function run() {
  if (manualMode) {
    console.log('manual mode, will not run');
    return;
  }
  if (running) {
    console.log('already running, will not run again');
    return;
  }

  running = 1;

  while (state.halted !== 1 && manualMode !== 1) {
    await pulseClock();
  }

  running = 0;
}

async function pulseClock() {
  toggleClock();
  await sleep(speed / 2);
  toggleClock();
  await sleep(speed / 2);
}
