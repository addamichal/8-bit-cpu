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

setBinaryValue('a-register', 42);
setBinaryValue('b-register', 15);
setBinaryValue('b-register', 42 + 15);
setBinaryValue('counter', 15);
setBinaryValue('bus', 17);
setBinaryValue('memory-address', 8);
setBinaryValue('memory-content', 30);
setBinaryValue('instruction-register', 43);