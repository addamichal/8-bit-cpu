# 8-bit CPU Emulator
Emulator for [Ben Eater's 8-bit computer](https://www.youtube.com/playlist?list=PLowKtXNTBypGqImE405J2565dvjafglHU)
written in Typescript.

Take a look at [Live demo page](https://addamichal.github.io/8-bit-cpu-emulator/)

## Supported instructions
```
(0000) NOP + value: No Operation is performed.
(0001) LDA + value: Loads number from RAM using value as Memory address to A Register.
(0010) ADD + value: Loads number from RAM using value as Memory address to B Register. Stores the sum of A and B Register to A Register.
(0011) SUB + value: Loads number from RAM using value as Memory address to B Register. Stores the difference of A and B Register to A Register.
(0100) STA + value: Stores A Register to RAM using value as Memory Address.
(0101) LDI + value: Loads value into A Register.
(0110) JMP + value: Sets counter to value.
(0111) JC + value: Similar to jump instruction, but gets performed only if Carry flag is set
(1000) JZ + value: Similar to jump instruction, but gets performed only if the Zero flag is set
(1110) OUT: Copies A Register to Out Register, shows result in the 7 segment display
(1111) HLT: Halts the clock, stops the execution
```

## Flags register
```
Zero Flag: Gets set if ADD or SUB instructions result in value zero
Carry Flag: Gets set if ADD or SUB instruction overflow (the result value is bigger than 8 bit)
```

## Clock Module
```
PLS (Pulse clock) button: Toggles the clock from 1 to 0.
NXT (Next instruction) button: Executes single instruction
Range (Clock speed) control: Sets the clock speed
OSC / MAN (Oscilate / Manual) button: Toggles between Oscilate clock mode (Automatic) and manual clock mode (PLS and NXT button needs to be used)
RST (Reset) button: Resets the simulation
```

## Bootstrapper
Can be used to set the RAM of the simulations. Supported instructions are converted into their binary representation and copied to RAM. Unknown / misformated instructions are converted as NOP instructions.

## Credits
[Source code for the Fibonacci program](https://theshamblog.com/programs-and-more-commands-for-the-ben-eater-8-bit-breadboard-computer/)