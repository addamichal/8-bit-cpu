# 8-bit CPU Emulator
Emulator for [Ben Eater's 8-bit computer](https://www.youtube.com/playlist?list=PLowKtXNTBypGqImE405J2565dvjafglHU)
written in Typescript.

See it live [here](https://addamichal.github.io/8-bit-cpu-emulator/)

## Supported instructions
NOP (0000) + value: No Operation is performed.
LDA (0001) + value: Loads number from RAM using value as Memory address to A Register.
ADD (0010) + value: Loads number from RAM using value as Memory address to B Register. Stores the sum of A and B Register to A Register.
SUB (0011) + value: Loads number from RAM using value as Memory address to B Register. Stores the difference of A and B Register to A Register.
STA (0100) + value: Stores A Register to RAM using value as Memory Address.
LDI (0101) + value: Loads value into A Register.
JMP (0110) + value: Sets counter to value.
JC 0111 Similar to jump instruction, but gets performed only if Carry flag is set
JZ 1000 Similar to jump instruction, but gets performed only if the Zero flag is set
OUT 1110 Copies A Register to Out Register, shows result in the 7 segment display
HLT 1111 Halts the clock, stops the execution

## Flags register
Zero Flag: Gets set if ADD or SUB instructions result in value zero
Carry Flag: Gets set if ADD or SUB instruction overflow (the result value is bigger than 8 bit)

## Clock Module
PLS (Pulse clock) button: Toggles the clock from 1 to 0.
NXT (Next instruction) button: Executes single instruction
Range (Clock speed) control: Sets the clock speed
OSC / MAN (Oscilate / Manual) button: Toggles between Oscilate clock mode (Automatic) and manual clock mode (PLS and NXT button needs to be used)
RST (Reset) button: Resets the simulation

## Bootstrapper
Can be used to set the RAM of the simulations. Supported instructions are converted into their binary representation and copied to RAM. Unknown / misformated instructions are converted as NOP instructions.

## Credits
[Source code for fibonacci program](https://theshamblog.com/programs-and-more-commands-for-the-ben-eater-8-bit-breadboard-computer/)