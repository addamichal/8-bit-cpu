// TODO
// add / generate favicon
// bus column should fix the size of bus, other 2 columns should be uniform
// rewrite to typescript
// connect to actual execution code
// optimize for phones
// set output value
// set control word value
// set op codes counter + rename it correctly based on ben eater's naming convention
// add ui tests
// use webpack?
// add prettier

// import { getInitState, nextInstruction, run } from "./emulator";
// import { AddInstruction, HltInstruction, JcInstruction, JmpInstruction, LdaInstruction, LdiInstruction, OutInstruction, StaInstruction } from "./instructions";
// import { State } from "./state";

console.log('here??')

setBinaryValue('a-register', 12);

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

/*
function updateUI(state: State) {
    setBinaryValue('a-register', state.aRegister);
    setBinaryValue('b-register', state.bRegister);
    setBinaryValue('sum-register', state.sumRegister);
    setBinaryValue('counter', state.counter);
    setBinaryValue('bus', state.bus);
    setBinaryValue('memory-address', state.memoryAddress);
    setBinaryValue('memory-content', state.memoryContent);
    setBinaryValue('instruction-register', state.instructionRegister);
}
*/

function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/*
async function start() {
    console.log('start called!');
    let state = getInitState();
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
    await sleep(1000);

    state = nextInstruction(state);
    updateUI(state);
    await sleep(1000);

    state = nextInstruction(state);
    updateUI(state);
    await sleep(1000);

    state = nextInstruction(state);
    updateUI(state);
    await sleep(1000);

    state = nextInstruction(state);
    updateUI(state);
    await sleep(1000);

    state = nextInstruction(state);
    updateUI(state);
    await sleep(1000);

}

start();
*/

console.log('here?')