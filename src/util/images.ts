import type { Image } from "../pack/Pack";

export const splitSheet = (
	image: Image,
	spriteWidth: number,
	spriteHeight: number,
	sprites: string[]
): { image: Image; name: string }[] => {
	// todo
};

export const mergeSheet = (width: number, height: number, sprites: { index: number; image: Image }[], fallback?: Image): Image => {
	// todo
};

export const createImage = (width: number, height: number, color: string): Image => {

}

export const placeImages = (width: number, height: number, images: { x: number, y: number, image: Image }[]): Image => {

}