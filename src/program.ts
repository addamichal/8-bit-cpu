export function getProgram(name: string): string[] {
  let program: string[] = [];

  if (name === 'blank') return program;

  if (name === 'print numbers 0 to 255') {
    program[0] = 'ldi 1';
    program[1] = 'sta 14';
    program[2] = 'lda 15';
    program[3] = 'out';
    program[4] = 'add 14';
    program[5] = 'sta 15';
    program[6] = 'jc 8';
    program[7] = 'jmp 2';
    program[8] = 'hlt';
    return program;
  }

  if (name === 'print numbers 0 to 10') {
    program[0] = 'lda 13';
    program[1] = 'out';
    program[2] = 'add 14';
    program[3] = 'sta 13';
    program[4] = 'sub 15';
    program[5] = 'jz 7';
    program[6] = 'jmp';
    program[7] = 'hlt';
    program[14] = '1';
    program[15] = '11';
    return program;
  }

  if (name === 'fibonacci') {
    let program = [];
    program[0] = 'ldi 1';
    program[1] = 'sta 14';
    program[2] = 'ldi 0';
    program[3] = 'sta 15';
    program[4] = 'out';
    program[5] = 'lda 14';
    program[6] = 'add 15';
    program[7] = 'sta 14';
    program[8] = 'out';
    program[9] = 'lda 15';
    program[10] = 'add 14';
    program[11] = 'jc 13';
    program[12] = 'jmp 3';
    program[13] = 'hlt';

    return program;
  }

  if (name === 'multiplication') {
    program[0] = 'lda 14';
    program[1] = 'sub 12';
    program[2] = 'jc 6';
    program[3] = 'lda 13';
    program[4] = 'out';
    program[5] = 'hlt';
    program[6] = 'sta 14';
    program[7] = 'lda 13';
    program[8] = 'add 15';
    program[9] = 'sta 13';
    program[10] = 'jmp 0';
    program[12] = '1';
    program[14] = '6';
    program[15] = '7';

    return program;
  }

  throw new Error(`Unknown program: ${name}`);
}
