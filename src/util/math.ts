export const inRange = (val: number, min: number, max: number) => min <= val && val <= max;
export const clamp = (val: number, min: number, max: number) => min > val ? min : max < val ? max : val;
