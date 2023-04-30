import { getInitState, nextInstruction, run } from "./emulator";
import { AddInstruction, HltInstruction, JcInstruction, JmpInstruction, LdaInstruction, LdiInstruction, OutInstruction, StaInstruction } from "./instructions";
import { State } from "./state";

function setBinaryValue(module: string, number: number) {
    let leds = Array.from(document.querySelectorAll(`#${module} .led`)).reverse();
    if (leds.length === 0) throw new Error(`Module ${module} not found`);

    for (let led of leds) {
        led.classList.remove('active');
    }

    let digits = number.toString(2).split('').reverse();
    if (digits.length > leds.length) throw new Error(`Number exceeds bits of module`);

    for (let i = 0; i < digits.length; i++) {
        if (digits[i] === '1') {
            leds[i].classList.add('active');
        }
    }
}

function setOutputValue(number: number) {
    let sevenSegmentDisplay = document.querySelector('.seven-segment-display');
    if (!sevenSegmentDisplay) throw new Error('Seven Segment Display not found');

    sevenSegmentDisplay.textContent = number.toString();
}

function updateUI(state: State) {
    setBinaryValue('a-register', state.aRegister);
    setBinaryValue('b-register', state.bRegister);
    setBinaryValue('sum-register', state.sumRegister);
    setBinaryValue('counter', state.counter);
    setBinaryValue('bus', state.bus);
    setBinaryValue('memory-address', state.memoryAddress);
    setBinaryValue('memory-content', state.memoryContent);
    setBinaryValue('instruction-register', state.instructionRegister);
    setOutputValue(state.outRegister);
}

function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function start() {
    let initState = getInitState();
    initState.ram[0] = new LdiInstruction(1).toNumber();
    initState.ram[1] = new StaInstruction(14).toNumber();
    initState.ram[2] = new LdiInstruction(0).toNumber();
    initState.ram[3] = new StaInstruction(15).toNumber();
    initState.ram[4] = new OutInstruction().toNumber();
    initState.ram[5] = new LdaInstruction(14).toNumber();
    initState.ram[6] = new AddInstruction(15).toNumber();
    initState.ram[7] = new StaInstruction(14).toNumber();
    initState.ram[8] = new OutInstruction().toNumber();
    initState.ram[9] = new LdaInstruction(15).toNumber();
    initState.ram[10] = new AddInstruction(14).toNumber();
    initState.ram[11] = new JcInstruction(13).toNumber();
    initState.ram[12] = new JmpInstruction(3).toNumber();
    initState.ram[13] = new HltInstruction().toNumber();

    let currentState = initState;
    while (currentState.halted !== 1) {
        await sleep(100);
        setBinaryValue('clock', 1);
        await sleep(100);
        setBinaryValue('clock', 0);

        let nextState = nextInstruction(currentState);
        currentState = nextState;

        updateUI(currentState);
    }
}

start();