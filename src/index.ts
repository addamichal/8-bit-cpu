import { getInitState, handleOpcodes, nextInstruction, run } from "./emulator";
import { AddInstruction, HltInstruction, JcInstruction, JmpInstruction, LdaInstruction, LdiInstruction, OutInstruction, StaInstruction } from "./instructions";
import { State } from "./state";

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
    digits[1].textContent = hundredsPlace ? hundredsPlace.toString() : '';
    digits[2].textContent = tensPlace ? tensPlace.toString() : '';
    digits[3].textContent = onesPlace ? onesPlace.toString() : '0';
}

function setFlagsRegister(carryFlag: number, zeroFlag: number) {
    let binaryValue = `${carryFlag}${zeroFlag}`;
    var value = Number.parseInt(binaryValue, 2);
    setBinaryValue('flags-register', value);
}

function setOpCodesCounter(value: number) {
    let binaryNumber = value.toString(2).padStart(3, '0');
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

function updateUI(state: State) {
    setBinaryValue('memory-address', state.memoryAddress);
    setBinaryValue('memory-content', state.memoryContent);
    setBinaryValue('instruction-register', state.instructionRegister);
    setOpCodesCounter(state.opcodeCounter);

    setBinaryValue('bus', state.bus);

    setBinaryValue('counter', state.counter);
    setFlagsRegister(state.carryFlag, state.zeroFlag);
    setBinaryValue('a-register', state.aRegister);
    setBinaryValue('sum-register', state.sumRegister);
    setBinaryValue('b-register', state.bRegister);
    setOutputValue(state.outRegister);
}

async function pulseClock(delay: number) {
    await sleep(delay / 2);
    setBinaryValue('clock', 1);
    await sleep(delay / 2);
    setBinaryValue('clock', 0);
}

function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function start() {
    let initState = getInitState();
    updateUI(initState);

    initState.ram[0] = new LdiInstruction(15).toNumber();
    initState.ram[1] = new OutInstruction().toNumber();
    initState.ram[2] = new HltInstruction().toNumber();

    //initState.ram[0] = new AddInstruction(15).toNumber();
    //initState.ram[1] = new HltInstruction().toNumber();

    // initState.ram[0] = new HltInstruction().toNumber();

    //initState.ram[0] = new LdiInstruction(1).toNumber();
    //initState.ram[1] = new StaInstruction(14).toNumber();
    //initState.ram[2] = new LdiInstruction(0).toNumber();
    //initState.ram[3] = new StaInstruction(15).toNumber();
    //initState.ram[4] = new OutInstruction().toNumber();
    //initState.ram[5] = new LdaInstruction(14).toNumber();
    //initState.ram[6] = new AddInstruction(15).toNumber();
    //initState.ram[7] = new StaInstruction(14).toNumber();
    //initState.ram[8] = new OutInstruction().toNumber();
    //initState.ram[9] = new LdaInstruction(15).toNumber();
    //initState.ram[10] = new AddInstruction(14).toNumber();
    //initState.ram[11] = new JcInstruction(13).toNumber();
    //initState.ram[12] = new JmpInstruction(3).toNumber();
    //initState.ram[13] = new HltInstruction().toNumber();

    let currentState = initState;
    while (currentState.halted !== 1) {
        await pulseClock(500);

        currentState = handleOpcodes(currentState);
        updateUI(currentState);

        currentState.opcodeCounter++;
        if (currentState.opcodeCounter === 5) {
            currentState.opcodeCounter = 0;
        }
    }
}

start();