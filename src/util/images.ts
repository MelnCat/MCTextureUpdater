import type { Image } from "../pack/Pack";

export class CanvasImage implements Image {
	#canvas?: OffscreenCanvas;
	#ctx?: OffscreenCanvasRenderingContext2D;
	#loadCanvas: () => OffscreenCanvas;

	constructor(loadCanvas: () => OffscreenCanvas) {
		this.#loadCanvas = loadCanvas;
	}
	private get canvas(): OffscreenCanvas {
		if (this.#canvas) return this.#canvas;
		this.#canvas = this.#loadCanvas();
		return this.#canvas;
	}
	private get ctx(): OffscreenCanvasRenderingContext2D {
		if (this.#ctx) return this.#ctx;
		this.#ctx = this.canvas.getContext("2d")!;
		return this.#ctx;
	}

	hasFeature(feature: "translucency"): boolean {
		if (feature === "translucency") {
			const { data } = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);

			for (let i = 0; i < data.length; i += 4) {
				const [r, g, b, a] = data.slice(i, i + 4);
				if (a !== 255 && a !== 0) return true;
			}

			return false;
		}

		return false;
	}
	getWidth(): number {
		return this.canvas.width;
	}
	getHeight(): number {
		return this.canvas.height;
	}
	getSubimage(x: number, y: number, w: number, h: number): CanvasImage {
		const subimage = CanvasImage.create(w, h);
		subimage.ctx.drawImage(this.canvas, x, y, w, h, 0, 0, w, h);
		return subimage;
	}
	scaled(w: number, h: number): CanvasImage {
		const image = CanvasImage.create(w, h);
		image.ctx.imageSmoothingEnabled = false;
		image.ctx.drawImage(this.canvas, 0, 0, w, h);
		return image;
	}
	rotated(degrees: number): CanvasImage {
		degrees = ((degrees % 360) + 360) % 360;
		if (degrees === 0) return this;
		if (degrees === 90 || degrees === -90) {
		} else if (degrees === -180) {
			const newImage = CanvasImage.create(this.canvas.width, this.canvas.height);
			newImage.ctx.setTransform(-1, 0, 0, -1, this.canvas.width, this.canvas.height);
			newImage.ctx.drawImage(this.canvas, 0, 0);
			return newImage;
		}
		throw new Error(`Non-180 degree rotations not implemented yet.`);
	}
	flipped(direction: "v" | "h"): CanvasImage {
		const newImage = CanvasImage.create(this.canvas.width, this.canvas.height);
		if (direction === "h") {
			newImage.ctx.scale(-1, 1);
			newImage.ctx.drawImage(this.canvas, -this.canvas.width, 0);
		} else {
			newImage.ctx.scale(1, -1);
			newImage.ctx.drawImage(this.canvas, 0, -this.canvas.height);
		}
		return newImage;
	}
	bWAlpha(): Image {
		const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
		for (let i = 0; i < imageData.data.length; i += 4) {
			const [r, g, b, a] = imageData.data.slice(i, i + 4);
			imageData.data[i] = 255;
			imageData.data[i + 1] = 255;
			imageData.data[i + 2] = 255;
			imageData.data[i + 3] = Math.min(a, r);
		}
		const newImage = CanvasImage.create(this.canvas.width, this.canvas.height);
		newImage.ctx.putImageData(imageData, 0, 0);
		return newImage;
	}

	toImageSource(): CanvasImageSource {
		return this.canvas;
	}

	toBlob(): Promise<Blob> {
		return this.canvas.convertToBlob();
	}

	static create(width: number, height: number, color?: string) {
		const canvas = new OffscreenCanvas(width, height);
		const ctx = canvas.getContext("2d")!;
		if (color) {
			ctx.fillStyle = color;
			ctx.fill();
		}
		return CanvasImage.fromCanvas(canvas);
	}

	static fromCanvas(canvas: OffscreenCanvas) {
		const image = new CanvasImage(() => canvas);
		image.#canvas = canvas;
		return image;
	}

	static fromBitmap(image: ImageBitmap) {
		return new CanvasImage(() => {
			const canvas = new OffscreenCanvas(image.width, image.height);
			canvas.getContext("2d")!.drawImage(image, 0, 0);
			return canvas;
		});
	}
}

export const splitSheet = (
	image: Image,
	spriteWidth: number,
	spriteHeight: number,
	sprites: string[]
): { image: Image; name: string }[] => {
	const cols = Math.floor(image.getWidth() / spriteWidth);
	return sprites.map((x, i) => ({
		image: image.getSubimage(spriteWidth * (i % cols), spriteHeight * Math.floor(i / cols), spriteWidth, spriteHeight),
		name: x,
	}));
};

export const mergeSheet = (width: number, height: number, sprites: { index: number; image: Image }[], fallback?: Image): Image => {
	const spriteWidth = sprites[0]?.image.getWidth() ?? 0;
	const spriteHeight = sprites[0]?.image.getHeight() ?? 0;
	const cols = Math.floor(width / spriteWidth);
	return placeImages(
		width,
		height,
		sprites.map(x => ({
			x: spriteWidth * (x.index % cols),
			y: spriteHeight * Math.floor(x.index / cols),
			image: x.image,
		}))
	);
};

export const createImage = (width: number, height: number, color: string): Image => {
	return CanvasImage.create(width, height, color);
};

export const placeImages = (width: number, height: number, images: { x: number; y: number; image: Image }[]): Image => {
	const canvas = new OffscreenCanvas(width, height);
	const ctx = canvas.getContext("2d")!;
	for (const img of images) {
		ctx.drawImage(img.image.toImageSource(), img.x, img.y);
	}
	return CanvasImage.fromCanvas(canvas);
};
