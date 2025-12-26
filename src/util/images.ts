import type { Image } from "../pack/Pack";

export const splitSheet = (
	image: Image,
	spriteWidth: number,
	spriteHeight: number,
	sprites: string[]
): { image: Image; name: string }[] => {
	// todo
};

export const mergeSheet = (width: number, height: number, sprites: { index: number; image: Image }[]): Image => {
	// todo
};
