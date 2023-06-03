import {
  AddInstruction,
  HltInstruction,
  Instruction,
  JcInstruction,
  JmpInstruction,
  JzInstruction,
  LdaInstruction,
  LdiInstruction,
  OutInstruction,
  StaInstruction,
  SubInstruction
} from './instructions';

export function assemble(lines: string[]): number[] {
  let program = [];
  for (let line of lines) {
    if (line === undefined || line === null || line === '') {
      program.push(0);
    } else if (!Number.isNaN(Number.parseInt(line))) {
      program.push(Number.parseInt(line));
    } else {
      try {
        let instruction = parseInstruction(line);
        program.push(instruction.toNumber());
      } catch (e: any) {
        program.push(0);
      }
    }
  }

  return program;
}

function parseInstruction(line: string): Instruction {
  let parts = line.split(' ');
  let instruction = parts[0].toUpperCase();
  let value = parseInt(parts[1] ?? 0);

  if (Number.isNaN(value))
    throw new Error('Instruction value must be a number');
  if (value < 0)
    throw new Error('Instruction value cannot be a negative number');
  if (value > 15)
    throw new Error('Instruction value cannot be bigger than 127');

  switch (instruction) {
    case 'LDA':
      return new LdaInstruction(value);
    case 'ADD':
      return new AddInstruction(value);
    case 'SUB':
      return new SubInstruction(value);
    case 'STA':
      return new StaInstruction(value);
    case 'LDI':
      return new LdiInstruction(value);
    case 'JMP':
      return new JmpInstruction(value);
    case 'JC':
      return new JcInstruction(value);
    case 'JZ':
      return new JzInstruction(value);
    case 'OUT':
      return new OutInstruction();
    case 'HLT':
      return new HltInstruction();
    default:
      throw new Error(`Unknown instruction: ${instruction}`);
  }
}
