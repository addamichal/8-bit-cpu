import { getInitState, handleOpcodes } from "./emulator";
import { AddInstruction, HltInstruction, JcInstruction, JmpInstruction, JzInstruction, LdaInstruction, LdiInstruction, OutInstruction, StaInstruction, SubInstruction } from "./instructions";
import { ControlWord, State } from "./state";

let paused = 1;
let state: State = init();
let speed = 1000;

document.querySelector('#speed')?.addEventListener('change', speedChanged)
document.querySelector('#toggleBtn')?.addEventListener('click', toggle);
document.querySelector('#pulseBtn')?.addEventListener('mousedown', toggleClock);
document.querySelector('#pulseBtn')?.addEventListener('mouseup', toggleClock);
document.querySelector('#resetBtn')?.addEventListener('click', () => {
    state = init();
});

function setBinaryValue(module: string, number: number) {
    let moduleDiv = document.querySelector(`#${module}`) as HTMLDivElement;
    if (!moduleDiv) throw new Error(`Module ${module} not found`);

    let leds = Array.from(moduleDiv.querySelectorAll(`.led`)).reverse();
    for (let led of leds) {
        led.classList.remove('active');
    }

    let digits = number.toString(2).split('').reverse();
    if (digits.length > leds.length) throw new Error(`Number: ${number} exceeds bits of module ${module}`);

    for (let i = 0; i < digits.length; i++) {
        if (digits[i] === '1') {
            leds[i].classList.add('active');
        }
    }
}

function setOutputValue(number: number) {
    let sevenSegmentDisplay = document.querySelector('.seven-segment-display');
    if (!sevenSegmentDisplay) throw new Error('Seven Segment Display not found');

    const onesPlace = number % 10;
    const tensPlace = Math.floor((number / 10) % 10);
    const hundredsPlace = Math.floor((number / 100) % 10);

    let digits = sevenSegmentDisplay.querySelectorAll('.seven-segment-display-digit');
    if (digits.length !== 4) throw new Error('Seven Segment Display does not have enough digits');

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
    let binaryNumber = value.toString(2).padStart(3, '0').split('').reverse().join('');
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
    setBinaryValue('sum-register', decimalNumber)
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
    setBinaryValue('memory-content', state.memoryContent);
    setBinaryValue('instruction-register', state.instructionRegister);
    setOpCodesCounter(state.opcodeCounter);

    setBinaryValue('bus', state.bus);

    setBinaryValue('counter', state.counter);
    setFlagsRegister(state.carryFlag, state.zeroFlag);
    setBinaryValue('a-register', state.aRegister);
    setSumRegister(state.sumRegister, state.sumRegisterOverflow, state.sumRegisterZero);
    setBinaryValue('b-register', state.bRegister);
    setOutputValue(state.outRegister);
    setControlWord(state.controlWord);
}

function init(): State {
    let state = getInitState();
    // state.ram[0] = new LdiInstruction(8).toNumber();
    // state.ram[1] = new SubInstruction(15).toNumber();
    // state.ram[15] = 8;


    // state.ram[0] = new AddInstruction(15).toNumber();
    // state.ram[1] = new JzInstruction(15).toNumber();
    // state.ram[15] = 15;

    // state.ram[0] = new HltInstruction().toNumber();

    // state.ram[0] = new LdiInstruction(15).toNumber();
    // state.ram[1] = new OutInstruction().toNumber();
    // state.ram[2] = new HltInstruction().toNumber();

    // state.ram[0] = new AddInstruction(15).toNumber();
    // state.ram[1] = new HltInstruction().toNumber();

    // state.ram[0] = new HltInstruction().toNumber();

    state.ram[0] = new LdiInstruction(1).toNumber();
    state.ram[1] = new StaInstruction(14).toNumber();
    state.ram[2] = new LdiInstruction(0).toNumber();
    state.ram[3] = new StaInstruction(15).toNumber();
    state.ram[4] = new OutInstruction().toNumber();
    state.ram[5] = new LdaInstruction(14).toNumber();
    state.ram[6] = new AddInstruction(15).toNumber();
    state.ram[7] = new StaInstruction(14).toNumber();
    state.ram[8] = new OutInstruction().toNumber();
    state.ram[9] = new LdaInstruction(15).toNumber();
    state.ram[10] = new AddInstruction(14).toNumber();
    state.ram[11] = new JcInstruction(13).toNumber();
    state.ram[12] = new JmpInstruction(3).toNumber();
    state.ram[13] = new HltInstruction().toNumber();

    updateUI(state);

    return state;
}

function speedChanged(e: Event) {
    let htmlElement: HTMLInputElement = e.target as HTMLInputElement;
    let value = htmlElement.value;
    switch (value) {
        case "1":
            speed = 3000;
            break;
        case "2":
            speed = 1000;
            break;
        case "3":
            speed = 500;
            break;
        case "4":
            speed = 100;
            break;
        case "5":
            speed = 10;
            break;
        default:
            throw new Error(`unsupported value: ${speed}`);
    }
}

function toggleClock() {
    if (state.halted === 1) {
        return;
    }

    state = handleOpcodes(state);
    updateUI(state);
}

function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function toggle() {
    let startBtn = document.querySelector('#toggleBtn');
    let pulseBtn = document.querySelector('#pulseBtn');
    if (!startBtn) throw new Error('startBtn not available');
    if (!pulseBtn) throw new Error('pulseBtn not available');

    if (paused === 0) {
        startBtn.textContent = 'OSC'
        pulseBtn.removeAttribute('disabled');
        paused = 1;
        return;
    }

    pulseBtn.setAttribute('disabled', 'disabled');
    startBtn.textContent = 'MAN'
    paused = 0;

    while (state.halted !== 1 && paused !== 1) {
        await pulseClock();
    }
}

async function pulseClock() {
    toggleClock();
    await sleep(speed / 2);
    toggleClock();
    await sleep(speed / 2);
}