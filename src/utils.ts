export function toSignedByte(value: number) {
    if (value & 0x80) {
        return -256 + value;
    }

    return value;
}